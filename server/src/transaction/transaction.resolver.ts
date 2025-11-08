import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionObject } from './object/transaction.object';
import { TransactionService } from './transaction.service';
import {
  CalculateTotalMonthlyExpenseArgs,
  CalculateTotalMonthlyIncomeArgs,
  TransactionArgs,
  TransactionCreateArgs,
  TransactionDeleteArgs,
  TransactionsArgs,
  TransactionUpdateArgs,
} from './dto/transaction.args';

@Resolver()
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query(() => TransactionObject, { nullable: true })
  async transaction(
    @Args() args: TransactionArgs,
  ): Promise<TransactionObject | null> {
    return this.transactionService.findUnique(args);
  }

  @Query(() => [TransactionObject])
  async transactions(
    @Args() args: TransactionsArgs,
  ): Promise<TransactionObject[]> {
    return this.transactionService.findMany(args);
  }

  @Query(() => String)
  calculateTotalMonthlyExpense(
    @Args() args: CalculateTotalMonthlyExpenseArgs,
  ): Promise<string> {
    return this.transactionService.calculateTotalMonthlyExpense(args);
  }

  @Query(() => String)
  calculateTotalMonthlyIncome(
    @Args() args: CalculateTotalMonthlyIncomeArgs,
  ): Promise<string> {
    return this.transactionService.calculateTotalMonthlyIncome(args);
  }

  @Mutation(() => TransactionObject)
  async createTransaction(
    @Args() args: TransactionCreateArgs,
  ): Promise<TransactionObject> {
    const { budgetId, ...restArgs } = args.data;

    return this.transactionService.create({
      data: {
        ...restArgs,
        budget: { connect: { id: budgetId } },
      },
    });
  }

  @Mutation(() => TransactionObject)
  async updateTransaction(
    @Args() args: TransactionUpdateArgs,
  ): Promise<TransactionObject> {
    return this.transactionService.update(args);
  }

  @Mutation(() => TransactionObject)
  async deleteTransaction(
    @Args() args: TransactionDeleteArgs,
  ): Promise<TransactionObject> {
    return this.transactionService.delete(args);
  }
}
