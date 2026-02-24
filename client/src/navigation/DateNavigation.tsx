import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './Menu.css';
import { dateContext } from '../context/DateContext';
import { MONTH_INDEX_TO_FULL_NAME } from './constants';

const PrevOrNextEnum = {
  PREVIOUS: 'PREVIOUS',
  NEXT: 'NEXT',
} as const;

type PrevOrNextType = (typeof PrevOrNextEnum)[keyof typeof PrevOrNextEnum];

export const DateNavigation = () => {
  const { currentMonth, currentYear, currentDate, setCurrentDate } =
    dateContext();

  const getNewDate = (navigation: PrevOrNextType) => {
    navigation === PrevOrNextEnum.PREVIOUS
      ? setCurrentDate(
          new Date(currentDate.setMonth(currentDate.getMonth() - 1)),
        )
      : setCurrentDate(
          new Date(currentDate.setMonth(currentDate.getMonth() + 1)),
        );
  };

  return (
    <div className="menu-date-navigation-container">
      <LeftOutlined onClick={() => getNewDate(PrevOrNextEnum.PREVIOUS)} />
      <p>
        {MONTH_INDEX_TO_FULL_NAME[currentMonth]} {currentYear}
      </p>
      <RightOutlined onClick={() => getNewDate(PrevOrNextEnum.NEXT)} />
    </div>
  );
};
