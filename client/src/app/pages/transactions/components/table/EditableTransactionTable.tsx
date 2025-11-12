import { useState } from 'react';
import { Form, Table } from 'antd';
import type {
  EditableColumnType,
  ExpenseRowDataType,
  IncomeRowDataType,
} from '../../types';
import { prepareEditableColumns } from './utils';
import { EditableCellComponent } from '../../../../components/editable-cell/EditableCell';
import { SaveOrCancelButtons } from './SaveOrCancelButtons';
import { EditOrDeleteButtons } from './EditOrDeleteButtons';
import { DateTime } from 'luxon';

type RowDataType = ExpenseRowDataType | IncomeRowDataType;

interface EditableTransactionTableProps<T extends RowDataType> {
  title: string;
  total: string | number | undefined;
  dataSource: T[];
  dataColumns: EditableColumnType<T>[];
  onSave: (key: string, row: T) => Promise<void>;
  onDelete: (key: string) => void;
  onSetEditing: (isEditing: boolean) => void;
  isAnyRowEditing: boolean;
}

export const EditableTransactionTable = <T extends RowDataType>({
  title,
  total,
  dataSource,
  dataColumns,
  onSave,
  onDelete,
  onSetEditing,
  isAnyRowEditing,
}: EditableTransactionTableProps<T>) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const isEditingRow = (row: T): boolean => row.key === editingKey;

  const handleEdit = (row: T) => {
    const recordToEdit = dataSource.find((item) => item.key === row.key);
    if (!recordToEdit) return;

    // We must convert dates back to Luxon objects for the DatePicker
    const formValues = {
      ...recordToEdit,
      dueDate: (recordToEdit as ExpenseRowDataType).dueDate
        ? DateTime.fromISO((recordToEdit as ExpenseRowDataType).dueDate!)
        : undefined,
      startDate: (recordToEdit as IncomeRowDataType).startDate
        ? DateTime.fromISO((recordToEdit as IncomeRowDataType).startDate!)
        : undefined,
    };

    form.setFieldsValue(formValues);
    setEditingKey(row.key);
    onSetEditing(true);
  };

  const handleCancel = () => {
    setEditingKey('');
    onSetEditing(false);
  };

  const handleSave = async (key: string) => {
    const row = (await form.validateFields()) as T;
    await onSave(key, row);
    setEditingKey('');
    onSetEditing(false);
  };

  const actionColumn: EditableColumnType<T> = {
    title: 'Action',
    dataIndex: 'action',
    editable: false,
    render: (_: any, record: T) => {
      const isEditing = isEditingRow(record);
      return isEditing ? (
        <SaveOrCancelButtons
          onSave={() => handleSave(record.key)}
          onCancel={handleCancel}
        />
      ) : (
        <EditOrDeleteButtons
          isAnyRowEditing={isAnyRowEditing}
          onEdit={() => handleEdit(record)}
          onDelete={() => onDelete(record.key)}
        />
      );
    },
  };

  const preparedDataColumns = prepareEditableColumns(dataColumns, isEditingRow);
  const allColumns = [...(preparedDataColumns || []), actionColumn];

  return (
    <Form form={form} component={false}>
      <Table
        title={() => (
          <h3>
            {title}
            <p style={{ fontSize: '14px' }}>{`(total: ${total})`}</p>
          </h3>
        )}
        components={{
          body: { cell: EditableCellComponent },
        }}
        dataSource={dataSource}
        columns={allColumns}
        rowClassName="editable-row"
        size="small"
        pagination={{ onChange: handleCancel, defaultPageSize: 20 }}
      />
    </Form>
  );
};
