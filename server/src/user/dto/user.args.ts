import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { FindManyBaseArgs } from 'src/common/common.args';
import {
  UserCreateInput,
  UsersWhereInput,
  UserUpdateInput,
  UserWhereUniqueInput,
} from './user.input';

@ArgsType()
export class UserArgs {
  @ValidateNested()
  @Type(() => UserWhereUniqueInput)
  @Field(() => UserWhereUniqueInput)
  where: UserWhereUniqueInput;
}

@ArgsType()
export class UsersArgs extends FindManyBaseArgs {
  @IsOptional()
  @ValidateNested()
  @Type(() => UsersWhereInput)
  @Field(() => UsersWhereInput, { nullable: true })
  where?: UsersWhereInput;
}

@ArgsType()
export class UserCreateArgs {
  @ValidateNested()
  @Type(() => UserCreateInput)
  @Field(() => UserCreateInput)
  data: UserCreateInput;
}

@ArgsType()
export class UserUpdateArgs {
  @ValidateNested()
  @Type(() => UserWhereUniqueInput)
  @Field(() => UserWhereUniqueInput)
  where: UserWhereUniqueInput;

  @ValidateNested()
  @Type(() => UserUpdateInput)
  @Field(() => UserUpdateInput)
  data: UserUpdateInput;
}

@ArgsType()
export class UserDeleteArgs {
  @ValidateNested()
  @Type(() => UserWhereUniqueInput)
  @Field(() => UserWhereUniqueInput)
  where: UserWhereUniqueInput;
}
