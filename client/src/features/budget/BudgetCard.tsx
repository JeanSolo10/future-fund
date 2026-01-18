import type { BudgetObjectType } from '../../object-types/budget/budget.type';
import { Card } from 'antd';
import { useNavigate } from 'react-router';
import { isEmptyObject } from '../../common/utils';
import { BookOutlined } from '@ant-design/icons';
import { menuContext } from '../../context/MenuContext';

type Props = {
  budget: BudgetObjectType | undefined;
};

export const BudgetCard: React.FC<Props> = ({ budget }) => {
  const navigate = useNavigate();

  const { setIsBudgetPageOpen } = menuContext();

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
        <div>
          <p>No budgets found</p>
        </div>
      )}
    </>
  );
};
