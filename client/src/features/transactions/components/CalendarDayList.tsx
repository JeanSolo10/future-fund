import React from 'react';
import type { CalendarTransactionObjectType } from '../../../object-types/transaction/transaction.type';
import { useDateContext } from '../../../context/DateContext';
import { isEmptyArray } from '../../../common/utils';
import { parseCalendarDate, type CalendarDate } from '../../../common/date';
import { TransactionTypeEnum } from '../../../object-types/transaction/transaction.enums';

type Props = {
  calendarTransactionsByDate: Record<
    CalendarDate,
    CalendarTransactionObjectType[]
  >;
};

export const CalendarDayList: React.FC<Props> = ({
  calendarTransactionsByDate,
}) => {
  const { viewedMonth } = useDateContext();

  const datesInViewedMonth = Object.keys(calendarTransactionsByDate)
    .filter((date) => parseCalendarDate(date).hasSame(viewedMonth, 'month'))
    .sort();

  if (isEmptyArray(datesInViewedMonth)) {
    return <h3>No data available</h3>;
  }

  return (
    <div className="transaction-list-view-container">
      {datesInViewedMonth.map((date) => (
        <React.Fragment key={date}>
          <h3>
            {parseCalendarDate(date).toFormat('LLLL d', { locale: 'en-US' })}
          </h3>

          {calendarTransactionsByDate[date].map((calendarTransaction) => {
            const isExpense =
              calendarTransaction.type === TransactionTypeEnum.EXPENSE;
            return (
              <div
                className={`transaction-list-view-item ${isExpense ? 'expense' : 'income'}`}
                key={calendarTransaction.transactionId}
              >
                <div className="transaction-list-view-item-name">
                  {calendarTransaction.name}
                </div>
                <div
                  className={`transaction-list-view-item-amount ${isExpense ? 'expense' : 'income'}`}
                >
                  ${calendarTransaction.amount}
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};
