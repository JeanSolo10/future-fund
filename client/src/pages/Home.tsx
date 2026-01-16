import { useMutation, useQuery, skipToken } from '@apollo/client/react';
import { GET_FINANCIAL_ACCOUNTS } from '../graphql/queries/GetFinancialAccounts';
import { userContext } from '../context/UserContext';
import { BudgetsList } from '../features/budget/BudgetsList';
import { FinancialAccounts } from '../features/financial-account/FinancialAccountsList';
import { APP_NAME } from '../common/enum';
import { useEffect, useState } from 'react';
import { CREATE_FINANCIAL_ACCOUNT } from '../graphql/mutations/CreateFinancialAccount';
import { Button, Form } from 'antd';
import '../styles/Home.css';
import { CreateAccountFormModal } from '../features/home/components/CreateAccountFormModal';
import { CreateBudgetFormModal } from '../features/home/components/CreateBudgetFormModal';
import { CREATE_BUDGET } from '../graphql/mutations/CreateBudget';
import { GET_BUDGET } from '../graphql/queries/GetBudget';
import { ErrorPage } from './ErrorPage';

export const Home: React.FC = () => {
  const [createAccountForm] = Form.useForm();
  const [createBudgetForm] = Form.useForm();
  const [openCreateAccountForm, setOpenCreateAccountForm] = useState(false);
  const [openCreateBudgetForm, setOpenCreateBudgetForm] = useState(false);

  const { user } = userContext();

  const { data: budgetData } = useQuery(
    GET_BUDGET,
    user?.budgetId
      ? { variables: { where: { id: user.budgetId } } }
      : skipToken,
  );

  const { data: financialAccountsData } = useQuery(
    GET_FINANCIAL_ACCOUNTS,
    user?.id ? { variables: { where: { userId: user.id } } } : skipToken,
  );

  const [createFinancialAccount] = useMutation(CREATE_FINANCIAL_ACCOUNT);
  const [createBudget] = useMutation(CREATE_BUDGET);

  const handleCreateFinancialAccount = () => {
    createFinancialAccount({
      variables: {
        data: { ...createAccountForm.getFieldsValue(true), userId: user?.id! },
      },
      onCompleted: () => {
        setOpenCreateAccountForm(false);
      },
      refetchQueries: [GET_FINANCIAL_ACCOUNTS],
    });
  };

  const handleCreateBudget = () => {
    createBudget({
      variables: {
        data: {
          ...createBudgetForm.getFieldsValue(true),
          userId: user?.id!,
        },
      },
      onCompleted: () => {
        setOpenCreateBudgetForm(false);
      },
      refetchQueries: [GET_BUDGET],
    });
  };

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

  if (!user || !user?.budgetId) {
    return (
      <ErrorPage
        title="Budget Not Found"
        subTitle="No budget found for your account. Please create one to continue."
      />
    );
  }

  return (
    <>
      <div className="main-screen-content">
        <h1>{APP_NAME}</h1>
        <h2>{getWelcomeMessage(user?.name)}</h2>

        <div className="section-header">
          <h2>Budgets</h2>
          <Button onClick={() => setOpenCreateBudgetForm(true)}>
            Add New Budget
          </Button>
        </div>

        <BudgetsList budget={budgetData?.budget} />

        <div className="section-header">
          <h2>Accounts</h2>
          <Button onClick={() => setOpenCreateAccountForm(true)}>
            Add New Account
          </Button>
        </div>

        <FinancialAccounts
          financialAccounts={
            financialAccountsData?.financialFinancialAccounts ?? []
          }
        />

        <CreateAccountFormModal
          form={createAccountForm}
          openForm={openCreateAccountForm}
          onFormSubmit={handleCreateFinancialAccount}
          setOpenForm={setOpenCreateAccountForm}
        />

        <CreateBudgetFormModal
          form={createBudgetForm}
          openForm={openCreateBudgetForm}
          onFormSubmit={handleCreateBudget}
          setOpenForm={setOpenCreateBudgetForm}
        />
      </div>
    </>
  );
};
