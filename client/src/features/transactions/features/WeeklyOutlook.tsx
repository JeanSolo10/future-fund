import { useState } from 'react';
import { skipToken, useQuery } from '@apollo/client/react';
import { Alert, Checkbox, Segmented, Spin } from 'antd';
import Decimal from 'decimal.js';
import { GET_FINANCIAL_ACCOUNTS } from '../../../graphql/queries/GetFinancialAccounts';
import { GET_WEEKLY_OUTLOOK } from '../../../graphql/queries/GetWeeklyOutlook';
import { useUserContext } from '../../../context/UserContext';
import {
  getToday,
  parseCalendarDate,
  toCalendarDate,
  type CalendarDate,
} from '../../../common/date';
import {
  AccountTypeEnum,
  type FinancialAccountObjectType,
} from '../../../object-types/financial-account/financial-account.type';
import { TransactionTypeEnum } from '../../../object-types/transaction/transaction.enums';
import type {
  AlreadyInBalanceInput,
  CalendarTransactionObjectType,
  OutlookWeekObjectType,
  WeeklyOutlookObjectType,
} from '../../../object-types/transaction/transaction.type';
import '../../../styles/Transaction.css';

type Props = {
  budgetId: string;
};

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const formatMoney = (amount: string): string =>
  usdFormatter.format(Number(amount));

const toOccurrenceKey = (transactionId: string, date: CalendarDate): string =>
  `${transactionId}:${date}`;

const getWeekLabel = (week: OutlookWeekObjectType): string => {
  const start = parseCalendarDate(week.startDate);
  const end = parseCalendarDate(week.endDate);
  const endFormat = start.hasSame(end, 'month') ? 'd' : 'LLL d';

  return `${start.toFormat('LLL d', { locale: 'en-US' })} to ${end.toFormat(endFormat, { locale: 'en-US' })}`;
};

