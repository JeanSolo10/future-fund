import {
  Dropdown,
  Form,
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
  total: string | number | undefined;
  dataSource: T[];
  dataColumns: TableColumnProps[];
  onSave: () => Promise<void>;
  onEdit: () => Promise<void>;
  onDelete: (key: string) => void;
  setSelectedRecord: React.Dispatch<React.SetStateAction<Partial<RowDataType>>>;
}

export const TransactionTable = <T extends RowDataType>({
  title,
  total,
  dataSource,
  dataColumns,
  onSave,
  onEdit,
  onDelete,
  setSelectedRecord,
}: TransactionTableProps<T>) => {
  const [form] = Form.useForm();

  const handleEdit = async () => {
    await onEdit();
    // setIsEditing(false);
  };

  const handleCancel = () => {};

  const handleSave = async () => {
    await onSave();
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
        <div style={{ color: 'red' }}>
          <DeleteOutlined style={{ marginRight: '8px' }} />
          <span>Delete</span>
        </div>
      ),
      onClick: () => console.log('delete'),
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
        title={() => (
          <div style={{ lineHeight: '14px' }}>
            <h3>
              {title}
              <p
                style={{ fontSize: '0.875rem', color: '#666666' }}
              >{`total: ${total ?? 'n/a'}`}</p>
            </h3>
          </div>
        )}
        dataSource={dataSource}
        columns={allColumns}
        rowClassName="editable-row"
        size="small"
        pagination={{ onChange: handleCancel, defaultPageSize: 20 }}
        scroll={{ x: 'max-content' }}
      />
    </Form>
  );
};
