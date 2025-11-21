import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  FinancialAccountObjectType,
  FinancialAccountWhereUniqueInput,
} from '../object-types/financial-account/financial-account.type';

type QueryReturnType = {
  financialAccount: FinancialAccountObjectType;
};

type QueryVariables = {
  where: FinancialAccountWhereUniqueInput;
};

export const GET_FINANCIAL_ACCOUNT: TypedDocumentNode<
  QueryReturnType,
  QueryVariables
> = gql`
  query GetFinancialAccount($where: FinancialAccountWhereUniqueInput!) {
    financialAccount(where: $where) {
      id
      name
      balance
      type
      userId
    }
  }
`;
