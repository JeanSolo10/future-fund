import { useMutation } from '@apollo/client/react';
import { Button, Form, Input, message } from 'antd';
import { CREATE_USER } from '../graphql/mutations/CreateUser';
import { GET_CURRENT_USER } from '../graphql/queries/GetCurrentUser';
import { APP_NAME } from '../common/enum';
import { FIELD_REQUIRED_TEXT } from '../common/constant';
import '../styles/CreateProfile.css';

type CreateProfileFormValues = {
  name: string;
  budgetName: string;
};

export const CreateProfile: React.FC = () => {
  const [form] = Form.useForm<CreateProfileFormValues>();

  const [createUser, { loading }] = useMutation(CREATE_USER, {
    refetchQueries: [GET_CURRENT_USER],
    awaitRefetchQueries: true,
  });

  const handleSubmit = async (values: CreateProfileFormValues) => {
    try {
      await createUser({
        variables: {
          data: { name: values.name, budget: { name: values.budgetName } },
        },
      });
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : 'Your profile was not created',
      );
    }
  };

  return (
    <div className="create-profile-page">
      <div className="create-profile-content">
        <h1>Welcome to {APP_NAME}</h1>
        <p>Create your profile to start planning your budget.</p>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ budgetName: 'Monthly Budget' }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Your name"
            name="name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: FIELD_REQUIRED_TEXT,
              },
            ]}
          >
            <Input placeholder="Alex" autoFocus />
          </Form.Item>
          <Form.Item
            label="Budget name"
            name="budgetName"
            rules={[
              {
                required: true,
                whitespace: true,
                message: FIELD_REQUIRED_TEXT,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="create-profile-button"
          >
            Create profile
          </Button>
        </Form>
      </div>
    </div>
  );
};
