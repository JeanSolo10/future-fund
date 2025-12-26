import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  FinancialAccountObjectType,
  FinancialAccountsWhereInput,
} from '../../object-types/financial-account/financial-account.type';

type QueryReturnType = {
  financialFinancialAccounts: FinancialAccountObjectType[];
};

type QueryVariables = {
  where?: FinancialAccountsWhereInput;
};

export const GET_FINANCIAL_ACCOUNTS: TypedDocumentNode<
  QueryReturnType,
  QueryVariables
> = gql`
  query GetFinancialAccounts($where: FinancialAccountsWhereInput) {
    financialFinancialAccounts(where: $where) {
      id
      name
      balance
      type
      userId
    }
  }
`;
