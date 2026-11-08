import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { MonthlySummaryObjectType } from '../../object-types/transaction/transaction.type';
import type { CalendarDate } from '../../common/date';

type QueryReturnType = {
  monthlySummary: MonthlySummaryObjectType;
};

type QueryVariables = {
  budgetId: string;
  month: CalendarDate;
};

export const GET_MONTHLY_SUMMARY: TypedDocumentNode<
  QueryReturnType,
  QueryVariables
> = gql`
  query GetMonthlySummary($budgetId: ID!, $month: CalendarDate!) {
    monthlySummary(budgetId: $budgetId, month: $month) {
      month
      totalIncome
      totalExpense
      expenseTotalsByCategory {
        category
        total
      }
      transactions {
        id
        amount
        name
        startDate
        type
        category
        frequency
        endDate
      }
    }
  }
`;
