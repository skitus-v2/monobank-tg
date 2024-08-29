import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';

// Загрузка .env файла
const result = dotenv.config({ path: path.resolve(__dirname, '../../.env') });
if (result.error) {
  throw result.error;
}

// Валидация переменных окружения
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  CHAT_ID: Joi.string().required(),
  TELEGRAM_TOKEN: Joi.string().required(),
  MONOBANK_API_URL: Joi.string().uri().default('https://api.monobank.ua/personal/webhook'),
  MONOBANK_TOKEN_SKITUS: Joi.string().required(),
  MONOBANK_TOKEN_BETA: Joi.string().required(),
}).unknown().required();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Validation error in environment variables: ${error.details.map(d => d.message).join(', ')}`);
}

// Интерфейсы для конфигурации
interface BaseConfig {
  port: number;
  nodeEnv: string;
}

interface TelegramConfig {
  groupId: string;
  token: string;
}

interface MonobankConfig {
  apiUrl: string;
  tokenSkytus: string;
  tokenBeta: string;
}

// Конфигурация
export const baseConfig: BaseConfig = {
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV,
};

export const telegramConfig: TelegramConfig = {
  groupId: envVars.CHAT_ID,
  token: envVars.TELEGRAM_TOKEN,
};

export const monobankConfig: MonobankConfig = {
  apiUrl: envVars.MONOBANK_API_URL,
  tokenSkytus: envVars.MONOBANK_TOKEN_SKITUS,
  tokenBeta: envVars.MONOBANK_TOKEN_BETA,
};

export const config = {
  base: baseConfig,
  telegram: telegramConfig,
  monobank: monobankConfig,
};
