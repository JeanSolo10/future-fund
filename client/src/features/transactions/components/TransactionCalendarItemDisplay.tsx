import React from 'react';

interface Props {
  name: string;
  amount: string;
  type: 'income' | 'expense';
}

export const TransactionCalendarItemDisplay: React.FC<Props> = ({
  name,
  amount,
  type,
}) => {
  const isExpense = type === 'expense';

  return (
    <div
      className={`transaction-calendar-item ${isExpense ? 'expense' : 'income'}`}
    >
      <div className="transaction-calendar-item-name">{name}</div>
      <div
        className={`transaction-calendar-item-amount ${isExpense ? 'expense' : 'income'}`}
      >
        ${amount}
      </div>
    </div>
  );
};
