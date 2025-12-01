import { Modal, Form, Input, type FormInstance, Button } from 'antd';
import type React from 'react';
import { FIELD_REQUIRED_TEXT } from '../../../../common/constant';

type Props = {
  openForm: boolean;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance;
  onFormSubmit: () => void;
};

export const CreateBudgetFormModal: React.FC<Props> = ({
  openForm = false,
  setOpenForm,
  form,
  onFormSubmit,
}) => {
  return (
    <Modal
      open={openForm}
      title="Add Budget"
      onCancel={() => setOpenForm(false)}
      destroyOnHidden
      footer={false}
    >
      <Form
        title="Account"
        form={form}
        layout="vertical"
        onFinish={onFormSubmit}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: FIELD_REQUIRED_TEXT }]}
        >
          <Input placeholder="My monthly budget" />
        </Form.Item>

        <Form.Item>
          <div
            style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
          >
            <Button type="default" onClick={() => setOpenForm(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
