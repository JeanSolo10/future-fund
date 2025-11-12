import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User, Prisma } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  async findUnique(args: {
    where: Prisma.UserWhereUniqueInput;
  }): Promise<User | null> {
    return this.db.user.findUnique(args);
  }

  async findMany(args?: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.db.user.findMany(args);
  }

  async create(args: { data: Prisma.UserCreateInput }): Promise<User> {
    return this.db.user.create(args);
  }

  async update(args: Prisma.UserUpdateArgs): Promise<User> {
    const { where, data } = args;
    return this.db.user.update({
      data,
      where,
    });
  }

  async delete(args: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    return await this.db.user.delete(args);
  }
}
