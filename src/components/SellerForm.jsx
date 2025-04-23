import { Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";

const SellerForm = ({ onFinish, initialValues = {}, loading }) => {
  const [form] = Form.useForm();

  // Reset form when initialValues change
  useEffect(() => {
    form.resetFields();

    if (initialValues?.qrCodeUrl) {
      // Set the existing QR code image URL as preview in fileList
      form.setFieldsValue({
        qrCodeFile: [
          {
            uid: "-1",  // Unique UID for the existing file
            name: "qr-code.jpg",  // Can be any name you prefer
            status: "done",  // Mark it as "done" because the file already exists
            url: initialValues.qrCodeUrl,  // Existing URL of the QR code image
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

    // Handle the file selection
    const fileObj = values.qrCodeFile?.[0];
    if (fileObj?.originFileObj) {
      formData.append("qrCodeFile", fileObj.originFileObj); // Append the selected file
    }

    // Call the provided onFinish function with the formData
    onFinish(formData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        fullName: initialValues?.fullName || '',
        phoneNumber: initialValues?.phoneNumber || '',
        email: initialValues?.email || '',
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

      <Form.Item name="qrCodeFile" label="QR Code Image">
        <Upload
          listType="picture-card"
          maxCount={1}  // Limit to 1 file
          beforeUpload={() => false}  // Prevent auto-upload
          onChange={(info) => {
            const { fileList } = info;

            // Only allow one file to be uploaded
            if (fileList.length > 1) {
              fileList.shift();  // Remove any extra file
            }

            // Create a URL for the uploaded file to preview it immediately
            const updatedList = fileList.map(file => ({
              ...file,
              url: file.originFileObj ? URL.createObjectURL(file.originFileObj) : file.url,
            }));

            form.setFieldsValue({
              qrCodeFile: updatedList,  // Update the form field with the new file
            });
          }}
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
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