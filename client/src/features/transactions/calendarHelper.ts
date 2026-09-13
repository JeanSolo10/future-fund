import { DateTime } from 'luxon';
import type { VisualCalendarTransaction } from './types';

export const generateDataForListView = (
  transactions: VisualCalendarTransaction[],
  currDate: Date,
): {
  [day: number]: VisualCalendarTransaction[];
} => {
  const dataForList: { [day: number]: VisualCalendarTransaction[] } = {};
  const daysInMonth = DateTime.fromJSDate(currDate)?.daysInMonth;

  if (daysInMonth) {
    for (let i = 1; i <= daysInMonth; i += 1) {
      for (let j = 0; j < transactions.length; j += 1) {
        const currTransaction = transactions[j];
        const transactionDay = DateTime.fromISO(currTransaction.startDate).day;

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
