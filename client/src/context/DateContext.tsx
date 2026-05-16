import { createContext, useContext, useEffect, useState } from 'react';

type DateContextType = {
  currentDate: Date;
  currentMonth: number;
  currentYear: number;
  currentDay: number;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  setCurrentMonth: React.Dispatch<React.SetStateAction<number>>;
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>;
};

export const DateContext = createContext<DateContextType | undefined>(
  undefined,
);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const NOW = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(NOW.getUTCMonth());
  const [currentYear, setCurrentYear] = useState<number>(NOW.getUTCFullYear());
  const [currentDate, setCurrentDate] = useState<Date>(NOW);
  const [currentDay, setCurrenDay] = useState<number>(NOW.getUTCDate());

  useEffect(() => {
    setCurrentMonth(currentDate.getUTCMonth());
    setCurrentYear(currentDate.getUTCFullYear());
    setCurrenDay(currentDate.getUTCDate());
  }, [currentDate]);

  const contextValue: DateContextType = {
    currentDate,
    currentMonth,
    currentYear,
    setCurrentDate,
    setCurrentMonth,
    setCurrentYear,
    currentDay,
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
