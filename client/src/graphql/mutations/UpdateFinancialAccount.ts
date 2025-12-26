import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  FinancialAccountObjectType,
  FinancialAccountUpdateInput,
  FinancialAccountWhereUniqueInput,
} from '../../object-types/financial-account/financial-account.type';

type MutationReturnType = {
  updateFinancialAccount: FinancialAccountObjectType;
};

type MutationVariables = {
  data: FinancialAccountUpdateInput;
  where: FinancialAccountWhereUniqueInput;
};

export const UPDATE_FINANCIAL_ACCOUNT: TypedDocumentNode<
  MutationReturnType,
  MutationVariables
> = gql`
  mutation UpdateFinancialAccount(
    $data: FinancialAccountUpdateInput!
    $where: FinancialAccountWhereUniqueInput!
  ) {
    updateFinancialAccount(data: $data, where: $where) {
      id
      name
      type
      balance
    }
  }
`;
