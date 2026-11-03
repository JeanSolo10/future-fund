import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { GET_TRANSACTIONS } from '../../graphql/queries/GetTransactions';
import { TransactionTypeEnum } from '../../object-types/transaction/transaction.enums';
import { CALCULATE_MONTHLY_EXPENSE } from '../../graphql/queries/CalculateMonthlyExpense';
import { CALCULATE_MONTHLY_INCOME } from '../../graphql/queries/CalculateMonthlyIncome';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { UPDATE_TRANSACTION } from '../../graphql/mutations/UpdateTransaction';
import { DELETE_TRANSACTION } from '../../graphql/mutations/DeleteTransaction';
import type {
  ExpenseDataType,
  IncomeDataType,
  TransactionFormType,
} from './types';
import { useParams } from 'react-router';
import { Form, message, Tabs, type TabsProps } from 'antd';
import type { TransactionSubmitPayload } from './components/forms/form.type';
import { toTransactionInput } from './transactionHelper';
import { Breakdown } from './features/Breakdown';
import { CalendarView } from './features/CalendarView';
import { Overview } from './features/Overview';
import { dateContext } from '../../context/DateContext';

type SelectedTableRowType = Partial<ExpenseDataType & IncomeDataType>;

type Props = {
  setShouldDisplayAddIcon: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Transactions: React.FC<Props> = ({ setShouldDisplayAddIcon }) => {
  const [formType, setFormType] = useState<TransactionFormType>('none');
  const [selectedRecord, setSelectedRecord] = useState<SelectedTableRowType>(
    {},
  );
  const { currentYear, currentMonth } = dateContext();

  const [form] = Form.useForm();

  const { budgetId } = useParams();

  const exactMonthStart = DateTime.fromObject(
    {
      day: 1,
      month: currentMonth + 1,
      year: currentYear,
    },
    { zone: 'utc' },
  );

  const exactMonthEnd = exactMonthStart.endOf('month');

  // add padding for spillover dates in ui
  const windowStart = exactMonthStart.minus({ days: 14 });
  const windowEnd = exactMonthEnd.plus({ days: 14 });

  const { data: getTransactionsData, refetch: refetchGetTransactions } =
    useQuery(GET_TRANSACTIONS, {
      variables: {
        where: {
          budgetId: budgetId,
          AND: [
            {
              startDate: { lte: windowEnd },
            },
            {
              OR: [
                { endDate: { gte: windowStart } },
                { endDate: { equals: null } },
              ],
            },
          ],
        },
      },
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
    refetchGetTransactions();

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
  }, [getTransactionsData, currentYear, currentMonth]);

  const expenseDataSource: ExpenseDataType[] = expenses.map((expense) => ({
    key: expense.id,
    name: expense.name,
    category: expense.category,
    amount: expense.amount,
    startDate: expense.startDate,
    frequency: expense.frequency,
    type: expense.type,
    endDate: expense.endDate,
  }));

  const incomeDataSource: IncomeDataType[] = incomes.map((income) => ({
    key: income.id,
    name: income.name,
    amount: income.amount,
    startDate: income.startDate,
    frequency: income.frequency,
    category: income.category,
    type: income.type,
    endDate: income.endDate,
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

  const handleEditTransaction = async (payload: TransactionSubmitPayload) => {
    if (!selectedRecord.key) {
      message.error('There was an error while editing');
      return;
    }

    const isExpense = payload.type === TransactionTypeEnum.EXPENSE;

    await updateTransaction({
      variables: {
        data: toTransactionInput(payload),
        where: { id: selectedRecord.key },
      },
      refetchQueries: [
        GET_TRANSACTIONS,
        isExpense ? CALCULATE_MONTHLY_EXPENSE : CALCULATE_MONTHLY_INCOME,
      ],
    });

    message.success(
      isExpense
        ? 'Expense updated successfully'
        : 'Income updated successfully',
    );
    handleSetFormType('none');
  };

  const handleClickEditExpense = async (
    record: ExpenseDataType | IncomeDataType,
  ) => {
    const expenseRecord = record as ExpenseDataType;
    form.setFieldsValue({
      name: record.name,
      amount: record.amount,
      startDate: record.startDate
        ? DateTime.fromISO(record.startDate, { zone: 'utc' })
        : undefined,
      ...(expenseRecord.category && { category: expenseRecord.category }),
      ...(expenseRecord.frequency && { frequency: expenseRecord.frequency }),
      endDate: record.endDate
        ? DateTime.fromISO(record.endDate, { zone: 'utc' })
        : undefined,
    });
    setSelectedRecord(record);
    handleSetFormType('expense');
  };

  const handleClickEditIncome = async (record: IncomeDataType) => {
    const incomeRecord = record as IncomeDataType;
    form.setFieldsValue({
      name: record.name,
      amount: record.amount,
      startDate: record.startDate
        ? DateTime.fromISO(record.startDate, { zone: 'utc' })
        : undefined,
      ...(incomeRecord.frequency && { frequency: incomeRecord.frequency }),
      endDate: record.endDate
        ? DateTime.fromISO(record.endDate, { zone: 'utc' })
        : undefined,
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
    {
      key: 'breakdown',
      label: 'Breakdown',
      children: (
        <Breakdown
          incomeData={incomeDataSource}
          expenseData={expenseDataSource}
        />
      ),
    },
    {
      key: 'calendar',
      label: 'Calendar',
      children: (
        <CalendarView
          transactions={transactions}
          windowStart={windowStart}
          windowEnd={windowEnd}
        />
      ),
    },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey="overview"
        items={tabItems}
        tabBarStyle={{}}
        centered={true}
        onChange={(key) =>
          key !== 'overview'
            ? setShouldDisplayAddIcon(false)
            : setShouldDisplayAddIcon(true)
        }
      />
    </div>
  );
};
