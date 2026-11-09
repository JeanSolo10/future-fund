import Decimal from 'decimal.js';
import {
  AccountType,
  Prisma,
  Transaction,
  TransactionCategory,
  TransactionFrequency,
  TransactionType,
} from 'generated/prisma';
import { listOccurrencesBetween } from './transaction.occurrences';
import {
  AlreadyInBalance,
  DEFAULT_OUTLOOK_WEEK_COUNT,
  OutlookWeek,
  buildOutlookWeeks,
  getOutlookRange,
  sumStartingBalance,
} from './transaction.outlook';

type TransactionOptions = {
  name: string;
  frequency: TransactionFrequency;
  startDate: string;
  amount: string;
  type?: TransactionType;
};

const day = (calendarDate: string): Date =>
  new Date(`${calendarDate}T00:00:00.000Z`);

const toCalendarDate = (date: Date): string => date.toISOString().slice(0, 10);

const buildTransaction = (options: TransactionOptions): Transaction => ({
  id: options.name,
  name: options.name,
  amount: new Prisma.Decimal(options.amount),
  startDate: day(options.startDate),
  endDate: null,
  type: options.type ?? TransactionType.EXPENSE,
  frequency: options.frequency,
  category: TransactionCategory.OTHER,
  budgetId: 'budget-1',
});

const buildOutlook = (
  today: string,
  startingBalance: string,
  transactions: Transaction[],
  alreadyInBalance: AlreadyInBalance[] = [],
  weekCount = DEFAULT_OUTLOOK_WEEK_COUNT,
): OutlookWeek[] => {
  const range = getOutlookRange(day(today), weekCount);
  const occurrences = listOccurrencesBetween(
    transactions,
    range.start,
    range.end,
  );

  return buildOutlookWeeks(
    new Decimal(startingBalance),
    occurrences,
    range.start,
    alreadyInBalance,
    weekCount,
  );
};

const rangeOf = (today: string, weekCount: number): string[] => {
  const range = getOutlookRange(day(today), weekCount);

  return [toCalendarDate(range.start), toCalendarDate(range.end)];
};

const balances = (weeks: OutlookWeek[]): string[] =>
  weeks.map((week) => week.balanceRemaining.toFixed(2));

const datesAndNames = (week: OutlookWeek): string[] =>
  week.occurrences.map(
    (occurrence) =>
      `${toCalendarDate(occurrence.date)} ${occurrence.transaction.name}`,
  );

const cable = buildTransaction({
  name: 'Cable',
  frequency: TransactionFrequency.MONTHLY,
  startDate: '2026-10-09',
  amount: '50',
});
const groceries = buildTransaction({
  name: 'Groceries',
  frequency: TransactionFrequency.WEEKLY,
  startDate: '2026-11-01',
  amount: '200',
});
const paycheck = buildTransaction({
  name: 'Paycheck',
  frequency: TransactionFrequency.SEMI_MONTHLY,
  startDate: '2026-10-15',
  amount: '3000',
  type: TransactionType.INCOME,
});
const phone = buildTransaction({
  name: 'Phone',
  frequency: TransactionFrequency.MONTHLY,
  startDate: '2026-10-19',
  amount: '50',
});
const rent = buildTransaction({
  name: 'Rent',
  frequency: TransactionFrequency.MONTHLY,
  startDate: '2026-10-01',
  amount: '1500',
});
const streaming = buildTransaction({
  name: 'Streaming',
  frequency: TransactionFrequency.MONTHLY,
  startDate: '2026-10-12',
  amount: '3',
});
const novemberBudget = [cable, groceries, paycheck, phone, rent, streaming];

describe('getOutlookRange', () => {
  it('starts on the Sunday on or before today', () => {
    expect(rangeOf('2026-11-08', 4)[0]).toBe('2026-11-08');
    expect(rangeOf('2026-11-10', 4)[0]).toBe('2026-11-08');
    expect(rangeOf('2026-11-14', 4)[0]).toBe('2026-11-08');
  });

  it('covers 4 weeks by default and ends on a Saturday', () => {
    expect(rangeOf('2026-11-10', DEFAULT_OUTLOOK_WEEK_COUNT)).toEqual([
      '2026-11-08',
      '2026-12-05',
    ]);
  });

  it('covers 8 weeks when asked, into the next year', () => {
    expect(rangeOf('2026-11-10', 8)).toEqual(['2026-11-08', '2027-01-02']);
  });
});

describe('sumStartingBalance', () => {
  it('adds bank and investment balances and subtracts credit card balances', () => {
    const total = sumStartingBalance([
      { type: AccountType.BANK, balance: new Decimal('2000') },
      { type: AccountType.CREDIT_CARD, balance: new Decimal('500') },
      { type: AccountType.INVESTMENT, balance: new Decimal('100') },
    ]);

    expect(total.toFixed(2)).toBe('1600.00');
  });

  it('adds a negative credit card balance, which the card owes the user', () => {
    const total = sumStartingBalance([
      { type: AccountType.BANK, balance: new Decimal('2000') },
      { type: AccountType.CREDIT_CARD, balance: new Decimal('-50') },
    ]);

    expect(total.toFixed(2)).toBe('2050.00');
  });

  it('subtracts an overdrawn bank account', () => {
    const total = sumStartingBalance([
      { type: AccountType.BANK, balance: new Decimal('-100') },
    ]);

    expect(total.toFixed(2)).toBe('-100.00');
  });

  it('is 0 with no accounts', () => {
    expect(sumStartingBalance([]).toFixed(2)).toBe('0.00');
  });
});

