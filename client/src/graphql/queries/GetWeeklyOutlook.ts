import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  AlreadyInBalanceInput,
  WeeklyOutlookObjectType,
} from '../../object-types/transaction/transaction.type';
import type { CalendarDate } from '../../common/date';

type QueryReturnType = {
  weeklyOutlook: WeeklyOutlookObjectType;
};

type QueryVariables = {
  budgetId: string;
  today: CalendarDate;
  financialAccountIds: string[];
  alreadyInBalance: AlreadyInBalanceInput[];
  weeks: number;
};

export const GET_WEEKLY_OUTLOOK: TypedDocumentNode<
  QueryReturnType,
  QueryVariables
> = gql`
  query GetWeeklyOutlook(
    $budgetId: ID!
    $today: CalendarDate!
    $financialAccountIds: [ID!]!
    $alreadyInBalance: [AlreadyInBalanceInput!]!
    $weeks: Int!
  ) {
    weeklyOutlook(
      budgetId: $budgetId
      today: $today
      financialAccountIds: $financialAccountIds
      alreadyInBalance: $alreadyInBalance
      weeks: $weeks
    ) {
      startingBalance
      weeks {
        startDate
        endDate
        balanceRemaining
        transactions {
          transactionId
          date
          name
          amount
          type
        }
      }
    }
  }
`;
