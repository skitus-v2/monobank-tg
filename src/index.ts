import express from 'express';
import { config } from './config/env-configuration';
import { handleMonobankWebhook } from './controllers/webhook-monobank.controller';
import { sendMonobankData } from './services/monobank.service';
import { startBot } from './services/telegram.service';
import { AppDataSource } from './data-source';

const app = express();
app.use(express.json());

app.post('/monobank-webhook-artur', (req, res) => handleMonobankWebhook('artur', req, res));
app.post('/monobank-webhook-sasha', (req, res) => handleMonobankWebhook('sasha', req, res));

app.get('/', (req, res) => {
  res.json({
    version: "1.0.0",
    server: "monobank-telegram-finance"
  });
});

app.listen(config.base.port, () => {
  console.log(`Server started at port ${config.base.port}`);
});

(async () => {
  await startBot();

  await sendMonobankData(config.monobank.apiUrl, config.monobank.tokenSkytus, {
    webhookUrl: 'https://boilerplate-v3.fly.dev/monobank-webhook-artur'
  });

  await sendMonobankData(config.monobank.apiUrl, config.monobank.tokenBeta, {
    webhookUrl: 'https://boilerplate-v3.fly.dev/monobank-webhook-sasha'
  });
})();

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));

export default app;
