import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  Transaction,
  Prisma,
  TransactionFrequency,
  TransactionType,
} from 'generated/prisma';
import {
  CalculateTotalMonthlyExpenseArgs,
  CalculateTotalMonthlyIncomeArgs,
  CalendarTransactionsArgs,
  GenerateTransactionsFromFrequencyArgs,
  MonthlySummaryArgs,
} from './dto/transaction.args';
import {
  listOccurrencesBetween,
  sumAmounts,
  sumAmountsByCategory,
} from './transaction.occurrences';
import { MonthlySummaryObject } from './object/monthly-summary.object';
import { CalendarTransactionObject } from './object/calendar-transaction.object';
import { TransactionFrequencyAndAmount } from './transaction.types';
import Decimal from 'decimal.js';
import { FREQUENCY_TO_MULTIPLE } from './transaction.constant';
import { DateTime } from 'luxon';

@Injectable()
export class TransactionService {
  constructor(private db: DatabaseService) {}

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

  private calculateTotalForBudget(
    transactions: TransactionFrequencyAndAmount[],
  ): string {
    let total: Decimal = new Decimal(0);

    for (let i = 0; i < transactions.length; i++) {
      const currentTransaction = {
        amount: transactions[i].amount,
        frequency: transactions[i].frequency,
      };
      total = total.add(
        new Decimal(currentTransaction.amount).times(
          FREQUENCY_TO_MULTIPLE[currentTransaction.frequency],
        ),
      );
    }

    return total.toString();
  }

  async calculateTotalMonthlyExpense(
    args: CalculateTotalMonthlyExpenseArgs,
  ): Promise<string> {
    const transactions = await this.findMany({
      where: { id: { in: args.transactionIds } },
      select: {
        amount: true,
        frequency: true,
      },
    });

    if (transactions.length === 0) {
      throw new Error('No transactions found');
    }

    return this.calculateTotalForBudget(transactions);
  }

  async calculateTotalMonthlyIncome(
    args: CalculateTotalMonthlyIncomeArgs,
  ): Promise<string> {
    const transactions = await this.findMany({
      where: { id: { in: args.transactionIds } },
      select: {
        amount: true,
        frequency: true,
      },
    });
    if (transactions.length === 0) {
      throw new Error('No transactions found');
    }

    return this.calculateTotalForBudget(transactions);
  }

  private generateWeeklyTransactions(
    transaction: Transaction,
    windowStart: Date,
    windowEnd: Date,
  ): Transaction[] {
    const generatedTransactions: Transaction[] = [];

    const windowStartDate = DateTime.fromJSDate(windowStart, { zone: 'utc' });
    const windowEndDate = DateTime.fromJSDate(windowEnd, { zone: 'utc' });

    const transactionStartDate = DateTime.fromJSDate(transaction.startDate, {
      zone: 'utc',
    });
    const transactionEndDate = transaction.endDate
      ? DateTime.fromJSDate(transaction.endDate, { zone: 'utc' })
      : windowEndDate;

    let weeksBetweenTransactionAndWindowStart: number = 0;

    if (transactionStartDate < windowStartDate) {
      weeksBetweenTransactionAndWindowStart = windowStartDate.diff(
        transactionStartDate,
        'weeks',
      ).weeks;
    }

    let updatedTransaction = {
      ...transaction,
      startDate: transactionStartDate
        .plus({
          weeks: Math.floor(weeksBetweenTransactionAndWindowStart),
        })
        .toJSDate(),
    };

    let updatedTransactionStartDate = DateTime.fromJSDate(
      updatedTransaction.startDate,
      { zone: 'utc' },
    );

    while (
      updatedTransactionStartDate <= windowEndDate &&
      updatedTransactionStartDate <= transactionEndDate
    ) {
      if (updatedTransactionStartDate >= windowStartDate) {
        generatedTransactions.push(updatedTransaction);
      }

      const newStartDate = updatedTransactionStartDate.plus({ weeks: 1 });

      updatedTransaction = {
        ...updatedTransaction,
        startDate: newStartDate.toUTC().toJSDate(),
      };

      updatedTransactionStartDate = newStartDate;
    }

    return generatedTransactions;
  }

