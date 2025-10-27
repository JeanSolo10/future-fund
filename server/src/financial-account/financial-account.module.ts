import { Module } from '@nestjs/common';
import { FinancialAccountService } from './financial-account.service';
import { FinancialAccountResolver } from './financial-account.resolver';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [FinancialAccountService, FinancialAccountResolver],
})
export class FinancialAccountModule {}
