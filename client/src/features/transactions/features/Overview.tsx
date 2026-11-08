import type { FormInstance } from 'antd';
import { TransactionFormModal } from '../components/TransactionFormModal';
import type { TransactionSubmitPayload } from '../components/forms/form.type';
import type { TransactionFormType } from '../types';
import type { TransactionObjectType } from '../../../object-types/transaction/transaction.type';
import { TransactionTypeEnum } from '../../../object-types/transaction/transaction.enums';
import { TransactionsList } from './TransactionsList';
import { TransactionSummary } from './TransactionSummary';

type Props = {
  totalIncome: string | undefined;
  totalExpense: string | undefined;
  incomes: TransactionObjectType[];
  expenses: TransactionObjectType[];
  onTransactionClick: (transaction: TransactionObjectType) => void;
  form: FormInstance<any>;
  formType: TransactionFormType;
  onFormClose: () => void;
  onTransactionUpdate: (payload: TransactionSubmitPayload) => Promise<void>;
  onFormTypeChange: (type: TransactionFormType) => void;
  onTransactionDelete: () => Promise<void>;
};

export const Overview: React.FC<Props> = ({
  totalIncome,
  totalExpense,
  incomes,
  expenses,
  onTransactionClick,
  form,
  formType,
  onFormClose,
  onTransactionUpdate,
  onFormTypeChange,
  onTransactionDelete,
}) => {
  return (
    <div>
      <TransactionSummary
        totalIncome={totalIncome}
        totalExpense={totalExpense}
      />

      <TransactionsList
        type={TransactionTypeEnum.INCOME}
        transactions={incomes}
        onTransactionClick={onTransactionClick}
      />
      <TransactionsList
        type={TransactionTypeEnum.EXPENSE}
        transactions={expenses}
        onTransactionClick={onTransactionClick}
      />

      <TransactionFormModal
        form={form}
        formType={formType}
        onCancel={onFormClose}
        onFormSubmit={onTransactionUpdate}
        isEditForm={true}
        onFormTypeChange={onFormTypeChange}
        onDelete={onTransactionDelete}
      />
    </div>
  );
};
