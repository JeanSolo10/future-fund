import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { VisualCalendarTransaction } from '../../features/transactions/types';
import type { DateTime } from 'luxon';

type QueryReturnType = {
  generateTransactionsFromFrequency: VisualCalendarTransaction[];
};

type QueryVariables = {
  transactionIds: string[];
  windowStart: DateTime;
  windowEnd: DateTime;
};

export const GENERATE_TRANSACTIONS_FROM_FREQUENCY: TypedDocumentNode<
  QueryReturnType,
  QueryVariables
> = gql`
  query GenerateTransactionsFromFrequency(
    $transactionIds: [String!]!
    $windowStart: DateTime!
    $windowEnd: DateTime!
  ) {
    generateTransactionsFromFrequency(
      transactionIds: $transactionIds
      windowStart: $windowStart
      windowEnd: $windowEnd
    ) {
      amount
      name
      startDate
      type
      category
      frequency
    }
  }
`;
