import { Modal, Form, Input, Button, Popconfirm } from 'antd';
import type React from 'react';
import { useEffect } from 'react';
import type { BudgetObjectType } from '../../../object-types/budget/budget.type';
import { FIELD_REQUIRED_TEXT } from '../../../common/constant';

type Props = {
  open: boolean;
  onCancel: () => void;
  onUpdate: (values: { name: string }) => void;
  onDelete: () => void;
  initialValues?: Partial<BudgetObjectType>;
  loading?: boolean;
};

export const EditBudgetModal: React.FC<Props> = ({
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
      title="Edit Budget"
      onCancel={onCancel}
      footer={false}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onUpdate}
        initialValues={initialValues}
      >
        <Form.Item
          label="Budget Name"
          name="name"
          rules={[{ required: true, message: FIELD_REQUIRED_TEXT }]}
        >
          <Input placeholder="My budget" />
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
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </Button>
          <Popconfirm
            title="Delete this budget?"
            description="This action cannot be undone."
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger disabled={loading}>
              Delete Budget
            </Button>
          </Popconfirm>
        </div>
      </Form>
    </Modal>
  );
};
