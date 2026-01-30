import Decimal from 'decimal.js';

type Props = {
  totalIncome?: string;
  totalExpenses?: string;
};

export const TransactionSummary: React.FC<Props> = ({
  totalIncome,
  totalExpenses,
}) => {
  let income = totalIncome ?? '0';
  let expenses = totalExpenses ?? '0';

  const calculateRemainingBalance = (): string => {
    const remaining = new Decimal(income).minus(new Decimal(expenses));
    return `$${remaining.toDecimalPlaces(2).toString()}`;
  };

  return (
    <div className="transaction-summary">
      <div className="income-summary">
        <p>INCOME</p>
        <p className="expense-total-amount">
          {totalIncome ? `$${income}` : '$0.00'}
        </p>
      </div>
      <div className="summary-divider" />
      <div className="expense-summary">
        <p>EXPENSES</p>
        <p className="expense-total-amount">
          {totalExpenses ? `$${expenses}` : '$0.00'}
        </p>
      </div>
      <div className="summary-divider" />
      <div className="expense-summary">
        <p>REMAINING</p>
        <p className="remaining-total-amount">{calculateRemainingBalance()}</p>
      </div>
    </div>
  );
};
