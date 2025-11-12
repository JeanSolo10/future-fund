export type BudgetObjectType = {
  __typename: 'Budget';
  id: string;
  name: string;
  userId: string;
};

export type BudgetWhereUniqueInput = {
  id: string;
};

export type BudgetsWhereInput = {
  name?: string;
  userId?: string;
};
