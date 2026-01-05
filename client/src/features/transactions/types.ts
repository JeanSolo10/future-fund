import type {
  TransactionCategory,
  TransactionFrequency,
} from '../../object-types/transaction/transaction.enums';

export type ExpenseRowDataType = {
  key: string;
  name: string;
  category: TransactionCategory;
  amount: string;
  dueDate: string | null;
  frequency: TransactionFrequency;
};

export type IncomeRowDataType = {
  key: string;
  name: string;
  amount: string;
  startDate: string | null;
  frequency: TransactionFrequency;
};

export type TransactionFormType = 'none' | 'expense' | 'income';
