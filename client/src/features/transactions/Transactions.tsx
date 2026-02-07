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
  ExpenseDataType,
  IncomeDataType,
  TransactionFormType,
} from './types';
import { useParams } from 'react-router';
import { Form, message, Tabs, type TabsProps } from 'antd';
import type { TransactionUpdateInput } from '../../object-types/transaction/transaction.type';
import { Breakdown } from './features/Breakdown';
import { Calendar } from './features/Calendar';
import { Overview } from './features/Overview';

type SelectedTableRowType = Partial<ExpenseDataType & IncomeDataType>;

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

  const expenseDataSource: ExpenseDataType[] = expenses.map((expense) => ({
    key: expense.id,
    name: expense.name,
    category: expense.category,
    amount: expense.amount,
    date: expense.date,
    frequency: expense.frequency,
  }));

  const incomeDataSource: IncomeDataType[] = incomes.map((income) => ({
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
            ...{ type: 'EXPENSE' },
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
          ...{ category: 'NONE' },
          ...{ type: 'INCOME' },
        },
        where: { id: selectedRecord.key },
      },
      refetchQueries: [GET_TRANSACTIONS, CALCULATE_MONTHLY_INCOME],
    });
    message.success('Income updated successfully');
    handleSetFormType('none');
    return;
  };

  const handleClickEditExpense = async (
    record: ExpenseDataType | IncomeDataType,
  ) => {
    const expenseRecord = record as ExpenseDataType;
    form.setFieldsValue({
      name: record.name,
      amount: record.amount,
      date: record.date ? DateTime.fromISO(record.date) : undefined,
      ...(expenseRecord.category && { category: expenseRecord.category }),
      ...(expenseRecord.frequency && { frequency: expenseRecord.frequency }),
    });
    setSelectedRecord(record);
    handleSetFormType('expense');
  };

  const handleClickEditIncome = async (record: IncomeDataType) => {
    const incomeRecord = record as IncomeDataType;
    form.setFieldsValue({
      name: record.name,
      amount: record.amount,
      date: record.date ? DateTime.fromISO(record.date) : undefined,
      ...(incomeRecord.frequency && { frequency: incomeRecord.frequency }),
    });
    setSelectedRecord(record);
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

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <Overview
          totalIncome={calculateMonthlyIncomeData?.calculateTotalMonthlyIncome}
          totalExpense={
            calculateMonthlyExpenseData?.calculateTotalMonthlyExpense
          }
          incomeData={incomeDataSource}
          expenseData={expenseDataSource}
          handleEditIncome={handleClickEditIncome}
          handleEditExpense={handleClickEditExpense}
          form={form}
          formType={formType}
          handleFormClose={handleFormClose}
          handleEditTransaction={handleEditTransaction}
          handleSetFormType={handleSetFormType}
          handleDeleteTransaction={handleDeleteTransaction}
        />
      ),
    },
    { key: 'breakdown', label: 'Breakdown', children: <Breakdown /> },
    { key: 'calendar', label: 'Calendar', children: <Calendar /> },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey="overview"
        items={tabItems}
        tabBarStyle={{}}
        centered={true}
      />
    </div>
  );
};
