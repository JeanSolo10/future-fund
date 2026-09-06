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
import type { IncomeFormValues } from './form.type';
import {
  disableDatesForSemiMonthlyTransaction,
  handleFormFrequencyChange,
} from '../../transactionHelper';

type Props = {
  form: FormInstance<IncomeFormValues>;
  onSubmit: (values: any) => void;
  onDelete?: () => void;
};

export const IncomeForm: React.FC<Props> = ({ form, onSubmit, onDelete }) => {
  const selectedFrequency = Form.useWatch('frequency', form);
  const selectedStartDate = Form.useWatch('startDate', form);

  const isFrequencySelected = !!selectedFrequency;
  const isSemiMonthlyTransaction =
    selectedFrequency === TransactionFrequencyEnum.SEMI_MONTHLY;

  const handleFinish = (values: IncomeFormValues) => {
    onSubmit({
      ...values,
      type: TransactionTypeEnum.INCOME,
      category: TransactionCategoryEnum.NONE,
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Form
      name="CreateIncomeTransaction"
      style={{ maxWidth: 500 }}
      onFinish={handleFinish}
      form={form}
      layout="vertical"
      requiredMark="optional"
    >
      <Form.Item
        label="Name/Source"
        name="name"
        rules={[{ required: true, message: FIELD_REQUIRED_TEXT }]}
      >
        <Input placeholder="paycheck" />
      </Form.Item>

      <Form.Item
        label="Amount"
        name="amount"
        rules={[{ required: true, message: FIELD_REQUIRED_TEXT }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          precision={2}
          placeholder="1000"
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
          onChange={(value) => handleFormFrequencyChange(value, form)}
        />
      </Form.Item>

      <Form.Item
        label="Start Date"
        name="startDate"
        rules={[{ required: true, message: FIELD_REQUIRED_TEXT }]}
        extra={
          isSemiMonthlyTransaction
            ? '*semi monthly transactions can only start on the 1st or 15th of the month'
            : undefined
        }
      >
        <LuxonDatePicker
          style={{ width: '100%' }}
          disabled={!isFrequencySelected}
          disabledDate={
            isSemiMonthlyTransaction
              ? disableDatesForSemiMonthlyTransaction
              : undefined
          }
        />
      </Form.Item>

      <Form.Item
        label="End Date"
        name="endDate"
        rules={[{ required: false, message: FIELD_REQUIRED_TEXT }]}
      >
        <LuxonDatePicker
          style={{ width: '100%' }}
          disabled={!isFrequencySelected || !selectedStartDate}
          minDate={selectedStartDate}
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