describe('buildOutlookWeeks', () => {
  it("starts each week from the previous week's balance", () => {
    const weeks = buildOutlook('2026-11-10', '1500', novemberBudget, [
      { transactionId: cable.id, date: day('2026-11-09') },
    ]);

    expect(balances(weeks)).toEqual([
      '1297.00',
      '4047.00',
      '3847.00',
      '5147.00',
    ]);
  });

  it('lists each date in its Sunday-to-Saturday week, in date order', () => {
    const weeks = buildOutlook('2026-11-10', '1500', novemberBudget);

    expect(
      weeks.map((week) => [
        toCalendarDate(week.startDate),
        toCalendarDate(week.endDate),
      ]),
    ).toEqual([
      ['2026-11-08', '2026-11-14'],
      ['2026-11-15', '2026-11-21'],
      ['2026-11-22', '2026-11-28'],
      ['2026-11-29', '2026-12-05'],
    ]);
    expect(weeks.map(datesAndNames)).toEqual([
      ['2026-11-08 Groceries', '2026-11-09 Cable', '2026-11-12 Streaming'],
      ['2026-11-15 Groceries', '2026-11-15 Paycheck', '2026-11-19 Phone'],
      ['2026-11-22 Groceries'],
      ['2026-11-29 Groceries', '2026-11-30 Paycheck', '2026-12-01 Rent'],
    ]);
  });

  it('does not count dates before the first week', () => {
    const weeks = buildOutlook('2026-11-10', '1500', [rent]);

    expect(balances(weeks)).toEqual(['1500.00', '1500.00', '1500.00', '0.00']);
  });

  it("skips a marked date but counts the same transaction's other weeks", () => {
    const weeks = buildOutlook(
      '2026-11-10',
      '1000',
      [groceries],
      [{ transactionId: groceries.id, date: day('2026-11-08') }],
    );

    expect(balances(weeks)).toEqual(['1000.00', '800.00', '600.00', '400.00']);
  });

  it("keeps a marked date in its week's list", () => {
    const weeks = buildOutlook(
      '2026-11-10',
      '1000',
      [groceries],
      [{ transactionId: groceries.id, date: day('2026-11-08') }],
    );

    expect(datesAndNames(weeks[0])).toEqual(['2026-11-08 Groceries']);
  });

  it('skips a marked date in a later week', () => {
    const weeks = buildOutlook(
      '2026-11-10',
      '2000',
      [rent],
      [{ transactionId: rent.id, date: day('2026-12-01') }],
    );

    expect(balances(weeks)).toEqual([
      '2000.00',
      '2000.00',
      '2000.00',
      '2000.00',
    ]);
  });

  it('ignores a mark that matches no date', () => {
    const movedRent = buildTransaction({
      name: 'Rent',
      frequency: TransactionFrequency.MONTHLY,
      startDate: '2026-10-22',
      amount: '1500',
    });

    const weeks = buildOutlook(
      '2026-11-10',
      '2000',
      [movedRent],
      [{ transactionId: movedRent.id, date: day('2026-11-15') }],
    );

    expect(balances(weeks)).toEqual(['2000.00', '2000.00', '500.00', '500.00']);
  });

  it('leaves transfers out of the list and the balance', () => {
    const transfer = buildTransaction({
      name: 'Transfer to savings',
      frequency: TransactionFrequency.WEEKLY,
      startDate: '2026-11-01',
      amount: '100',
      type: TransactionType.TRANSFER,
    });

    const weeks = buildOutlook('2026-11-10', '1000', [transfer]);

    expect(weeks.map(datesAndNames)).toEqual([[], [], [], []]);
    expect(balances(weeks)).toEqual([
      '1000.00',
      '1000.00',
      '1000.00',
      '1000.00',
    ]);
  });

  it('keeps cents exact, without floating-point drift', () => {
    const tenCents = buildTransaction({
      name: 'Ten cents',
      frequency: TransactionFrequency.MONTHLY,
      startDate: '2026-10-09',
      amount: '0.10',
    });
    const twentyCents = buildTransaction({
      name: 'Twenty cents',
      frequency: TransactionFrequency.MONTHLY,
      startDate: '2026-10-09',
      amount: '0.20',
    });

    const weeks = buildOutlook('2026-11-10', '1.00', [tenCents, twentyCents]);

    expect(weeks[0].balanceRemaining.toFixed(2)).toBe('0.70');
  });

  it('carries the balance through 8 weeks when asked', () => {
    const weeks = buildOutlook('2026-11-10', '1000', [groceries], [], 8);

    expect(balances(weeks)).toEqual([
      '800.00',
      '600.00',
      '400.00',
      '200.00',
      '0.00',
      '-200.00',
      '-400.00',
      '-600.00',
    ]);
    expect(toCalendarDate(weeks[7].startDate)).toBe('2026-12-27');
    expect(toCalendarDate(weeks[7].endDate)).toBe('2027-01-02');
  });
});
