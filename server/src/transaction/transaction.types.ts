import Decimal from 'decimal.js';
import { TransactionFrequency } from 'generated/prisma';

export type CalculateTotalMonthlyExpenseArgs = {
  transactionIds: string[];
};

export type CalculateTotalMonthlyIncomeArgs = CalculateTotalMonthlyExpenseArgs;

export type TransactionFrequencyAndAmount = {
  amount: Decimal;
  frequency: TransactionFrequency;
};
