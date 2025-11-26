import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  type FormInstance,
} from 'antd';
import type React from 'react';
import { AccountTypeEnum } from '../../../../object-types/financial-account/financial-account.type';

type Props = {
  openForm: boolean;
  setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance;
  onFormSubmit: () => void;
};

export const CreateAccountFormModal: React.FC<Props> = ({
  openForm = false,
  setOpenForm,
  form,
  onFormSubmit,
}) => {
  return (
    <Modal
      open={openForm}
      title="Add Account"
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
          rules={[{ required: true, message: 'Please enter a name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Please select a type' }]}
        >
          <Select
            options={Object.values(AccountTypeEnum).map((value) => ({
              label: value,
              value,
            }))}
          />
        </Form.Item>
        <Form.Item label="Balance" name="balance">
          <InputNumber precision={2} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button type="default" onClick={() => setOpenForm(false)}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
