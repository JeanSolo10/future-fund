import { createContext, useContext } from 'react';
import type { UserObjectType } from '../object-types/user/user.type';
import { useQuery } from '@apollo/client/react';
import { GET_CURRENT_USER } from '../graphql/queries/GetCurrentUser';

type UserContextType = {
  user: UserObjectType | undefined;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: currentUserData } = useQuery(GET_CURRENT_USER);

  const contextValue: UserContextType = {
    user: currentUserData?.currentUser ?? undefined,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
