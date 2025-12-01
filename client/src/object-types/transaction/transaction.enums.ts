export const TransactionTypeEnum = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  SAVINGS: 'SAVINGS',
  INVESTMENT: 'INVESTMENT',
} as const;
export type TransactionType =
  (typeof TransactionTypeEnum)[keyof typeof TransactionTypeEnum];

export const TransactionCategoryEnum = {
  GROCERIES: 'GROCERIES',
  RENT: 'RENT',
  MORTGAGE: 'MORTGAGE',
  UTILITIES: 'UTILITIES',
  TRANSPORTATION: 'TRANSPORTATION',
  SUBSCRIPTION: 'SUBSCRIPTION',
  OTHER: 'OTHER',
  NONE: 'NONE',
} as const;
export type TransactionCategory =
  (typeof TransactionCategoryEnum)[keyof typeof TransactionCategoryEnum];

export const TransactionFrequencyEnum = {
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  SEMI_MONTHLY: 'SEMI_MONTHLY',
} as const;
export type TransactionFrequency =
  (typeof TransactionFrequencyEnum)[keyof typeof TransactionFrequencyEnum];
