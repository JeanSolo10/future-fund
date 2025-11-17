import { UserProvider } from './context/UserContext';
import { Router } from './routes/router';

export const App = () => {
  return (
    <UserProvider>
      <Router />
    </UserProvider>
  );
};
