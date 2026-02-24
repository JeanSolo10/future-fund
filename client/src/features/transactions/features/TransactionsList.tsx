import React from 'react';
import type {
  ExpenseDataType,
  IncomeDataType,
  TransactionListType,
} from '../types';
import { DollarCircleFilled, ShoppingFilled } from '@ant-design/icons';
import '../../../styles/Transaction.css';
import { isEmptyArray } from '../../../common/utils';

type Props = {
  type: TransactionListType;
  data: ExpenseDataType[] | IncomeDataType[];
  onClickItem: (record: ExpenseDataType | IncomeDataType) => Promise<void>;
};

const getNoTransactionFound = (type: TransactionListType) => {
  const targetTransaction = type === 'income' ? 'income' : 'expense';

  return (
    <p className="no-transaction-message">
      You don't have any {targetTransaction}. <br /> Tap the + symbol to add one
    </p>
  );
};

export const TransactionsList: React.FC<Props> = ({
  type,
  data,
  onClickItem,
}) => {
  const isIncome = type === 'income';
  let title = isIncome ? 'Income' : 'Expenses';

  const handleItemClick = (item: ExpenseDataType | IncomeDataType) => {
    onClickItem(item);
  };

  return (
    <div className="transactions-list-container">
      <h3 className="transactions-list-title">{title}</h3>
      {!isEmptyArray(data)
        ? data.map((item) => (
            <div
              key={item.key}
              className="transaction-item"
              onClick={() => handleItemClick(item)}
              style={{ cursor: 'pointer' }}
            >
              {isIncome ? (
                <div className="transaction-item-content income">
                  <DollarCircleFilled />
                  <p className="transaction-item-name">{item.name}</p>
                </div>
              ) : (
                <div className="transaction-item-content expense">
                  <ShoppingFilled />
                  <p className="transaction-item-name">{item.name}</p>
                </div>
              )}
              <p className="transaction-item-amount">
                {Number(item.amount).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </p>
            </div>
          ))
        : getNoTransactionFound(type)}
    </div>
  );
};
