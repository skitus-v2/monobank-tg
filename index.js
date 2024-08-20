require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Telegraf } = require('telegraf');
const packageInfo = require('./package.json');

const app = express();
app.use(bodyParser.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const MONOBANK_TOKEN_SKITUS = process.env.MONOBANK_TOKEN_SKITUS;
const MONOBANK_TOKEN_BETA = process.env.MONOBANK_TOKEN_BETA;
const bot = new Telegraf(TELEGRAM_TOKEN);
const chatId = process.env.CHAT_ID; // Один общий chat ID для обоих пользователей
const PORT = process.env.PORT || 3000;

let fetch;

(async () => {
    fetch = (await import('node-fetch')).default;

    // Webhook для Monobank для аккаунта Артура
    app.post('/monobank-webhook-artur', (req, res) => {
        const transactions = req.body.data.statementItem;

        transactions.forEach(transaction => {
            const message = `
            🏦 Новая транзакция (Артур):
            - Сумма: ${transaction.amount / 100} ${transaction.currencyCode}
            - Описание: ${transaction.description}
            - Дата: ${new Date(transaction.time * 1000).toLocaleString()}
            `;
            bot.telegram.sendMessage(chatId, message);
        });

        res.sendStatus(200);
    });

    // Webhook для Monobank для аккаунта Саши
    app.post('/monobank-webhook-sasha', (req, res) => {
        const transactions = req.body.data.statementItem;

        transactions.forEach(transaction => {
            const message = `
            🏦 Новая транзакция (Саша):
            - Сумма: ${transaction.amount / 100} ${transaction.currencyCode}
            - Описание: ${transaction.description}
            - Дата: ${new Date(transaction.time * 1000).toLocaleString()}
            `;
            bot.telegram.sendMessage(chatId, message);
        });

        res.sendStatus(200);
    });

    // Обработчик для GET-запроса
    app.get('/', (req, res) => {
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
    bot.start((ctx) => ctx.reply('Бот запущен и готов к работе!'));
    bot.launch();

    // Регистрация Webhook в Monobank для Артура
    const setupWebhookArtur = async () => {
        const url = `https://api.monobank.ua/personal/webhook`;
        const webhookUrl = 'https://your-server-url/monobank-webhook-artur'; // Замените на ваш URL сервера

        try {
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
        const webhookUrl = 'https://your-server-url/monobank-webhook-sasha'; // Замените на ваш URL сервера

        try {
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
