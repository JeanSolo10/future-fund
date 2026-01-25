type Props = {
  totalIncome?: string;
  totalExpenses?: string;
};

export const TransactionSummary: React.FC<Props> = ({
  totalIncome,
  totalExpenses,
}) => {
  return (
    <div className="transaction-summary">
      <div className="income-summary">
        <p>INCOME</p>
        <p className="expense-total-amount">
          {totalIncome ? `$${totalIncome}` : '$0.00'}
        </p>
      </div>
      <div className="summary-divider"></div>
      <div className="expense-summary">
        <p>EXPENSES</p>
        <p className="expense-total-amount">
          {totalExpenses ? `$${totalExpenses}` : '$0.00'}
        </p>
      </div>
    </div>
  );
};
