import React from 'react';
import type { IncomeOrExpense } from '../types';
import type { TransactionObjectType } from '../../../object-types/transaction/transaction.type';
import { TransactionTypeEnum } from '../../../object-types/transaction/transaction.enums';
import { DollarCircleFilled, ShoppingFilled } from '@ant-design/icons';
import '../../../styles/Transaction.css';
import { isEmptyArray } from '../../../common/utils';

type Props = {
  type: IncomeOrExpense;
  transactions: TransactionObjectType[];
  onTransactionClick: (transaction: TransactionObjectType) => void;
};

const getNoTransactionFound = (type: IncomeOrExpense) => {
  const targetTransaction =
    type === TransactionTypeEnum.INCOME ? 'income' : 'expense';

  return (
    <p className="no-transaction-message">
      You don't have any {targetTransaction}. <br /> Tap the + symbol to add one
    </p>
  );
};

export const TransactionsList: React.FC<Props> = ({
  type,
  transactions,
  onTransactionClick,
}) => {
  const isIncome = type === TransactionTypeEnum.INCOME;
  const title = isIncome ? 'Income' : 'Expenses';

  return (
    <div className="transactions-list-container">
      <h3 className="transactions-list-title">{title}</h3>
      {!isEmptyArray(transactions)
        ? transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="transaction-item"
              onClick={() => onTransactionClick(transaction)}
              style={{ cursor: 'pointer' }}
            >
              {isIncome ? (
                <div className="transaction-item-content income">
                  <DollarCircleFilled />
                  <p className="transaction-item-name">{transaction.name}</p>
                </div>
              ) : (
                <div className="transaction-item-content expense">
                  <ShoppingFilled />
                  <p className="transaction-item-name">{transaction.name}</p>
                </div>
              )}
              <p className="transaction-item-amount">
                {Number(transaction.amount).toLocaleString('en-US', {
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
