import { TransactionCalendarItemDisplay } from '../components/TransactionCalendarItemDisplay';
import { useEffect, useMemo } from 'react';
import { generateDataForListView } from '../calendarHelper';
import { useWindowSizeHook } from '../../../hooks/useWindowSizeHook';
import CustomAntdCalendar from '../../../components/Calendar';
import { dateContext } from '../../../context/DateContext';
import { DateTime } from 'luxon';
import { TransactionWeeklyViewList } from '../components/TransactionWeeklyViewList';
import { useLazyQuery } from '@apollo/client/react';
import { GENERATE_TRANSACTIONS_FROM_FREQUENCY } from '../../../graphql/queries/GetTransactionsFromFrequency';
import { isEmptyArray } from '../../../common/utils';
import type { TransactionObjectType } from '../../../object-types/transaction/transaction.type';
import { TransactionTypeEnum } from '../../../object-types/transaction/transaction.enums';

type Props = {
  transactions: TransactionObjectType[];
};

export const CalendarView: React.FC<Props> = ({ transactions }) => {
  const { isMobile } = useWindowSizeHook();

  const { currentMonth, currentYear, currentDay, currentDate } = dateContext();

  const [
    generateTransactionsFromFrequency,
    { data: transactionsFromFrequencyData, error },
  ] = useLazyQuery(GENERATE_TRANSACTIONS_FROM_FREQUENCY);

  useEffect(() => {
    if (!isEmptyArray(transactions)) {
      generateTransactionsFromFrequency({
        variables: {
          transactionIds: transactions.map((transaction) => transaction.id),
        },
      });
    }
  }, [transactions]);

  if (error) {
    return <div>There was an error fetching data</div>;
  }

  const transactionsFromFrequency =
    transactionsFromFrequencyData?.generateTransactionsFromFrequency ?? [];

  const transactionsByDay = useMemo(() => {
    const grouped: Record<number, typeof transactionsFromFrequency> = {};

    transactionsFromFrequency.forEach((transaction) => {
      const day = new Date(transaction.startDate).getDate();

      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(transaction);
    });

    return grouped;
  }, [transactionsFromFrequency]);

  const getCalendarData = (value: Date) => {
    const day = new Date(value).getDate();
    const dailyTransactions = transactionsByDay[day] || [];

    return dailyTransactions.map((item, index) => {
      const isIncome = item.type === TransactionTypeEnum.INCOME;

      return {
        type: isIncome ? 'success' : 'error',
        content: (
          <TransactionCalendarItemDisplay
            name={item.name}
            amount={item.amount}
            type={isIncome ? 'income' : 'expense'}
          />
        ),
        key: `cal-item-${day}-${index}`,
      };
    });
  };

  const dateCellRender = (value: Date) => {
    const calendarData = getCalendarData(value);
    return (
      <ul className="events" style={{ padding: 0 }}>
        {calendarData.map((data) => (
          <li
            key={data.key}
            style={{ listStyleType: 'none', marginBottom: '4px' }}
          >
            {data.content}
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current: any, info: any) => {
    if (info.type === 'date') {
      return dateCellRender(current);
    }
    return info.originNode;
  };

  const getListViewData = () => {
    const generatedData = generateDataForListView(
      transactionsFromFrequency,
      currentDate,
    );

    return generatedData;
  };

  return (
    <div className="calendar-content">
      {isMobile ? (
        <TransactionWeeklyViewList data={getListViewData()} />
      ) : (
        <CustomAntdCalendar
          cellRender={cellRender}
          style={{ height: 'auto' }}
          headerRender={() => null}
          value={DateTime.fromObject({
            year: currentYear,
            // need +1 as its 'currentMonth' number is coming from new Date()
            month: currentMonth + 1,
            day: currentDay,
          })}
        />
      )}
    </div>
  );
};
