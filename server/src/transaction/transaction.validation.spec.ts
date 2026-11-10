import Decimal from 'decimal.js';
import {
  Prisma,
  Transaction,
  TransactionCategory,
  TransactionFrequency,
  TransactionType,
} from 'generated/prisma';
import {
  TransactionRuleFields,
  listTransactionRuleViolations,
  mergeTransactionUpdate,
} from './transaction.validation';

const day = (calendarDate: string): Date =>
  new Date(`${calendarDate}T00:00:00.000Z`);

const validFields: TransactionRuleFields = {
  amount: '50',
  startDate: day('2026-11-10'),
  endDate: null,
  frequency: TransactionFrequency.MONTHLY,
};

const storedTransaction: Transaction = {
  id: 'transaction-1',
  name: 'Phone',
  amount: new Prisma.Decimal('85'),
  startDate: day('2026-01-10'),
  endDate: day('2026-12-10'),
  type: TransactionType.EXPENSE,
  frequency: TransactionFrequency.MONTHLY,
  category: TransactionCategory.UTILITIES,
  budgetId: 'budget-1',
};

describe('listTransactionRuleViolations', () => {
  it('accepts a positive amount with no end date', () => {
    expect(listTransactionRuleViolations(validFields)).toEqual([]);
  });

  it('rejects an amount of 0 or less', () => {
    expect(
      listTransactionRuleViolations({ ...validFields, amount: '0' }),
    ).toEqual(['Amount must be greater than 0.']);
    expect(
      listTransactionRuleViolations({ ...validFields, amount: '-5' }),
    ).toEqual(['Amount must be greater than 0.']);
  });

  it('accepts an amount of one cent', () => {
    expect(
      listTransactionRuleViolations({
        ...validFields,
        amount: new Decimal('0.01'),
      }),
    ).toEqual([]);
  });

  it('rejects an end date before the start date', () => {
    expect(
      listTransactionRuleViolations({
        ...validFields,
        endDate: day('2026-11-09'),
      }),
    ).toEqual(["End date can't be before the start date."]);
  });

  it('accepts an end date on the start date', () => {
    expect(
      listTransactionRuleViolations({
        ...validFields,
        endDate: day('2026-11-10'),
      }),
    ).toEqual([]);
  });

  it('requires a semi-monthly start on the 1st or 15th', () => {
    const semiMonthly = {
      ...validFields,
      frequency: TransactionFrequency.SEMI_MONTHLY,
    };

    expect(
      listTransactionRuleViolations({
        ...semiMonthly,
        startDate: day('2026-11-01'),
      }),
    ).toEqual([]);
    expect(
      listTransactionRuleViolations({
        ...semiMonthly,
        startDate: day('2026-11-15'),
      }),
    ).toEqual([]);
    expect(listTransactionRuleViolations(semiMonthly)).toEqual([
      'Semi-monthly transactions must start on the 1st or 15th.',
    ]);
  });

  it('lists every broken rule at once', () => {
    expect(
      listTransactionRuleViolations({
        amount: '0',
        startDate: day('2026-11-10'),
        endDate: day('2026-11-01'),
        frequency: TransactionFrequency.SEMI_MONTHLY,
      }),
    ).toEqual([
      'Amount must be greater than 0.',
      "End date can't be before the start date.",
      'Semi-monthly transactions must start on the 1st or 15th.',
    ]);
  });
});

describe('mergeTransactionUpdate', () => {
  it('keeps the stored values for fields the update leaves out', () => {
    expect(mergeTransactionUpdate(storedTransaction, {})).toEqual({
      amount: storedTransaction.amount,
      startDate: storedTransaction.startDate,
      endDate: storedTransaction.endDate,
      frequency: storedTransaction.frequency,
    });
  });

  it('uses the values the update sends', () => {
    const merged = mergeTransactionUpdate(storedTransaction, {
      amount: '95',
      startDate: day('2026-02-01'),
      frequency: TransactionFrequency.SEMI_MONTHLY,
    });

    expect(merged).toEqual({
      amount: '95',
      startDate: day('2026-02-01'),
      endDate: storedTransaction.endDate,
      frequency: TransactionFrequency.SEMI_MONTHLY,
    });
  });

  it('clears the end date when the update sends null', () => {
    expect(
      mergeTransactionUpdate(storedTransaction, { endDate: null }).endDate,
    ).toBeNull();
  });

  it('catches a frequency change that breaks the stored start date', () => {
    const merged = mergeTransactionUpdate(storedTransaction, {
      frequency: TransactionFrequency.SEMI_MONTHLY,
    });

    expect(listTransactionRuleViolations(merged)).toEqual([
      'Semi-monthly transactions must start on the 1st or 15th.',
    ]);
  });

  it('catches a start date moved past the stored end date', () => {
    const merged = mergeTransactionUpdate(storedTransaction, {
      startDate: day('2027-01-10'),
    });

    expect(listTransactionRuleViolations(merged)).toEqual([
      "End date can't be before the start date.",
    ]);
  });
});
