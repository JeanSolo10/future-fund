import { Button, Form, message } from 'antd';
import { Transactions } from '../features/transactions/Transactions';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { CREATE_TRANSACTION } from '../graphql/mutations/CreateTransaction';
import { GET_TRANSACTIONS } from '../graphql/queries/GetTransactions';
import { useNavigate, useParams } from 'react-router';
import { GET_BUDGET } from '../graphql/queries/GetBudget';
import { TransactionFormModal } from '../features/transactions/components/TransactionFormModal';
import { UPDATE_BUDGET } from '../graphql/mutations/UpdateBudget';
import { DELETE_BUDGET } from '../graphql/mutations/DeleteBudget';
import type { BudgetUpdateInput } from '../object-types/budget/budget.type';
import { EditOutlined } from '@ant-design/icons';
import { EditBudgetModal } from '../features/budget/components/EditBudgetModal';

import '../styles/Budget.css';
import type { TransactionFormType } from '../features/transactions/types';

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

  const handleCreateTransaction = async (values: any) => {
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
    <div className="budget-details-page">
      <nav className="back-btn-container">
        <Button onClick={() => handleBackClick()}>Back</Button>
      </nav>
      <header className="header-content">
        <h2>{budget?.name}</h2>
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => setIsEditModalOpen(true)}
        />
      </header>

      <main className="page-content">
        <div className="btn-container">
          <Button onClick={() => handleSetFormType('expense')}>
            Add Expense
          </Button>
          <Button onClick={() => handleSetFormType('income')}>
            Add Income
          </Button>
        </div>

        <Transactions />
      </main>

      <TransactionFormModal
        form={form}
        formType={formType}
        onCancel={handleFormClose}
        onFormSubmit={handleCreateTransaction}
      />

      <EditBudgetModal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateBudget}
        onDelete={handleDeleteBudget}
        initialValues={{ ...budget }}
        loading={updatingBudget || deletingBudget}
      />
    </div>
  );
};
