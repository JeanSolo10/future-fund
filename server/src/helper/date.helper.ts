import { MONTH_INDEX_TO_FULL_NAME } from 'src/constant/date.constant';

const daysInMonth = (year: number, monthIndex: number) => {
  // by setting day parameter 0, we get the last day of the previous month
  return new Date(year, monthIndex + 1, 0).getDate();
};

export const monthIndexToFullMonthName = (monthIndex: number) => {
  return MONTH_INDEX_TO_FULL_NAME[monthIndex];
};

/**
 * Gets the day, month, year, daysInMonth from a date.
 * @param {Date} date The date we are breaking down.
 * @returns {{ day: number, monthIndex: number, month: string, year: number, daysInMonth: number}} the day, month, year, daysInMonth from the date
 */
export const getDateBreakdown = (
  date: Date,
): {
  day: number;
  monthIndex: number;
  monthString: string;
  year: number;
  daysInMonth: number;
} => {
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const monthIndex = date.getUTCMonth();

  return {
    day,
    monthString: monthIndexToFullMonthName(monthIndex),
    monthIndex,
    year,
    daysInMonth: daysInMonth(year, monthIndex),
  };
};
