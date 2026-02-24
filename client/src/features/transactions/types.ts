import type {
  TransactionCategory,
  TransactionFrequency,
  TransactionType,
} from '../../object-types/transaction/transaction.enums';

export type ExpenseDataType = {
  key: string;
  name: string;
  category: TransactionCategory;
  amount: string;
  date: string;
  frequency: TransactionFrequency;
  type: TransactionType;
};

export type IncomeDataType = {
  key: string;
  name: string;
  amount: string;
  date: string;
  frequency: TransactionFrequency;
  type: TransactionType;
};

export type TransactionFormType = 'none' | 'expense' | 'income';

export type TransactionListType = 'expense' | 'income';
