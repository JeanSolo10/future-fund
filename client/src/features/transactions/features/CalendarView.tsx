import type { ExpenseDataType, IncomeDataType } from '../types';
import { Calendar } from 'antd';
import { TransactionCalendarItemDisplay } from '../components/TransactionCalendarItemDisplay';
import type { ReactNode } from 'react';
import { generateDataForCalendar } from '../calendarHelper';

type Props = {
  incomeData: IncomeDataType[];
  expenseData: ExpenseDataType[];
};

export const CalendarView: React.FC<Props> = ({ incomeData, expenseData }) => {
  const getListData = (value: Date) => {
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
    const listData = getListData(value);
    return (
      <ul className="events" style={{ padding: 0 }}>
        {listData.map((item) => (
          <li
            key={item.key}
            style={{ listStyleType: 'none', marginBottom: '4px' }}
          >
            {item.content}
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

  return (
    <div className="calendar-content">
      <Calendar cellRender={cellRender} style={{ height: 'auto' }} />
    </div>
  );
};
