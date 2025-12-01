import type { BudgetObjectType } from '../../../object-types/budget/budget.type';
import { Button } from 'antd';
import { useNavigate } from 'react-router';
import { isEmptyArray } from '../../../common/utils';
import './Budget.css';

type Props = {
  budgets: BudgetObjectType[];
};

export const BudgetsList: React.FC<Props> = ({ budgets }) => {
  const navigate = useNavigate();

  const hasBudgets = !isEmptyArray(budgets);

  const handleBudgetClick = (budgetId: string) => {
    navigate(`/budget/${budgetId}`);
  };

  return (
    <>
      {hasBudgets ? (
        <div className="budget-list">
          {budgets.map((budget) => {
            return (
              <Button
                key={budget.id}
                onClick={() => handleBudgetClick(budget.id)}
              >
                <p>{budget.name}</p>
              </Button>
            );
          })}
        </div>
      ) : (
        <div>
          <p>No budgets found</p>
        </div>
      )}
    </>
  );
};
