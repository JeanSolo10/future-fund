import { DateTime } from 'luxon';
import type { TransactionCreateInput } from '../../object-types/transaction/transaction.type';
import type { SemiMonthlyEnums } from './types';

// todo: implement this correctly
export const sanitizeCreateFormData = (
  values: TransactionCreateInput & { semiMonthlyDates?: SemiMonthlyEnums },
): TransactionCreateInput => {
  const { semiMonthlyDates, ...restData } = values;

  if (values.semiMonthlyDates) {
    const isFirstAndFifthTeen = semiMonthlyDates?.FIFTEEN_AND_LAST_DAY;

    return {
      ...restData,
    };
  }

  return {
    ...restData,
  };
};

// Limit selection to 1st and 15th for semi-monthly transactions
export const disableDatesForSemiMonthlyTransaction = (date: DateTime) => {
  const isAllowedDate = date.day === 1 || date.day === 15;

  return !isAllowedDate;
};
