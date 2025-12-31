import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';

type QueryReturnType = {
  calculateTotalMonthlyIncome: string;
};

type QueryVariables = {
  transactionIds: string[];
};

export const CALCULATE_MONTHLY_INCOME: TypedDocumentNode<
  QueryReturnType,
  QueryVariables
> = gql`
  query calculateTotalMonthlyIncome($transactionIds: [String!]!) {
    calculateTotalMonthlyIncome(transactionIds: $transactionIds)
  }
`;
