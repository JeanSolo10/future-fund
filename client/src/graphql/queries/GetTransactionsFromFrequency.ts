import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { VisualCalendarTransaction } from '../../features/transactions/types';
import type { CalendarDate } from '../../common/date';

type QueryReturnType = {
  generateTransactionsFromFrequency: VisualCalendarTransaction[];
};

type QueryVariables = {
  transactionIds: string[];
  windowStart: CalendarDate;
  windowEnd: CalendarDate;
};

export const GENERATE_TRANSACTIONS_FROM_FREQUENCY: TypedDocumentNode<
  QueryReturnType,
  QueryVariables
> = gql`
  query GenerateTransactionsFromFrequency(
    $transactionIds: [String!]!
    $windowStart: CalendarDate!
    $windowEnd: CalendarDate!
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
