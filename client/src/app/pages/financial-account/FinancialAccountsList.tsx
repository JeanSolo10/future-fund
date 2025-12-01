import type { FinancialAccountObjectType } from '../../../object-types/financial-account/financial-account.type';
import { List } from 'antd';
import { BankOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { isEmptyArray } from '../../../common/utils';

type Props = {
  financialAccounts: FinancialAccountObjectType[];
};

export const FinancialAccounts: React.FC<Props> = ({ financialAccounts }) => {
  const navigate = useNavigate();

  const hasFinancialAccounts = !isEmptyArray(financialAccounts);

  const handleAccountClick = (accountId: string) => {
    navigate(`/financialAccount/${accountId}`);
  };

  return (
    <>
      {hasFinancialAccounts ? (
        <List
          dataSource={financialAccounts}
          renderItem={(account) => (
            <List.Item onClick={() => handleAccountClick(account.id)}>
              <List.Item.Meta
                avatar={<BankOutlined style={{ fontSize: '3em' }} />}
                title={account.name}
                description={account.type}
              />
              <p>{account.balance}</p>
            </List.Item>
          )}
          // todo: move to css
          style={{ border: 'solid', paddingLeft: '10px', paddingRight: '20px' }}
        />
      ) : (
        <div>
          <p>No accounts found</p>
        </div>
      )}
    </>
  );
};
