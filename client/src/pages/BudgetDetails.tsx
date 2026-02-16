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
import type { BudgetUpdateInput } from '../object-types/budget/budget.type';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { EditBudgetModal } from '../features/budget/components/EditBudgetModal';

import '../styles/Budget.css';
import type { TransactionFormType } from '../features/transactions/types';

export const BudgetDetails: React.FC = () => {
  const [formType, setFormType] = useState<TransactionFormType>('none');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [shouldDisplayAddIcon, setShouldDisplayAddIcon] = useState(true);

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
      {shouldDisplayAddIcon && (
        <div className="plus-button-container">
          <Button
            className="plus-button"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => handleSetFormType('expense')}
          />
        </div>
      )}

      <div className="header-content">
        <div className="back-btn-container">
          <Button onClick={() => handleBackClick()}>Back</Button>
        </div>
        <h2>{budget?.name}</h2>
        <div className="edit-btn">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => setIsEditModalOpen(true)}
          />
        </div>
      </div>

      <main className="page-content">
        <Transactions setShouldDisplayAddIcon={setShouldDisplayAddIcon} />
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
        initialValues={{ ...budget }}
        loading={updatingBudget}
      />
    </div>
  );
};
