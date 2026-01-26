import type {
  TransactionCategory,
  TransactionFrequency,
} from '../../object-types/transaction/transaction.enums';

export type ExpenseDataType = {
  key: string;
  name: string;
  category: TransactionCategory;
  amount: string;
  date: string | null;
  frequency: TransactionFrequency;
};

export type IncomeDataType = {
  key: string;
  name: string;
  amount: string;
  date: string | null;
  frequency: TransactionFrequency;
};

export type TransactionFormType = 'none' | 'expense' | 'income';

export type TransactionListType = 'expense' | 'income';
