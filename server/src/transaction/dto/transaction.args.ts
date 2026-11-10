import { ArgsType, Field, ID, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsInt, IsUUID, Max, Min, ValidateNested } from 'class-validator';
import { CalendarDateScalar } from 'src/common/calendar-date.scalar';
import { FindManyBaseArgs } from 'src/common/common.args';
import {
  DEFAULT_OUTLOOK_WEEK_COUNT,
  MAX_OUTLOOK_WEEK_COUNT,
} from '../transaction.outlook';
import {
  AlreadyInBalanceInput,
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

@ArgsType()
export class WeeklyOutlookArgs {
  @IsUUID()
  @Field(() => ID)
  budgetId: string;

  @Field(() => CalendarDateScalar)
  today: Date;

  @IsUUID(undefined, { each: true })
  @Field(() => [ID])
  financialAccountIds: string[];

  @ValidateNested({ each: true })
  @Type(() => AlreadyInBalanceInput)
  @Field(() => [AlreadyInBalanceInput])
  alreadyInBalance: AlreadyInBalanceInput[];

  @IsInt()
  @Min(1)
  @Max(MAX_OUTLOOK_WEEK_COUNT)
  @Field(() => Int, { defaultValue: DEFAULT_OUTLOOK_WEEK_COUNT })
  weeks: number;
}
