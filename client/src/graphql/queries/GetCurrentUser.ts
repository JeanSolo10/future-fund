import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type { UserObjectType } from '../../object-types/user/user.type';

type QueryReturnType = {
  currentUser: UserObjectType | null;
};

export const GET_CURRENT_USER: TypedDocumentNode<QueryReturnType> = gql`
  query GetCurrentUser {
    currentUser {
      id
      name
      budget {
        id
        name
      }
    }
  }
`;
