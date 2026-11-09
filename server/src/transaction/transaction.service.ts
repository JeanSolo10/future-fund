import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Transaction, Prisma, TransactionType } from 'generated/prisma';
import {
  CalendarTransactionsArgs,
  MonthlySummaryArgs,
  WeeklyOutlookArgs,
} from './dto/transaction.args';
import {
  TransactionOccurrence,
  listOccurrencesBetween,
  sumAmounts,
  sumAmountsByCategory,
} from './transaction.occurrences';
import {
  OutlookAccount,
  buildOutlookWeeks,
  getOutlookRange,
  sumStartingBalance,
} from './transaction.outlook';
import { MonthlySummaryObject } from './object/monthly-summary.object';
import { CalendarTransactionObject } from './object/calendar-transaction.object';
import { WeeklyOutlookObject } from './object/weekly-outlook.object';
import { DateTime } from 'luxon';
import { FinancialAccountService } from 'src/financial-account/financial-account.service';

const toCalendarTransaction = (
  occurrence: TransactionOccurrence,
): CalendarTransactionObject => ({
  transactionId: occurrence.transaction.id,
  date: occurrence.date,
  name: occurrence.transaction.name,
  amount: occurrence.transaction.amount,
  type: occurrence.transaction.type,
});

@Injectable()
export class TransactionService {
  constructor(
    private db: DatabaseService,
    private financialAccountService: FinancialAccountService,
  ) {}

  async findUnique(args: {
    where: Prisma.TransactionWhereUniqueInput;
  }): Promise<Transaction | null> {
    return this.db.transaction.findUnique(args);
  }

  async findMany(args: Prisma.TransactionFindManyArgs): Promise<Transaction[]> {
    return this.db.transaction.findMany(args);
  }

  async create(args: {
    data: Prisma.TransactionCreateInput;
  }): Promise<Transaction> {
    return this.db.transaction.create(args);
  }

  async update(args: Prisma.TransactionUpdateArgs): Promise<Transaction> {
    const { where, data } = args;
    return this.db.transaction.update({
      data,
      where,
    });
  }

  async delete(args: {
    where: Prisma.TransactionWhereUniqueInput;
  }): Promise<Transaction> {
    return await this.db.transaction.delete(args);
  }

  async findTransactionsActiveBetween(
    budgetId: string,
    start: Date,
    end: Date,
  ): Promise<Transaction[]> {
    return this.db.transaction.findMany({
      where: {
        budgetId,
        startDate: { lte: end },
        OR: [{ endDate: null }, { endDate: { gte: start } }],
      },
      orderBy: { name: 'asc' },
    });
  }

  async getMonthlySummary(
    args: MonthlySummaryArgs,
  ): Promise<MonthlySummaryObject> {
    const monthStart = DateTime.fromJSDate(args.month, {
      zone: 'utc',
    }).startOf('month');
    const start = monthStart.toJSDate();
    const end = monthStart.endOf('month').startOf('day').toJSDate();

    const transactions = await this.findTransactionsActiveBetween(
      args.budgetId,
      start,
      end,
    );
    const occurrences = listOccurrencesBetween(transactions, start, end);

    const transactionIdsInMonth = new Set(
      occurrences.map((occurrence) => occurrence.transaction.id),
    );
    const incomeOccurrences = occurrences.filter(
      (occurrence) => occurrence.transaction.type === TransactionType.INCOME,
    );
    const expenseOccurrences = occurrences.filter(
      (occurrence) => occurrence.transaction.type === TransactionType.EXPENSE,
    );

    return {
      month: start,
      transactions: transactions.filter((transaction) =>
        transactionIdsInMonth.has(transaction.id),
      ),
      totalIncome: sumAmounts(incomeOccurrences),
      totalExpense: sumAmounts(expenseOccurrences),
      expenseTotalsByCategory: sumAmountsByCategory(expenseOccurrences),
    };
  }

  async getCalendarTransactions(
    args: CalendarTransactionsArgs,
  ): Promise<CalendarTransactionObject[]> {
    if (args.start > args.end) {
      throw new BadRequestException('start must be on or before end');
    }

    const transactions = await this.findTransactionsActiveBetween(
      args.budgetId,
      args.start,
      args.end,
    );

    return listOccurrencesBetween(transactions, args.start, args.end).map(
      toCalendarTransaction,
    );
  }

  async getWeeklyOutlook(
    args: WeeklyOutlookArgs,
  ): Promise<WeeklyOutlookObject> {
    const accounts = await this.findOutlookAccounts(
      args.budgetId,
      args.financialAccountIds,
    );
    const range = getOutlookRange(args.today);
    const transactions = await this.findTransactionsActiveBetween(
      args.budgetId,
      range.start,
      range.end,
    );
    const occurrences = listOccurrencesBetween(
      transactions,
      range.start,
      range.end,
    );
    const startingBalance = sumStartingBalance(accounts);
    const weeks = buildOutlookWeeks(
      startingBalance,
      occurrences,
      range.start,
      args.alreadyInBalance,
    );

    return {
      startingBalance,
      weeks: weeks.map((week) => ({
        startDate: week.startDate,
        endDate: week.endDate,
        transactions: week.occurrences.map(toCalendarTransaction),
        balanceRemaining: week.balanceRemaining,
      })),
    };
  }

  private async findOutlookAccounts(
    budgetId: string,
    financialAccountIds: string[],
  ): Promise<OutlookAccount[]> {
    const uniqueIds = [...new Set(financialAccountIds)];
    const accounts = await this.financialAccountService.findMany({
      where: { id: { in: uniqueIds }, user: { budgetId } },
    });

    if (accounts.length !== uniqueIds.length) {
      throw new BadRequestException(
        "Every account must exist and belong to this budget's user",
      );
    }

    return accounts.map((account) => {
      if (account.balance === null) {
        throw new BadRequestException(
          `${account.name} has no balance. Add a balance to use it in the outlook.`,
        );
      }

      return { type: account.type, balance: account.balance };
    });
  }
}
