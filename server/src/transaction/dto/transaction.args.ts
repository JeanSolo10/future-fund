import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
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
export class CalculateTotalMonthlyExpenseArgs {
  @Field(() => [String])
  transactionIds: string[];
}

@ArgsType()
export class CalculateTotalMonthlyIncomeArgs {
  @Field(() => [String])
  transactionIds: string[];
}
