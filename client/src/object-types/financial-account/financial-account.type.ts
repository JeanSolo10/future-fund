const AccountTypeEnum = {
  BANK: 'BANK',
  CREDIT_CARD: 'CREDIT_CARD',
  INVESTMENT: 'INVESTMENT',
} as const;

export type AccountType =
  (typeof AccountTypeEnum)[keyof typeof AccountTypeEnum];

export type FinancialAccountObjectType = {
  __typename: 'FinancialAccount';
  id: string;
  name: string;
  balance: string | null;
  type: AccountType;
  userId: string;
};

export type FinancialAccountWhereUniqueInput = {
  id: string;
};

export type FinancialAccountsWhereInput = {
  name?: string;
  type?: AccountType;
  userId?: string;
};

export type FinancialAccountCreateInput = {
  name: string;
  type: AccountType;
  balance?: string;
  userId: string;
};

export type FinancialAccountUpdateInput = Partial<FinancialAccountCreateInput>;
