import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { FindManyBaseArgs } from 'src/common/common.args';
import {
  BudgetCreateInput,
  BudgetsWhereInput,
  BudgetUpdateInput,
  BudgetWhereUniqueInput,
} from './budget.input';

@ArgsType()
export class BudgetArgs {
  @ValidateNested()
  @Type(() => BudgetWhereUniqueInput)
  @Field(() => BudgetWhereUniqueInput)
  where: BudgetWhereUniqueInput;
}

@ArgsType()
export class BudgetsArgs extends FindManyBaseArgs {
  @ValidateNested()
  @Type(() => BudgetsWhereInput)
  @Field(() => BudgetsWhereInput, { nullable: true })
  where?: BudgetsWhereInput;
}

@ArgsType()
export class BudgetCreateArgs {
  @ValidateNested()
  @Type(() => BudgetCreateInput)
  @Field(() => BudgetCreateInput)
  data: BudgetCreateInput;
}

@ArgsType()
export class BudgetUpdateArgs {
  @ValidateNested()
  @Type(() => BudgetWhereUniqueInput)
  @Field(() => BudgetWhereUniqueInput)
  where: BudgetWhereUniqueInput;

  @ValidateNested()
  @Type(() => BudgetUpdateInput)
  @Field(() => BudgetUpdateInput)
  data: BudgetUpdateInput;
}

@ArgsType()
export class BudgetDeleteArgs {
  @ValidateNested()
  @Type(() => BudgetWhereUniqueInput)
  @Field(() => BudgetWhereUniqueInput)
  where: BudgetWhereUniqueInput;
}
