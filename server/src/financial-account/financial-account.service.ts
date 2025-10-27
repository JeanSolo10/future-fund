import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { FinancialAccount, Prisma } from 'generated/prisma';

@Injectable()
export class FinancialAccountService {
  constructor(private db: DatabaseService) {}

  async findUnique(args: {
    where: Prisma.FinancialAccountWhereUniqueInput;
  }): Promise<FinancialAccount | null> {
    return this.db.financialAccount.findUnique(args);
  }

  async findMany(
    args: Prisma.FinancialAccountFindManyArgs,
  ): Promise<FinancialAccount[]> {
    return this.db.financialAccount.findMany(args);
  }

  async create(args: {
    data: Prisma.FinancialAccountCreateInput;
  }): Promise<FinancialAccount> {
    return this.db.financialAccount.create(args);
  }

  async update(
    args: Prisma.FinancialAccountUpdateArgs,
  ): Promise<FinancialAccount> {
    const { where, data } = args;
    return this.db.financialAccount.update({
      data,
      where,
    });
  }

  async delete(args: {
    where: Prisma.FinancialAccountWhereUniqueInput;
  }): Promise<FinancialAccount> {
    return await this.db.financialAccount.delete(args);
  }
}
