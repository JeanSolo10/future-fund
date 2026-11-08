import { TransactionCalendarItemDisplay } from '../components/TransactionCalendarItemDisplay';
import { useEffect, useMemo } from 'react';
import { generateDataForListView } from '../calendarHelper';
import { useWindowSizeHook } from '../../../hooks/useWindowSizeHook';
import CustomAntdCalendar from '../../../components/Calendar';
import { dateContext } from '../../../context/DateContext';
import type { DateTime } from 'luxon';
import { TransactionWeeklyViewList } from '../components/TransactionWeeklyViewList';
import { useLazyQuery } from '@apollo/client/react';
import { GENERATE_TRANSACTIONS_FROM_FREQUENCY } from '../../../graphql/queries/GetTransactionsFromFrequency';
import { isEmptyArray } from '../../../common/utils';
import type { TransactionObjectType } from '../../../object-types/transaction/transaction.type';
import { TransactionTypeEnum } from '../../../object-types/transaction/transaction.enums';
import {
  getToday,
  toCalendarDate,
  type CalendarDate,
} from '../../../common/date';

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

  const { viewedMonth } = dateContext();

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
      viewedMonth,
    );

    return generatedData;
  };

  const today = getToday();
  const isViewingCurrentMonth = today.hasSame(viewedMonth, 'month');

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
          // antd always selects a day: outside the current month it selects the 1st, and CSS hides it
          value={isViewingCurrentMonth ? today : viewedMonth}
        />
      )}
    </div>
  );
};
