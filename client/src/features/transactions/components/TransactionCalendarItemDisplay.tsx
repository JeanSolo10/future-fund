import React from 'react';
import {
  TransactionTypeEnum,
  type TransactionType,
} from '../../../object-types/transaction/transaction.enums';

interface Props {
  name: string;
  amount: string;
  type: TransactionType;
}

export const TransactionCalendarItemDisplay: React.FC<Props> = ({
  name,
  amount,
  type,
}) => {
  const isIncome = type === TransactionTypeEnum.INCOME;

  return (
    <div
      className={`transaction-calendar-item ${isIncome ? 'income' : 'expense'}`}
    >
      <div className="transaction-calendar-item-name">{name}</div>
      <div
        className={`transaction-calendar-item-amount ${isIncome ? 'income' : 'expense'}`}
      >
        ${amount}
      </div>
    </div>
  );
};
