import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../configs/apiConfig';
import { useEffect } from 'react';
import { toast } from 'react-toastify'; // dùng toast thay message

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/admin/dashboard');
  }, []);

  const onFinish = async (values) => {
    const { username, password } = values;
    try {
      const res = await axios.post(API_ENDPOINTS.LOGIN, {
        email: username,
        password,
      });

      if (res.data.errCode === 0) {
        const { token, seller } = res.data.data;
        login(seller, token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        toast.success('Đăng nhập thành công!');
        navigate('/admin/dashboard');
      } else {
        toast.error(res.data.errMessage || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Lỗi server hoặc thông tin không đúng.');
    }
  };

  return (
    <>
      <style>{`
  .custom-placeholder input::placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
    opacity: 1;
  }

  input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  border: none !important;
  -webkit-box-shadow: 0 0 0px 1000px #1f1f1f inset !important;
  -webkit-text-fill-color: #f0c040 !important;
  transition: background-color 9999s ease-in-out 0s;
  caret-color: #f0c040 !important;
  outline: none !important;
}
`}</style>
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: '#2c2c2c',
            padding: 32,
            borderRadius: 12,
            boxShadow: '0 0 10px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <img src="/logo.png" alt="Logo" style={{ height: 60, marginBottom: 12 }} />
            <h2 style={{ color: '#f0c040', marginBottom: 0 }}>Quản trị viên</h2>
          </div>

          <Form
            name="login-form"
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ autoLogin: true }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="Email"
                className="custom-placeholder"
                style={{
                  backgroundColor: '#1f1f1f',
                  color: '#f0c040',
                  borderColor: '#444',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                className="custom-placeholder"
                style={{
                  backgroundColor: '#1f1f1f',
                  color: '#f0c040',
                  borderColor: '#444',
                }}
              />
            </Form.Item>

            <Form.Item name="autoLogin" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#f0c040' }}>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>

            <Form.Item style={{ marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{
                  backgroundColor: '#f0c040',
                  borderColor: '#f0c040',
                  color: '#000',
                }}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;