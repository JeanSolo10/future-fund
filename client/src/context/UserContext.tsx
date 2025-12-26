import { createContext, useContext, useEffect, useState } from 'react';
import type { UserObjectType } from '../object-types/user/user.type';
import { useQuery } from '@apollo/client/react';
import { GET_USER } from '../graphql/queries/GetUser';

type UserContextType = {
  user: UserObjectType | undefined;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserObjectType | undefined>(undefined);

  const { data: getUserData } = useQuery(GET_USER, {
    variables: { where: { id: '629a83d8-7454-4833-abc3-49caa34d91e4' } },
  });

  useEffect(() => {
    if (getUserData && getUserData.user) {
      setUser(getUserData.user);
    }
  }, [getUserData]);

  const contextValue: UserContextType = {
    user,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const userContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('userContext must be used within a UserProvider');
  }
  return context;
};
