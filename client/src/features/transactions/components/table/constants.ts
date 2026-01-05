import type { TableColumnProps } from 'antd';

export const expenseDataColumns: TableColumnProps[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
  { title: 'Amount', dataIndex: 'amount', key: 'amount' },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    render: (isoString: string | null) => {
      if (!isoString) return null;
      return new Date(isoString).toLocaleDateString('en-us', {
        month: 'long',
        day: 'numeric',
      });
    },
  },
  {
    title: 'Frequency',
    dataIndex: 'frequency',
    key: 'frequency',
  },
];

export const incomeDataColumns: TableColumnProps[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Amount', dataIndex: 'amount', key: 'amount' },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
    render: (isoString: string | null) => {
      if (!isoString) return null;
      return new Date(isoString).toLocaleDateString('en-us', {
        month: 'long',
        day: 'numeric',
      });
    },
  },
  {
    title: 'Frequency',
    dataIndex: 'frequency',
    key: 'frequency',
  },
];
