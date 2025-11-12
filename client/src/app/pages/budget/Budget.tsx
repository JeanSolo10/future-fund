import type { BudgetObjectType } from '../../../objects/budget/budget.type';
import { Button, Form } from 'antd';
import { Transactions } from '../transactions/Transactions';
import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_TRANSACTION } from '../../../mutations/CreateTransaction';
import { GET_TRANSACTIONS } from '../../../queries/GetTransactions';
import { ExpenseForm } from './components/ExpenseForm';
import { IncomeForm } from './components/IncomeForm';

type TransactionFormType = 'none' | 'expense' | 'income';

type Props = {
  budgets: BudgetObjectType[];
  selectedBudget?: BudgetObjectType;
  onSelectBudget: (budget: BudgetObjectType) => void;
  onCloseBudget: () => void;
};

export const Budgets: React.FC<Props> = ({
  budgets,
  onCloseBudget,
  onSelectBudget,
  selectedBudget,
}) => {
  const [formType, setFormType] = useState<TransactionFormType>('none');
  const [form] = Form.useForm();

  const [createTransactionMutation] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS],
  });

  const isDetailedView = !!selectedBudget;
  const isFormVisible = formType !== 'none';

  const handleBudgetClick = (budget: BudgetObjectType) => {
    onSelectBudget(budget);
  };

  const handleBackClick = () => {
    onCloseBudget();
  };

  const handleSetFormType = (type: TransactionFormType) => {
    setFormType(type);
  };

  const handleFormClose = () => {
    setFormType('none');
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    await createTransactionMutation({
      variables: {
        data: {
          ...values,
          budgetId: selectedBudget?.id!,
        },
      },
    });
    setFormType('none');
    form.resetFields();
  };

  const renderForm = () => {
    if (formType === 'expense') {
      return (
        <ExpenseForm
          form={form}
          onClose={handleFormClose}
          onSubmit={handleSubmit}
        />
      );
    }
    if (formType === 'income') {
      return (
        <IncomeForm
          form={form}
          onClose={handleFormClose}
          onSubmit={handleSubmit}
        />
      );
    }
    return null;
  };

  return (
    <>
      {isDetailedView ? (
        <div>
          <h2>{selectedBudget.name}</h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Button onClick={handleBackClick}>Back</Button>
            <Button onClick={() => handleSetFormType('expense')}>
              Add Expense
            </Button>
            <Button onClick={() => handleSetFormType('income')}>
              Add Income
            </Button>
          </div>
          {isFormVisible && <div>{renderForm()}</div>}
          <Transactions budgetId={selectedBudget.id} />
        </div>
      ) : (
        <div>
          {budgets.map((budget) => {
            return (
              <Button key={budget.id} onClick={() => handleBudgetClick(budget)}>
                <p>{budget.name}</p>
              </Button>
            );
          })}
        </div>
      )}
    </>
  );
};
