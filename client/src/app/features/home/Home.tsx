import { useQuery } from '@apollo/client/react';
import { GET_BUDGETS } from '../../../queries/GetBudgets';
import { GET_FINANCIAL_ACCOUNTS } from '../../../queries/GetFinancialAccounts';
import { userContext } from '../../context/UserContext';
import { Budgets } from '../../pages/budget/Budgets';
import { FinancialAccounts } from '../../pages/financial-account/FinancialAccounts';
import { APP_NAME } from '../../../common/enum';
import { useEffect } from 'react';

export const Home: React.FC = () => {
  const { user } = userContext();

  const { data: budgetsData } = useQuery(GET_BUDGETS, {
    variables: { where: { userId: user?.id } },
  });

  const { data: financialAccountsData } = useQuery(GET_FINANCIAL_ACCOUNTS, {
    variables: { where: { userId: user?.id } },
  });

  const getWelcomeMessage = (userName?: string): string => {
    let initialMessage = 'Greetings';

    if (userName) {
      initialMessage = initialMessage.concat(', ', userName);
    }

    return initialMessage.concat('!');
  };

  useEffect(() => {
    if (user?.name) {
      getWelcomeMessage(user.name);
    }
  }, [user?.name]);

  return (
    <>
      <div>
        <h1>{APP_NAME}</h1>
        <h2>{getWelcomeMessage(user?.name)}</h2>
        <h2>Budgets</h2>
        <Budgets budgets={budgetsData?.budgets ?? []} />
        <h2>Accounts</h2>
        <FinancialAccounts
          financialAccounts={
            financialAccountsData?.financialFinancialAccounts ?? []
          }
        />
      </div>
    </>
  );
};
