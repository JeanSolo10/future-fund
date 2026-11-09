import { CalendarTransactionItem } from '../components/CalendarTransactionItem';
import { useMemo, useState } from 'react';
import { Button, Drawer } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import { WeeklyOutlook } from './WeeklyOutlook';
import { useWindowSize } from '../../../hooks/useWindowSize';
import LuxonCalendar from '../../../components/Calendar';
import { useDateContext } from '../../../context/DateContext';
import type { DateTime } from 'luxon';
import { CalendarDayList } from '../components/CalendarDayList';
import { skipToken, useQuery } from '@apollo/client/react';
import { GET_CALENDAR_TRANSACTIONS } from '../../../graphql/queries/GetCalendarTransactions';
import type { CalendarTransactionObjectType } from '../../../object-types/transaction/transaction.type';
import { TransactionTypeEnum } from '../../../object-types/transaction/transaction.enums';
import {
  getToday,
  toCalendarDate,
  type CalendarDate,
} from '../../../common/date';

// the calendar grid also shows days from the neighboring months
const CALENDAR_PADDING_DAYS = 14;

type Props = {
  budgetId: string | undefined;
};

export const CalendarView: React.FC<Props> = ({ budgetId }) => {
  const { isMobile } = useWindowSize();

  const { viewedMonth } = useDateContext();

  const [isOutlookOpen, setIsOutlookOpen] = useState(false);

  const calendarStart = toCalendarDate(
    viewedMonth.minus({ days: CALENDAR_PADDING_DAYS }),
  );
  const calendarEnd = toCalendarDate(
    viewedMonth.endOf('month').plus({ days: CALENDAR_PADDING_DAYS }),
  );

  const { data: calendarTransactionsData, error } = useQuery(
    GET_CALENDAR_TRANSACTIONS,
    budgetId
      ? {
          variables: { budgetId, start: calendarStart, end: calendarEnd },
          fetchPolicy: 'cache-and-network',
        }
      : skipToken,
  );

  const calendarTransactions =
    calendarTransactionsData?.calendarTransactions ?? [];

  const calendarTransactionsByDate = useMemo(() => {
    const grouped: Record<CalendarDate, CalendarTransactionObjectType[]> = {};

    calendarTransactions.forEach((calendarTransaction) => {
      if (!grouped[calendarTransaction.date]) {
        grouped[calendarTransaction.date] = [];
      }
      grouped[calendarTransaction.date].push(calendarTransaction);
    });

    return grouped;
  }, [calendarTransactions]);

  if (error) {
    return <div>There was an error fetching data</div>;
  }

  const getCalendarCellItems = (calendarDate: CalendarDate) => {
    const dailyTransactions = calendarTransactionsByDate[calendarDate] || [];

    return dailyTransactions.map((item, index) => {
      const isIncome = item.type === TransactionTypeEnum.INCOME;

      return {
        type: isIncome ? 'success' : 'error',
        content: (
          <CalendarTransactionItem
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
    const calendarData = getCalendarCellItems(calendarDate);
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

  const today = getToday();
  const isViewingCurrentMonth = today.hasSame(viewedMonth, 'month');

  const handleOutlookOpen = () => setIsOutlookOpen(true);

  const handleOutlookClose = () => setIsOutlookOpen(false);

  return (
    <div
      className={`calendar-content ${isViewingCurrentMonth ? '' : 'hide-selected-date'}`}
    >
      {isMobile ? (
        <CalendarDayList
          calendarTransactionsByDate={calendarTransactionsByDate}
        />
      ) : (
        <LuxonCalendar
          cellRender={cellRender}
          style={{ height: 'auto' }}
          headerRender={() => null}
          // antd always selects a day: outside the current month it selects the 1st, and CSS hides it
          value={isViewingCurrentMonth ? today : viewedMonth}
        />
      )}
      {isViewingCurrentMonth && budgetId && (
        <Button
          className="weekly-outlook-button"
          shape="round"
          size="large"
          icon={<LineChartOutlined />}
          onClick={handleOutlookOpen}
        >
          Outlook
        </Button>
      )}
      <Drawer
        title="Weekly outlook"
        open={isOutlookOpen}
        onClose={handleOutlookClose}
        width={isMobile ? '100%' : 480}
        destroyOnHidden
      >
        {budgetId && <WeeklyOutlook budgetId={budgetId} />}
      </Drawer>
    </div>
  );
};
