import { Field, ID, ObjectType } from '@nestjs/graphql';
import Decimal from 'decimal.js';
import { TransactionType } from 'generated/prisma';
import { CalendarDateScalar } from 'src/common/calendar-date.scalar';
import { CustomDecimalScalar } from 'src/common/decimal.scalar';

@ObjectType()
export class CalendarTransactionObject {
  @Field(() => ID)
  transactionId: string;

  @Field(() => CalendarDateScalar)
  date: Date;

  @Field(() => String)
  name: string;

  @Field(() => CustomDecimalScalar)
  amount: Decimal;

  @Field(() => TransactionType)
  type: TransactionType;
}
