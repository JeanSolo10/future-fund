import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class BudgetWhereUniqueInput {
  @IsUUID()
  @Field(() => ID)
  id: string;
}

@InputType()
export class BudgetsWhereInput {
  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  id?: string;

  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  userId?: string;
}

@InputType()
export class BudgetCreateInput {
  @IsString()
  @Field(() => String)
  name: string;

  @IsUUID()
  @Field(() => ID)
  userId: string;
}

@InputType()
export class BudgetUpdateInput {
  @IsOptional()
  @IsString()
  @Field(() => String)
  name: string;

  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  userId?: string;
}
