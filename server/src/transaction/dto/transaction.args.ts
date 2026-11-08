import { ArgsType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';
import { CalendarDateScalar } from 'src/common/calendar-date.scalar';
import { FindManyBaseArgs } from 'src/common/common.args';
import {
  TransactionCreateInput,
  TransactionsWhereInput,
  TransactionUpdateInput,
  TransactionWhereUniqueInput,
} from './transaction.input';

@ArgsType()
export class TransactionArgs {
  @ValidateNested()
  @Type(() => TransactionWhereUniqueInput)
  @Field(() => TransactionWhereUniqueInput)
  where: TransactionWhereUniqueInput;
}

@ArgsType()
export class TransactionsArgs extends FindManyBaseArgs {
  @ValidateNested()
  @Type(() => TransactionsWhereInput)
  @Field(() => TransactionsWhereInput, { nullable: true })
  where?: TransactionsWhereInput;
}

@ArgsType()
export class TransactionCreateArgs {
  @ValidateNested()
  @Type(() => TransactionCreateInput)
  @Field(() => TransactionCreateInput)
  data: TransactionCreateInput;
}

@ArgsType()
export class TransactionUpdateArgs {
  @ValidateNested()
  @Type(() => TransactionWhereUniqueInput)
  @Field(() => TransactionWhereUniqueInput)
  where: TransactionWhereUniqueInput;

  @ValidateNested()
  @Type(() => TransactionUpdateInput)
  @Field(() => TransactionUpdateInput)
  data: TransactionUpdateInput;
}

@ArgsType()
export class TransactionDeleteArgs {
  @ValidateNested()
  @Type(() => TransactionWhereUniqueInput)
  @Field(() => TransactionWhereUniqueInput)
  where: TransactionWhereUniqueInput;
}

@ArgsType()
export class MonthlySummaryArgs {
  @IsUUID()
  @Field(() => ID)
  budgetId: string;

  @Field(() => CalendarDateScalar)
  month: Date;
}

@ArgsType()
export class CalendarTransactionsArgs {
  @IsUUID()
  @Field(() => ID)
  budgetId: string;

  @Field(() => CalendarDateScalar)
  start: Date;

  @Field(() => CalendarDateScalar)
  end: Date;
}
