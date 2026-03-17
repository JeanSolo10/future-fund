import type Decimal from 'decimal.js';
import type {
  TransactionCategory,
  TransactionFrequency,
  TransactionType,
} from './transaction.enums';

export type TransactionObjectType = {
  __typename: 'Transaction';
  id: string;
  amount: string;
  name: string;
  startDate: string;
  type: TransactionType;
  category: TransactionCategory;
  frequency: TransactionFrequency;
};

export type TransactionWhereUniqueInput = {
  id: string;
};

export type TransactionsWhereInput = {
  type?: TransactionType;
  category?: TransactionCategory;
  frequency?: TransactionFrequency;
  budgetId?: string;
};

export type TransactionCreateInput = {
  amount: Decimal;
  name: string;
  startDate: Date;
  type: TransactionType;
  category: TransactionCategory;
  frequency: TransactionFrequency;
  budgetId: string;
};

export type TransactionUpdateInput = Partial<TransactionCreateInput>;
