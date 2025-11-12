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

export const IncomeForm: React.FC<Props> = ({ form, onClose, onSubmit }) => {
  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
      type: TransactionTypeEnum.INCOME,
      category: TransactionCategoryEnum.NONE,
    });
  };

  return (
    <Form
      name="CreateIncomeTransaction"
      style={{ maxWidth: 500 }}
      onFinish={handleFinish}
      form={form}
      layout="vertical"
    >
      <h3>Add New Income</h3>
      <Form.Item
        label="Name/Source"
        name="name"
        rules={[{ required: true, message: 'Please enter a name or source' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Amount"
        name="amount"
        rules={[{ required: true, message: 'Please enter the income amount' }]}
      >
        <InputNumber style={{ width: '100%' }} min={0} precision={2} />
      </Form.Item>

      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="Frequency" name="frequency">
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
          Submit Income
        </Button>
      </Form.Item>
    </Form>
  );
};
