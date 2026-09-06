import type Decimal from 'decimal.js';
import type {
  TransactionCategory,
  TransactionFrequency,
  TransactionType,
} from './transaction.enums';
import type { DateTimeFilter } from '../../graphql/types/common.types';

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
  startDate?: DateTimeFilter;
  endDate?: DateTimeFilter;
  OR?: TransactionsWhereInput[];
  AND?: TransactionsWhereInput | TransactionsWhereInput[];
};

export type TransactionCreateInput = {
  amount: Decimal;
  name: string;
  startDate: Date;
  type: TransactionType;
  category: TransactionCategory;
  frequency: TransactionFrequency;
  budgetId: string;
  endDate: Date;
};

export type TransactionUpdateInput = Partial<TransactionCreateInput>;
