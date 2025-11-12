import type { ColumnType } from 'antd/es/table';
import type {
  TransactionCategory,
  TransactionFrequency,
} from '../../../objects/transaction/transaction.enums';
import type { TransactionTableTypeEnum } from './transactions.enums';

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

export type TransactionTableType =
  (typeof TransactionTableTypeEnum)[keyof typeof TransactionTableTypeEnum];

export type EditableColumnType<T> = ColumnType<T> & {
  editable?: boolean;
  dataIndex: string;
};

export type EditableCellInputType = 'number' | 'date' | 'select' | 'text';
