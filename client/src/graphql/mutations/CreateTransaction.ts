import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  TransactionCreateInput,
  TransactionObjectType,
} from '../../object-types/transaction/transaction.type';

type MutationReturnType = {
  createTransaction: TransactionObjectType;
};

type MutationVariables = {
  data: TransactionCreateInput;
};

export const CREATE_TRANSACTION: TypedDocumentNode<
  MutationReturnType,
  MutationVariables
> = gql`
  mutation CreateTransaction($data: TransactionCreateInput!) {
    createTransaction(data: $data) {
      id
      name
    }
  }
`;
