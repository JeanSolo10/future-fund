import { Menu as AntdMenu } from 'antd';
import type { MenuProps } from 'antd';

import './Menu.css';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { MENU_KEYS, MENU_PAGE_PATHS } from './constants';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'menu',
    icon: <MenuOutlined />,
    expandIcon: false,
    children: [
      {
        label: 'Home',
        key: 'home',
      },
    ],
  },
  {
    key: 'user',
    icon: <UserOutlined />,
  },
];

export const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getSelectedKey = () => {
    const path = location.pathname;

    if (path === MENU_PAGE_PATHS.HOME) {
      return ['home'];
    }

    if (path.includes('user')) return ['user'];

    return [];
  };

  const handleClick: MenuProps['onClick'] = (e) => {
    if (e.key === MENU_KEYS.HOME) {
      navigate(MENU_PAGE_PATHS.HOME);
    }
  };

  return (
    <div className="menu-container">
      <AntdMenu
        onClick={handleClick}
        mode="horizontal"
        items={items}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        selectedKeys={getSelectedKey()}
      />
    </div>
  );
};
