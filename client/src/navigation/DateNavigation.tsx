import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './Menu.css';
import { useState } from 'react';

const PrevOrNextEnum = {
  PREVIOUS: 'PREVIOUS',
  NEXT: 'NEXT',
} as const;

type PrevOrNextType = (typeof PrevOrNextEnum)[keyof typeof PrevOrNextEnum];

export const DateNavigation = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNamesFull = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const getNewDate = (navigation: PrevOrNextType) => {
    const date = new Date(currentDate);

    navigation === PrevOrNextEnum.PREVIOUS
      ? date.setMonth(date.getMonth() - 1)
      : date.setMonth(date.getMonth() + 1);

    setCurrentDate(date);
  };

  return (
    <div className="menu-date-navigation-container">
      <LeftOutlined onClick={() => getNewDate(PrevOrNextEnum.PREVIOUS)} />
      <p>
        {monthNamesFull[currentMonth]} {currentYear}
      </p>
      <RightOutlined onClick={() => getNewDate(PrevOrNextEnum.NEXT)} />
    </div>
  );
};
