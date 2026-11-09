import Decimal from 'decimal.js';
import { AccountType, TransactionType } from 'generated/prisma';
import {
  TransactionOccurrence,
  isOnOrBetween,
  toUtcDay,
} from './transaction.occurrences';

export const OUTLOOK_WEEK_COUNT = 4;

export type OutlookRange = {
  start: Date;
  end: Date;
};

export type OutlookAccount = {
  type: AccountType;
  balance: Decimal;
};

export type AlreadyInBalance = {
  transactionId: string;
  date: Date;
};

export type OutlookWeek = {
  startDate: Date;
  endDate: Date;
  occurrences: TransactionOccurrence[];
  balanceRemaining: Decimal;
};

export const getOutlookRange = (today: Date): OutlookRange => {
  const day = toUtcDay(today);
  // luxon's startOf('week') starts on Monday, but the calendar starts weeks on Sunday.
  const sunday = day.minus({ days: day.weekday % 7 });
  const lastSaturday = sunday
    .plus({ weeks: OUTLOOK_WEEK_COUNT })
    .minus({ days: 1 });

  return { start: sunday.toJSDate(), end: lastSaturday.toJSDate() };
};

const signedBalance = (account: OutlookAccount): Decimal => {
  switch (account.type) {
    case AccountType.BANK:
    case AccountType.INVESTMENT:
      return new Decimal(account.balance);
    case AccountType.CREDIT_CARD:
      return new Decimal(account.balance).negated();
  }
};

export const sumStartingBalance = (accounts: OutlookAccount[]): Decimal =>
  accounts.reduce(
    (total, account) => total.plus(signedBalance(account)),
    new Decimal(0),
  );

const toOccurrenceKey = (transactionId: string, date: Date): string =>
  `${transactionId}:${toUtcDay(date).toISODate()}`;

const isIncomeOrExpense = (occurrence: TransactionOccurrence): boolean =>
  occurrence.transaction.type === TransactionType.INCOME ||
  occurrence.transaction.type === TransactionType.EXPENSE;

const applyToBalance = (
  balance: Decimal,
  occurrence: TransactionOccurrence,
): Decimal => {
  switch (occurrence.transaction.type) {
    case TransactionType.INCOME:
      return balance.plus(occurrence.transaction.amount);
    case TransactionType.EXPENSE:
      return balance.minus(occurrence.transaction.amount);
    case TransactionType.TRANSFER:
      return balance;
  }
};

export const buildOutlookWeeks = (
  startingBalance: Decimal,
  occurrences: TransactionOccurrence[],
  firstWeekStart: Date,
  alreadyInBalance: AlreadyInBalance[],
): OutlookWeek[] => {
  const alreadyInBalanceKeys = new Set(
    alreadyInBalance.map((entry) =>
      toOccurrenceKey(entry.transactionId, entry.date),
    ),
  );
  const listedOccurrences = occurrences
    .filter(isIncomeOrExpense)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const weeks: OutlookWeek[] = [];
  let balance = startingBalance;

  for (let weekIndex = 0; weekIndex < OUTLOOK_WEEK_COUNT; weekIndex += 1) {
    const weekStart = toUtcDay(firstWeekStart).plus({ weeks: weekIndex });
    const weekEnd = weekStart.plus({ days: 6 });
    const weekOccurrences = listedOccurrences.filter((occurrence) =>
      isOnOrBetween(toUtcDay(occurrence.date), weekStart, weekEnd),
    );

    for (const occurrence of weekOccurrences) {
      const isAlreadyInBalance = alreadyInBalanceKeys.has(
        toOccurrenceKey(occurrence.transaction.id, occurrence.date),
      );
      if (!isAlreadyInBalance) {
        balance = applyToBalance(balance, occurrence);
      }
    }

    weeks.push({
      startDate: weekStart.toJSDate(),
      endDate: weekEnd.toJSDate(),
      occurrences: weekOccurrences,
      balanceRemaining: balance,
    });
  }

  return weeks;
};
