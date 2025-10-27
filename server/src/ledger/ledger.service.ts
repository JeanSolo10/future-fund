import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Ledger, Prisma } from 'generated/prisma';

@Injectable()
export class LedgerService {
  constructor(private db: DatabaseService) {}

  async findUnique(args: {
    where: Prisma.LedgerWhereUniqueInput;
  }): Promise<Ledger | null> {
    return this.db.ledger.findUnique(args);
  }

  async findMany(args: Prisma.LedgerFindManyArgs): Promise<Ledger[]> {
    return this.db.ledger.findMany(args);
  }

  async create(args: { data: Prisma.LedgerCreateInput }): Promise<Ledger> {
    return this.db.ledger.create(args);
  }

  async update(args: Prisma.LedgerUpdateArgs): Promise<Ledger> {
    const { where, data } = args;
    return this.db.ledger.update({
      data,
      where,
    });
  }

  async delete(args: {
    where: Prisma.LedgerWhereUniqueInput;
  }): Promise<Ledger> {
    return await this.db.ledger.delete(args);
  }
}
