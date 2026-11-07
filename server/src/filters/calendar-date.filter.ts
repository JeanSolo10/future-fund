import { Field, InputType } from '@nestjs/graphql';
import { CalendarDateScalar } from 'src/common/calendar-date.scalar';

@InputType()
export class CalendarDateFilter {
  @Field(() => CalendarDateScalar, { nullable: true })
  equals?: Date;

  @Field(() => CalendarDateScalar, { nullable: true })
  lt?: Date;

  @Field(() => CalendarDateScalar, { nullable: true })
  lte?: Date;

  @Field(() => CalendarDateScalar, { nullable: true })
  gt?: Date;

  @Field(() => CalendarDateScalar, { nullable: true })
  gte?: Date;

  @Field(() => CalendarDateFilter, { nullable: true })
  not?: CalendarDateFilter;
}
