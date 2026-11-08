import { skipToken, useMutation, useQuery } from '@apollo/client/react';
import { TransactionTypeEnum } from '../../object-types/transaction/transaction.enums';
import React, { useState } from 'react';
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
import { GET_MONTHLY_SUMMARY } from '../../graphql/queries/GetMonthlySummary';
import { GET_CALENDAR_TRANSACTIONS } from '../../graphql/queries/GetCalendarTransactions';

type Props = {
  setShouldDisplayAddIcon: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Transactions: React.FC<Props> = ({ setShouldDisplayAddIcon }) => {
  const [formType, setFormType] = useState<TransactionFormType>(null);
  const [selectedRecord, setSelectedRecord] =
    useState<TransactionObjectType | null>(null);
  const { viewedMonth } = dateContext();

  const [form] = Form.useForm();

  const { budgetId } = useParams();

  const { data: monthlySummaryData } = useQuery(
    GET_MONTHLY_SUMMARY,
    budgetId
      ? {
          variables: { budgetId, month: toCalendarDate(viewedMonth) },
          fetchPolicy: 'cache-and-network',
        }
      : skipToken,
  );

  const [updateTransaction] = useMutation(UPDATE_TRANSACTION);

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION);

  const monthlySummary = monthlySummaryData?.monthlySummary;
  const transactions = monthlySummary?.transactions ?? [];
  const expenses = transactions.filter(
    (transaction) => transaction.type === TransactionTypeEnum.EXPENSE,
  );
  const incomes = transactions.filter(
    (transaction) => transaction.type === TransactionTypeEnum.INCOME,
  );

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
      refetchQueries: [GET_MONTHLY_SUMMARY, GET_CALENDAR_TRANSACTIONS],
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
      refetchQueries: [GET_MONTHLY_SUMMARY, GET_CALENDAR_TRANSACTIONS],
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
          totalIncome={monthlySummary?.totalIncome}
          totalExpense={monthlySummary?.totalExpense}
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
      children: (
        <Breakdown
          expenseTotalsByCategory={
            monthlySummary?.expenseTotalsByCategory ?? []
          }
        />
      ),
    },
    {
      key: 'calendar',
      label: 'Calendar',
      children: <CalendarView budgetId={budgetId} />,
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
