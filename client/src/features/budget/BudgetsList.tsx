import type { BudgetObjectType } from '../../object-types/budget/budget.type';
import { Button } from 'antd';
import { useNavigate } from 'react-router';
import { isEmptyObject } from '../../common/utils';

type Props = {
  budget: BudgetObjectType | undefined;
};

export const BudgetsList: React.FC<Props> = ({ budget }) => {
  const navigate = useNavigate();

  const hasBudget = budget && !isEmptyObject(budget);

  const handleBudgetClick = (budgetId: string) => {
    navigate(`/budget/${budgetId}`);
  };

  return (
    <>
      {hasBudget ? (
        <div className="budget-list">
          <Button key={budget.id} onClick={() => handleBudgetClick(budget.id)}>
            <p>{budget.name}</p>
          </Button>
        </div>
      ) : (
        <div>
          <p>No budgets found</p>
        </div>
      )}
    </>
  );
};
