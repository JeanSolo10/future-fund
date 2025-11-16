import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router';
import { Home } from '../features/home/Home';
import type React from 'react';
import { BudgetDetails } from '../pages/budget/BudgetDetails';

export const Router: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="budget/:budgetId" element={<BudgetDetails />} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
};
