import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  TransactionObjectType,
  TransactionWhereUniqueInput,
} from '../objects/transaction/transaction.type';

type MutationReturnType = {
  deleteTransaction: TransactionObjectType;
};

type MutationVariables = {
  where: TransactionWhereUniqueInput;
};

export const DELETE_TRANSACTION: TypedDocumentNode<
  MutationReturnType,
  MutationVariables
> = gql`
  mutation DeleteTransaction($where: TransactionWhereUniqueInput!) {
    deleteTransaction(where: $where) {
      id
      name
    }
  }
`;
