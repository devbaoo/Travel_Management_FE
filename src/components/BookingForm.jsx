import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Select
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellers } from "../features/seller/sellerSlice";
import { toast } from 'react-toastify';

const BookingForm = ({ onFinish, initialValues = {}, loading }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { sellers } = useSelector(state => state.seller);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    dispatch(fetchSellers());
  }, [dispatch]);

  useEffect(() => {
    if (initialValues && initialValues.checkInDate) {
      form.setFieldsValue({
        customerName: initialValues.customerName,
        phoneNumber: initialValues.phoneNumber,
        serviceRequest: initialValues.serviceRequest,
        guestCount: initialValues.guestCount,
        roomCount: initialValues.roomCount,
        roomClass: initialValues.roomClass,
        note: initialValues.note,
        sellerId: initialValues.sellerId,
        price: initialValues.price,
        checkInDate: moment(initialValues.checkInDate),
        checkOutDate: moment(initialValues.checkOutDate),
      });
      setPrice(initialValues.price);
    } else {
      form.resetFields();
      form.setFieldsValue({
        guestCount: 1,
        roomCount: 1,
        price: 0,
      });
      setPrice(0);
    }
  }, [initialValues, form]);

  const handlePriceChange = val => setPrice(val);

  const validateCheckOutDate = (_, value) => {
    const checkIn = form.getFieldValue('checkInDate');
    if (checkIn && value && moment(value).isBefore(checkIn)) {
      return Promise.reject('Ngày trả phòng phải sau ngày nhận phòng');
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    try {
      await onFinish(values);
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="customerName"
        label="Tên khách hàng"
        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
      >
        <Input placeholder="Nguyễn Văn A" />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="Số điện thoại"
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
      >
        <Input placeholder="0123456789" />
      </Form.Item>

      <Form.Item
        name="serviceRequest"
        label="Yêu cầu dịch vụ"
        rules={[
          { required: true, message: 'Vui lòng nhập yêu cầu dịch vụ' },
          { max: 255, message: 'Tối đa 255 ký tự' },
        ]}
      >
        <Input.TextArea style={{ minHeight: 100 }} placeholder="Ví dụ: Dọn phòng, giặt ủi, v.v." />
      </Form.Item>

      <Form.Item
        name="guestCount"
        label="Số khách"
        rules={[{ required: true, message: 'Vui lòng nhập số khách' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} placeholder="1" />
      </Form.Item>

      <Form.Item
        name="roomCount"
        label="Số phòng"
        rules={[{ required: true, message: 'Vui lòng nhập số phòng' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} placeholder="1" />
      </Form.Item>

      <Form.Item
        name="roomClass"
        label="Hạng phòng"
        rules={[{ required: true, message: 'Vui lòng nhập hạng phòng' }]}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        name="checkInDate"
        label="Ngày & giờ nhận phòng"
        rules={[{ required: true, message: 'Vui lòng chọn ngày & giờ nhận phòng' }]}
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
        label="Ngày & giờ trả phòng"
        rules={[
          { required: true, message: 'Vui lòng chọn ngày & giờ trả phòng' },
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
        label="Giá"
        rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
      >
        <InputNumber
          min={0}
          step={1000}
          value={price}
          onChange={handlePriceChange}
          formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          parser={v => v.replace(/\./g, '')}
          style={{ width: '100%' }}
          placeholder="Ví dụ: 500000"
        />
      </Form.Item>

      <Form.Item name="note" label="Ghi chú">
        <Input.TextArea placeholder="Thêm ghi chú (nếu có)" />
      </Form.Item>

      <Form.Item
        name="sellerId"
        label="Người bán"
        rules={[{ required: true, message: 'Vui lòng chọn người bán' }]}
      >
        <Select
          showSearch
          placeholder="Chọn người bán"
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
        <Button type="primary" htmlType="submit" loading={loading} block>
          Lưu thông tin
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BookingForm;
