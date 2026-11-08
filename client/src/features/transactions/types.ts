import type { TransactionTypeEnum } from '../../object-types/transaction/transaction.enums';
import {
  FIRST_AND_FIFTEEN,
  FIFTEEN_AND_LAST_DAY,
} from './components/forms/constants';

export type TransactionFormType = IncomeOrExpense | null;

export type SemiMonthlyEnums = {
  FIRST_AND_FIFTEEN: typeof FIRST_AND_FIFTEEN;
  FIFTEEN_AND_LAST_DAY: typeof FIFTEEN_AND_LAST_DAY;
};

export type IncomeOrExpense =
  | typeof TransactionTypeEnum.INCOME
  | typeof TransactionTypeEnum.EXPENSE;
