import { Telegraf } from 'telegraf';
import { config } from '../config/env-configuration';

export const bot = new Telegraf(config.telegram.token);

export const startBot = async () => {
  bot.start((ctx: any) => {
    ctx.reply('Бот запущен и готов к работе!');
  });

  await bot.launch();
  console.log("Telegram bot launched successfully.");
};

export const sendMessage = async (message: string) => {
  try {
    await bot.telegram.sendMessage(config.telegram.groupId, message);
    console.log("Message sent to group.");
  } catch (error) {
    console.error("Error sending message to group:", error);
  }
};
