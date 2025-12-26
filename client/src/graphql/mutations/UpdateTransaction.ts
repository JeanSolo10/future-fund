import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  TransactionObjectType,
  TransactionUpdateInput,
  TransactionWhereUniqueInput,
} from '../../object-types/transaction/transaction.type';

type MutationReturnType = {
  updateTransaction: TransactionObjectType;
};

type MutationVariables = {
  data: TransactionUpdateInput;
  where: TransactionWhereUniqueInput;
};

export const UPDATE_TRANSACTION: TypedDocumentNode<
  MutationReturnType,
  MutationVariables
> = gql`
  mutation UpdateTransaction(
    $data: TransactionUpdateInput!
    $where: TransactionWhereUniqueInput!
  ) {
    updateTransaction(data: $data, where: $where) {
      id
      amount
      name
      date
      type
      category
      frequency
    }
  }
`;
