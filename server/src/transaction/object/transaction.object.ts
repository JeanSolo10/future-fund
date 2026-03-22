import { Field, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import Decimal from 'decimal.js';
import {
  TransactionCategory,
  TransactionFrequency,
  TransactionType,
} from 'generated/prisma';
import { BaseObject } from 'src/common/base.object';
import { CustomDecimalScalar } from 'src/common/decimal.scalar';

@ObjectType()
export class TransactionObject extends BaseObject {
  @Field(() => CustomDecimalScalar)
  amount: Decimal;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date | null;

  @Field(() => TransactionType)
  type: TransactionType;

  @Field(() => TransactionCategory)
  category: TransactionCategory;

  @Field(() => TransactionFrequency)
  frequency: TransactionFrequency;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate?: Date | null;

  // relationship
  @Field(() => String, { nullable: true })
  budgetId?: string | null;
}
