import type { DateTime } from 'luxon';
import type {
  TransactionCategory,
  TransactionFrequency,
} from '../../../../object-types/transaction/transaction.enums';
import {
  TransactionTypeEnum,
  TransactionCategoryEnum,
} from '../../../../object-types/transaction/transaction.enums';

export type ExpenseFormValues = {
  name: string;
  amount: number;
  startDate: DateTime;
  endDate: DateTime;
  category: TransactionCategory;
  frequency: TransactionFrequency;
};

export type ExpenseSubmitPayload = ExpenseFormValues & {
  type: typeof TransactionTypeEnum.EXPENSE;
};

export type IncomeFormValues = {
  name: string;
  amount: number;
  startDate: DateTime;
  endDate: DateTime;
  frequency?: TransactionFrequency;
};

export type IncomeSubmitPayload = IncomeFormValues & {
  type: typeof TransactionTypeEnum.INCOME;
  category: typeof TransactionCategoryEnum.NONE;
};

export type TransactionSubmitPayload =
  | ExpenseSubmitPayload
  | IncomeSubmitPayload;
