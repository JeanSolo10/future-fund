import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  BudgetCreateInput,
  BudgetObjectType,
} from '../object-types/budget/budget.type';

type MutationReturnType = {
  budget: BudgetObjectType;
};

type MutationVariables = {
  data: BudgetCreateInput;
};

export const CREATE_BUDGET: TypedDocumentNode<
  MutationReturnType,
  MutationVariables
> = gql`
  mutation CreateBudget($data: BudgetCreateInput!) {
    createBudget(data: $data) {
      id
      name
    }
  }
`;
