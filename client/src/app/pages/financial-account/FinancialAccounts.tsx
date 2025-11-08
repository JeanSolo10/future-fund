import { useEffect, useState } from 'react';
import type { FinancialAccountObjectType } from '../../../objects/financial-account/financial-account.type';
import Decimal from 'decimal.js';
import { List } from 'antd';
import { BankOutlined } from '@ant-design/icons';

type Props = {
  financialFinancialAccounts: FinancialAccountObjectType[];
};

export const FinancialAccounts: React.FC<Props> = ({
  financialFinancialAccounts,
}) => {
  const [totalValue, setTotalValue] = useState<number | null>(null);

  const calculateTotalAccountValue = (
    accounts: FinancialAccountObjectType[],
  ): number => {
    let accountsTotal: number = 0;
    accounts.forEach((account) => {
      if (account.balance) {
        accountsTotal += Decimal(account.balance).toNumber();
      }
    });
    return accountsTotal;
  };

  useEffect(() => {
    setTotalValue(calculateTotalAccountValue(financialFinancialAccounts));
  }, [totalValue]);

  return (
    <div>
      <h3>Total Value: {totalValue ?? null}</h3>
      <div>
        <List
          dataSource={financialFinancialAccounts}
          renderItem={(account) => (
            <List.Item>
              <List.Item.Meta
                avatar={<BankOutlined style={{ fontSize: '3em' }} />}
                title={account.name}
                description={account.type}
              />
              <div>{account.balance}</div>
            </List.Item>
          )}
          style={{ border: 'solid', paddingLeft: '10px', paddingRight: '20px' }}
        />
      </div>
    </div>
  );
};
