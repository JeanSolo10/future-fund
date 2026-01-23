import { Button, Modal, type FormInstance } from 'antd';
import type React from 'react';
import { ExpenseForm } from './forms/ExpenseForm';
import { IncomeForm } from './forms/IncomeForm';

import type { TransactionFormType } from '../types';
import { DollarCircleFilled, ShoppingFilled } from '@ant-design/icons';

import '../../../styles/Transaction.css';
import { useState } from 'react';

type Props = {
  formType: TransactionFormType;
  onCancel: () => void;
  form: FormInstance;
  onFormSubmit: (values: any) => void;
  isEditForm?: boolean;
};

export const TransactionFormModal: React.FC<Props> = ({
  formType,
  onCancel,
  form,
  onFormSubmit,
  isEditForm,
}) => {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  const isModalOpen = formType !== 'none';
  const isExpenseForm = activeTab === 'expense';
  const isIncomeForm = activeTab === 'income';

  return (
    <Modal
      open={isModalOpen}
      title={isEditForm ? 'Edit Transaction' : 'New Transaction'}
      onCancel={onCancel}
      destroyOnHidden
      footer={false}
      className="modal-transaction"
    >
      <div className="modal-transaction-header">
        <Button
          className={`expense-btn ${isExpenseForm ? 'active' : ''}`}
          shape="round"
          icon={<ShoppingFilled />}
          onClick={() => setActiveTab('expense')}
        >
          Expense
        </Button>
        <Button
          className={`income-btn ${isIncomeForm ? 'active' : ''}`}
          shape="round"
          icon={<DollarCircleFilled />}
          onClick={() => setActiveTab('income')}
        >
          Income
        </Button>
      </div>

      {isExpenseForm && (
        <ExpenseForm form={form} onClose={onCancel} onSubmit={onFormSubmit} />
      )}

      {isIncomeForm && (
        <IncomeForm form={form} onClose={onCancel} onSubmit={onFormSubmit} />
      )}
    </Modal>
  );
};
