import dayjs from 'dayjs'; // Thay thế moment bằng dayjs
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Select,
  Row,
  Col
} from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellers } from "../features/seller/sellerSlice";
import { toast } from 'react-toastify';
import { useAuth } from '../utils/AuthContext'; // Import the AuthContext

const BookingForm = ({ onFinish, initialValues = {}, loading }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { sellers } = useSelector(state => state.seller);
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const { user, isStaff } = useAuth(); // Get user and role-checking function

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
        originalPrice: initialValues.originalPrice,
        checkInDate: dayjs(initialValues.checkInDate), // Thay thế moment bằng dayjs
        checkOutDate: dayjs(initialValues.checkOutDate), // Thay thế moment bằng dayjs
      });
      setPrice(initialValues.price);
    } else {
      form.resetFields();
      form.setFieldsValue({
        guestCount: 1,
        roomCount: 1,
        price: 0,
        originalPrice: 0,
      });
      setPrice(0);
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (isStaff()) {
      form.setFieldsValue({ sellerId: user.id }); // Automatically set sellerId for staff
    }
  }, [isStaff, user, form]);

  const handlePriceChange = val => setPrice(val);
  const handleOriginalPriceChange = val => setOriginalPrice(val);

  const validateOriginalPrice = (_, value) => {
    return Promise.resolve(); // Bỏ qua kiểm tra
  };

  const validateCheckOutDate = (_, value) => {
    const checkIn = form.getFieldValue('checkInDate');
    if (checkIn && value && dayjs(value).isBefore(dayjs(checkIn))) { // Thay thế moment bằng dayjs
      return Promise.reject('Ngày trả phòng phải sau ngày nhận phòng');
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    try {
      // Ensure sellerId is set to the staff's ID if the user is a staff member
      if (isStaff()) {
        values.sellerId = user.id;
      }
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
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="customerName"
            label="Tên khách hàng"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số và không chứa ký tự khác' }
            ]}
          >
            <Input
              placeholder="0123456789"
              maxLength={10}
              onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} // Xóa ký tự không phải số
            />
          </Form.Item>

        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item
            name="serviceRequest"
            label="Yêu cầu dịch vụ"
            rules={[
              { required: true, message: 'Vui lòng nhập yêu cầu dịch vụ' },
              { max: 255, message: 'Tối đa 255 ký tự' },
            ]}
          >
            <Input.TextArea style={{ minHeight: 100 }} placeholder="Ví dụ: Khách sạn, phòng v.v." />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="guestCount"
            label="Số khách"
            rules={[{ required: true, message: 'Vui lòng nhập số khách' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="1" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="roomCount"
            label="Số phòng"
            rules={[{ required: true, message: 'Vui lòng nhập số phòng' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="1" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="checkInDate"
            label="Ngày & giờ nhận phòng"
            rules={[{ required: true, message: 'Vui lòng chọn ngày & giờ nhận phòng' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY HH:mm"
              showTime={{ format: 'HH:mm', minuteStep: 15 }}
              disabledDate={d => d && d < dayjs().startOf('day')} // Thay thế moment bằng dayjs
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
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
              disabledDate={d => d && d < dayjs().startOf('day')} // Thay thế moment bằng dayjs
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
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
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="originalPrice"
            label="Giá nhập"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]} // Chỉ giữ lại yêu cầu nhập
          >
            <InputNumber
              min={0}
              step={1000}
              value={originalPrice}
              onChange={handleOriginalPriceChange}
              formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              parser={v => v.replace(/\./g, '')}
              style={{ width: '100%' }}
              placeholder="Ví dụ: 500000"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea placeholder="Thêm ghi chú (nếu có)" />
          </Form.Item>
        </Col>
      </Row>

      {!isStaff() && (
        <Row gutter={[16, 16]}>
          <Col xs={24}>
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
          </Col>
        </Row>
      )}

      <Row>
        <Col xs={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Lưu thông tin
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default BookingForm;
