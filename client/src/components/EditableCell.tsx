import { Form, Input, InputNumber, Select } from 'antd';
import { LuxonDatePicker } from '.';
import type { EditableCellInputType } from '../pages/transactions/types';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  cellTitle: React.ReactNode;
  inputType: EditableCellInputType;
}

export const EditableCellComponent: React.FC<
  React.PropsWithChildren<EditableCellProps>
> = ({ editing, dataIndex, cellTitle, inputType, children, ...restProps }) => {
  let inputNode: React.ReactElement;

  switch (inputType) {
    case 'number':
      inputNode = <InputNumber />;
      break;
    case 'date':
      inputNode = <LuxonDatePicker />;
      break;
    case 'select':
      inputNode = <Select />;
      break;
    default:
      inputNode = <Input />;
      break;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${cellTitle}` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
