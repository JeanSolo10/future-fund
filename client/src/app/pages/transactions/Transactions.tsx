import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { GET_TRANSACTIONS } from '../../../queries/GetTransactions';
import { TransactionTypeEnum } from '../../../objects/transaction/transaction.enums';
import { CALCULATE_MONTHLY_EXPENSE } from '../../../queries/CalculateMonthlyExpense';
import { CALCULATE_MONTHLY_INCOME } from '../../../queries/CalculateMonthlyIncome';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { UPDATE_TRANSACTION } from '../../../mutations/UpdateTransaction';
import Decimal from 'decimal.js';
import { DELETE_TRANSACTION } from '../../../mutations/DeleteTransaction';
import type {
  EditableColumnType,
  ExpenseRowDataType,
  IncomeRowDataType,
} from './types';
import { EditableTransactionTable } from './components/table/EditableTransactionTable';

const expenseDataColumns: EditableColumnType<ExpenseRowDataType>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name', editable: true },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    editable: true,
  },
  { title: 'Amount', dataIndex: 'amount', key: 'amount', editable: true },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    editable: true,
    render: (isoString: string | null) => {
      if (!isoString) return null;
      return new Date(isoString).toLocaleDateString('en-us', {
        month: 'long',
        day: 'numeric',
      });
    },
  },
  {
    title: 'Frequency',
    dataIndex: 'frequency',
    key: 'frequency',
    editable: true,
  },
];

const incomeDataColumns: EditableColumnType<IncomeRowDataType>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name', editable: true },
  { title: 'Amount', dataIndex: 'amount', key: 'amount', editable: true },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
    editable: true,
    render: (isoString: string | null) => {
      if (!isoString) return null;
      return new Date(isoString).toLocaleDateString('en-us', {
        month: 'long',
        day: 'numeric',
      });
    },
  },
  {
    title: 'Frequency',
    dataIndex: 'frequency',
    key: 'frequency',
    editable: true,
  },
];

type Props = {
  budgetId: string;
};

export const Transactions: React.FC<Props> = ({ budgetId }) => {
  const [isAnyRowEditing, setIsAnyRowEditing] = useState(false);

  const { data: getTransactionsData } = useQuery(GET_TRANSACTIONS, {
    variables: { where: { budgetId: budgetId } },
  });

  const [calculateMonthlyExpense, { data: calculateMonthlyExpenseData }] =
    useLazyQuery(CALCULATE_MONTHLY_EXPENSE);

  const [calculateMonthlyIncome, { data: calculateMonthlyIncomeData }] =
    useLazyQuery(CALCULATE_MONTHLY_INCOME);

  const [updateTransaction] = useMutation(UPDATE_TRANSACTION);

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION);

  const transactions = getTransactionsData?.transactions ?? [];
  const expenses = transactions.filter(
    (transaction) => transaction.type === TransactionTypeEnum.EXPENSE,
  );
  const incomes = transactions.filter(
    (transaction) => transaction.type === TransactionTypeEnum.INCOME,
  );

  useEffect(() => {
    if (getTransactionsData) {
      calculateMonthlyExpense({
        variables: {
          transactionIds: expenses.map((expense) => expense.id),
        },
      });
      calculateMonthlyIncome({
        variables: {
          transactionIds: incomes.map((income) => income.id),
        },
      });
    }
  }, [getTransactionsData]);

  const expenseDataSource: ExpenseRowDataType[] = expenses.map((expense) => ({
    key: expense.id,
    name: expense.name,
    category: expense.category,
    amount: expense.amount,
    dueDate: expense.date,
    frequency: expense.frequency,
  }));

  const incomeDataSource: IncomeRowDataType[] = incomes.map((income) => ({
    key: income.id,
    name: income.name,
    amount: income.amount,
    startDate: income.date,
    frequency: income.frequency,
    category: income.category,
  }));

  const handleSaveExpense = async (key: string, row: ExpenseRowDataType) => {
    const { amount, dueDate, name, category, frequency } = row;
    await updateTransaction({
      variables: {
        data: {
          ...(amount ? { amount: new Decimal(amount) } : {}),
          ...(dueDate
            ? { date: (dueDate as unknown as DateTime).toJSDate() }
            : {}),
          ...(category ? { category } : {}),
          ...(frequency ? { frequency } : {}),
          ...(name ? { name } : {}),
        },
        where: { id: key },
      },
      refetchQueries: [GET_TRANSACTIONS, CALCULATE_MONTHLY_EXPENSE],
    });
  };

  const handleSaveIncome = async (key: string, row: IncomeRowDataType) => {
    const { amount, name, frequency, startDate } = row;
    await updateTransaction({
      variables: {
        data: {
          ...(amount ? { amount: new Decimal(amount) } : {}),
          ...(startDate
            ? { date: (startDate as unknown as DateTime).toJSDate() }
            : {}),
          ...(frequency ? { frequency } : {}),
          ...(name ? { name } : {}),
        },
        where: { id: key },
      },
      refetchQueries: [GET_TRANSACTIONS, CALCULATE_MONTHLY_INCOME],
    });
  };

  const handleDelete = async (key: string) => {
    await deleteTransaction({
      variables: { where: { id: key } },
      refetchQueries: [
        GET_TRANSACTIONS,
        CALCULATE_MONTHLY_EXPENSE,
        CALCULATE_MONTHLY_INCOME,
      ],
    });
  };

  return (
    <div>
      <EditableTransactionTable
        title="Expenses"
        total={calculateMonthlyExpenseData?.calculateTotalMonthlyExpense}
        dataSource={expenseDataSource}
        dataColumns={expenseDataColumns}
        onSave={handleSaveExpense}
        onDelete={handleDelete}
        onSetEditing={setIsAnyRowEditing}
        isAnyRowEditing={isAnyRowEditing}
      />
      <EditableTransactionTable
        title="Income"
        total={calculateMonthlyIncomeData?.calculateTotalMonthlyIncome}
        dataSource={incomeDataSource}
        dataColumns={incomeDataColumns}
        onSave={handleSaveIncome}
        onDelete={handleDelete}
        onSetEditing={setIsAnyRowEditing}
        isAnyRowEditing={isAnyRowEditing}
      />
    </div>
  );
};
