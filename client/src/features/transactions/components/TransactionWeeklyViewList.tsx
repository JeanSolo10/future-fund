import React from 'react';
import type { VisualCalendarTransaction } from '../types';
import { dateContext } from '../../../context/DateContext';
import { isEmptyObject } from '../../../common/utils';
import { toCalendarDate } from '../../../common/date';
import { TransactionTypeEnum } from '../../../object-types/transaction/transaction.enums';

interface Props {
  data: {
    [day: number]: VisualCalendarTransaction[];
  };
}

export const TransactionWeeklyViewList: React.FC<Props> = ({ data }) => {
  const { viewedMonth } = dateContext();
  const monthName = viewedMonth.toFormat('LLLL', { locale: 'en-US' });

  if (isEmptyObject(data)) {
    return <h3>No data available</h3>;
  }

  return (
    <div className="transaction-list-view-container">
      {Object.entries(data).map(([day, transactions]) => {
        const calendarDate = toCalendarDate(
          viewedMonth.set({ day: Number(day) }),
        );

        return (
          <React.Fragment key={calendarDate}>
            <h3>{`${monthName} ${day}`}</h3>

            {transactions.map((transaction, index) => {
              const isExpense =
                transaction.type === TransactionTypeEnum.EXPENSE;
              return (
                <div
                  className={`transaction-list-view-item ${isExpense ? 'expense' : 'income'}`}
                  key={`${index}-${transaction.startDate}`}
                >
                  <div className="transaction-list-view-item-name">
                    {transaction.name}
                  </div>
                  <div
                    className={`transaction-list-view-item-amount ${isExpense ? 'expense' : 'income'}`}
                  >
                    ${transaction.amount}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};
