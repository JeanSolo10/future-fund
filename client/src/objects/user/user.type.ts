export type UserObjectType = {
  __typename: 'User';
  id: string;
  name: string;
  email: string;
};

export type UserWhereUniqueInput = {
  id: string;
};

export type UsersWhereInput = {
  name?: string;
  email?: string;
};
