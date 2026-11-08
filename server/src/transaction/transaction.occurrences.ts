import Decimal from 'decimal.js';
import { DateTime } from 'luxon';
import {
  Transaction,
  TransactionCategory,
  TransactionFrequency,
} from 'generated/prisma';

export type TransactionOccurrence = {
  transaction: Transaction;
  date: Date;
};

export type CategoryTotal = {
  category: TransactionCategory;
  total: Decimal;
};

const toUtcDay = (date: Date): DateTime =>
  DateTime.fromJSDate(date, { zone: 'utc' });

const isOnOrBetween = (date: DateTime, first: DateTime, last: DateTime) =>
  date >= first && date <= last;

const listMonthlyDates = (
  transactionStart: DateTime,
  rangeStart: DateTime,
  rangeEnd: DateTime,
): DateTime[] => {
  const dates: DateTime[] = [];

  for (
    let month = rangeStart.startOf('month');
    month <= rangeEnd;
    month = month.plus({ months: 1 })
  ) {
    const day = Math.min(transactionStart.day, month.daysInMonth ?? 31);
    dates.push(month.set({ day }));
  }

  return dates;
};

const listSemiMonthlyDates = (
  transactionStart: DateTime,
  rangeStart: DateTime,
  rangeEnd: DateTime,
): DateTime[] => {
  const dates: DateTime[] = [];
  const startsOnFirst = transactionStart.day === 1;

  for (
    let month = rangeStart.startOf('month');
    month <= rangeEnd;
    month = month.plus({ months: 1 })
  ) {
    if (startsOnFirst) {
      dates.push(month.set({ day: 1 }), month.set({ day: 15 }));
    } else {
      dates.push(month.set({ day: 15 }), month.endOf('month').startOf('day'));
    }
  }

  return dates;
};

const listWeeklyDates = (
  transactionStart: DateTime,
  rangeStart: DateTime,
  rangeEnd: DateTime,
): DateTime[] => {
  const dates: DateTime[] = [];
  const weeksBeforeRange = Math.max(
    0,
    Math.floor(rangeStart.diff(transactionStart, 'weeks').weeks),
  );

  for (
    let date = transactionStart.plus({ weeks: weeksBeforeRange });
    date <= rangeEnd;
    date = date.plus({ weeks: 1 })
  ) {
    dates.push(date);
  }

  return dates;
};

const listDatesForFrequency = (
  frequency: TransactionFrequency,
  transactionStart: DateTime,
  rangeStart: DateTime,
  rangeEnd: DateTime,
): DateTime[] => {
  switch (frequency) {
    case TransactionFrequency.MONTHLY:
      return listMonthlyDates(transactionStart, rangeStart, rangeEnd);
    case TransactionFrequency.SEMI_MONTHLY:
      return listSemiMonthlyDates(transactionStart, rangeStart, rangeEnd);
    case TransactionFrequency.WEEKLY:
      return listWeeklyDates(transactionStart, rangeStart, rangeEnd);
  }
};

export const listOccurrencesBetween = (
  transactions: Transaction[],
  start: Date,
  end: Date,
): TransactionOccurrence[] => {
  const rangeStart = toUtcDay(start);
  const rangeEnd = toUtcDay(end);

  return transactions.flatMap((transaction) => {
    const transactionStart = toUtcDay(transaction.startDate);
    const transactionEnd = transaction.endDate
      ? toUtcDay(transaction.endDate)
      : rangeEnd;

    return listDatesForFrequency(
      transaction.frequency,
      transactionStart,
      rangeStart,
      rangeEnd,
    )
      .filter(
        (date) =>
          isOnOrBetween(date, rangeStart, rangeEnd) &&
          isOnOrBetween(date, transactionStart, transactionEnd),
      )
      .map((date) => ({ transaction, date: date.toJSDate() }));
  });
};

export const sumAmounts = (occurrences: TransactionOccurrence[]): Decimal =>
  occurrences.reduce(
    (total, occurrence) => total.plus(occurrence.transaction.amount),
    new Decimal(0),
  );

export const sumAmountsByCategory = (
  occurrences: TransactionOccurrence[],
): CategoryTotal[] => {
  const totalByCategory = new Map<TransactionCategory, Decimal>();

  for (const occurrence of occurrences) {
    const { category, amount } = occurrence.transaction;
    const runningTotal = totalByCategory.get(category) ?? new Decimal(0);
    totalByCategory.set(category, runningTotal.plus(amount));
  }

  return [...totalByCategory.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total.comparedTo(a.total));
};
