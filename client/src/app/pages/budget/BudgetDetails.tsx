import { Button, Form, message } from 'antd';
import { Transactions } from '../transactions/Transactions';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { CREATE_TRANSACTION } from '../../../mutations/CreateTransaction';
import { GET_TRANSACTIONS } from '../../../queries/GetTransactions';
import { useNavigate, useParams } from 'react-router';
import { GET_BUDGET } from '../../../queries/GetBudget';
import { CreateTransactionFormModal } from './components/CreateTransactionFormModal';
import { UPDATE_BUDGET } from '../../../mutations/UpdateBudget';
import { DELETE_BUDGET } from '../../../mutations/DeleteBudget';
import type { BudgetUpdateInput } from '../../../object-types/budget/budget.type';
import { EditOutlined } from '@ant-design/icons';
import { EditBudgetModal } from './components/EditBudgetModal';

type TransactionFormType = 'none' | 'expense' | 'income';

export const BudgetDetails: React.FC = () => {
  const [formType, setFormType] = useState<TransactionFormType>('none');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [form] = Form.useForm();
  const { budgetId } = useParams();
  const navigate = useNavigate();

  // queries
  const [getBudget, { data: budgetData }] = useLazyQuery(GET_BUDGET);

  // mutations
  const [createTransactionMutation] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS],
  });

  const [updateBudgetMutation, { loading: updatingBudget }] = useMutation(
    UPDATE_BUDGET,
    { refetchQueries: [GET_BUDGET] },
  );

  const [deleteBudgetMutation, { loading: deletingBudget }] =
    useMutation(DELETE_BUDGET);

  // handlers

  const handleSetFormType = (type: TransactionFormType) => {
    setFormType(type);
  };

  const handleFormClose = () => {
    setFormType('none');
    form.resetFields();
  };

  const handleSubmitTransaction = async (values: any) => {
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

  const handleUpdateBudget = async (values: BudgetUpdateInput) => {
    if (!budget?.id) {
      return;
    }

    await updateBudgetMutation({
      variables: {
        where: { id: budget?.id },
        data: { ...values },
      },
    });

    message.success('Budget updated successfully');
    setIsEditModalOpen(false);
  };

  const handleDeleteBudget = async () => {
    if (!budget?.id) {
      return;
    }

    await deleteBudgetMutation({
      variables: {
        where: { id: budget?.id },
      },
    });

    message.success('Budget deleted');
    setIsEditModalOpen(false);
    navigate('/');
  };

  const handleBackClick = () => {
    navigate('/');
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

  const budget = budgetData?.budget;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1.25rem',
          marginBottom: '1.25rem',
        }}
      >
        <h2 style={{ margin: 0 }}>{budget?.name}</h2>
        <Button
          type="text"
          style={{ backgroundColor: '#e6e6e6' }}
          icon={<EditOutlined style={{ fontSize: '1.25rem' }} />}
          onClick={() => setIsEditModalOpen(true)}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button onClick={() => handleBackClick()}>Back</Button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={() => handleSetFormType('expense')}>
            Add Expense
          </Button>
          <Button onClick={() => handleSetFormType('income')}>
            Add Income
          </Button>
        </div>
      </div>

      <CreateTransactionFormModal
        form={form}
        formType={formType}
        onCancel={handleFormClose}
        onFormSubmit={handleSubmitTransaction}
      />

      <EditBudgetModal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateBudget}
        onDelete={handleDeleteBudget}
        initialValues={{ name: budget?.name ?? '' }}
        loading={updatingBudget || deletingBudget}
      />

      <Transactions />
    </div>
  );
};
