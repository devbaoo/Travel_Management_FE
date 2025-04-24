import { Modal, Form, Input, message } from "antd";
import { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../configs/apiConfig";
import { useAuth } from "../utils/AuthContext";

const ChangePassword = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleChangePassword = () => {
    form
      .validateFields()
      .then(async (values) => {
        const { oldPassword, newPassword } = values;

        setLoading(true);
        try {
          const res = await axios.patch(
            API_ENDPOINTS.CHANGE_PASSWORD(user.id),
            { oldPassword, newPassword }
          );

          if (res.data.errCode === 0) {
            message.success("Đổi mật khẩu thành công");
            form.resetFields();
            onClose();
          } else {
            message.error(res.data.errMessage || "Đổi mật khẩu thất bại");
          }
        } catch (err) {
          console.error("Error changing password:", err);
          message.error("Đã xảy ra lỗi");
        } finally {
          setLoading(false);
        }
      })
      .catch(() => {
        // Form validation failed
      });
  };

  return (
    <Modal
      title="Đổi mật khẩu"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleChangePassword}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" validateTrigger="onBlur">
        <Form.Item
          name="oldPassword"
          label="Mật khẩu hiện tại"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới" },
            { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePassword;