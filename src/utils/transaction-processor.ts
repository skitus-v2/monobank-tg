import { sendMessage } from '../services/telegram.service';

type Transaction = {
  amount: number;
  currencyCode: number;
  description: string;
  time: number;
};

const currencyMap: Record<number, string> = {
  980: 'UAH',
  840: 'USD',
  978: 'EUR',
  643: 'RUB',
  985: 'PLN',
};

export const processTransaction = (transaction: Transaction, accountHolder: string) => {
  const currency = currencyMap[transaction.currencyCode] || transaction.currencyCode.toString();

  const message = `
  🏦 Новая транзакция (${accountHolder}):
  - Сумма: ${transaction.amount / 100} ${currency}
  - Описание: ${transaction.description}
  - Дата: ${new Date(transaction.time * 1000).toLocaleString()}
  `;

  sendMessage(message);
};
