import { Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { toast } from "react-toastify";

const SellerForm = ({ onFinish, initialValues = {}, loading }) => {
  const [form] = Form.useForm();
  const isUpdate = !!initialValues?.id;

  useEffect(() => {
    form.resetFields();

    if (initialValues?.qrCodeUrl) {
      form.setFieldsValue({
        qrCodeFile: [
          {
            uid: "-1",
            name: "qr-code.jpg",
            status: "done",
            url: initialValues.qrCodeUrl,
          },
        ],
      });
    }
  }, [initialValues, form]);

  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("email", values.email);

    if (!isUpdate) {
      formData.append("password", values.password);
    }

    const fileObj = values.qrCodeFile?.[0];
    if (fileObj?.originFileObj) {
      formData.append("qrCodeFile", fileObj.originFileObj);
    }

    try {
      await onFinish(formData);
      toast.success(isUpdate ? "Cập nhật người bán thành công!" : "Tạo người bán mới thành công!");
      form.resetFields();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        fullName: initialValues?.fullName || "",
        phoneNumber: initialValues?.phoneNumber || "",
        email: initialValues?.email || "",
      }}
      onFinish={handleFormSubmit}
    >
      <Form.Item
        name="fullName"
        label="Họ và tên"
        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
      >
        <Input placeholder="Nguyễn Văn A" />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="Số điện thoại"
        rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
      >
        <Input placeholder="0123456789" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, type: "email", message: "Email không hợp lệ" }]}
      >
        <Input placeholder="example@email.com" />
      </Form.Item>

      {!isUpdate && (
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password placeholder="********" />
        </Form.Item>
      )}

      <Form.Item name="qrCodeFile" label="Hình ảnh mã QR">
        <Upload
          listType="picture-card"
          maxCount={1}
          beforeUpload={() => false}
          onChange={(info) => {
            const { fileList } = info;
            if (fileList.length > 1) fileList.shift();

            const updatedList = fileList.map((file) => ({
              ...file,
              url: file.originFileObj ? URL.createObjectURL(file.originFileObj) : file.url,
            }));

            form.setFieldsValue({
              qrCodeFile: updatedList,
            });
          }}
        >
          <Button icon={<UploadOutlined />}>Chọn tệp</Button>
        </Upload>
        <small style={{ color: "#aaa" }}>(Không bắt buộc)</small>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {isUpdate ? "Cập nhật" : "Tạo mới"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SellerForm;
