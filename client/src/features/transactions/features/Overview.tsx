import type { FormInstance } from 'antd';
import { TransactionFormModal } from '../components/TransactionFormModal';
import type {
  ExpenseDataType,
  IncomeDataType,
  TransactionFormType,
} from '../types';
import { TransactionsList } from './TransactionsList';
import { TransactionSummary } from './TransactionsSummary';

type Props = {
  totalIncome: string | undefined;
  totalExpense: string | undefined;
  incomeData: IncomeDataType[];
  expenseData: ExpenseDataType[];
  handleEditIncome: (record: IncomeDataType | ExpenseDataType) => Promise<void>;
  handleEditExpense: (
    record: IncomeDataType | ExpenseDataType,
  ) => Promise<void>;
  form: FormInstance<any>;
  formType: TransactionFormType;
  handleFormClose: () => void;
  handleEditTransaction: () => Promise<void>;
  handleSetFormType: (type: TransactionFormType) => void;
  handleDeleteTransaction: () => Promise<void>;
};

export const Overview: React.FC<Props> = ({
  totalIncome,
  totalExpense,
  incomeData,
  expenseData,
  handleEditIncome,
  handleEditExpense,
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
        type="income"
        data={incomeData}
        onClickItem={handleEditIncome}
      />
      <TransactionsList
        type="expense"
        data={expenseData}
        onClickItem={handleEditExpense}
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
