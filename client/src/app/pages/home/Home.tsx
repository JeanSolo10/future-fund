import { useMutation, useQuery } from '@apollo/client/react';
import { GET_BUDGETS } from '../../../queries/GetBudgets';
import { GET_FINANCIAL_ACCOUNTS } from '../../../queries/GetFinancialAccounts';
import { userContext } from '../../context/UserContext';
import { Budgets } from '../budget/Budgets';
import { FinancialAccounts } from '../financial-account/FinancialAccounts';
import { APP_NAME } from '../../../common/enum';
import { useEffect, useState } from 'react';
import { CREATE_FINANCIAL_ACCOUNT } from '../../../mutations/CreateFinancialAccount';
import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import './Home.css';
import { AccountTypeEnum } from '../../../object-types/financial-account/financial-account.type';

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

        <Modal
          open={openForm}
          title="Add Account"
          onCancel={() => setOpenForm(false)}
          destroyOnHidden
          footer={false}
        >
          <Form
            title="Account"
            form={form}
            layout="vertical"
            onFinish={handleCreateFinancialAccount}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please enter a name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please select a type' }]}
            >
              <Select
                options={Object.values(AccountTypeEnum).map((value) => ({
                  label: value,
                  value,
                }))}
              />
            </Form.Item>
            <Form.Item label="Balance" name="balance">
              <InputNumber precision={2} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button type="default" onClick={() => setOpenForm(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};
