import { DateTime } from 'luxon';
import type { TransactionCreateInput } from '../../object-types/transaction/transaction.type';
import type { SemiMonthlyEnums } from './types';
import {
  TransactionFrequencyEnum,
  type TransactionFrequency,
} from '../../object-types/transaction/transaction.enums';
import type { FormInstance } from 'antd';

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

export const handleFormFrequencyChange = (
  value: TransactionFrequency,
  form: FormInstance,
) => {
  if (value === TransactionFrequencyEnum.SEMI_MONTHLY) {
    const currentStartDate = form.getFieldValue('startDate');

    if (currentStartDate) {
      const day = currentStartDate.day;

      if (day !== 1 && day !== 15) {
        form.setFieldValue('startDate', undefined);
        form.setFieldValue('endDate', undefined);
      }
    }
  }
};
