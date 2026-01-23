import {
  Dropdown,
  Form,
  Popconfirm,
  Table,
  type MenuProps,
  type TableColumnProps,
} from 'antd';
import type { ExpenseRowDataType, IncomeRowDataType } from '../../types';
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';

type RowDataType = ExpenseRowDataType | IncomeRowDataType;

interface TransactionTableProps<T extends RowDataType> {
  title: string;
  dataSource: T[];
  dataColumns: TableColumnProps[];
  onClickEdit: () => Promise<void>;
  onDelete: () => Promise<void>;
  setSelectedRecord: React.Dispatch<React.SetStateAction<Partial<RowDataType>>>;
}

export const TransactionTable = <T extends RowDataType>({
  title,
  dataSource,
  dataColumns,
  onClickEdit,
  onDelete,
  setSelectedRecord,
}: TransactionTableProps<T>) => {
  const [form] = Form.useForm();

  const handleEdit = async () => {
    await onClickEdit();
  };

  const handleDelete = async () => {
    await onDelete();
  };

  const actionDropDownItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: (
        <div>
          <EditOutlined style={{ marginRight: '8px' }} />
          <span>Edit</span>
        </div>
      ),
      onClick: handleEdit,
    },
    {
      key: 'delete',
      label: (
        <div style={{ color: 'red' }} onClick={(e) => e.stopPropagation()}>
          <Popconfirm
            title="Delete this expense?"
            description="This action cannot be undone."
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
            onConfirm={handleDelete}
          >
            <DeleteOutlined style={{ marginRight: '8px' }} />
            <span>Delete</span>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const actionColumn: TableColumnProps = {
    title: 'Action',
    dataIndex: 'action',
    render: (_, record) => {
      return (
        <Dropdown menu={{ items: actionDropDownItems }}>
          <EllipsisOutlined
            style={{
              fontSize: '2rem',
              backgroundColor: '#efefefff',
              borderRadius: '8px',
              color: '#4f4f4fff',
            }}
            onClick={() => setSelectedRecord(record)}
          />
        </Dropdown>
      );
    },
    fixed: 'right',
    align: 'center',
  };

  const allColumns = [...dataColumns, actionColumn];

  return (
    <Form form={form} component={false}>
      <Table
        title={() => <h3>{title}</h3>}
        dataSource={dataSource}
        columns={allColumns}
        rowClassName="editable-row"
        size="small"
        pagination={{ defaultPageSize: 20 }}
        scroll={{ x: 'max-content' }}
      />
    </Form>
  );
};
