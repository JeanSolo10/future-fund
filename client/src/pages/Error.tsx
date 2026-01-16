import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  title?: string;
  subTitle?: string;
  showHomeButton?: boolean;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  title = 'Something Went Wrong',
  subTitle = 'We encountered an unexpected error. Please try again.',
  showHomeButton = true,
}) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Result
        status="error"
        title={title}
        subTitle={subTitle}
        extra={
          showHomeButton && (
            <Button type="primary" onClick={() => navigate('/')}>
              Go to Home
            </Button>
          )
        }
      />
    </div>
  );
};
