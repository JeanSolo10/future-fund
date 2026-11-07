import Decimal from 'decimal.js';
import { TransactionFrequency } from 'generated/prisma';

export type TransactionFrequencyAndAmount = {
  amount: Decimal;
  frequency: TransactionFrequency;
};
