import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  BudgetObjectType,
  BudgetUpdateInput,
  BudgetWhereUniqueInput,
} from '../object-types/budget/budget.type';

type MutationReturnType = {
  updateBudget: BudgetObjectType;
};

type MutationVariables = {
  data: BudgetUpdateInput;
  where: BudgetWhereUniqueInput;
};

export const UPDATE_BUDGET: TypedDocumentNode<
  MutationReturnType,
  MutationVariables
> = gql`
  mutation UpdateBudget(
    $data: BudgetUpdateInput!
    $where: BudgetWhereUniqueInput!
  ) {
    updateBudget(data: $data, where: $where) {
      id
      name
    }
  }
`;
