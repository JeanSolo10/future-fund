import {
  Prisma,
  Transaction,
  TransactionCategory,
  TransactionFrequency,
  TransactionType,
} from 'generated/prisma';
import {
  listOccurrencesBetween,
  sumAmounts,
  sumAmountsByCategory,
} from './transaction.occurrences';

type TransactionOptions = {
  frequency: TransactionFrequency;
  startDate: string;
  endDate?: string;
  amount?: string;
  category?: TransactionCategory;
  name?: string;
};

let nextTransactionNumber = 0;

const day = (calendarDate: string): Date =>
  new Date(`${calendarDate}T00:00:00.000Z`);

const buildTransaction = (options: TransactionOptions): Transaction => {
  nextTransactionNumber += 1;

  return {
    id: `transaction-${nextTransactionNumber}`,
    name: options.name ?? 'Test transaction',
    amount: new Prisma.Decimal(options.amount ?? '10'),
    startDate: day(options.startDate),
    endDate: options.endDate ? day(options.endDate) : null,
    type: TransactionType.EXPENSE,
    frequency: options.frequency,
    category: options.category ?? TransactionCategory.OTHER,
    budgetId: 'budget-1',
  };
};

const datesBetween = (
  transactions: Transaction[],
  start: string,
  end: string,
): string[] =>
  listOccurrencesBetween(transactions, day(start), day(end)).map((occurrence) =>
    occurrence.date.toISOString().slice(0, 10),
  );

describe('listOccurrencesBetween', () => {
  describe('monthly', () => {
    it('lands on the same day of the month as the start date', () => {
      const rent = buildTransaction({
        frequency: TransactionFrequency.MONTHLY,
        startDate: '2026-01-10',
      });

      expect(datesBetween([rent], '2026-11-01', '2026-11-30')).toEqual([
        '2026-11-10',
      ]);
    });

    it('moves to the last day in shorter months, then back to the start day', () => {
      const bill = buildTransaction({
        frequency: TransactionFrequency.MONTHLY,
        startDate: '2026-01-31',
      });

      expect(datesBetween([bill], '2026-02-01', '2026-03-31')).toEqual([
        '2026-02-28',
        '2026-03-31',
      ]);
    });

    it('lands on February 29 in a leap year', () => {
      const bill = buildTransaction({
        frequency: TransactionFrequency.MONTHLY,
        startDate: '2026-01-31',
      });

      expect(datesBetween([bill], '2028-02-01', '2028-02-29')).toEqual([
        '2028-02-29',
      ]);
    });

    it('has no dates before its start date', () => {
      const bill = buildTransaction({
        frequency: TransactionFrequency.MONTHLY,
        startDate: '2026-11-20',
      });

      expect(datesBetween([bill], '2026-11-01', '2026-11-30')).toEqual([
        '2026-11-20',
      ]);
    });

    it('has no dates after its end date', () => {
      const bill = buildTransaction({
        frequency: TransactionFrequency.MONTHLY,
        startDate: '2026-01-10',
        endDate: '2026-11-05',
      });

      expect(datesBetween([bill], '2026-11-01', '2026-11-30')).toEqual([]);
    });
  });

  describe('semi-monthly', () => {
    it('starting on the 1st lands on the 1st and the 15th', () => {
      const paycheck = buildTransaction({
        frequency: TransactionFrequency.SEMI_MONTHLY,
        startDate: '2026-01-01',
      });

      expect(datesBetween([paycheck], '2026-11-01', '2026-11-30')).toEqual([
        '2026-11-01',
        '2026-11-15',
      ]);
    });

    it('starting on the 15th lands on the 15th and the last day of the month', () => {
      const paycheck = buildTransaction({
        frequency: TransactionFrequency.SEMI_MONTHLY,
        startDate: '2026-01-15',
      });

      expect(datesBetween([paycheck], '2026-02-01', '2026-02-28')).toEqual([
        '2026-02-15',
        '2026-02-28',
      ]);
      expect(datesBetween([paycheck], '2026-04-01', '2026-04-30')).toEqual([
        '2026-04-15',
        '2026-04-30',
      ]);
    });
  });

  describe('weekly', () => {
    it("repeats every 7 days on the start date's weekday", () => {
      const gym = buildTransaction({
        frequency: TransactionFrequency.WEEKLY,
        startDate: '2026-01-02',
      });

      expect(datesBetween([gym], '2026-11-01', '2026-11-30')).toEqual([
        '2026-11-06',
        '2026-11-13',
        '2026-11-20',
        '2026-11-27',
      ]);
    });

    it('stops at its end date', () => {
      const gym = buildTransaction({
        frequency: TransactionFrequency.WEEKLY,
        startDate: '2026-01-02',
        endDate: '2026-11-18',
      });

      expect(datesBetween([gym], '2026-11-01', '2026-11-30')).toEqual([
        '2026-11-06',
        '2026-11-13',
      ]);
    });
  });

  describe('ranges', () => {
    it('includes dates on the first and last day of the range', () => {
      const gym = buildTransaction({
        frequency: TransactionFrequency.WEEKLY,
        startDate: '2026-01-02',
      });

      expect(datesBetween([gym], '2026-11-06', '2026-11-27')).toEqual([
        '2026-11-06',
        '2026-11-13',
        '2026-11-20',
        '2026-11-27',
      ]);
    });

    it('includes the 1st when the range ends on the 1st of a month', () => {
      const rent = buildTransaction({
        frequency: TransactionFrequency.MONTHLY,
        startDate: '2026-01-01',
      });
      const paycheck = buildTransaction({
        frequency: TransactionFrequency.SEMI_MONTHLY,
        startDate: '2026-01-01',
      });

      expect(datesBetween([rent], '2026-11-15', '2026-12-01')).toEqual([
        '2026-12-01',
      ]);
      expect(datesBetween([paycheck], '2026-11-15', '2026-12-01')).toEqual([
        '2026-11-15',
        '2026-12-01',
      ]);
    });

    it('leaves out a transaction that ended before the range starts', () => {
      const oldPhoneBill = buildTransaction({
        frequency: TransactionFrequency.MONTHLY,
        startDate: '2026-01-05',
        endDate: '2026-10-31',
        name: 'Phone (old)',
      });
      const newPhoneBill = buildTransaction({
        frequency: TransactionFrequency.MONTHLY,
        startDate: '2026-11-01',
        name: 'Phone (new)',
      });

      const occurrences = listOccurrencesBetween(
        [oldPhoneBill, newPhoneBill],
        day('2026-11-01'),
        day('2026-11-30'),
      );

      expect(
        occurrences.map((occurrence) => occurrence.transaction.name),
      ).toEqual(['Phone (new)']);
    });

    it('returns no dates when there are no transactions', () => {
      expect(datesBetween([], '2026-11-01', '2026-11-30')).toEqual([]);
    });
  });
});

