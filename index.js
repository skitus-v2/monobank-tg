require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Telegraf } = require('telegraf');
const packageInfo = require('./package.json');

console.log("Starting application...");

const app = express();
app.use(bodyParser.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const MONOBANK_TOKEN_SKITUS = process.env.MONOBANK_TOKEN_SKITUS;
const MONOBANK_TOKEN_BETA = process.env.MONOBANK_TOKEN_BETA;

// Используйте ваш полученный Group Id
const GROUP_CHAT_ID = process.env.CHAT_ID; 
const PORT = process.env.PORT || 3000;

console.log("Environment variables:");
console.log("TELEGRAM_TOKEN:", TELEGRAM_TOKEN ? "Loaded" : "Not Loaded");
console.log("MONOBANK_TOKEN_SKITUS:", MONOBANK_TOKEN_SKITUS ? "Loaded" : "Not Loaded");
console.log("MONOBANK_TOKEN_BETA:", MONOBANK_TOKEN_BETA ? "Loaded" : "Not Loaded");
console.log("GROUP_CHAT_ID:", GROUP_CHAT_ID ? "Loaded" : "Not Loaded");

const bot = new Telegraf(TELEGRAM_TOKEN);
let fetch;

(async () => {
    fetch = (await import('node-fetch')).default;
    console.log("Fetch module loaded.");

    // Webhook для Monobank для аккаунта Артура
    app.post('/monobank-webhook-artur', (req, res) => {
        console.log("Received webhook for Артур:", req.body);

        // Проверяем тип события
        if (req.body.type !== 'StatementItem') {
            console.log(`Ignoring non-transaction event: ${req.body.type}`);
            return res.sendStatus(200);
        }

        const transactions = req.body.data.statementItem;
        const accountId = req.body.data.account;

        if (!transactions) {
            console.error("No statementItem found in webhook data for Артур:", req.body);
            return res.sendStatus(400);
        }

        // Убедимся, что это правильный аккаунт
        if (accountId !== 'iVnCBCn4mhoVv1JxFrQEiA') {
            console.error(`Received webhook for Артур, but account ID does not match! Account ID: ${accountId}`);
            return res.sendStatus(400);
        }

        // Проверяем, является ли transactions массивом или объектом
        if (Array.isArray(transactions)) {
            transactions.forEach(transaction => {
                processTransaction(transaction, "Артур");
            });
        } else {
            processTransaction(transactions, "Артур");
        }

        res.sendStatus(200);
    });

    // Webhook для Monobank для аккаунта Саши
    app.post('/monobank-webhook-sasha', (req, res) => {
        console.log("Received webhook for Саша:", req.body);

        // Проверяем тип события
        if (req.body.type !== 'StatementItem') {
            console.log(`Ignoring non-transaction event: ${req.body.type}`);
            return res.sendStatus(200);
        }

        const transactions = req.body.data.statementItem;
        const accountId = req.body.data.account;

        if (!transactions) {
            console.error("No statementItem found in webhook data for Саша:", req.body);
            return res.sendStatus(400);
        }

        // Убедимся, что это правильный аккаунт
        if (accountId === 'iVnCBCn4mhoVv1JxFrQEiA') {
            console.error(`Received webhook for Саша, but it seems to be Артур's account! Account ID: ${accountId}`);
            return res.sendStatus(400);
        }

        // Проверяем, является ли transactions массивом или объектом
        if (Array.isArray(transactions)) {
            transactions.forEach(transaction => {
                processTransaction(transaction, "Саша");
            });
        } else {
            processTransaction(transactions, "Саша");
        }

        res.sendStatus(200);
    });

    // Обработчик для GET-запроса
    app.get('/', (req, res) => {
        console.log("Received GET request on /");
        res.json({
            version: packageInfo.version,
            server: "monobank-telegram-finance"
        });
    });

    // Запуск сервера
    app.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
    });

    // Запуск Telegram бота
    bot.start((ctx) => {
        console.log("Telegram bot started.");
        ctx.reply('Бот запущен и готов к работе!');
    });

    bot.launch()
        .then(() => console.log("Telegram bot launched successfully."))
        .catch(error => console.error("Error launching Telegram bot:", error));

    // Регистрация Webhook в Monobank для Артура
    const setupWebhookArtur = async () => {
        const url = `https://api.monobank.ua/personal/webhook`;
        const webhookUrl = 'https://boilerplate-v3.fly.dev/monobank-webhook-artur'; // Ваш URL для Артура

        try {
            console.log("Registering webhook for Артур at URL:", webhookUrl);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'X-Token': MONOBANK_TOKEN_SKITUS,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ webHookUrl: webhookUrl }),
            });

            if (response.ok) {
                console.log('Webhook успешно зарегистрирован для аккаунта Артура');
            } else {
                console.error('Ошибка при регистрации webhook для Артура:', await response.text());
            }
        } catch (error) {
            console.error('Ошибка при регистрации webhook для Артура:', error);
        }
    };

    // Регистрация Webhook в Monobank для Саши
    const setupWebhookSasha = async () => {
        const url = `https://api.monobank.ua/personal/webhook`;
        const webhookUrl = 'https://boilerplate-v3.fly.dev/monobank-webhook-sasha'; // Ваш URL для Саши

        try {
            console.log("Registering webhook for Саша at URL:", webhookUrl);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'X-Token': MONOBANK_TOKEN_BETA,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ webHookUrl: webhookUrl }),
            });

            if (response.ok) {
                console.log('Webhook успешно зарегистрирован для аккаунта Саши');
            } else {
                console.error('Ошибка при регистрации webhook для Саши:', await response.text());
            }
        } catch (error) {
            console.error('Ошибка при регистрации webhook для Саши:', error);
        }
    };

    // Вызов функций для регистрации webhook
    setupWebhookArtur();
    setupWebhookSasha();
})();

// Функция для обработки транзакций
function processTransaction(transaction, accountHolder) {
    console.log(`Processing transaction for ${accountHolder}:`, transaction);

    // Маппинг currencyCode на более читабельное название
    const currencyMap = {
        980: 'UAH', // Украинская гривна
        840: 'USD', // Доллар США
        978: 'EUR', // Евро
        643: 'RUB', // Российский рубль
        985: 'PLN'  // Польский злотый
    };

    // Получаем читаемое название валюты или оставляем код
    const currency = currencyMap[transaction.currencyCode] || transaction.currencyCode;

    const message = `
    🏦 Новая транзакция (${accountHolder}):
    - Сумма: ${transaction.amount / 100} ${currency}
    - Описание: ${transaction.description}
    - Дата: ${new Date(transaction.time * 1000).toLocaleString()}
    `;
    bot.telegram.sendMessage(GROUP_CHAT_ID, message)
        .then(() => console.log(`Message sent for ${accountHolder}'s transaction to group.`))
        .catch(error => console.error(`Error sending message for ${accountHolder}'s transaction to group:`, error));
}
