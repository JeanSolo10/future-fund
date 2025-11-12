import { Field, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import Decimal from 'decimal.js';
import { AccountType } from 'generated/prisma';
import { CustomDecimalScalar, SafeDecimal } from 'src/common/decimal.scalar';

@InputType()
export class FinancialAccountWhereUniqueInput {
  @IsUUID()
  @Field(() => ID)
  id: string;
}

@InputType()
export class FinancialAccountsWhereInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @IsEnum(AccountType)
  @Field(() => AccountType, { nullable: true })
  type?: AccountType;

  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  userId?: string;
}

@InputType()
export class FinancialAccountCreateInput {
  @IsString()
  @Field(() => String)
  name: string;

  @IsEnum(AccountType)
  @Field(() => AccountType)
  type: AccountType;

  @Type(() => SafeDecimal)
  @Field(() => CustomDecimalScalar, { nullable: true })
  balance?: Decimal;

  @IsUUID()
  @Field(() => ID)
  userId: string;
}

@InputType()
export class FinancialAccountUpdateInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @IsEnum(AccountType)
  @Field(() => AccountType, { nullable: true })
  type?: AccountType;

  @Type(() => SafeDecimal)
  @Field(() => CustomDecimalScalar, { nullable: true })
  balance?: Decimal;

  @IsOptional()
  @IsUUID()
  @Field(() => ID, { nullable: true })
  userId?: string;
}
