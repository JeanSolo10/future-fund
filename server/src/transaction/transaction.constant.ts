import { TransactionFrequency } from 'generated/prisma';

export const FREQUENCY_TO_MULTIPLE = {
  [TransactionFrequency.WEEKLY]: 4,
  [TransactionFrequency.SEMI_MONTHLY]: 2,
  [TransactionFrequency.MONTHLY]: 1,
};
