import { UserProvider } from './context/UserContext';
import { Home } from './features/home/Home';

export const App = () => {
  return (
    <UserProvider>
      <Home />
    </UserProvider>
  );
};
