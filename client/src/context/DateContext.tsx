import { createContext, useContext, useState } from 'react';
import type { DateTime } from 'luxon';
import { getToday } from '../common/date';

type DateContextType = {
  viewedMonth: DateTime;
  setViewedMonth: React.Dispatch<React.SetStateAction<DateTime>>;
};

export const DateContext = createContext<DateContextType | undefined>(
  undefined,
);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [viewedMonth, setViewedMonth] = useState<DateTime>(() =>
    getToday().startOf('month'),
  );

  const contextValue: DateContextType = {
    viewedMonth,
    setViewedMonth,
  };

  return (
    <DateContext.Provider value={contextValue}>{children}</DateContext.Provider>
  );
};

export const dateContext = (): DateContextType => {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error('dateContext must be used within a DateProvider');
  }
  return context;
};
