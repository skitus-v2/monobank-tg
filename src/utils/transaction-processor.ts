import { AppDataSource } from "../data-source";
import { Transaction } from "../entity/transaction.entity";
import { sendMessage } from "../services/telegram.service";

type ITransaction = {
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

export const processTransaction = async (transaction: ITransaction, accountHolder: string, account: string) => {
  const currency = currencyMap[transaction.currencyCode] || transaction.currencyCode.toString();

  const transactionRepo = AppDataSource.getRepository(Transaction);
  
  const newTransaction = transactionRepo.create({
    amount: transaction.amount / 100,
    currency: currency,
    time: new Date(transaction.time),
    description: transaction.description,
    account: account,
    accountHolder: accountHolder
  });
  
  await transactionRepo.save(newTransaction);


  const message = `
  🏦 Новая транзакция (${accountHolder}):
  - Сумма: ${transaction.amount / 100} ${currency}
  - Описание: ${transaction.description}
  - Дата: ${new Date(transaction.time * 1000).toLocaleString()}
  `;

  sendMessage(message);
};
