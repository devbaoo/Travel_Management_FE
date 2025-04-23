import { Form, Input, Button, DatePicker, InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellers } from "../features/seller/sellerSlice"; // Import fetchSellers action

const BookingForm = ({ onFinish, initialValues = {}, loading }) => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller); // Get sellers from redux
  const [form] = Form.useForm();
  const [price, setPrice] = useState(initialValues.price || 0); // State to handle price input

  // Reset form when initialValues change (for editing bookings)
  useEffect(() => {
    dispatch(fetchSellers()); // Fetch sellers when component mounts
    form.resetFields();
  }, [initialValues, dispatch]);

  // Handle price change
  const handlePriceChange = (value) => {
    setPrice(value);
  };

  // Check if checkout date is after check-in date
  const validateCheckOutDate = (_, value) => {
    const checkInDate = form.getFieldValue('checkInDate');
    if (checkInDate && value && moment(value).isBefore(moment(checkInDate))) {
      return Promise.reject('Check-out date must be after check-in date');
    }
    return Promise.resolve();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        checkInDate: initialValues.checkInDate ? moment(initialValues.checkInDate) : null,
        checkOutDate: initialValues.checkOutDate ? moment(initialValues.checkOutDate) : null,
        serviceRequest: initialValues.serviceRequest || '',  // Set default value for serviceRequest
        sellerId: initialValues.sellerId || ''  // Set default value for sellerId
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="customerName"
        label="Customer Name"
        rules={[{ required: true, message: 'Please enter customer name' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="Phone"
        rules={[{ required: true, message: 'Please enter phone number' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="serviceRequest"
        label="Service Request"
        initialValue={initialValues.serviceRequest || ''}
        rules={[
          { required: true, message: 'Please enter service request' },
          { max: 255, message: 'Service request must be less than 255 characters' },
        ]}
      >
        <Input.TextArea style={{ minHeight: 100 }} />
      </Form.Item>

      <Form.Item
        name="guestCount"
        label="Guest Count"
        rules={[{ required: true, message: 'Please enter guest count' }]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item
        name="roomCount"
        label="Room Count"
        rules={[{ required: true, message: 'Please enter room count' }]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item
        name="roomClass"
        label="Room Class"
        rules={[{ required: true, message: 'Please enter room class' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="checkInDate"
        label="Check-in Date"
        rules={[{ required: true, message: 'Please select check-in date' }]}
      >
        <DatePicker
          format="DD/MM/YYYY HH:mm"
          showTime
          disabledDate={(current) => current && current < moment().endOf('day')} // Disable past dates
        />
      </Form.Item>

      <Form.Item
        name="checkOutDate"
        label="Check-out Date"
        rules={[
          { required: true, message: 'Please select check-out date' },
          { validator: validateCheckOutDate }, // Validate check-out date after check-in
        ]}
      >
        <DatePicker
          format="DD/MM/YYYY HH:mm"
          showTime
          disabledDate={(current) => current && current < moment().endOf('day')} // Disable past dates
        />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: 'Please enter price' }]}
      >
        <InputNumber
          min={0}
          step={1000}
          value={price}
          onChange={handlePriceChange}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item name="note" label="Note">
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        name="sellerId"
        label="Seller"
        rules={[{ required: true, message: 'Please select a seller' }]}
      >
        <Select
          showSearch
          placeholder="Select a seller"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {sellers.map(seller => (
            <Select.Option key={seller.id} value={seller.id}>
              {seller.fullName} {/* Assuming seller has 'id' and 'name' properties */}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BookingForm;