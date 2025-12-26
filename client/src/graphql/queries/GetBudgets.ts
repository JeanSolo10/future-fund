import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  BudgetObjectType,
  BudgetsWhereInput,
} from '../../object-types/budget/budget.type';

type QueryReturnType = {
  budgets: BudgetObjectType[];
};

type QueryVariables = {
  where?: BudgetsWhereInput;
};

export const GET_BUDGETS: TypedDocumentNode<QueryReturnType, QueryVariables> =
  gql`
    query GetBudgets($where: BudgetsWhereInput) {
      budgets(where: $where) {
        id
        name
        userId
      }
    }
  `;
