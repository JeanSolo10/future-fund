import { useLazyQuery, useMutation } from '@apollo/client/react';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_FINANCIAL_ACCOUNT } from '../../../queries/GetFinancialAccount';
import { useEffect, useState } from 'react';
import Decimal from 'decimal.js';
import { Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { EditFinancialAccountModal } from './components/EditFinancialAccountModal';
import type { FinancialAccountUpdateInput } from '../../../object-types/financial-account/financial-account.type';
import { UPDATE_FINANCIAL_ACCOUNT } from '../../../mutations/UpdateFinancialAccount';
import { DELETE_FINANCIAL_ACCOUNT } from '../../../mutations/DeleteFinancialAccount';

import './FinancialAccount.css';

export const FinancialAccountDetails: React.FC = () => {
  const { financialAccountId } = useParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  // queries
  const [getFinancialAccount, { data: financialAccountData }] = useLazyQuery(
    GET_FINANCIAL_ACCOUNT,
  );

  // mutations
  const [
    updateFinancialAccountMutation,
    { loading: updatingFinancialAccount },
  ] = useMutation(UPDATE_FINANCIAL_ACCOUNT, {
    refetchQueries: [GET_FINANCIAL_ACCOUNT],
  });

  const [deleteFinancialAccount, { loading: deletingFinancialAccount }] =
    useMutation(DELETE_FINANCIAL_ACCOUNT);

  // handlers
  const fetchAccount = async (financialAccountId: string) => {
    await getFinancialAccount({
      variables: {
        where: {
          id: financialAccountId,
        },
      },
    });
  };

  const handleUpdateAccount = async (values: FinancialAccountUpdateInput) => {
    if (!financialAccount?.id) {
      return;
    }

    await updateFinancialAccountMutation({
      variables: {
        where: { id: financialAccount?.id },
        data: { ...values },
      },
    });

    message.success('Account updated successfully');
    setIsEditModalOpen(false);
  };

  const handleDeleteFinancialAccount = async () => {
    if (!financialAccount?.id) {
      return;
    }

    await deleteFinancialAccount({
      variables: {
        where: { id: financialAccount?.id },
      },
    });

    message.success('Account deleted');
    setIsEditModalOpen(false);
    navigate('/');
  };

  const handleBackClick = () => {
    navigate('/');
  };

  useEffect(() => {
    if (financialAccountId && !financialAccount) {
      fetchAccount(financialAccountId);
    }
  }, [financialAccountId]);

  const financialAccount = financialAccountData?.financialAccount;

  return (
    <div className="financial-details-page">
      <nav className="back-btn-container">
        <Button onClick={() => handleBackClick()}>Back</Button>
      </nav>
      <header className="header-content">
        <h2>{financialAccount?.name}</h2>
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => setIsEditModalOpen(true)}
        />
      </header>

      <main className="page-content">
        <h3>Available balance</h3>
        <p>
          {financialAccount?.balance
            ? `${new Decimal(financialAccount?.balance).toDP(2).toString()}$`
            : null}
        </p>
      </main>

      <EditFinancialAccountModal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateAccount}
        onDelete={handleDeleteFinancialAccount}
        initialValues={{ ...financialAccount }}
        loading={updatingFinancialAccount || deletingFinancialAccount}
      />
    </div>
  );
};
