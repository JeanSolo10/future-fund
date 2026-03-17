import type {
  TransactionCategory,
  TransactionFrequency,
  TransactionType,
} from '../../object-types/transaction/transaction.enums';
import type { TransactionObjectType } from '../../object-types/transaction/transaction.type';

export type ExpenseDataType = {
  key: string;
  name: string;
  category: TransactionCategory;
  amount: string;
  startDate: string;
  frequency: TransactionFrequency;
  type: TransactionType;
};

export type IncomeDataType = {
  key: string;
  name: string;
  amount: string;
  startDate: string;
  frequency: TransactionFrequency;
  type: TransactionType;
};

export type TransactionFormType = 'none' | 'expense' | 'income';

export type TransactionListType = 'expense' | 'income';

export type VisualCalendarTransaction = Omit<TransactionObjectType, 'id'>;
