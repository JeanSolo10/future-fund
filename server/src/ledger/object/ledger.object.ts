import { Field, ObjectType } from '@nestjs/graphql';
import { BaseObject } from 'src/common/base.object';

@ObjectType()
export class LedgerObject extends BaseObject {
  @Field(() => String)
  name: string;

  // relationship
  @Field(() => String)
  userId: string;
}
