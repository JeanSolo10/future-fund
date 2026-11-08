import { DateTime } from 'luxon';

export type CalendarDate = string;

export const parseCalendarDate = (value: CalendarDate): DateTime =>
  DateTime.fromISO(value, { zone: 'utc' });

export const toCalendarDate = (date: DateTime): CalendarDate => {
  const calendarDate = date.toISODate();

  if (!calendarDate) {
    throw new Error(
      `Cannot turn an invalid date into a calendar date: ${date.invalidReason}`,
    );
  }

  return calendarDate;
};

export const getToday = (): DateTime =>
  parseCalendarDate(toCalendarDate(DateTime.local()));
