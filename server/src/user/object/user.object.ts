import { Field, ObjectType } from '@nestjs/graphql';
import { BaseObject } from 'src/common/base.object';

@ObjectType()
export class UserObject extends BaseObject {
  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;
}
