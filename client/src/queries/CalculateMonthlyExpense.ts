import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';

type QueryReturnType = {
  calculateTotalMonthlyExpense: string;
};

type QueryVariables = {
  transactionIds: string[];
};

export const CALCULATE_MONTHLY_EXPENSE: TypedDocumentNode<
  QueryReturnType,
  QueryVariables
> = gql`
  query calculateTotalMonthlyExpense($transactionIds: [String!]!) {
    calculateTotalMonthlyExpense(transactionIds: $transactionIds)
  }
`;
