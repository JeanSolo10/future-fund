import { Field, ObjectType } from '@nestjs/graphql';
import Decimal from 'decimal.js';
import { CalendarDateScalar } from 'src/common/calendar-date.scalar';
import { CustomDecimalScalar } from 'src/common/decimal.scalar';
import { CalendarTransactionObject } from './calendar-transaction.object';

@ObjectType()
export class OutlookWeekObject {
  @Field(() => CalendarDateScalar)
  startDate: Date;

  @Field(() => CalendarDateScalar)
  endDate: Date;

  @Field(() => [CalendarTransactionObject])
  transactions: CalendarTransactionObject[];

  @Field(() => CustomDecimalScalar)
  balanceRemaining: Decimal;
}

@ObjectType()
export class WeeklyOutlookObject {
  @Field(() => CustomDecimalScalar)
  startingBalance: Decimal;

  @Field(() => [OutlookWeekObject])
  weeks: OutlookWeekObject[];
}
