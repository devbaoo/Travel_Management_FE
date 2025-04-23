import { Form, Input, Button, DatePicker, InputNumber, Select } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellers } from "../features/seller/sellerSlice";

const BookingForm = ({ onFinish, initialValues = {}, loading }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { sellers } = useSelector(state => state.seller);
  const [price, setPrice] = useState(0);

  // 1) Fetch sellers once
  useEffect(() => {
    dispatch(fetchSellers());
  }, [dispatch]);

  // 2) Whenever initialValues changes, populate the form
  useEffect(() => {
    if (initialValues && initialValues.checkInDate) {
      // EDIT mode: convert dates → moment
      form.setFieldsValue({
        customerName:   initialValues.customerName,
        phoneNumber:    initialValues.phoneNumber,
        serviceRequest: initialValues.serviceRequest,
        guestCount:     initialValues.guestCount,
        roomCount:      initialValues.roomCount,
        roomClass:      initialValues.roomClass,
        note:           initialValues.note,
        sellerId:       initialValues.sellerId,
        price:          initialValues.price,
        checkInDate:    moment(initialValues.checkInDate),
        checkOutDate:   moment(initialValues.checkOutDate),
      });
      setPrice(initialValues.price);
    } else {
      // NEW mode: clear & set defaults
      form.resetFields();
      form.setFieldsValue({
        guestCount: 1,
        roomCount:  1,
        price:      0,
      });
      setPrice(0);
    }
  }, [initialValues, form]);

  const handlePriceChange = val => setPrice(val);

  const validateCheckOutDate = (_, value) => {
    const checkIn = form.getFieldValue('checkInDate');
    if (checkIn && value && moment(value).isBefore(checkIn)) {
      return Promise.reject('Check-out must be after check-in');
    }
    return Promise.resolve();
  };

  return (
    <Form
      form={form}
      layout="vertical"
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
        rules={[
          { required: true, message: 'Please enter service request' },
          { max: 255, message: 'Must be under 255 characters' },
        ]}
      >
        <Input.TextArea style={{ minHeight: 100 }} />
      </Form.Item>

      <Form.Item
        name="guestCount"
        label="Guest Count"
        rules={[{ required: true, message: 'Please enter guest count' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="roomCount"
        label="Room Count"
        rules={[{ required: true, message: 'Please enter room count' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
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
        label="Check-in Date & Time"
        rules={[{ required: true, message: 'Please select check-in date & time' }]}
      >
        <DatePicker
          style={{ width: '100%' }}
          format="DD/MM/YYYY HH:mm"
          showTime={{ format: 'HH:mm', minuteStep: 15 }}
          disabledDate={d => d && d < moment().startOf('day')}
        />
      </Form.Item>

      <Form.Item
        name="checkOutDate"
        label="Check-out Date & Time"
        rules={[
          { required: true, message: 'Please select check-out date & time' },
          { validator: validateCheckOutDate },
        ]}
      >
        <DatePicker
          style={{ width: '100%' }}
          format="DD/MM/YYYY HH:mm"
          showTime={{ format: 'HH:mm', minuteStep: 15 }}
          disabledDate={d => d && d < moment().startOf('day')}
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
          formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          parser={v => v.replace(/\./g, '')}
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
          {sellers.map(s => (
            <Select.Option key={s.id} value={s.id}>
              {s.fullName}
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