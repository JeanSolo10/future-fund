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

export const generateDataForListView = (
  expenses: ExpenseDataType[],
  incomes: IncomeDataType[],
  currDate: Date,
): {
  [day: number]: (ExpenseDataType | IncomeDataType)[];
} => {
  const generatedExpenseData = generateDataForCalendar(expenses);
  const generatedIncomeData = generateDataForCalendar(incomes);

  const aggregatedData = [...generatedExpenseData, ...generatedIncomeData];

  const dataForList: { [day: number]: (ExpenseDataType | IncomeDataType)[] } =
    {};
  const daysInMonth = DateTime.fromJSDate(currDate)?.daysInMonth;

  if (daysInMonth) {
    for (let i = 1; i < daysInMonth; i += 1) {
      for (let j = 0; j < aggregatedData.length; j += 1) {
        const currTransaction = aggregatedData[j];
        const transactionDay = DateTime.fromISO(currTransaction.date).day;

        if (transactionDay === i) {
          if (!dataForList[i]) {
            dataForList[i] = [];
          }
          dataForList[i].push(currTransaction);
        }
      }
    }
  }

  return dataForList;
};
