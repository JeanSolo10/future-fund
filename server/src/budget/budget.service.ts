import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Budget, Prisma } from 'generated/prisma';

@Injectable()
export class BudgetService {
  constructor(private db: DatabaseService) {}

  async findUnique(args: {
    where: Prisma.BudgetWhereUniqueInput;
  }): Promise<Budget | null> {
    return this.db.budget.findUnique(args);
  }

  async findMany(args: Prisma.BudgetFindManyArgs): Promise<Budget[]> {
    return this.db.budget.findMany(args);
  }

  async create(args: { data: Prisma.BudgetCreateInput }): Promise<Budget> {
    return this.db.budget.create(args);
  }

  async update(args: Prisma.BudgetUpdateArgs): Promise<Budget> {
    const { where, data } = args;
    return this.db.budget.update({
      data,
      where,
    });
  }

  async delete(args: {
    where: Prisma.BudgetWhereUniqueInput;
  }): Promise<Budget> {
    return await this.db.budget.delete(args);
  }
}
