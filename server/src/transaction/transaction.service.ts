import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Transaction, Prisma } from 'generated/prisma';
import {
  CalculateTotalMonthlyExpenseArgs,
  CalculateTotalMonthlyIncomeArgs,
  TransactionFrequencyAndAmount,
} from './transaction.types';
import Decimal from 'decimal.js';
import { FREQUENCY_TO_MULTIPLE } from './transaction.constant';

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
}
