import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { FinancialAccountModule } from 'src/financial-account/financial-account.module';

@Module({
  imports: [DatabaseModule, FinancialAccountModule],
  providers: [TransactionService, TransactionResolver],
})
export class TransactionModule {}
