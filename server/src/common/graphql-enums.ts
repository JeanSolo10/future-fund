import {
  AccountType,
  TransactionType,
  TransactionCategory,
  TransactionFrequency,
} from 'generated/prisma';

export const enumsToRegister = [
  { name: 'AccountType', value: AccountType },
  { name: 'TransactionType', value: TransactionType },
  { name: 'TransactionCategory', value: TransactionCategory },
  { name: 'TransactionFrequency', value: TransactionFrequency },
];
