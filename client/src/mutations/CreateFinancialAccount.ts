import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  FinancialAccountCreateInput,
  FinancialAccountObjectType,
} from '../object-types/financial-account/financial-account.type';

type MutationReturnType = {
  financialAccount: FinancialAccountObjectType;
};

type MutationVariables = {
  data: FinancialAccountCreateInput;
};

export const CREATE_FINANCIAL_ACCOUNT: TypedDocumentNode<
  MutationReturnType,
  MutationVariables
> = gql`
  mutation CreateTransaction($data: TransactionCreateInput!) {
    createFinancialAccount(data: $data) {
      id
      name
    }
  }
`;
