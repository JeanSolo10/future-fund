import type { CalendarDate } from '../../common/date';

export type CalendarDateFilter = {
  equals?: CalendarDate | null;
  lt?: CalendarDate;
  lte?: CalendarDate;
  gt?: CalendarDate;
  gte?: CalendarDate;
  not?: CalendarDateFilter;
};
