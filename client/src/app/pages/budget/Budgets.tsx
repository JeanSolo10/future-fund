import type { BudgetObjectType } from '../../../objects/budget/budget.type';
import { Button } from 'antd';
import { useNavigate } from 'react-router';
import { isEmptyArray } from '../../../common/utils';

type Props = {
  budgets: BudgetObjectType[];
};

export const Budgets: React.FC<Props> = ({ budgets }) => {
  const navigate = useNavigate();

  const hasBudgets = !isEmptyArray(budgets);

  const handleBudgetClick = (budgetId: string) => {
    navigate(`/budget/${budgetId}`);
  };

  return (
    <>
      {hasBudgets ? (
        <div>
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
