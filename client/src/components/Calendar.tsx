import { Calendar } from 'antd';
import type { DateTime } from 'luxon';
import luxonGenerateConfig from 'rc-picker/lib/generate/luxon';

const CustomAntdCalendar = Calendar.generateCalendar<DateTime>({
  ...luxonGenerateConfig,
  locale: {
    ...luxonGenerateConfig.locale,
    getWeekFirstDay: () => 0,
  },
});

/* todo: create specific calendars based on user preference
export const CalendarSunday = createCalendar(0);
export const CalendarMonday = createCalendar(1);
*/

export default CustomAntdCalendar;
