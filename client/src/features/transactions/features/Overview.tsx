import type { FormInstance } from 'antd';
import { TransactionFormModal } from '../components/TransactionFormModal';
import type { TransactionSubmitPayload } from '../components/forms/form.type';
import type { TransactionFormType } from '../types';
import type { TransactionObjectType } from '../../../object-types/transaction/transaction.type';
import { TransactionTypeEnum } from '../../../object-types/transaction/transaction.enums';
import { TransactionsList } from './TransactionsList';
import { TransactionSummary } from './TransactionsSummary';

type Props = {
  totalIncome: string | undefined;
  totalExpense: string | undefined;
  incomeData: TransactionObjectType[];
  expenseData: TransactionObjectType[];
  onTransactionClick: (transaction: TransactionObjectType) => void;
  form: FormInstance<any>;
  formType: TransactionFormType;
  handleFormClose: () => void;
  handleEditTransaction: (payload: TransactionSubmitPayload) => Promise<void>;
  handleSetFormType: (type: TransactionFormType) => void;
  handleDeleteTransaction: () => Promise<void>;
};

export const Overview: React.FC<Props> = ({
  totalIncome,
  totalExpense,
  incomeData,
  expenseData,
  onTransactionClick,
  form,
  formType,
  handleFormClose,
  handleEditTransaction,
  handleSetFormType,
  handleDeleteTransaction,
}) => {
  return (
    <div>
      <TransactionSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpense}
      />

      <TransactionsList
        type={TransactionTypeEnum.INCOME}
        transactions={incomeData}
        onTransactionClick={onTransactionClick}
      />
      <TransactionsList
        type={TransactionTypeEnum.EXPENSE}
        transactions={expenseData}
        onTransactionClick={onTransactionClick}
      />

      <TransactionFormModal
        form={form}
        formType={formType}
        onCancel={handleFormClose}
        onFormSubmit={handleEditTransaction}
        isEditForm={true}
        handleSetFormType={handleSetFormType}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
};
