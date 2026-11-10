import type { BudgetObjectType } from '../budget/budget.type';

export type UserObjectType = {
  __typename: 'User';
  id: string;
  name: string;
  budget: BudgetObjectType | null;
};

export type UserWhereUniqueInput = {
  id: string;
};

export type UsersWhereInput = {
  name?: string;
  email?: string;
};
