export type BudgetObjectType = {
  __typename: 'Budget';
  id: string;
  name: string;
};

export type BudgetWhereUniqueInput = {
  id: string;
};

export type BudgetsWhereInput = {
  name?: string;
};

export type BudgetCreateInput = {
  name: string;
};

export type BudgetUpdateInput = Partial<BudgetCreateInput>;
