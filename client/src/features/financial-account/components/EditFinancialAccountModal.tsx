import {
  Modal,
  Form,
  Input,
  Button,
  Popconfirm,
  InputNumber,
  Select,
} from 'antd';
import type React from 'react';
import { useEffect } from 'react';
import {
  AccountTypeEnum,
  type FinancialAccountObjectType,
} from '../../../object-types/financial-account/financial-account.type';
import { FIELD_REQUIRED_TEXT } from '../../../common/constant';

type Props = {
  open: boolean;
  onCancel: () => void;
  onUpdate: (values: { name: string }) => void;
  onDelete: () => void;
  initialValues?: Partial<FinancialAccountObjectType>;
  loading?: boolean;
};

export const EditFinancialAccountModal: React.FC<Props> = ({
  open,
  onCancel,
  onUpdate,
  onDelete,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      open={open}
      title="Edit Account"
      onCancel={onCancel}
      footer={false}
      destroyOnHidden
      centered={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onUpdate}
        initialValues={initialValues}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: FIELD_REQUIRED_TEXT }]}
        >
          <Input placeholder="My Bank" />
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: FIELD_REQUIRED_TEXT }]}
        >
          <Select
            options={Object.values(AccountTypeEnum).map((value) => ({
              label: value,
              value,
            }))}
            placeholder="Select a type"
          />
        </Form.Item>
        <Form.Item
          label="Balance"
          name="balance"
          rules={[{ required: true, message: FIELD_REQUIRED_TEXT }]}
        >
          <InputNumber
            precision={2}
            style={{ width: '100%' }}
            placeholder="1000"
          />
        </Form.Item>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="modal-save-button"
          >
            Save Changes
          </Button>
          <Popconfirm
            title="Delete this account?"
            description="This action cannot be undone."
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger disabled={loading}>
              Delete Account
            </Button>
          </Popconfirm>
        </div>
      </Form>
    </Modal>
  );
};
