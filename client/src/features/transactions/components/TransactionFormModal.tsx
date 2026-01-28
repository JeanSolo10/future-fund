import { Button, Modal, type FormInstance } from 'antd';
import type React from 'react';
import { ExpenseForm } from './forms/ExpenseForm';
import { IncomeForm } from './forms/IncomeForm';

import type { TransactionFormType } from '../types';
import { DollarCircleFilled, ShoppingFilled } from '@ant-design/icons';

import '../../../styles/Transaction.css';
import { useEffect, useState } from 'react';

type Props = {
  formType: TransactionFormType;
  onCancel: () => void;
  form: FormInstance;
  onFormSubmit: (values: any) => void;
  isEditForm?: boolean;
  handleSetFormType?: (formType: TransactionFormType) => void;
  onDelete?: () => void;
};

export const TransactionFormModal: React.FC<Props> = ({
  formType,
  onCancel,
  form,
  onFormSubmit,
  isEditForm,
  handleSetFormType,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  const isModalOpen = formType !== 'none';
  const isExpenseForm = activeTab === 'expense';
  const isIncomeForm = activeTab === 'income';

  const handleSetActiveTab = (tab: 'expense' | 'income') => {
    setActiveTab(tab);
    if (handleSetFormType) {
      handleSetFormType(tab);
    }
  };

  useEffect(() => {
    if (formType !== 'none') {
      setActiveTab(formType);
    }

    if (handleSetFormType) {
      handleSetFormType(formType);
    }
  }, [formType]);

  return (
    <Modal
      open={isModalOpen}
      title={isEditForm ? 'Edit Transaction' : 'New Transaction'}
      onCancel={onCancel}
      destroyOnHidden
      footer={false}
      className="modal-transaction"
      getContainer={false}
      centered={true}
    >
      <div className="modal-transaction-header">
        <Button
          className={`expense-btn ${isExpenseForm ? 'active' : ''}`}
          shape="round"
          icon={<ShoppingFilled />}
          onClick={() => handleSetActiveTab('expense')}
        >
          Expense
        </Button>
        <Button
          className={`income-btn ${isIncomeForm ? 'active' : ''}`}
          shape="round"
          icon={<DollarCircleFilled />}
          onClick={() => handleSetActiveTab('income')}
        >
          Income
        </Button>
      </div>

      {isExpenseForm && (
        <ExpenseForm form={form} onSubmit={onFormSubmit} onDelete={onDelete} />
      )}

      {isIncomeForm && (
        <IncomeForm form={form} onSubmit={onFormSubmit} onDelete={onDelete} />
      )}
    </Modal>
  );
};
