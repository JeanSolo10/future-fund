import { Button, Form, Input, InputNumber, Select } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import {
  TransactionCategoryEnum,
  TransactionFrequencyEnum,
  TransactionTypeEnum,
} from '../../../../object-types/transaction/transaction.enums';
import { FIELD_REQUIRED_TEXT } from '../../../../common/constant';
import { LuxonDatePicker } from '../../../../components';
import { DeleteOutlined } from '@ant-design/icons';

type Props = {
  form: FormInstance;
  onSubmit: (values: any) => void;
  onDelete?: () => void;
};

export const ExpenseForm: React.FC<Props> = ({ form, onSubmit, onDelete }) => {
  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
      type: TransactionTypeEnum.EXPENSE,
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Form
      name="CreateExpenseTransaction"
      style={{ maxWidth: 500 }}
      onFinish={handleFinish}
      form={form}
      layout="vertical"
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: FIELD_REQUIRED_TEXT }]}
      >
        <Input placeholder="groceries" />
      </Form.Item>

      <Form.Item
        label="Amount"
        name="amount"
        rules={[{ required: true, message: FIELD_REQUIRED_TEXT }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          precision={2}
          placeholder="100"
        />
      </Form.Item>

      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: FIELD_REQUIRED_TEXT }]}
      >
        <LuxonDatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true, message: FIELD_REQUIRED_TEXT }]}
      >
        <Select
          placeholder="Select a category"
          options={Object.values(TransactionCategoryEnum)
            .filter((value) => value !== TransactionCategoryEnum.NONE)
            .map((value) => ({
              label: value,
              value,
            }))}
        />
      </Form.Item>

      <Form.Item
        label="Frequency"
        name="frequency"
        rules={[{ required: true, message: FIELD_REQUIRED_TEXT }]}
      >
        <Select
          placeholder="Select a frequency"
          options={Object.values(TransactionFrequencyEnum).map((value) => ({
            label: value,
            value,
          }))}
        />
      </Form.Item>

      <Form.Item>
        <div
          style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
        >
          {onDelete && (
            <Button onClick={handleDelete} icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            className="modal-save-button"
          >
            Save
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};
