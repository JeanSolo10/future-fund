import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BudgetObject } from './object/budget.object';
import { BudgetService } from './budget.service';
import {
  BudgetArgs,
  BudgetsArgs,
  BudgetCreateArgs,
  BudgetUpdateArgs,
  BudgetDeleteArgs,
} from './dto/budget.args';

@Resolver()
export class BudgetResolver {
  constructor(private budgetService: BudgetService) {}

  @Query(() => BudgetObject, { nullable: true })
  async budget(@Args() args: BudgetArgs): Promise<BudgetObject | null> {
    return this.budgetService.findUnique(args);
  }

  @Query(() => [BudgetObject])
  async budgets(@Args() args: BudgetsArgs): Promise<BudgetObject[]> {
    return this.budgetService.findMany(args);
  }

  @Mutation(() => BudgetObject)
  async createBudget(@Args() args: BudgetCreateArgs): Promise<BudgetObject> {
    return this.budgetService.create(args);
  }

  @Mutation(() => BudgetObject)
  async updateBudget(@Args() args: BudgetUpdateArgs): Promise<BudgetObject> {
    return this.budgetService.update(args);
  }

  @Mutation(() => BudgetObject)
  async deleteBudget(@Args() args: BudgetDeleteArgs): Promise<BudgetObject> {
    return this.budgetService.delete(args);
  }
}
