import { Field, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

@InputType()
export class UserWhereUniqueInput {
  @IsUUID()
  @Field(() => ID)
  id: string;
}

@InputType()
export class UsersWhereInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name?: string;
}

@InputType()
export class UserBudgetCreateInput {
  @IsString()
  @Field(() => String)
  name: string;
}

@InputType()
export class UserCreateInput {
  @IsString()
  @Field(() => String)
  name: string;

  @ValidateNested()
  @Type(() => UserBudgetCreateInput)
  @Field(() => UserBudgetCreateInput)
  budget: UserBudgetCreateInput;
}

@InputType()
export class UserUpdateInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name?: string;
}
