import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Transaction, Prisma, TransactionFrequency } from 'generated/prisma';
import {
  CalculateTotalMonthlyExpenseArgs,
  CalculateTotalMonthlyIncomeArgs,
  GenerateTransactionsFromFrequencyArgs,
  TransactionFrequencyAndAmount,
} from './transaction.types';
import Decimal from 'decimal.js';
import { FREQUENCY_TO_MULTIPLE } from './transaction.constant';
import { getDateBreakdown } from 'src/helper/date.helper';

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

  public async generateTransactionsFromFrequency(
    args: GenerateTransactionsFromFrequencyArgs,
  ): Promise<Transaction[]> {
    const { transactionIds } = args;

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

      // case 1: one transction per month
      if (currentTransaction.frequency === TransactionFrequency.MONTHLY) {
        generatedTransactions.push(currentTransaction);
      }

      // case 2: semi monthly: half a month + last day of month
      // todo: potentially add ability to use 1st and half a month instead
      if (currentTransaction.frequency === TransactionFrequency.SEMI_MONTHLY) {
        const { daysInMonth, year, monthIndex } = getDateBreakdown(
          currentTransaction.startDate,
        );

        const halfAMonth = Math.floor(Number(daysInMonth) / 2);
        const transactionDays = [halfAMonth, daysInMonth];

        transactionDays.forEach((day) => {
          const transaction = {
            ...currentTransaction,
            startDate: new Date(year, monthIndex + 1, day),
          };
          generatedTransactions.push(transaction);
        });
      }

      // case 3: weekly for the month
      if (currentTransaction.frequency === TransactionFrequency.WEEKLY) {
        const { daysInMonth, year, monthIndex, day } = getDateBreakdown(
          currentTransaction.startDate,
        );

        for (let currentDay = day; currentDay < daysInMonth; currentDay += 7) {
          const currentDate = new Date(year, monthIndex, currentDay);
          generatedTransactions.push({
            ...currentTransaction,
            startDate: currentDate,
          });
        }
      }
    }

    return generatedTransactions;
  }
}
