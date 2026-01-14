import {
  AccountType,
  PrismaClient,
  TransactionCategory,
  TransactionFrequency,
  TransactionType,
} from '../generated/prisma';
const prisma = new PrismaClient();
async function main() {
  // create budget
  const budget = await prisma.budget.upsert({
    where: { id: 'dcbf2846-1212-4e81-a1ce-7564244f0f00' },
    update: {
      name: 'Monthly Budget',
    },
    create: {
      id: 'dcbf2846-1212-4e81-a1ce-7564244f0f00',
      name: 'Monthly Budget',
    },
  });

  // create transaction for budget
  await prisma.transaction.upsert({
    where: { id: '3af93e7d-8fb4-4714-8e5d-327c39b1962d' },
    update: {
      name: 'Rent',
      type: TransactionType.EXPENSE,
      category: TransactionCategory.RENT,
      frequency: TransactionFrequency.MONTHLY,
      amount: 1800,
      date: new Date('2025-11-01'),
    },
    create: {
      id: '3af93e7d-8fb4-4714-8e5d-327c39b1962d',
      name: 'Rent',
      type: TransactionType.EXPENSE,
      category: TransactionCategory.RENT,
      frequency: TransactionFrequency.MONTHLY,
      amount: 1800,
      date: new Date('2025-11-01'),
      budgetId: budget.id,
    },
  });

  // create user with budget
  await prisma.user.upsert({
    where: { email: 'couriersix@gmail.com' },
    update: {
      name: 'Courier Six',
    },
    create: {
      id: '629a83d8-7454-4833-abc3-49caa34d91e4',
      email: 'couriersix@gmail.com',
      name: 'Courier Six',
      budgetId: budget.id,
    },
  });

  // create financial account
  await prisma.financialAccount.upsert({
    where: { id: 'f0bd04f5-3582-494c-9578-41d71e72ebf2' },
    update: {
      name: 'BankOfAmerica',
      balance: 1500,
    },
    create: {
      id: 'f0bd04f5-3582-494c-9578-41d71e72ebf2',
      name: 'BankOfAmerica',
      type: AccountType.BANK,
      balance: 1500,
      userId: '629a83d8-7454-4833-abc3-49caa34d91e4',
    },
  });
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
