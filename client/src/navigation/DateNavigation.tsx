import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './Menu.css';
import { dateContext } from '../context/DateContext';

export const DateNavigation = () => {
  const { viewedMonth, setViewedMonth } = dateContext();

  const showPreviousMonth = () => {
    setViewedMonth((month) => month.minus({ months: 1 }));
  };

  const showNextMonth = () => {
    setViewedMonth((month) => month.plus({ months: 1 }));
  };

  return (
    <div className="menu-date-navigation-container">
      <LeftOutlined onClick={showPreviousMonth} />
      <p>{viewedMonth.toFormat('LLLL yyyy', { locale: 'en-US' })}</p>
      <RightOutlined onClick={showNextMonth} />
    </div>
  );
};
