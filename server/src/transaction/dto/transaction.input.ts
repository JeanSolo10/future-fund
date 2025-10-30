import { Field, GraphQLISODateTime, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import Decimal from 'decimal.js';
import {
  TransactionCategory,
  TransactionType,
  TransactionFrequency,
} from 'generated/prisma';
import { CustomDecimalScalar, SafeDecimal } from 'src/common/decimal.scalar';

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
  ledgerId?: string;

  // TODO - add some sort of filtering to match characters
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description?: string;

  // TODO - add some sort of filtering for dates
  @Field(() => GraphQLISODateTime, { nullable: true })
  dueDate?: Date;
}

@InputType()
export class TransactionCreateInput {
  @Type(() => SafeDecimal)
  @Field(() => CustomDecimalScalar)
  amount: Decimal;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  dueDate?: Date;

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
  ledgerId: string;
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
  description?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  dueDate?: Date;

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
  ledgerId?: string;
}
