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
import { toCalendarDate, type CalendarDate } from '../../../common/date';

type Props = {
  transactions: TransactionObjectType[];
  windowStart: DateTime;
  windowEnd: DateTime;
};

export const CalendarView: React.FC<Props> = ({
  transactions,
  windowStart,
  windowEnd,
}) => {
  const { isMobile } = useWindowSizeHook();

  const { currentMonth, currentYear, currentDate } = dateContext();

  const [
    generateTransactionsFromFrequency,
    { data: transactionsFromFrequencyData, error },
  ] = useLazyQuery(GENERATE_TRANSACTIONS_FROM_FREQUENCY);

  const windowStartDate = toCalendarDate(windowStart);
  const windowEndDate = toCalendarDate(windowEnd);

  useEffect(() => {
    if (!isEmptyArray(transactions)) {
      generateTransactionsFromFrequency({
        variables: {
          transactionIds: transactions.map((transaction) => transaction.id),
          windowStart: windowStartDate,
          windowEnd: windowEndDate,
        },
      });
    }
  }, [transactions, windowStartDate, windowEndDate]);

  if (error) {
    return <div>There was an error fetching data</div>;
  }

  const transactionsFromFrequency =
    transactionsFromFrequencyData?.generateTransactionsFromFrequency ?? [];

  const transactionsByDay = useMemo(() => {
    const grouped: Record<CalendarDate, typeof transactionsFromFrequency> = {};

    transactionsFromFrequency.forEach((transaction) => {
      if (!grouped[transaction.startDate]) {
        grouped[transaction.startDate] = [];
      }
      grouped[transaction.startDate].push(transaction);
    });

    return grouped;
  }, [transactionsFromFrequency]);

  const getCalendarData = (calendarDate: CalendarDate) => {
    const dailyTransactions = transactionsByDay[calendarDate] || [];

    return dailyTransactions.map((item, index) => {
      const isIncome = item.type === TransactionTypeEnum.INCOME;

      return {
        type: isIncome ? 'success' : 'error',
        content: (
          <TransactionCalendarItemDisplay
            name={item.name}
            amount={item.amount}
            type={item.type}
          />
        ),
        key: `cal-item-${calendarDate}-${index}`,
      };
    });
  };

  const dateCellRender = (calendarDate: CalendarDate) => {
    const calendarData = getCalendarData(calendarDate);
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

  const cellRender = (current: DateTime, info: any) => {
    if (info.type === 'date') {
      return dateCellRender(toCalendarDate(current));
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

  const today = DateTime.now();
  const isViewingCurrentMonth =
    today.year === currentYear && today.month === currentMonth + 1;

  return (
    <div
      className={`calendar-content ${isViewingCurrentMonth ? '' : 'hide-selected-date'}`}
    >
      {isMobile ? (
        <TransactionWeeklyViewList data={getListViewData()} />
      ) : (
        <CustomAntdCalendar
          cellRender={cellRender}
          style={{ height: 'auto' }}
          headerRender={() => null}
          value={DateTime.fromObject(
            {
              year: currentYear,
              // need +1 as its 'currentMonth' number is coming from new Date()
              month: currentMonth + 1,
              // every month has a day 1, and CSS hides the selection outside the current month
              day: isViewingCurrentMonth ? today.day : 1,
            },
            { zone: 'utc' },
          )}
        />
      )}
    </div>
  );
};
