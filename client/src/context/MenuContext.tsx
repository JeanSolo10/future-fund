import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MENU_PAGE_PATHS } from '../navigation/constants';

type MenuContextType = {
  isBudgetPageOpen: boolean;
  setIsBudgetPageOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MenuContext = createContext<MenuContextType | undefined>(
  undefined,
);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isBudgetPageOpen, setIsBudgetPageOpen] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    setIsBudgetPageOpen(location.pathname.includes(MENU_PAGE_PATHS.BUDGET));
  }, [location.pathname]);

  const contextValue: MenuContextType = {
    isBudgetPageOpen,
    setIsBudgetPageOpen,
  };

  return (
    <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
  );
};

export const menuContext = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('menuContext must be used within a MenuProvider');
  }
  return context;
};
