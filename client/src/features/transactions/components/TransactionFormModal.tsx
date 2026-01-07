import { Modal, type FormInstance } from 'antd';
import type React from 'react';
import { ExpenseForm } from './forms/ExpenseForm';
import { IncomeForm } from './forms/IncomeForm';

import type { TransactionFormType } from '../types';

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
  isEditForm = false,
}) => {
  const isModalOpen = formType !== 'none';

  const isExpenseForm = formType === 'expense';
  const isIncomeForm = formType === 'income';

  const getTitle = () => {
    if (isExpenseForm) {
      return isEditForm ? 'Edit Expense' : 'Add Expense';
    }

    return isEditForm ? 'Edit Income' : 'Add Income';
  };

  return (
    <Modal
      open={isModalOpen}
      title={getTitle()}
      onCancel={onCancel}
      destroyOnHidden
      footer={false}
    >
      {isExpenseForm && (
        <ExpenseForm form={form} onClose={onCancel} onSubmit={onFormSubmit} />
      )}

      {isIncomeForm && (
        <IncomeForm form={form} onClose={onCancel} onSubmit={onFormSubmit} />
      )}
    </Modal>
  );
};
