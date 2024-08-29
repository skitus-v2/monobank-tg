import { Request, Response } from 'express';
import { processTransaction } from '../utils/transaction-processor';

export const handleMonobankWebhook = (accountId: string, req: Request, res: Response) => {
  const { type, data } = req.body;

  if (type !== 'StatementItem') {
    console.log(`Ignoring non-transaction event: ${type}`);
    return res.sendStatus(200);
  }

  const transactions = data.statementItem;

  if (!transactions) {
    console.error("No statementItem found in webhook data");
    return res.sendStatus(400);
  }

  if (Array.isArray(transactions)) {
    transactions.forEach(transaction => processTransaction(transaction, accountId));
  } else {
    processTransaction(transactions, accountId);
  }

  res.sendStatus(200);
};
