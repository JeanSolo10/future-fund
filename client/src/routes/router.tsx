import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Home } from '../pages/Home';
import type React from 'react';
import { BudgetDetails } from '../pages/BudgetDetails';
import { FinancialAccountDetails } from '../pages/FinancialAccountDetails';
import { Layout } from '../navigation/Layout';
import { MenuProvider } from '../context/MenuContext';

export const Router: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <MenuProvider>
            <Layout />
          </MenuProvider>
        }
      >
        <Route index element={<Home />} />
        <Route path="budget/:budgetId" element={<BudgetDetails />} />
        <Route
          path="financialAccount/:financialAccountId"
          element={<FinancialAccountDetails />}
        />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
};
