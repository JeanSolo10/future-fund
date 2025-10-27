import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { LedgerModule } from './ledger/ledger.module';
import { FinancialAccountModule } from './financial-account/financial-account.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { CustomDecimalScalar } from './common/decimal.scalar';
import { DatabaseModule } from './database/database.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      resolvers: { Decimal: CustomDecimalScalar },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    LedgerModule,
    FinancialAccountModule,
    TransactionModule,
    UserModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppController],
})
export class AppModule {}
