import {
  AccountType,
  PrismaClient,
  TransactionCategory,
  TransactionFrequency,
  TransactionType,
} from '../generated/prisma';

const prisma = new PrismaClient();

const USER_ID = '629a83d8-7454-4833-abc3-49caa34d91e4';
const BUDGET_ID = 'dcbf2846-1212-4e81-a1ce-7564244f0f00';

type SeedTransaction = {
  id: string;
  name: string;
  type: TransactionType;
  category: TransactionCategory;
  frequency: TransactionFrequency;
  amount: string;
  startDate: Date;
};

type SeedAccount = {
  id: string;
  name: string;
  type: AccountType;
  balance: string;
};

const transactions: SeedTransaction[] = [
  {
    id: '0f65e83b-7f7c-45c9-9b2c-731aa8848e84',
    name: 'Paycheck',
    type: TransactionType.INCOME,
    category: TransactionCategory.NONE,
    frequency: TransactionFrequency.SEMI_MONTHLY,
    amount: '2600',
    startDate: new Date('2026-01-15'),
  },
  {
    id: '3af93e7d-8fb4-4714-8e5d-327c39b1962d',
    name: 'Rent',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.RENT,
    frequency: TransactionFrequency.MONTHLY,
    amount: '1800',
    startDate: new Date('2026-01-01'),
  },
  {
    id: '5be5471d-8ed9-4cee-bd15-8d00b8f3b2dd',
    name: 'Groceries',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.GROCERIES,
    frequency: TransactionFrequency.WEEKLY,
    amount: '150',
    startDate: new Date('2026-01-04'),
  },
  {
    id: '2233068e-8cac-4161-9a89-c8766725e12f',
    name: 'Dining out',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.OTHER,
    frequency: TransactionFrequency.WEEKLY,
    amount: '60',
    startDate: new Date('2026-01-03'),
  },
  {
    id: '7823fcf3-37b2-4bef-9934-ef1aa0bca9fd',
    name: 'Gas',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.TRANSPORTATION,
    frequency: TransactionFrequency.WEEKLY,
    amount: '45',
    startDate: new Date('2026-01-02'),
  },
  {
    id: '42cb5d33-a80c-4eb8-a60c-b9891be52e83',
    name: 'Car insurance',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.TRANSPORTATION,
    frequency: TransactionFrequency.MONTHLY,
    amount: '140',
    startDate: new Date('2026-01-05'),
  },
  {
    id: '8513bdc5-509a-4f27-bfac-9e590b7f4846',
    name: 'Internet and cable',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.UTILITIES,
    frequency: TransactionFrequency.MONTHLY,
    amount: '65',
    startDate: new Date('2026-01-09'),
  },
  {
    id: 'baf02d40-625e-425e-b586-13eb4971a7c7',
    name: 'Phone',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.UTILITIES,
    frequency: TransactionFrequency.MONTHLY,
    amount: '85',
    startDate: new Date('2026-01-19'),
  },
  {
    id: '13b2a32c-d85a-42e4-90e0-cc63753de69d',
    name: 'Electricity',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.UTILITIES,
    frequency: TransactionFrequency.MONTHLY,
    amount: '95',
    startDate: new Date('2026-01-23'),
  },
  {
    id: '7253fe67-bef4-4cc1-a9c8-af4f691049b2',
    name: 'Streaming',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.SUBSCRIPTION,
    frequency: TransactionFrequency.MONTHLY,
    amount: '15.49',
    startDate: new Date('2026-01-12'),
  },
  {
    id: '2aa51cf6-dded-4575-8d45-6c808cae2d34',
    name: 'Music',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.SUBSCRIPTION,
    frequency: TransactionFrequency.MONTHLY,
    amount: '10.99',
    startDate: new Date('2026-01-03'),
  },
  {
    id: '910fe51f-3ab9-483d-9aa5-424ed2dda251',
    name: 'Gym',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.SUBSCRIPTION,
    frequency: TransactionFrequency.MONTHLY,
    amount: '40',
    startDate: new Date('2026-01-01'),
  },
];

const accounts: SeedAccount[] = [
  {
    id: 'f0bd04f5-3582-494c-9578-41d71e72ebf2',
    name: 'Checking',
    type: AccountType.BANK,
    balance: '3200',
  },
  {
    id: 'b1efee9a-5203-420d-9237-5da3023860fe',
    name: 'Credit card',
    type: AccountType.CREDIT_CARD,
    balance: '450',
  },
  {
    id: 'faa1eb8e-0318-42e4-869f-d68968c2b465',
    name: 'Retirement',
    type: AccountType.INVESTMENT,
    balance: '25000',
  },
];

async function main() {
  await prisma.user.upsert({
    where: { id: USER_ID },
    update: { name: 'Courier Six' },
    create: {
      id: USER_ID,
      name: 'Courier Six',
      budget: { create: { id: BUDGET_ID, name: 'Monthly Budget' } },
    },
  });

  for (const { id, ...transaction } of transactions) {
    await prisma.transaction.upsert({
      where: { id },
      update: transaction,
      create: { id, ...transaction, budgetId: BUDGET_ID },
    });
  }

  for (const { id, ...account } of accounts) {
    await prisma.financialAccount.upsert({
      where: { id },
      update: account,
      create: { id, ...account, userId: USER_ID },
    });
  }
}

main()
  .then(async () => {
    console.log('Seed completed successfully!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
