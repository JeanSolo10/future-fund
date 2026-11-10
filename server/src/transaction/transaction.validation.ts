import Decimal from 'decimal.js';
import { Transaction, TransactionFrequency } from 'generated/prisma';
import { toUtcDay } from './transaction.occurrences';

export type TransactionRuleFields = {
  amount: Decimal.Value;
  startDate: Date;
  endDate: Date | null;
  frequency: TransactionFrequency;
};

export type TransactionUpdateFields = {
  amount?: Decimal.Value | null;
  startDate?: Date | null;
  endDate?: Date | null;
  frequency?: TransactionFrequency | null;
};

export const listTransactionRuleViolations = (
  fields: TransactionRuleFields,
): string[] => {
  const violations: string[] = [];

  if (!new Decimal(fields.amount).greaterThan(0)) {
    violations.push('Amount must be greater than 0.');
  }

  if (fields.endDate && fields.endDate.getTime() < fields.startDate.getTime()) {
    violations.push("End date can't be before the start date.");
  }

  if (fields.frequency === TransactionFrequency.SEMI_MONTHLY) {
    const startDay = toUtcDay(fields.startDate).day;

    if (startDay !== 1 && startDay !== 15) {
      violations.push(
        'Semi-monthly transactions must start on the 1st or 15th.',
      );
    }
  }

  return violations;
};

export const mergeTransactionUpdate = (
  stored: Transaction,
  update: TransactionUpdateFields,
): TransactionRuleFields => ({
  amount: update.amount ?? stored.amount,
  startDate: update.startDate ?? stored.startDate,
  endDate: update.endDate === undefined ? stored.endDate : update.endDate,
  frequency: update.frequency ?? stored.frequency,
});
