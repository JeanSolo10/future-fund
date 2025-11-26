import { Modal, type FormInstance } from 'antd';
import type React from 'react';
import { ExpenseForm } from './ExpenseForm';
import { IncomeForm } from './IncomeForm';

export type TransactionFormType = 'none' | 'expense' | 'income';

type Props = {
  formType: TransactionFormType;
  onCancel: () => void;
  form: FormInstance;
  onFormSubmit: (values: any) => void;
};

export const TransactionFormModal: React.FC<Props> = ({
  formType,
  onCancel,
  form,
  onFormSubmit,
}) => {
  const isModalOpen = formType !== 'none';

  const getTitle = () => {
    return formType === 'expense' ? 'Add Expense' : 'Add Income';
  };

  return (
    <Modal
      open={isModalOpen}
      title={getTitle()}
      onCancel={onCancel}
      destroyOnHidden
      footer={false}
    >
      {formType === 'expense' && (
        <ExpenseForm form={form} onClose={onCancel} onSubmit={onFormSubmit} />
      )}

      {formType === 'income' && (
        <IncomeForm form={form} onClose={onCancel} onSubmit={onFormSubmit} />
      )}
    </Modal>
  );
};
