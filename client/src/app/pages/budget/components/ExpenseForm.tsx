import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import {
  TransactionCategoryEnum,
  TransactionFrequencyEnum,
  TransactionTypeEnum,
} from '../../../../objects/transaction/transaction.enums';

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
      <h3>Add New Expense</h3>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please enter a name' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Amount"
        name="amount"
        rules={[{ required: true, message: 'Please enter the amount' }]}
      >
        <InputNumber style={{ width: '100%' }} precision={2} />
      </Form.Item>

      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true, message: 'Please select a category' }]}
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
        rules={[{ required: true, message: 'Please select a frequency' }]}
      >
        <Select
          options={Object.values(TransactionFrequencyEnum).map((value) => ({
            label: value,
            value,
          }))}
        />
      </Form.Item>

      <Form.Item
        style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
      >
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          Submit Expense
        </Button>
      </Form.Item>
    </Form>
  );
};
