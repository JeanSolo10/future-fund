import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  FinancialAccountObjectType,
  FinancialAccountWhereUniqueInput,
} from '../object-types/financial-account/financial-account.type';

type MutationReturnType = {
  deleteFinancialAccount: FinancialAccountObjectType;
};

type MutationVariables = {
  where: FinancialAccountWhereUniqueInput;
};

export const DELETE_FINANCIAL_ACCOUNT: TypedDocumentNode<
  MutationReturnType,
  MutationVariables
> = gql`
  mutation DeleteFinancialAccount($where: FinancialAccountWhereUniqueInput!) {
    deleteFinancialAccount(where: $where) {
      id
    }
  }
`;
