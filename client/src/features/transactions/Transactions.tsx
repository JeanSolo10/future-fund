import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { GET_TRANSACTIONS } from '../../graphql/queries/GetTransactions';
import { TransactionTypeEnum } from '../../object-types/transaction/transaction.enums';
import { CALCULATE_MONTHLY_EXPENSE } from '../../graphql/queries/CalculateMonthlyExpense';
import { CALCULATE_MONTHLY_INCOME } from '../../graphql/queries/CalculateMonthlyIncome';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { UPDATE_TRANSACTION } from '../../graphql/mutations/UpdateTransaction';
import Decimal from 'decimal.js';
import { DELETE_TRANSACTION } from '../../graphql/mutations/DeleteTransaction';
import type {
  ExpenseRowDataType,
  IncomeRowDataType,
  TransactionFormType,
} from './types';
import { TransactionTable } from './components/table/TransactionTable';
import { useParams } from 'react-router';
import {
  expenseDataColumns,
  incomeDataColumns,
} from './components/table/constants';
import { Form, message } from 'antd';
import type { TransactionUpdateInput } from '../../object-types/transaction/transaction.type';
import { TransactionFormModal } from './components/TransactionFormModal';
import { TransactionSummary } from './TransactionsSummary';

type SelectedTableRowType = Partial<ExpenseRowDataType & IncomeRowDataType>;

export const Transactions: React.FC = () => {
  const [formType, setFormType] = useState<TransactionFormType>('none');
  const [selectedRecord, setSelectedRecord] = useState<SelectedTableRowType>(
    {},
  );

  const [form] = Form.useForm();

  const { budgetId } = useParams();

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
    date: expense.date,
    frequency: expense.frequency,
  }));

  const incomeDataSource: IncomeRowDataType[] = incomes.map((income) => ({
    key: income.id,
    name: income.name,
    amount: income.amount,
    date: income.date,
    frequency: income.frequency,
    category: income.category,
  }));

  const handleSetFormType = (type: TransactionFormType) => {
    setFormType(type);
    if (type === 'none') {
      form.resetFields();
      setSelectedRecord({});
    }
  };

  const handleFormClose = () => {
    handleSetFormType('none');
  };

  const handleEditTransaction = async () => {
    const { amount, date, category, frequency, name } =
      form.getFieldsValue() as TransactionUpdateInput;

    if (!selectedRecord.key) {
      message.error('There was an error while editing');
      return;
    }

    if (formType === 'expense') {
      await updateTransaction({
        variables: {
          data: {
            ...(amount ? { amount: new Decimal(amount) } : {}),
            ...(date ? { date: new Date(date) } : {}),
            ...(category ? { category: category } : {}),
            ...(frequency ? { frequency } : {}),
            ...(name ? { name } : {}),
          },
          where: { id: selectedRecord.key },
        },
        refetchQueries: [GET_TRANSACTIONS, CALCULATE_MONTHLY_EXPENSE],
      });

      message.success('Expense updated successfully');
      handleSetFormType('none');
      return;
    }

    await updateTransaction({
      variables: {
        data: {
          ...(amount ? { amount: new Decimal(amount) } : {}),
          ...(date ? { date: new Date(date) } : {}),
          ...(frequency ? { frequency } : {}),
          ...(name ? { name } : {}),
        },
        where: { id: selectedRecord.key },
      },
      refetchQueries: [GET_TRANSACTIONS, CALCULATE_MONTHLY_INCOME],
    });
    message.success('Income updated successfully');
    handleSetFormType('none');
    return;
  };

  const handleClickEditExpense = async () => {
    form.setFieldsValue({
      name: selectedRecord.name,
      amount: selectedRecord.amount,
      date: selectedRecord.date
        ? DateTime.fromISO(selectedRecord.date)
        : undefined,
      category: selectedRecord.category,
      frequency: selectedRecord.frequency,
    });
    handleSetFormType('expense');
  };

  const handleClickEditIncome = async () => {
    form.setFieldsValue({
      name: selectedRecord.name,
      amount: selectedRecord.amount,
      date: selectedRecord.date
        ? DateTime.fromISO(selectedRecord.date)
        : undefined,
      frequency: selectedRecord.frequency,
    });
    handleSetFormType('income');
  };

  const handleDeleteTransaction = async () => {
    if (!selectedRecord.key) {
      message.error('There was an error while trying to delete record');
      return;
    }

    await deleteTransaction({
      variables: { where: { id: selectedRecord.key } },
      refetchQueries: [
        GET_TRANSACTIONS,
        CALCULATE_MONTHLY_EXPENSE,
        CALCULATE_MONTHLY_INCOME,
      ],
    });

    message.success('Expense deleted successfully');
    handleSetFormType('none');
  };

  return (
    <div>
      <TransactionSummary
        totalIncome={calculateMonthlyIncomeData?.calculateTotalMonthlyIncome}
        totalExpenses={
          calculateMonthlyExpenseData?.calculateTotalMonthlyExpense
        }
      />

      <TransactionTable
        title="Income"
        dataSource={incomeDataSource}
        dataColumns={incomeDataColumns}
        onDelete={handleDeleteTransaction}
        onClickEdit={handleClickEditIncome}
        setSelectedRecord={setSelectedRecord}
      />

      <TransactionTable
        title="Expenses"
        dataSource={expenseDataSource}
        dataColumns={expenseDataColumns}
        onDelete={handleDeleteTransaction}
        onClickEdit={handleClickEditExpense}
        setSelectedRecord={setSelectedRecord}
      />

      <TransactionFormModal
        form={form}
        formType={formType}
        onCancel={handleFormClose}
        onFormSubmit={handleEditTransaction}
        isEditForm={true}
      />
    </div>
  );
};
