import express from 'express';
import { config } from './config/env-configuration';
import { handleMonobankWebhook } from './controllers/webhook-monobank.controller';
import { getMonobankData, sendMonobankData } from './services/monobank.service';
import { startBot } from './services/telegram.service';

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

  await getMonobankData(config.monobank.apiUrl, config.monobank.tokenSkytus);

  await sendMonobankData(config.monobank.apiUrl, config.monobank.tokenSkytus, {
    webhookUrl: 'https://your-domain.com/monobank-webhook-artur',
    user: 'artur'
  });

  await sendMonobankData(config.monobank.apiUrl, config.monobank.tokenBeta, {
    webhookUrl: 'https://your-domain.com/monobank-webhook-sasha',
    user: 'sasha'
  });
})();

export default app;
