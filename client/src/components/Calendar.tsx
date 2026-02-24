import { Calendar } from 'antd';
import type { DateTime } from 'luxon';
import luxonGenerateConfig from 'rc-picker/lib/generate/luxon';

const CustomAntdCalendar =
  Calendar.generateCalendar<DateTime>(luxonGenerateConfig);

export default CustomAntdCalendar;
