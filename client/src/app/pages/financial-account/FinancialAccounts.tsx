import type { FinancialAccountObjectType } from '../../../object-types/financial-account/financial-account.type';
import { List } from 'antd';
import { BankOutlined } from '@ant-design/icons';

type Props = {
  financialAccounts: FinancialAccountObjectType[];
};

export const FinancialAccounts: React.FC<Props> = ({ financialAccounts }) => {
  return (
    <List
      dataSource={financialAccounts}
      renderItem={(account) => (
        <List.Item>
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
  );
};
