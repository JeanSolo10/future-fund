import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  UserObjectType,
  UsersWhereInput,
} from '../objects/user/user.type';

type QueryReturnType = {
  users: UserObjectType[];
};

type QueryVariables = {
  where?: UsersWhereInput;
};

export const GET_USERS: TypedDocumentNode<QueryReturnType, QueryVariables> =
  gql`
    query GetUsers($where: UsersWhereInput) {
      users(where: $where) {
        id
        name
        email
      }
    }
  `;
