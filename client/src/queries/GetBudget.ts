import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  BudgetObjectType,
  BudgetWhereUniqueInput,
} from '../objects/budget/budget.type';

type QueryReturnType = {
  budget: BudgetObjectType;
};

type QueryVariables = {
  where: BudgetWhereUniqueInput;
};

export const GET_BUDGET: TypedDocumentNode<QueryReturnType, QueryVariables> =
  gql`
    query GetBudget($where: BudgetWhereUniqueInput!) {
      budget(where: $where) {
        id
        name
        userId
      }
    }
  `;
