import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { GET_TRANSACTIONS } from '../../graphql/queries/GetTransactions';
import { TransactionTypeEnum } from '../../object-types/transaction/transaction.enums';
import { CALCULATE_MONTHLY_EXPENSE } from '../../graphql/queries/CalculateMonthlyExpense';
import { CALCULATE_MONTHLY_INCOME } from '../../graphql/queries/CalculateMonthlyIncome';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { UPDATE_TRANSACTION } from '../../graphql/mutations/UpdateTransaction';
import { DELETE_TRANSACTION } from '../../graphql/mutations/DeleteTransaction';
import type { TransactionFormType } from './types';
import type { TransactionObjectType } from '../../object-types/transaction/transaction.type';
import { useParams } from 'react-router';
import { Form, message, Tabs, type TabsProps } from 'antd';
import type { TransactionSubmitPayload } from './components/forms/form.type';
import { toTransactionInput } from './transactionHelper';
import { Breakdown } from './features/Breakdown';
import { CalendarView } from './features/CalendarView';
import { Overview } from './features/Overview';
import { dateContext } from '../../context/DateContext';
import { parseCalendarDate, toCalendarDate } from '../../common/date';

type Props = {
  setShouldDisplayAddIcon: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Transactions: React.FC<Props> = ({ setShouldDisplayAddIcon }) => {
  const [formType, setFormType] = useState<TransactionFormType>(null);
  const [selectedRecord, setSelectedRecord] =
    useState<TransactionObjectType | null>(null);
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
              startDate: { lte: toCalendarDate(windowEnd) },
            },
            {
              OR: [
                { endDate: { gte: toCalendarDate(windowStart) } },
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

  const handleSetFormType = (type: TransactionFormType) => {
    setFormType(type);
    if (type === null) {
      form.resetFields();
      setSelectedRecord(null);
    }
  };

  const handleFormClose = () => {
    handleSetFormType(null);
  };

  const handleEditTransaction = async (payload: TransactionSubmitPayload) => {
    if (!selectedRecord) {
      message.error('There was an error while editing');
      return;
    }

    const isExpense = payload.type === TransactionTypeEnum.EXPENSE;

    await updateTransaction({
      variables: {
        data: toTransactionInput(payload),
        where: { id: selectedRecord.id },
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
    handleSetFormType(null);
  };

  const handleTransactionClick = (transaction: TransactionObjectType) => {
    form.setFieldsValue({
      name: transaction.name,
      amount: transaction.amount,
      startDate: parseCalendarDate(transaction.startDate),
      category: transaction.category,
      frequency: transaction.frequency,
      endDate: transaction.endDate
        ? parseCalendarDate(transaction.endDate)
        : undefined,
    });
    setSelectedRecord(transaction);

    if (transaction.type === TransactionTypeEnum.INCOME) {
      handleSetFormType(TransactionTypeEnum.INCOME);
    } else {
      handleSetFormType(TransactionTypeEnum.EXPENSE);
    }
  };

  const handleDeleteTransaction = async () => {
    if (!selectedRecord) {
      message.error('There was an error while trying to delete record');
      return;
    }

    await deleteTransaction({
      variables: { where: { id: selectedRecord.id } },
      refetchQueries: [
        GET_TRANSACTIONS,
        CALCULATE_MONTHLY_EXPENSE,
        CALCULATE_MONTHLY_INCOME,
      ],
    });

    message.success('Expense deleted successfully');
    handleSetFormType(null);
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
          incomeData={incomes}
          expenseData={expenses}
          onTransactionClick={handleTransactionClick}
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
      children: <Breakdown expenseData={expenses} />,
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
