import type { ExpenseDataType, IncomeDataType } from '../types';
import { TransactionCalendarItemDisplay } from '../components/TransactionCalendarItemDisplay';
import type { ReactNode } from 'react';
import {
  generateDataForCalendar,
  generateDataForListView,
} from '../calendarHelper';
import { useWindowSizeHook } from '../../../hooks/useWindowSizeHook';
import CustomAntdCalendar from '../../../components/Calendar';
import { dateContext } from '../../../context/DateContext';
import { DateTime } from 'luxon';
import { TransactionWeeklyViewList } from '../components/TransactionWeeklyViewList';

type Props = {
  incomeData: IncomeDataType[];
  expenseData: ExpenseDataType[];
};

export const CalendarView: React.FC<Props> = ({ incomeData, expenseData }) => {
  const { isMobile } = useWindowSizeHook();

  const { currentMonth, currentYear, currentDay, currentDate } = dateContext();

  const getCalendarData = (value: Date) => {
    const day = new Date(value).getDate();

    const listData: { type: string; content: ReactNode; key: string }[] = [];

    const incomeDataForCalendar = generateDataForCalendar(incomeData);
    const expenseDataForCalendar = generateDataForCalendar(expenseData);

    incomeDataForCalendar.forEach((item) => {
      if (new Date(item.date).getDate() === day) {
        listData.push({
          type: 'success',
          content: (
            <TransactionCalendarItemDisplay
              name={item.name}
              amount={item.amount}
              type="income"
            />
          ),
          key: item.key,
        });
      }
    });

    expenseDataForCalendar.forEach((item) => {
      if (new Date(item.date).getDate() === day) {
        listData.push({
          type: 'error',
          content: (
            <TransactionCalendarItemDisplay
              name={item.name}
              amount={item.amount}
              type="expense"
            />
          ),
          key: item.key,
        });
      }
    });

    return listData;
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
      expenseData,
      incomeData,
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
