import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LedgerObject } from './object/ledger.object';
import { LedgerService } from './ledger.service';
import {
  LedgerArgs,
  LedgerCreateArgs,
  LedgerDeleteArgs,
  LedgersArgs,
  LedgerUpdateArgs,
} from './dto/ledger.args';

@Resolver()
export class LedgerResolver {
  constructor(private ledgerService: LedgerService) {}

  @Query(() => LedgerObject, { nullable: true })
  async ledger(@Args() args: LedgerArgs): Promise<LedgerObject | null> {
    return this.ledgerService.findUnique(args);
  }

  @Query(() => [LedgerObject])
  async ledgers(@Args() args: LedgersArgs): Promise<LedgerObject[]> {
    return this.ledgerService.findMany(args);
  }

  @Mutation(() => LedgerObject)
  async create(@Args() args: LedgerCreateArgs): Promise<LedgerObject> {
    const { userId, ...restArgs } = args.data;

    return this.ledgerService.create({
      data: {
        ...restArgs,
        user: { connect: { id: userId } },
      },
    });
  }

  @Mutation(() => LedgerObject)
  async updateLedger(@Args() args: LedgerUpdateArgs): Promise<LedgerObject> {
    return this.ledgerService.update(args);
  }

  @Mutation(() => LedgerObject)
  async deleteLedger(@Args() args: LedgerDeleteArgs): Promise<LedgerObject> {
    return this.ledgerService.delete(args);
  }
}
