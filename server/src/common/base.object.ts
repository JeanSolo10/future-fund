import { registerEnumType } from '@nestjs/graphql';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { enumsToRegister } from './graphql-enums';

enumsToRegister.forEach(({ name, value }) => {
  registerEnumType(value, {
    name,
  });
});

@ObjectType()
export class BaseObject {
  @Field(() => ID)
  id: string;
}
