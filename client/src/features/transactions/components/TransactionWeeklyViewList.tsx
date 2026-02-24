import React from 'react';
import type { ExpenseDataType, IncomeDataType } from '../types';
import { dateContext } from '../../../context/DateContext';
import { isEmptyObject } from '../../../common/utils';
import { MONTH_INDEX_TO_FULL_NAME } from '../../../navigation/constants';
import { TransactionTypeEnum } from '../../../object-types/transaction/transaction.enums';

interface Props {
  data: {
    [day: number]: (ExpenseDataType | IncomeDataType)[];
  };
}

export const TransactionWeeklyViewList: React.FC<Props> = ({ data }) => {
  const { currentMonth } = dateContext();

  if (isEmptyObject(data)) {
    return <h3>No data available</h3>;
  }

  return (
    <div className="transaction-list-view-container">
      {Object.entries(data).map(([day, transactions]) => {
        return (
          <>
            <h3
              key={`${currentMonth}-${day}`}
            >{`${MONTH_INDEX_TO_FULL_NAME[currentMonth]} ${day}`}</h3>
            {transactions.map((transaction) => {
              const isExpense =
                transaction.type === TransactionTypeEnum.EXPENSE;
              return (
                <div
                  className={`transaction-list-view-item ${isExpense ? 'expense' : 'income'}`}
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
          </>
        );
      })}
    </div>
  );
};
