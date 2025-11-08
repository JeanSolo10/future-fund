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
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  frequency: TransactionFrequency;
  budgetId: string | null;
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
  amount: number;
  name: string;
  date: Date;
  type: TransactionType;
  category: TransactionType;
  frequency: TransactionFrequency;
  budgetId: string;
};

export type TransactionUpdateInput = Partial<TransactionCreateInput>;
