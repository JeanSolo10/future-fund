import { Result, Spin } from 'antd';
import { UserProvider, useUserContext } from './context/UserContext';
import { Router } from './routes/router';
import { CreateProfile } from './pages/CreateProfile';

const UserGate = () => {
  const { user, isUserLoading, hasUserError } = useUserContext();

  if (isUserLoading) {
    return <Spin fullscreen />;
  }

  if (hasUserError) {
    return (
      <Result
        status="error"
        title="The server isn't responding"
        subTitle="Check that the server is running, then reload the page."
      />
    );
  }

  if (!user) {
    return <CreateProfile />;
  }

  return <Router />;
};

export const App = () => {
  return (
    <UserProvider>
      <UserGate />
    </UserProvider>
  );
};
