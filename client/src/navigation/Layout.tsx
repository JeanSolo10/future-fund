import { Menu } from './Menu.tsx';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div>
      <Menu />

      <Outlet />
    </div>
  );
};
