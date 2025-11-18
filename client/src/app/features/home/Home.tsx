import { useQuery } from '@apollo/client/react';
import { GET_BUDGETS } from '../../../queries/GetBudgets';
import { GET_FINANCIAL_ACCOUNTS } from '../../../queries/GetFinancialAccounts';
import { userContext } from '../../context/UserContext';
import { Budgets } from '../../pages/budget/Budget';
import { FinancialAccounts } from '../../pages/financial-account/FinancialAccounts';
import { APP_NAME } from '../../../common/enum';
import { useState } from 'react';
import type { BudgetObjectType } from '../../../objects/budget/budget.type';

export const Home: React.FC = () => {
  const [selectedBudget, setSelectedBudget] = useState<
    BudgetObjectType | undefined
  >(undefined);
  const { user } = userContext();

  const isDisplayingBudgetDetail = !!selectedBudget;

  const { data: budgetsData } = useQuery(GET_BUDGETS, {
    variables: { where: { userId: user?.id } },
  });

  const { data: financialAccountsData } = useQuery(GET_FINANCIAL_ACCOUNTS, {
    variables: { where: { userId: user?.id } },
  });

  const onSelectBudget = (budget: BudgetObjectType) => {
    setSelectedBudget(budget);
  };

  const onCloseBudget = () => {
    setSelectedBudget(undefined);
  };

  return (
    <>
      {isDisplayingBudgetDetail ? (
        <Budgets
          budgets={budgetsData?.budgets ?? []}
          selectedBudget={selectedBudget}
          onSelectBudget={onSelectBudget}
          onCloseBudget={onCloseBudget}
        />
      ) : (
        <div>
          <h1>{APP_NAME}</h1>
          <h2>Greetings, {user?.name ?? ''}!</h2>
          <h2>Budgets</h2>
          <Budgets
            budgets={budgetsData?.budgets ?? []}
            onSelectBudget={onSelectBudget}
            onCloseBudget={onCloseBudget}
          />
          <h2>Accounts</h2>
          <FinancialAccounts
            financialAccounts={
              financialAccountsData?.financialFinancialAccounts ?? []
            }
          />
        </div>
      )}
    </>
  );
};
