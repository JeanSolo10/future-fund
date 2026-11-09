import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionObject } from './object/transaction.object';
import { MonthlySummaryObject } from './object/monthly-summary.object';
import { CalendarTransactionObject } from './object/calendar-transaction.object';
import { WeeklyOutlookObject } from './object/weekly-outlook.object';
import { TransactionService } from './transaction.service';
import {
  TransactionArgs,
  TransactionCreateArgs,
  TransactionDeleteArgs,
  TransactionsArgs,
  TransactionUpdateArgs,
  MonthlySummaryArgs,
  CalendarTransactionsArgs,
  WeeklyOutlookArgs,
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

  @Query(() => MonthlySummaryObject)
  monthlySummary(
    @Args() args: MonthlySummaryArgs,
  ): Promise<MonthlySummaryObject> {
    return this.transactionService.getMonthlySummary(args);
  }

  @Query(() => [CalendarTransactionObject])
  calendarTransactions(
    @Args() args: CalendarTransactionsArgs,
  ): Promise<CalendarTransactionObject[]> {
    return this.transactionService.getCalendarTransactions(args);
  }

  @Query(() => WeeklyOutlookObject)
  weeklyOutlook(@Args() args: WeeklyOutlookArgs): Promise<WeeklyOutlookObject> {
    return this.transactionService.getWeeklyOutlook(args);
  }
}
