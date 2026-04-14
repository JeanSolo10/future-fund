import { Field, GraphQLISODateTime, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import Decimal from 'decimal.js';
import {
  TransactionCategory,
  TransactionType,
  TransactionFrequency,
} from 'generated/prisma';
import { CustomDecimalScalar, SafeDecimal } from 'src/common/decimal.scalar';
import { DateTimeFilter } from 'src/filters/DaTimeFilter';

@InputType()
export class TransactionWhereUniqueInput {
  @IsUUID()
  @Field(() => ID)
  id: string;
}

@InputType()
export class TransactionsWhereInput {
  @IsOptional()
  @IsEnum(TransactionType)
  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @IsOptional()
  @IsEnum(TransactionCategory)
  @Field(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory;

  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  budgetId?: string;

  // TODO - add some sort of filtering to match characters
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => DateTimeFilter, { nullable: true })
  startDate?: DateTimeFilter;

  @Field(() => DateTimeFilter, { nullable: true })
  endDate?: DateTimeFilter;

  @ValidateNested()
  @Type(() => TransactionsWhereInput)
  @Field(() => [TransactionsWhereInput], { nullable: true })
  AND?: TransactionsWhereInput[];

  @ValidateNested()
  @Type(() => TransactionsWhereInput)
  @Field(() => [TransactionsWhereInput], { nullable: true })
  OR?: TransactionsWhereInput[];
}

@InputType()
export class TransactionCreateInput {
  @Type(() => SafeDecimal)
  @Field(() => CustomDecimalScalar)
  amount: Decimal;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @IsEnum(TransactionType)
  @Field(() => TransactionType)
  type: TransactionType;

  @IsEnum(TransactionCategory)
  @Field(() => TransactionCategory)
  category: TransactionCategory;

  @IsEnum(TransactionFrequency)
  @Field(() => TransactionFrequency)
  frequency: TransactionFrequency;

  @IsUUID()
  @Field(() => ID)
  budgetId: string;

  @Field(() => GraphQLISODateTime)
  endDate: Date;
}

@InputType()
export class TransactionUpdateInput {
  @IsOptional()
  @Type(() => SafeDecimal)
  @Field(() => CustomDecimalScalar, { nullable: true })
  amount?: Decimal;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date;

  @IsOptional()
  @IsEnum(TransactionType)
  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @IsOptional()
  @IsEnum(TransactionCategory)
  @Field(() => TransactionCategory, { nullable: true })
  category?: TransactionCategory;

  @IsOptional()
  @IsEnum(TransactionFrequency)
  @Field(() => TransactionFrequency, { nullable: true })
  frequency?: TransactionFrequency;

  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  budgetId?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate?: Date;
}
