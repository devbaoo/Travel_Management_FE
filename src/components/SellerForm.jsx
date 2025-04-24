import { Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";

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

  const handleFormSubmit = (values) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("email", values.email);

    if (!isUpdate) {
      formData.append("password", values.password); // only on create
    }

    const fileObj = values.qrCodeFile?.[0];
    if (fileObj?.originFileObj) {
      formData.append("qrCodeFile", fileObj.originFileObj); // Only if selected
    }

    onFinish(formData);
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
        label="Full Name"
        rules={[{ required: true, message: "Please enter full name" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="Phone"
        rules={[{ required: true, message: "Please enter phone number" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, type: "email", message: "Invalid email" }]}
      >
        <Input />
      </Form.Item>

      {!isUpdate && (
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter password" }]}
        >
          <Input.Password />
        </Form.Item>
      )}

      <Form.Item name="qrCodeFile" label="QR Code Image">
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
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <small style={{ color: "#aaa" }}>(Không bắt buộc)</small>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SellerForm;