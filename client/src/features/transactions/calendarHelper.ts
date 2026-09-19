import { DateTime } from 'luxon';
import type { VisualCalendarTransaction } from './types';

export const generateDataForListView = (
  transactions: VisualCalendarTransaction[],
  currDate: Date,
): Record<number, VisualCalendarTransaction[]> => {
  const dataForList: Record<number, VisualCalendarTransaction[]> = {};

  const currentDateTime = DateTime.fromJSDate(currDate).toUTC();
  const currentMonth = currentDateTime.month;
  const currentYear = currentDateTime.year;

  for (const transaction of transactions) {
    const transactionDate = DateTime.fromISO(transaction.startDate).toUTC();

    // only process transactions that fall within the exact month and year the user is viewing
    if (
      transactionDate.month === currentMonth &&
      transactionDate.year === currentYear
    ) {
      const day = transactionDate.day;

      if (!dataForList[day]) {
        dataForList[day] = [];
      }

      dataForList[day].push(transaction);
    }
  }

  return dataForList;
};
