import { Modal, Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../configs/apiConfig";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Sử dụng toast

const UpdateProfile = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber ? String(user.phoneNumber) : "",
        qrCodeFile: user.qrCodeUrl
          ? [
              {
                uid: "-1",
                name: "qr-code.jpg",
                status: "done",
                url: user.qrCodeUrl,
              },
            ]
          : [],
      });
    }
  }, [visible, user]);

  const handleUpdateProfile = async (values) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("email", values.email);

    const fileObj = values.qrCodeFile?.[0];
    if (fileObj?.originFileObj) {
      formData.append("qrCodeFile", fileObj.originFileObj);
    }

    try {
      setLoading(true);
      const res = await axios.put(API_ENDPOINTS.UPDATE_SELLER(user.id), formData);

      if (res.data.errCode === 0) {
        toast.success("Cập nhật thành công, vui lòng đăng nhập lại");

        setTimeout(() => {
          logout();
          navigate("/login");
        }, 1500);
      } else {
        toast.error(res.data.errMessage || "Cập nhật thất bại");
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi khi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Cập nhật thông tin cá nhân"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form
        key={user?.id || "profile-form"}
        form={form}
        layout="vertical"
        onFinish={handleUpdateProfile}
      >
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item name="qrCodeFile" label="Ảnh mã QR">
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
            onChange={(info) => {
              const fileList = info.fileList.slice(-1);
              const updatedList = fileList.map((file) => ({
                ...file,
                url: file.originFileObj
                  ? URL.createObjectURL(file.originFileObj)
                  : file.url,
              }));
              form.setFieldsValue({ qrCodeFile: updatedList });
            }}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          <small style={{ color: "#aaa" }}>(Không bắt buộc)</small>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateProfile;