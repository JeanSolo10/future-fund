import Decimal from 'decimal.js';
import { TransactionFrequency } from 'generated/prisma';

type TransactionIds = {
  transactionIds: string[];
};

export type CalculateTotalMonthlyExpenseArgs = TransactionIds;

export type CalculateTotalMonthlyIncomeArgs = CalculateTotalMonthlyExpenseArgs;

export type TransactionFrequencyAndAmount = {
  amount: Decimal;
  frequency: TransactionFrequency;
};

export type GenerateTransactionsFromFrequencyArgs = TransactionIds;
