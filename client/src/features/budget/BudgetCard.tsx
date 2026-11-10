import type { BudgetObjectType } from '../../object-types/budget/budget.type';
import { Button, Card } from 'antd';
import { useNavigate } from 'react-router';
import { isEmptyObject } from '../../common/utils';
import { BookOutlined } from '@ant-design/icons';
import { useMenuContext } from '../../context/MenuContext';

type Props = {
  budget: BudgetObjectType | null;
  onCreateBudgetClick: () => void;
};

export const BudgetCard: React.FC<Props> = ({
  budget,
  onCreateBudgetClick,
}) => {
  const navigate = useNavigate();

  const { setIsBudgetPageOpen } = useMenuContext();

  const hasBudget = budget && !isEmptyObject(budget);

  const handleBudgetClick = (budgetId: string) => {
    setIsBudgetPageOpen(true);
    navigate(`/budget/${budgetId}`);
  };

  return (
    <>
      {hasBudget ? (
        <Card
          key={budget.id}
          onClick={() => handleBudgetClick(budget.id)}
          style={{
            alignContent: 'center',
            border: 'solid',
            borderWidth: '2px',
          }}
        >
          <Card.Meta
            avatar={<BookOutlined style={{ fontSize: '1.5rem' }} />}
            title={budget.name}
          />
        </Card>
      ) : (
        <div className="budget-card-empty">
          <p>You don't have a budget yet.</p>
          <Button onClick={onCreateBudgetClick}>Create budget</Button>
        </div>
      )}
    </>
  );
};
