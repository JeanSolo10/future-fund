import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  TransactionObjectType,
  TransactionsWhereInput,
} from '../../object-types/transaction/transaction.type';

type QueryReturnType = {
  transactions: TransactionObjectType[];
};

type QueryVariables = {
  where?: TransactionsWhereInput;
};

export const GET_TRANSACTIONS: TypedDocumentNode<
  QueryReturnType,
  QueryVariables
> = gql`
  query GetTransactions($where: TransactionsWhereInput) {
    transactions(where: $where) {
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
