import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import './Menu.css';
import { useDateContext } from '../context/DateContext';
import { getCurrentMonth } from '../common/date';

export const DateNavigation = () => {
  const { viewedMonth, setViewedMonth } = useDateContext();

  const isViewingCurrentMonth = viewedMonth.hasSame(getCurrentMonth(), 'month');

  const showPreviousMonth = () => {
    setViewedMonth((month) => month.minus({ months: 1 }));
  };

  const showNextMonth = () => {
    setViewedMonth((month) => month.plus({ months: 1 }));
  };

  const showCurrentMonth = () => {
    setViewedMonth(getCurrentMonth());
  };

  return (
    <div className="menu-date-navigation-container">
      <LeftOutlined onClick={showPreviousMonth} />
      <p>{viewedMonth.toFormat('LLLL yyyy', { locale: 'en-US' })}</p>
      <RightOutlined onClick={showNextMonth} />
      {!isViewingCurrentMonth && (
        <Button
          className="today-button"
          type="text"
          size="small"
          icon={<CalendarOutlined />}
          aria-label="Back to today"
          onClick={showCurrentMonth}
        >
          <span className="today-button-label">Back to today</span>
        </Button>
      )}
    </div>
  );
};
