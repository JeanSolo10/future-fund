import type { DateTime } from 'luxon';
import type { VisualCalendarTransaction } from './types';
import { parseCalendarDate } from '../../common/date';

export const generateDataForListView = (
  transactions: VisualCalendarTransaction[],
  viewedMonth: DateTime,
): Record<number, VisualCalendarTransaction[]> => {
  const dataForList: Record<number, VisualCalendarTransaction[]> = {};

  for (const transaction of transactions) {
    const transactionDate = parseCalendarDate(transaction.startDate);

    if (transactionDate.hasSame(viewedMonth, 'month')) {
      const day = transactionDate.day;

      if (!dataForList[day]) {
        dataForList[day] = [];
      }

      dataForList[day].push(transaction);
    }
  }

  return dataForList;
};
