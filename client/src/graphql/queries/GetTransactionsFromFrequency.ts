import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { VisualCalendarTransaction } from '../../features/transactions/types';

type QueryReturnType = {
  generateTransactionsFromFrequency: VisualCalendarTransaction[];
};

type QueryVariables = { transactionIds: string[] };

export const GENERATE_TRANSACTIONS_FROM_FREQUENCY: TypedDocumentNode<
  QueryReturnType,
  QueryVariables
> = gql`
  query GenerateTransactionsFromFrequency($transactionIds: [String!]!) {
    generateTransactionsFromFrequency(transactionIds: $transactionIds) {
      amount
      name
      startDate
      type
      category
      frequency
    }
  }
`;
