import { Field, ObjectType } from '@nestjs/graphql';
import { BaseObject } from 'src/common/base.object';
import { UserObject } from 'src/user/object/user.object';

@ObjectType()
export class BudgetObject extends BaseObject {
  @Field(() => String)
  name: string;

  // relationship
  @Field(() => UserObject, { nullable: true })
  user?: UserObject;
}
