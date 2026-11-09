import {
  AccountTypeEnum,
  type AccountType,
} from '../../object-types/financial-account/financial-account.type';

type BalanceFieldText = {
  label: string;
  extra?: string;
};

export const getBalanceFieldText = (
  accountType: AccountType | undefined,
): BalanceFieldText => {
  if (accountType === AccountTypeEnum.CREDIT_CARD) {
    return {
      label: 'Amount owed',
      extra:
        'Enter what you owe as a positive number. Use a negative number if the card owes you money.',
    };
  }

  return { label: 'Balance' };
};
