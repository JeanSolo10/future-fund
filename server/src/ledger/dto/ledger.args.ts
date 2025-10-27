import { ArgsType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { FindManyBaseArgs } from 'src/common/common.args';
import {
  LedgerCreateInput,
  LedgersWhereInput,
  LedgerUpdateInput,
  LedgerWhereUniqueInput,
} from './ledger.input';

@ArgsType()
export class LedgerArgs {
  @ValidateNested()
  @Type(() => LedgerWhereUniqueInput)
  @Field(() => LedgerWhereUniqueInput)
  where: LedgerWhereUniqueInput;
}

@ArgsType()
export class LedgersArgs extends FindManyBaseArgs {
  @ValidateNested()
  @Type(() => LedgersWhereInput)
  @Field(() => LedgersWhereInput, { nullable: true })
  where?: LedgersWhereInput;
}

@ArgsType()
export class LedgerCreateArgs {
  @ValidateNested()
  @Type(() => LedgerCreateInput)
  @Field(() => LedgerCreateInput)
  data: LedgerCreateInput;
}

@ArgsType()
export class LedgerUpdateArgs {
  @ValidateNested()
  @Type(() => LedgerWhereUniqueInput)
  @Field(() => LedgerWhereUniqueInput)
  where: LedgerWhereUniqueInput;

  @ValidateNested()
  @Type(() => LedgerUpdateInput)
  @Field(() => LedgerUpdateInput)
  data: LedgerUpdateInput;
}

@ArgsType()
export class LedgerDeleteArgs {
  @ValidateNested()
  @Type(() => LedgerWhereUniqueInput)
  @Field(() => LedgerWhereUniqueInput)
  where: LedgerWhereUniqueInput;
}
