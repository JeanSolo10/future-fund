import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { FindManyBaseArgs } from 'src/common/common.args';
import {
  FinancialAccountCreateInput,
  FinancialAccountsWhereInput,
  FinancialAccountUpdateInput,
  FinancialAccountWhereUniqueInput,
} from './financial-account.input';

@ArgsType()
export class FinancialAccountArgs {
  @ValidateNested()
  @Type(() => FinancialAccountWhereUniqueInput)
  @Field(() => FinancialAccountWhereUniqueInput)
  where: FinancialAccountWhereUniqueInput;
}

@ArgsType()
export class FinancialAccountsArgs extends FindManyBaseArgs {
  @ValidateNested()
  @Type(() => FinancialAccountsWhereInput)
  @Field(() => FinancialAccountsWhereInput, { nullable: true })
  where?: FinancialAccountsWhereInput;
}

@ArgsType()
export class FinancialAccountCreateArgs {
  @ValidateNested()
  @Type(() => FinancialAccountCreateInput)
  @Field(() => FinancialAccountCreateInput)
  data: FinancialAccountCreateInput;
}

@ArgsType()
export class FinancialAccountUpdateArgs {
  @ValidateNested()
  @Type(() => FinancialAccountWhereUniqueInput)
  @Field(() => FinancialAccountWhereUniqueInput)
  where: FinancialAccountWhereUniqueInput;

  @ValidateNested()
  @Type(() => FinancialAccountUpdateInput)
  @Field(() => FinancialAccountUpdateInput)
  data: FinancialAccountUpdateInput;
}

@ArgsType()
export class FinancialAccountDeleteArgs {
  @ValidateNested()
  @Type(() => FinancialAccountWhereUniqueInput)
  @Field(() => FinancialAccountWhereUniqueInput)
  where: FinancialAccountWhereUniqueInput;
}
