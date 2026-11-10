import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import type {
  UserCreateInput,
  UserObjectType,
} from '../../object-types/user/user.type';

type MutationReturnType = {
  createUser: UserObjectType;
};

type MutationVariables = {
  data: UserCreateInput;
};

export const CREATE_USER: TypedDocumentNode<
  MutationReturnType,
  MutationVariables
> = gql`
  mutation CreateUser($data: UserCreateInput!) {
    createUser(data: $data) {
      id
      name
      budget {
        id
        name
      }
    }
  }
`;
