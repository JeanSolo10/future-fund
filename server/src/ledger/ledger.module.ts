import { Module } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { LedgerResolver } from './ledger.resolver';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [LedgerService, LedgerResolver],
})
export class LedgerModule {}
