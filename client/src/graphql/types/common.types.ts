import type { DateTime } from 'luxon';

export type DateTimeFilter = {
  equals?: DateTime | null;
  in?: DateTime[];
  notIn?: DateTime[];
  lt?: DateTime;
  lte?: DateTime;
  gt?: DateTime;
  gte?: DateTime;
  not?: DateTimeFilter;
};