describe('sumAmounts', () => {
  it('counts every date a transaction lands on', () => {
    const gym = buildTransaction({
      frequency: TransactionFrequency.WEEKLY,
      startDate: '2026-01-02',
      amount: '50',
    });

    const octoberOccurrences = listOccurrencesBetween(
      [gym],
      day('2026-10-01'),
      day('2026-10-31'),
    );

    expect(octoberOccurrences).toHaveLength(5);
    expect(sumAmounts(octoberOccurrences).toFixed(2)).toBe('250.00');
  });

  it('adds amounts exactly, without floating-point drift', () => {
    const tenCents = buildTransaction({
      frequency: TransactionFrequency.MONTHLY,
      startDate: '2026-11-01',
      amount: '0.10',
    });
    const twentyCents = buildTransaction({
      frequency: TransactionFrequency.MONTHLY,
      startDate: '2026-11-01',
      amount: '0.20',
    });

    const occurrences = listOccurrencesBetween(
      [tenCents, twentyCents],
      day('2026-11-01'),
      day('2026-11-30'),
    );

    expect(sumAmounts(occurrences).toFixed(2)).toBe('0.30');
  });

  it('is 0 when there are no dates', () => {
    expect(sumAmounts([]).toFixed(2)).toBe('0.00');
  });
});

describe('sumAmountsByCategory', () => {
  it('totals each category, largest first', () => {
    const oldPhoneBill = buildTransaction({
      frequency: TransactionFrequency.MONTHLY,
      startDate: '2026-01-05',
      endDate: '2026-10-31',
      amount: '80',
      category: TransactionCategory.UTILITIES,
    });
    const gym = buildTransaction({
      frequency: TransactionFrequency.WEEKLY,
      startDate: '2026-01-02',
      amount: '50',
      category: TransactionCategory.SUBSCRIPTION,
    });

    const octoberOccurrences = listOccurrencesBetween(
      [oldPhoneBill, gym],
      day('2026-10-01'),
      day('2026-10-31'),
    );

    expect(
      sumAmountsByCategory(octoberOccurrences).map(({ category, total }) => [
        category,
        total.toFixed(2),
      ]),
    ).toEqual([
      [TransactionCategory.SUBSCRIPTION, '250.00'],
      [TransactionCategory.UTILITIES, '80.00'],
    ]);
  });
});
