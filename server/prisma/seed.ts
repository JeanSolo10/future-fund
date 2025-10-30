import {
  AccountType,
  PrismaClient,
  TransactionCategory,
  TransactionFrequency,
  TransactionType,
} from '../generated/prisma';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { email: 'jean@gmail.com' },
    update: {
      email: 'couriersix@gmail.com',
      name: 'Courier Six',
      accounts: {
        connectOrCreate: {
          where: { id: 'f0bd04f5-3582-494c-9578-41d71e72ebf2' },
          create: {
            id: 'f0bd04f5-3582-494c-9578-41d71e72ebf2',
            name: 'BankOfAmerica',
            type: AccountType.BANK,
          },
        },
      },
    },
    create: {
      id: '629a83d8-7454-4833-abc3-49caa34d91e4',
      email: 'couriersix@gmail.com',
      name: 'Courier Six',
      accounts: {
        connectOrCreate: {
          where: { id: 'f0bd04f5-3582-494c-9578-41d71e72ebf2' },
          create: {
            id: 'f0bd04f5-3582-494c-9578-41d71e72ebf2',
            name: 'BankOfAmerica',
            type: AccountType.BANK,
          },
        },
      },
      ledgers: {
        connectOrCreate: [
          {
            where: { id: 'dcbf2846-1212-4e81-a1ce-7564244f0f00' },
            create: {
              name: 'Budgeting',
              transactions: {
                connectOrCreate: [
                  {
                    where: { id: '3af93e7d-8fb4-4714-8e5d-327c39b1962d' },
                    create: {
                      id: '3af93e7d-8fb4-4714-8e5d-327c39b1962d',
                      description: 'hello',
                      type: TransactionType.EXPENSE,
                      category: TransactionCategory.RENT,
                      frequency: TransactionFrequency.MONTHLY,
                      amount: '1800',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
