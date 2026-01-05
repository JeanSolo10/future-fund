import { Button, Form, Input, InputNumber, Select } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import {
  TransactionCategoryEnum,
  TransactionFrequencyEnum,
  TransactionTypeEnum,
} from '../../../../object-types/transaction/transaction.enums';
import { FIELD_REQUIRED_TEXT } from '../../../../common/constant';
import { LuxonDatePicker } from '../../../../components';

type Props = {
  form: FormInstance;
  onClose: () => void;
  onSubmit: (values: any) => void;
};

export const ExpenseForm: React.FC<Props> = ({ form, onClose, onSubmit }) => {
  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
      type: TransactionTypeEnum.EXPENSE,
    });
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
          options={Object.values(TransactionCategoryEnum).map((value) => ({
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
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Submit Expense
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};
