import { DateTime } from 'luxon';
import { TransactionFrequencyEnum } from '../../object-types/transaction/transaction.enums';
import type { ExpenseDataType, IncomeDataType } from './types';

export const generateDataForCalendar = (
  data: ExpenseDataType[] | IncomeDataType[],
): (ExpenseDataType | IncomeDataType)[] => {
  let generatedData: (ExpenseDataType | IncomeDataType)[] = [];

  for (let i = 0; i < data.length; i += 1) {
    const record = data[i];

    if (record.frequency === TransactionFrequencyEnum.MONTHLY) {
      generatedData.push(record);
    }

    if (record.frequency === TransactionFrequencyEnum.SEMI_MONTHLY) {
      const { daysInMonth, day, year, month } = DateTime.fromISO(record.date);

      const halfAMonth = Math.floor(Number(daysInMonth) / 2);

      if (daysInMonth && day + halfAMonth < daysInMonth) {
        const semiMonthlyRecord = {
          ...record,
          date: DateTime.local(year, month, day + halfAMonth - 1)
            .toISO()
            ?.toString()!,
        };
        generatedData.push(semiMonthlyRecord);
      }

      generatedData.push(record);
    }

    if (record.frequency === TransactionFrequencyEnum.WEEKLY) {
      const baseDate = DateTime.fromISO(record.date);

      for (let week = 0; week < 4; week += 1) {
        const weeklyRecord = {
          ...record,
          date: baseDate.plus({ weeks: week }).toISO()?.toString()!,
        };
        generatedData.push(weeklyRecord);
      }
    }
  }
  return generatedData;
};
