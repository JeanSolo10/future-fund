# Future Fund

A personal budgeting app. You enter your recurring income and expenses once, and Future Fund places each one on a monthly calendar on the dates it repeats, totals every month, and shows how your account balances hold up week by week.

I wanted a simple way to plan my money week by week, and the budgeting apps I tried charged a subscription for basic features. Future Fund is the version I built for myself, kept small so you can use it as a starting point for your own.

## What it does

- **Recurring transactions.** Income and expenses that repeat weekly, semi-monthly, or monthly, from a start date to an optional end date.
- **Calendar.** Every date each transaction lands on, for any month. Move between months with the arrows, and use "Back to today" to return to the current one.
- **Overview and Breakdown.** The month's income, expenses, and what remains, plus a chart of expenses by category. Totals count every date in the month, so a weekly expense counts five times in a month with five of its weekdays.
- **Weekly outlook.** On the Calendar tab for the current month, the Outlook button takes the accounts you check (bank and investment balances add, credit card balances subtract what you owe) and shows what remains after each week's transactions, for the next 4 or 8 weeks. Mark a transaction as already in your balance so it isn't counted twice.
- **Accounts.** Bank, credit card, and investment accounts with their balances.

There's one user and no login. The first visit asks you to create your profile (your name and a budget name). After that, the home page shows your budget and accounts.

## Tech stack

- **Server:** NestJS 10, GraphQL (code first, Apollo Server), Prisma 6, PostgreSQL 16
- **Client:** React 18, Vite, TypeScript, Apollo Client, Ant Design
- **Repo:** npm workspaces, `server/` and `client/`

## Getting started

You need Node 22 (see `.nvmrc`), npm, and Docker.

1. Install dependencies from the repo root:

   ```sh
   npm install
   ```

2. Create the three `.env` files from the examples:

   ```sh
   cp .env.example .env
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

   The example values work together for local development. If you change the Postgres user, password, or database name, update `DATABASE_URL` in `server/.env` to match. If you change the server's `PORT`, update `VITE_SERVER_URL` in `client/.env`.

3. Start Postgres:

   ```sh
   docker compose -f docker-compose.dev.yml up -d
   ```

4. Apply the database migration and generate the Prisma client:

   ```sh
   npm run db:deploy:server
   ```

5. Optional: load sample data (a user with a paycheck, rent, bills, and three accounts). Run it before you create a profile, since the app has one user.

   ```sh
   cd server
   npx prisma db seed
   cd ..
   ```

6. Start the server and the client in two terminals:

   ```sh
   npm run start:dev
   ```

   ```sh
   npm run start:client
   ```

   The client runs at http://localhost:5173 and the GraphQL API at http://localhost:3000/graphql.

## Commands

Run these from the repo root unless the command changes directory.

| Task                                                     | Command                                                                     |
| -------------------------------------------------------- | --------------------------------------------------------------------------- |
| Start Postgres                                           | `docker compose -f docker-compose.dev.yml up -d`                            |
| Start the server in watch mode                           | `npm run start:dev`                                                         |
| Start the client                                         | `npm run start:client`                                                      |
| Apply migrations and generate the Prisma client          | `npm run db:deploy:server`                                                  |
| Load sample data into an empty database                  | `cd server && npx prisma db seed`                                           |
| Reset the database to the sample data (deletes all data) | `cd server && npx prisma migrate reset`                                     |
| Run the server tests                                     | `npm run test:server`                                                       |
| Run the server tests on every save                       | `npm run test:server:watch`                                                 |
| Typecheck                                                | `npm run typecheck:server` and `npm run typecheck:client`                   |
| Lint the server (check only)                             | `cd server && npx eslint "src/**/*.ts"`                                     |
| Check formatting                                         | `npm run format --workspace=server` and `npm run format --workspace=client` |

## How the rules work

A transaction is stored once, with an amount, a frequency, a start date, and an optional end date. Its individual dates are never stored. The server computes them for whatever range a screen asks for.

- **Monthly:** the same day of the month as the start date. A transaction that starts on the 31st lands on the last day of shorter months.
- **Semi-monthly:** starts on the 1st or the 15th. Starting on the 1st gives the 1st and the 15th; starting on the 15th gives the 15th and the last day of the month.
- **Weekly:** every 7 days from the start date.

Transaction dates are calendar days (`YYYY-MM-DD`) with no time or timezone. "Today" is the date on the device running the browser.

The rules live in pure functions on the server, each with a spec next to it:

| File                                                | What it decides                                                                                                                                                  |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `server/src/transaction/transaction.occurrences.ts` | Which dates each frequency lands on in a range, and the totals for those dates                                                                                   |
| `server/src/transaction/transaction.outlook.ts`     | The weekly outlook: weeks from Sunday to Saturday, account signs, and transactions marked as already in your balance                                             |
| `server/src/transaction/transaction.validation.ts`  | What a transaction must satisfy on create and update: an amount above 0, an end date on or after the start date, and a semi-monthly start on the 1st or the 15th |

## Tests and CI

The server tests cover the core rules above, not every service and resolver, since those are the parts you're most likely to reshape. They're there so a change shows you what else it affects. When a spec fails, either your change broke something you didn't intend, or you changed how a calculation works on purpose. If it's the second, update the spec to match your rule.

A GitHub Actions workflow (`.github/workflows/server-tests.yml`) runs the server tests on every pull request into `main` and every push to `main`. It comes with the repo, so it runs in your own copy on GitHub too. On a fork, you may need to enable workflows on the Actions tab first. To make the merge button wait for the tests, add a ruleset for `main` (Settings, then Rules, then Rulesets) that requires the "Server tests" status check.

## Making it your own

The schema in `server/prisma/schema.prisma` and its single `init` migration are a starting point, so change them freely. After editing the schema, create a migration:

```sh
cd server
npx prisma migrate dev --name <name>
```

The server writes the GraphQL schema to `server/src/schema.gql` from its decorators when it starts. The client's types in `client/src/object-types/` are written by hand, so update them when the API changes.

## License

MIT. See [LICENSE](LICENSE).
