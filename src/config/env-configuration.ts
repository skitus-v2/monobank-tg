import dotenv from 'dotenv';
import Joi from 'joi';
import path from 'path';

const result = dotenv.config({ path: path.resolve(__dirname, '../../.env') });
if (result.error) {
  throw result.error;
}

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  CHAT_ID: Joi.string().required(),
  TELEGRAM_TOKEN: Joi.string().required(),
  MONOBANK_API_URL: Joi.string().uri().default('https://api.monobank.ua/personal/webhook'),
  MONOBANK_TOKEN_SKITUS: Joi.string().required(),
  MONOBANK_TOKEN_BETA: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
}).unknown().required();

const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Validation error in environment variables: ${error.details.map(d => d.message).join(', ')}`);
}

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

interface DatabaseConfig {
  host: string;
  port: number;
  password: string;
  username: string;
  databaseName: string
}

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

export const databaseConfig: DatabaseConfig = {
  host: envVars.DB_HOST,
  port: envVars.DB_PORT,
  password: envVars.DB_PASSWORD,
  username: envVars.DB_USERNAME,
  databaseName: envVars.DB_DATABASE
};

export const config = {
  base: baseConfig,
  telegram: telegramConfig,
  monobank: monobankConfig,
  database: databaseConfig
};
