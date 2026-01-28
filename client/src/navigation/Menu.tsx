import { Menu as AntdMenu } from 'antd';
import type { MenuProps } from 'antd';

import './Menu.css';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { MENU_KEYS, MENU_PAGE_PATHS } from './constants';
import { menuContext } from '../context/MenuContext';
import { DateNavigation } from './DateNavigation';

type MenuItem = Required<MenuProps>['items'][number];

const getItems = (includeDatePicker: boolean): MenuItem[] => {
  return [
    {
      key: 'menu',
      icon: <MenuOutlined />,
      children: [
        {
          label: 'Home',
          key: 'home',
        },
      ],
    },
    ...(includeDatePicker
      ? [
          {
            key: 'datePicker',
            label: <DateNavigation />,
            style: { lineHeight: 2 },
          },
        ]
      : []),
    {
      key: 'user',
      icon: <UserOutlined />,
    },
  ];
};

export const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isBudgetPageOpen } = menuContext();

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
        items={getItems(isBudgetPageOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        selectedKeys={getSelectedKey()}
      />
    </div>
  );
};
