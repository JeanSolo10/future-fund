import { DateTime } from 'luxon';
import {
  TransactionFrequencyEnum,
  type TransactionFrequency,
} from '../../object-types/transaction/transaction.enums';
import type { FormInstance } from 'antd';
import Decimal from 'decimal.js';
import type { TransactionCreateInput } from '../../object-types/transaction/transaction.type';
import type { TransactionSubmitPayload } from './components/forms/form.type';

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

export const toTransactionInput = (
  payload: TransactionSubmitPayload,
): Omit<TransactionCreateInput, 'budgetId'> => ({
  name: payload.name,
  amount: new Decimal(payload.amount),
  startDate: payload.startDate.toJSDate(),
  endDate: payload.endDate ? payload.endDate.toJSDate() : null,
  category: payload.category,
  frequency: payload.frequency,
  type: payload.type,
});