  private generateSemiMonthlyTransactions(
    transaction: Transaction,
    windowStart: Date,
    windowEnd: Date,
  ): Transaction[] {
    const generatedTransactions: Transaction[] = [];

    const windowStartDate = DateTime.fromJSDate(windowStart, { zone: 'utc' });
    const windowEndDate = DateTime.fromJSDate(windowEnd, { zone: 'utc' });

    const transactionStartDate = DateTime.fromJSDate(transaction.startDate, {
      zone: 'utc',
    });
    const transactionEndDate = transaction.endDate
      ? DateTime.fromJSDate(transaction.endDate, { zone: 'utc' })
      : null;

    let currentMonthCursor = windowStartDate.startOf('month');

    while (currentMonthCursor < windowEndDate) {
      const {
        month: currentMonth,
        year: currentYear,
        daysInMonth,
      } = currentMonthCursor;

      const isFirstAndFifteenth = transactionStartDate.day === 1;
      const dayOne = isFirstAndFifteenth ? 1 : 15;
      const dayTwo = isFirstAndFifteenth ? 15 : daysInMonth;

      const generatedDates = [dayOne, dayTwo].map((day) =>
        DateTime.fromObject(
          { year: currentYear, month: currentMonth, day },
          { zone: 'utc' },
        ),
      );

      for (const date of generatedDates) {
        const isAfterStart = date >= transactionStartDate;
        const isBeforeEnd = !transactionEndDate || date <= transactionEndDate;
        const isInsidePaddedWindow =
          date >= windowStartDate && date <= windowEndDate;

        if (isAfterStart && isBeforeEnd && isInsidePaddedWindow) {
          generatedTransactions.push({
            ...transaction,
            startDate: date.toJSDate(),
          });
        }
      }

      currentMonthCursor = currentMonthCursor.plus({ months: 1 });
    }

    return generatedTransactions;
  }

  private getMonthlyTransactions(
    transaction: Transaction,
    windowStart: Date,
    windowEnd: Date,
  ): Transaction[] {
    const generatedTransactions: Transaction[] = [];

    const windowStartDate = DateTime.fromJSDate(windowStart, { zone: 'utc' });
    const windowEndDate = DateTime.fromJSDate(windowEnd, { zone: 'utc' });

    const transactionStartDate = DateTime.fromJSDate(transaction.startDate, {
      zone: 'utc',
    });
    const transactionEndDate = transaction.endDate
      ? DateTime.fromJSDate(transaction.endDate, { zone: 'utc' })
      : null;

    let currentMonthCursor = windowStartDate.startOf('month');

    while (currentMonthCursor < windowEndDate) {
      const targetDay = Math.min(
        transactionStartDate.day,
        currentMonthCursor.daysInMonth ?? 31,
      );

      const generatedDate = DateTime.fromObject(
        {
          day: targetDay,
          month: currentMonthCursor.month,
          year: currentMonthCursor.year,
        },
        { zone: 'utc' },
      );

      const hasStarted = generatedDate >= transactionStartDate;
      const hasNotEnded =
        !transactionEndDate || generatedDate <= transactionEndDate;
      const isInsidePaddedWindow =
        generatedDate >= windowStartDate && generatedDate <= windowEndDate;

      if (hasStarted && hasNotEnded && isInsidePaddedWindow) {
        generatedTransactions.push({
          ...transaction,
          startDate: generatedDate.toJSDate(),
        });
      }

      currentMonthCursor = currentMonthCursor.plus({ months: 1 });
    }

    return generatedTransactions;
  }

  public async generateTransactionsFromFrequency(
    args: GenerateTransactionsFromFrequencyArgs,
  ): Promise<Transaction[]> {
    const { transactionIds, windowEnd, windowStart } = args;

    const transactions = await this.findMany({
      where: {
        id: {
          in: transactionIds,
        },
      },
    });

    if (transactions.length === 0) {
      return [];
    }

    const generatedTransactions: Transaction[] = [];

    for (let i = 0; i < transactions.length; i += 1) {
      const currentTransaction = transactions[i];

      // case 1: monthly transactions within window
      if (currentTransaction.frequency === TransactionFrequency.MONTHLY) {
        const generatedMonthlyTransaction = this.getMonthlyTransactions(
          currentTransaction,
          windowStart,
          windowEnd,
        );

        generatedTransactions.push(...generatedMonthlyTransaction);
      }

      // case 2: semi monthly
      if (currentTransaction.frequency === TransactionFrequency.SEMI_MONTHLY) {
        const generatedSemiMonthlyTransactions =
          this.generateSemiMonthlyTransactions(
            currentTransaction,
            windowStart,
            windowEnd,
          );

        generatedTransactions.push(...generatedSemiMonthlyTransactions);
      }

      // case 3: weekly transactions within window
      if (currentTransaction.frequency === TransactionFrequency.WEEKLY) {
        const generatedWeeklyTransactions = this.generateWeeklyTransactions(
          currentTransaction,
          windowStart,
          windowEnd,
        );

        generatedTransactions.push(...generatedWeeklyTransactions);
      }
    }

    return generatedTransactions;
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
      (occurrence) => ({
        transactionId: occurrence.transaction.id,
        date: occurrence.date,
        name: occurrence.transaction.name,
        amount: occurrence.transaction.amount,
        type: occurrence.transaction.type,
      }),
    );
  }
}
