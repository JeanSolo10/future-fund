import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { CalendarTransactionObjectType } from '../../object-types/transaction/transaction.type';
import type { CalendarDate } from '../../common/date';

type QueryReturnType = {
  calendarTransactions: CalendarTransactionObjectType[];
};

type QueryVariables = {
  budgetId: string;
  start: CalendarDate;
  end: CalendarDate;
};

export const GET_CALENDAR_TRANSACTIONS: TypedDocumentNode<
  QueryReturnType,
  QueryVariables
> = gql`
  query GetCalendarTransactions(
    $budgetId: ID!
    $start: CalendarDate!
    $end: CalendarDate!
  ) {
    calendarTransactions(budgetId: $budgetId, start: $start, end: $end) {
      transactionId
      date
      name
      amount
      type
    }
  }
`;