export const WeeklyOutlook: React.FC<Props> = ({ budgetId }) => {
  const { user } = useUserContext();
  const [checkedAccountIds, setCheckedAccountIds] = useState<string[]>([]);
  const [alreadyInBalance, setAlreadyInBalance] = useState<
    AlreadyInBalanceInput[]
  >([]);
  const [weekCount, setWeekCount] = useState(4);

  const { data: financialAccountsData } = useQuery(
    GET_FINANCIAL_ACCOUNTS,
    user?.id ? { variables: { where: { userId: user.id } } } : skipToken,
  );

  const {
    data: weeklyOutlookData,
    previousData: previousWeeklyOutlookData,
    error,
  } = useQuery(
    GET_WEEKLY_OUTLOOK,
    checkedAccountIds.length > 0
      ? {
          variables: {
            budgetId,
            today: toCalendarDate(getToday()),
            financialAccountIds: checkedAccountIds,
            alreadyInBalance,
            weeks: weekCount,
          },
          fetchPolicy: 'cache-and-network',
        }
      : skipToken,
  );

  const accounts = financialAccountsData?.financialFinancialAccounts ?? [];
  const outlook = (weeklyOutlookData ?? previousWeeklyOutlookData)
    ?.weeklyOutlook;
  const alreadyInBalanceKeys = new Set(
    alreadyInBalance.map((entry) =>
      toOccurrenceKey(entry.transactionId, entry.date),
    ),
  );

  const handleAccountChange = (accountId: string, isChecked: boolean) => {
    setCheckedAccountIds((accountIds) =>
      isChecked
        ? [...accountIds, accountId]
        : accountIds.filter((id) => id !== accountId),
    );
  };

  const handleAlreadyInBalanceChange = (
    transaction: CalendarTransactionObjectType,
    isChecked: boolean,
  ) => {
    setAlreadyInBalance((entries) =>
      isChecked
        ? [
            ...entries,
            {
              transactionId: transaction.transactionId,
              date: transaction.date,
            },
          ]
        : entries.filter(
            (entry) =>
              entry.transactionId !== transaction.transactionId ||
              entry.date !== transaction.date,
          ),
    );
  };

  const renderAccount = (account: FinancialAccountObjectType) => {
    const isCreditCard = account.type === AccountTypeEnum.CREDIT_CARD;

    return (
      <div key={account.id} className="weekly-outlook-row">
        <Checkbox
          disabled={account.balance === null}
          checked={checkedAccountIds.includes(account.id)}
          onChange={(event) =>
            handleAccountChange(account.id, event.target.checked)
          }
        >
          {account.name}
        </Checkbox>
        {account.balance === null ? (
          <span className="weekly-outlook-muted">
            Add a balance to use this account
          </span>
        ) : (
          <span className="weekly-outlook-amount">
            {formatMoney(account.balance)}
            {isCreditCard ? ' owed' : ''}
          </span>
        )}
      </div>
    );
  };

  const renderTransaction = (transaction: CalendarTransactionObjectType) => {
    const isIncome = transaction.type === TransactionTypeEnum.INCOME;
    const key = toOccurrenceKey(transaction.transactionId, transaction.date);
    const isAlreadyInBalance = alreadyInBalanceKeys.has(key);

    return (
      <div
        key={key}
        className={`weekly-outlook-transaction ${isAlreadyInBalance ? 'already-in-balance' : ''}`}
      >
        <span className="weekly-outlook-muted">
          {parseCalendarDate(transaction.date).toFormat('ccc d', {
            locale: 'en-US',
          })}
        </span>
        <span className="weekly-outlook-name">{transaction.name}</span>
        <span
          className={`weekly-outlook-amount ${isIncome ? 'income' : 'expense'}`}
        >
          {isIncome ? '+' : '-'}
          {formatMoney(transaction.amount)}
        </span>
        <Checkbox
          aria-label={`${transaction.name} is already in my balance`}
          title="Already in my balance"
          checked={isAlreadyInBalance}
          onChange={(event) =>
            handleAlreadyInBalanceChange(transaction, event.target.checked)
          }
        />
      </div>
    );
  };

  const renderWeek = (
    week: OutlookWeekObjectType,
    weekIndex: number,
    weeklyOutlook: WeeklyOutlookObjectType,
  ) => {
    const startsAt =
      weekIndex === 0
        ? weeklyOutlook.startingBalance
        : weeklyOutlook.weeks[weekIndex - 1].balanceRemaining;
    const isNegative = new Decimal(week.balanceRemaining).isNegative();

    return (
      <section
        key={week.startDate}
        className="weekly-outlook-section weekly-outlook-week"
      >
        <h4>{getWeekLabel(week)}</h4>
        <div className="weekly-outlook-row weekly-outlook-muted">
          <span>Starts at</span>
          <span className="weekly-outlook-amount">{formatMoney(startsAt)}</span>
        </div>
        {week.transactions.length === 0 ? (
          <span className="weekly-outlook-muted">
            No transactions this week
          </span>
        ) : (
          week.transactions.map(renderTransaction)
        )}
        <div className="weekly-outlook-row weekly-outlook-remaining">
          <strong>Remaining</strong>
          <strong
            className={`weekly-outlook-amount ${isNegative ? 'negative' : ''}`}
          >
            {formatMoney(week.balanceRemaining)}
          </strong>
        </div>
      </section>
    );
  };

  const renderWeeks = () => {
    if (checkedAccountIds.length === 0) {
      return (
        <p className="weekly-outlook-muted">
          Check an account to see the next {weekCount} weeks.
        </p>
      );
    }

    if (error) {
      return <Alert type="error" message={error.message} />;
    }

    if (!outlook) {
      return <Spin />;
    }

    return (
      <>
        <div className="weekly-outlook-row weekly-outlook-starting-balance">
          <strong>Starting balance</strong>
          <strong className="weekly-outlook-amount">
            {formatMoney(outlook.startingBalance)}
          </strong>
        </div>
        <p className="weekly-outlook-muted">
          Check a transaction once it's already in your balance, so it isn't
          counted twice.
        </p>
        {outlook.weeks.map((week, weekIndex) =>
          renderWeek(week, weekIndex, outlook),
        )}
      </>
    );
  };

  return (
    <div className="weekly-outlook">
      <section className="weekly-outlook-section">
        <h4>Accounts</h4>
        {accounts.length === 0 ? (
          <span className="weekly-outlook-muted">
            Add an account on the home page to use the outlook.
          </span>
        ) : (
          accounts.map(renderAccount)
        )}
      </section>
      <Segmented
        block
        options={[
          { label: '4 weeks', value: 4 },
          { label: '8 weeks', value: 8 },
        ]}
        value={weekCount}
        onChange={setWeekCount}
      />
      {renderWeeks()}
    </div>
  );
};
