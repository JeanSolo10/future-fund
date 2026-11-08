import { Field, ObjectType } from '@nestjs/graphql';
import Decimal from 'decimal.js';
import { TransactionCategory } from 'generated/prisma';
import { CalendarDateScalar } from 'src/common/calendar-date.scalar';
import { CustomDecimalScalar } from 'src/common/decimal.scalar';
import { TransactionObject } from './transaction.object';

@ObjectType()
export class CategoryTotalObject {
  @Field(() => TransactionCategory)
  category: TransactionCategory;

  @Field(() => CustomDecimalScalar)
  total: Decimal;
}

@ObjectType()
export class MonthlySummaryObject {
  @Field(() => CalendarDateScalar)
  month: Date;

  @Field(() => [TransactionObject])
  transactions: TransactionObject[];

  @Field(() => CustomDecimalScalar)
  totalIncome: Decimal;

  @Field(() => CustomDecimalScalar)
  totalExpense: Decimal;

  @Field(() => [CategoryTotalObject])
  expenseTotalsByCategory: CategoryTotalObject[];
}
