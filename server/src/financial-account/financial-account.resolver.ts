import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FinancialAccountObject } from './object/financial-account.object';
import { FinancialAccountService } from './financial-account.service';
import {
  FinancialAccountArgs,
  FinancialAccountCreateArgs,
  FinancialAccountDeleteArgs,
  FinancialAccountUpdateArgs,
  FinancialAccountsArgs,
} from './dto/financial-account.args';

@Resolver()
export class FinancialAccountResolver {
  constructor(private financialAccountService: FinancialAccountService) {}

  @Query(() => FinancialAccountObject, { nullable: true })
  async financialAccount(
    @Args() args: FinancialAccountArgs,
  ): Promise<FinancialAccountObject | null> {
    return this.financialAccountService.findUnique(args);
  }

  @Query(() => [FinancialAccountObject])
  async financialAccounts(
    @Args() args: FinancialAccountsArgs,
  ): Promise<FinancialAccountObject[]> {
    return this.financialAccountService.findMany(args);
  }

  @Mutation(() => FinancialAccountObject)
  async createFinancialAccount(
    @Args() args: FinancialAccountCreateArgs,
  ): Promise<FinancialAccountObject> {
    const { userId, ...restArgs } = args.data;

    return this.financialAccountService.create({
      data: {
        ...restArgs,
        user: { connect: { id: userId } },
      },
    });
  }

  @Mutation(() => FinancialAccountObject)
  async updateFinancialAccount(
    @Args() args: FinancialAccountUpdateArgs,
  ): Promise<FinancialAccountObject> {
    return this.financialAccountService.update(args);
  }

  @Mutation(() => FinancialAccountObject)
  async deleteFinancialAccount(
    @Args() args: FinancialAccountDeleteArgs,
  ): Promise<FinancialAccountObject> {
    return this.financialAccountService.delete(args);
  }
}
