import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  BudgetObjectType,
  BudgetWhereUniqueInput,
} from '../../object-types/budget/budget.type';

type MutationReturnType = {
  deleteBudget: BudgetObjectType;
};

type MutationVariables = {
  where: BudgetWhereUniqueInput;
};

export const DELETE_BUDGET: TypedDocumentNode<
  MutationReturnType,
  MutationVariables
> = gql`
  mutation DeleteBudget($where: BudgetWhereUniqueInput!) {
    deleteBudget(where: $where) {
      id
    }
  }
`;
