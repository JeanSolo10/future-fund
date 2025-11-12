import { Field, ObjectType } from '@nestjs/graphql';
import Decimal from 'decimal.js';
import { AccountType } from 'generated/prisma';
import { BaseObject } from 'src/common/base.object';
import { CustomDecimalScalar } from 'src/common/decimal.scalar';

@ObjectType()
export class FinancialAccountObject extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => CustomDecimalScalar, { nullable: true })
  balance?: Decimal | null;

  @Field(() => AccountType)
  type: AccountType;

  // relationship
  @Field(() => String)
  userId: string;
}
