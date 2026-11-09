import type Decimal from 'decimal.js';
import type {
  TransactionCategory,
  TransactionFrequency,
  TransactionType,
} from './transaction.enums';
import type { CalendarDate } from '../../common/date';

export type TransactionObjectType = {
  __typename: 'Transaction';
  id: string;
  amount: string;
  name: string;
  startDate: CalendarDate;
  type: TransactionType;
  category: TransactionCategory;
  frequency: TransactionFrequency;
  endDate: CalendarDate | null;
};

export type TransactionWhereUniqueInput = {
  id: string;
};

export type TransactionCreateInput = {
  amount: Decimal;
  name: string;
  startDate: CalendarDate;
  type: TransactionType;
  category: TransactionCategory;
  frequency: TransactionFrequency;
  budgetId: string;
  endDate?: CalendarDate | null;
};

export type TransactionUpdateInput = Partial<TransactionCreateInput>;

export type CategoryTotalObjectType = {
  category: TransactionCategory;
  total: string;
};

export type MonthlySummaryObjectType = {
  month: CalendarDate;
  transactions: TransactionObjectType[];
  totalIncome: string;
  totalExpense: string;
  expenseTotalsByCategory: CategoryTotalObjectType[];
};

export type CalendarTransactionObjectType = {
  transactionId: string;
  date: CalendarDate;
  name: string;
  amount: string;
  type: TransactionType;
};

export type AlreadyInBalanceInput = {
  transactionId: string;
  date: CalendarDate;
};

export type OutlookWeekObjectType = {
  startDate: CalendarDate;
  endDate: CalendarDate;
  transactions: CalendarTransactionObjectType[];
  balanceRemaining: string;
};

export type WeeklyOutlookObjectType = {
  startingBalance: string;
  weeks: OutlookWeekObjectType[];
};
