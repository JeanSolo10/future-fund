import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionObject } from './object/transaction.object';
import { TransactionService } from './transaction.service';
import {
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

  @Mutation(() => TransactionObject)
  async createTransaction(
    @Args() args: TransactionCreateArgs,
  ): Promise<TransactionObject> {
    return this.transactionService.create(args);
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
