import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseObject } from 'src/common/base.object';
import { BudgetObject } from 'src/budget/object/budget.object';

@ObjectType()
export class UserObject extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => ID)
  budgetId: string;

  @Field(() => BudgetObject, { nullable: true })
  budget?: BudgetObject | null;
}
