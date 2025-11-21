import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  TransactionObjectType,
  TransactionWhereUniqueInput,
} from '../object-types/transaction/transaction.type';

export type QueryReturnType = {
  transaction: TransactionObjectType;
};

type QueryVariables = {
  where: TransactionWhereUniqueInput;
};

export const GET_TRANSACTION: TypedDocumentNode<
  QueryReturnType,
  QueryVariables
> = gql`
  query GetTransaction($where: TransactionWhereUniqueInput!) {
    transaction(where: $where) {
      id
      amount
      name
      date
      type
      category
      frequency
      budgetId
    }
  }
`;
