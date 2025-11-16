import { Button, Form } from 'antd';
import { Transactions } from '../transactions/Transactions';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { CREATE_TRANSACTION } from '../../../mutations/CreateTransaction';
import { GET_TRANSACTIONS } from '../../../queries/GetTransactions';
import { ExpenseForm } from './components/ExpenseForm';
import { IncomeForm } from './components/IncomeForm';
import { useNavigate, useParams } from 'react-router';
import { GET_BUDGET } from '../../../queries/GetBudget';

type TransactionFormType = 'none' | 'expense' | 'income';

export const BudgetDetails: React.FC = () => {
  const [formType, setFormType] = useState<TransactionFormType>('none');
  const [form] = Form.useForm();
  const { budgetId } = useParams();
  const navigate = useNavigate();

  const [createTransactionMutation] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS],
  });

  const [getBudget, { data: budgetData }] = useLazyQuery(GET_BUDGET);

  const isFormVisible = formType !== 'none';

  const budget = budgetData?.budget;

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
          budgetId: budget?.id!,
        },
      },
    });
    setFormType('none');
    form.resetFields();
  };

  const fetchBudget = async (budgetId: string) => {
    await getBudget({
      variables: {
        where: {
          id: budgetId,
        },
      },
    });
  };

  useEffect(() => {
    if (budgetId && !budget) {
      fetchBudget(budgetId);
    }
  }, [budgetId]);

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

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>{budget?.name}</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button onClick={() => handleBackClick()}>Back</Button>
        <Button onClick={() => handleSetFormType('expense')}>
          Add Expense
        </Button>
        <Button onClick={() => handleSetFormType('income')}>Add Income</Button>
      </div>
      {isFormVisible && <div>{renderForm()}</div>}
      <Transactions />
    </div>
  );
};
