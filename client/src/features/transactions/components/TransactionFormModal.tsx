import { Button, Modal, type FormInstance } from 'antd';
import type React from 'react';
import { ExpenseForm } from './forms/ExpenseForm';
import { IncomeForm } from './forms/IncomeForm';
import type { TransactionSubmitPayload } from './forms/form.type';

import type { IncomeOrExpense, TransactionFormType } from '../types';
import { TransactionTypeEnum } from '../../../object-types/transaction/transaction.enums';
import { DollarCircleFilled, ShoppingFilled } from '@ant-design/icons';

import '../../../styles/Transaction.css';
import { useEffect, useState } from 'react';

type Props = {
  formType: TransactionFormType;
  onCancel: () => void;
  form: FormInstance;
  onFormSubmit: (payload: TransactionSubmitPayload) => void;
  isEditForm?: boolean;
  onFormTypeChange?: (formType: TransactionFormType) => void;
  onDelete?: () => void;
};

export const TransactionFormModal: React.FC<Props> = ({
  formType,
  onCancel,
  form,
  onFormSubmit,
  isEditForm,
  onFormTypeChange,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<IncomeOrExpense>(
    TransactionTypeEnum.EXPENSE,
  );

  const isModalOpen = formType !== null;
  const isExpenseForm = activeTab === TransactionTypeEnum.EXPENSE;
  const isIncomeForm = activeTab === TransactionTypeEnum.INCOME;

  const handleSetActiveTab = (tab: IncomeOrExpense) => {
    setActiveTab(tab);
    if (onFormTypeChange) {
      onFormTypeChange(tab);
    }
  };

  useEffect(() => {
    if (formType !== null) {
      setActiveTab(formType);
    }

    if (onFormTypeChange) {
      onFormTypeChange(formType);
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
          onClick={() => handleSetActiveTab(TransactionTypeEnum.EXPENSE)}
        >
          Expense
        </Button>
        <Button
          className={`income-btn ${isIncomeForm ? 'active' : ''}`}
          shape="round"
          icon={<DollarCircleFilled />}
          onClick={() => handleSetActiveTab(TransactionTypeEnum.INCOME)}
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
