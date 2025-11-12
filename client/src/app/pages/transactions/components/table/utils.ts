import type { TableProps } from 'antd';
import type { EditableColumnType } from '../../types';

export const prepareEditableColumns = <T extends { key: React.Key }>(
  columns: EditableColumnType<T>[],
  isEditing: (record: T) => boolean,
): TableProps<T>['columns'] => {
  return columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    type InputType = 'number' | 'date' | 'select' | 'text';

    let inputType: InputType = 'text';
    const dataIndex = col.dataIndex;
    const title = col.title;

    if (dataIndex === 'dueDate' || dataIndex === 'startDate') {
      inputType = 'date';
    }

    if (dataIndex === 'category' || dataIndex === 'frequency') {
      inputType = 'select';
    }

    if (dataIndex === 'amount') {
      inputType = 'number';
    }

    return {
      ...col,
      onCell: (record: T) =>
        ({
          record,
          inputType,
          dataIndex,
          cellTitle: title,
          editing: isEditing(record),
        }) as any,
    };
  });
};
