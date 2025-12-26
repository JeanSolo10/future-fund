import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Home } from '../pages/home/Home';
import type React from 'react';
import { BudgetDetails } from '../pages/budget/BudgetDetails';
import { FinancialAccountDetails } from '../pages/financial-account/FinancialAccountDetails';
import { Layout } from '../navigation/Layout';

export const Router: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
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
