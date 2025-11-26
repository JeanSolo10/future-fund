import { useMutation, useQuery } from '@apollo/client/react';
import { GET_BUDGETS } from '../../../queries/GetBudgets';
import { GET_FINANCIAL_ACCOUNTS } from '../../../queries/GetFinancialAccounts';
import { userContext } from '../../context/UserContext';
import { Budgets } from '../budget/Budgets';
import { FinancialAccounts } from '../financial-account/FinancialAccounts';
import { APP_NAME } from '../../../common/enum';
import { useEffect, useState } from 'react';
import { CREATE_FINANCIAL_ACCOUNT } from '../../../mutations/CreateFinancialAccount';
import { Button, Form } from 'antd';
import './Home.css';
import { CreateAccountFormModal } from './components/CreateAccountFormModal';

export const Home: React.FC = () => {
  const [form] = Form.useForm();
  const [openForm, setOpenForm] = useState(false);

  const { user } = userContext();

  const { data: budgetsData } = useQuery(GET_BUDGETS, {
    variables: { where: { userId: user?.id } },
  });

  const { data: financialAccountsData } = useQuery(GET_FINANCIAL_ACCOUNTS, {
    variables: { where: { userId: user?.id } },
  });

  const [createFinancialAccount] = useMutation(CREATE_FINANCIAL_ACCOUNT);

  const handleCreateFinancialAccount = () => {
    createFinancialAccount({
      variables: {
        data: { ...form.getFieldsValue(true), userId: user?.id! },
      },
      onCompleted: () => {
        setOpenForm(false);
      },
      refetchQueries: [GET_FINANCIAL_ACCOUNTS],
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

  return (
    <>
      <div>
        <h1>{APP_NAME}</h1>
        <h2>{getWelcomeMessage(user?.name)}</h2>

        <h2>Budgets</h2>
        <Budgets budgets={budgetsData?.budgets ?? []} />

        <div className="accounts-header">
          <h2 style={{ width: '50%' }}>Accounts</h2>
          <Button
            style={{ alignSelf: 'center' }}
            onClick={() => setOpenForm(true)}
          >
            Add Account
          </Button>
        </div>

        <FinancialAccounts
          financialAccounts={
            financialAccountsData?.financialFinancialAccounts ?? []
          }
        />

        <CreateAccountFormModal
          form={form}
          openForm={openForm}
          onFormSubmit={handleCreateFinancialAccount}
          setOpenForm={setOpenForm}
        />
      </div>
    </>
  );
};
