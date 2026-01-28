import { gql } from '@apollo/client';
import { type TypedDocumentNode } from '@apollo/client';
import {
  type UserObjectType,
  type UserWhereUniqueInput,
} from '../../object-types/user/user.type';

type QueryReturnType = {
  user: UserObjectType;
};

type QueryVariables = {
  where: UserWhereUniqueInput;
};

export const GET_USER: TypedDocumentNode<QueryReturnType, QueryVariables> = gql`
  query GetUser($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      name
      email
      budgetId
    }
  }
`;
