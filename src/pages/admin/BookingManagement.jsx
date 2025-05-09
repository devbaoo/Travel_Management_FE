import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Popconfirm, message, Input, DatePicker,Descriptions, Row, Col, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { fetchBookings, createBooking, deleteBooking, updateBooking , exportBookingPdf, exportBookingTxt} from "../../features/booking/bookingSlice";
import { fetchSellers } from "../../features/seller/sellerSlice"; // Import fetchSellers
import BookingForm from "../../components/BookingForm";
import moment from 'moment';
import { API_ENDPOINTS } from "../../configs/apiConfig"; // Import API endpoints
import { toast } from 'react-toastify';

const { Search } = Input;

const BookingManagement = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.booking);
  const { sellers } = useSelector((state) => state.seller); // Get sellers from redux
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filteredBookings, setFilteredBookings] = useState(bookings); // filtered bookings state
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [viewingBooking, setViewingBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchBookings());
    dispatch(fetchSellers()); // Fetch sellers when component mounts
  }, [dispatch]);

  useEffect(() => {
    setFilteredBookings(bookings); // Update filtered bookings when `bookings` state changes
  }, [bookings]);

  const handleExport = (type, id) => {
    const url =
      type === "pdf"
        ? API_ENDPOINTS.EXPORT_BOOKING_PDF(id)
        : type === "txt"
        ? API_ENDPOINTS.EXPORT_BOOKING_TXT(id)
        : API_ENDPOINTS.EXPORT_BOOKING_IMG(id);

    window.open(url, "_blank");
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      setSubmitLoading(true);

      let result;
      let updatedBooking;
      if (editingBooking) {
        result = await dispatch(updateBooking({ id: editingBooking.id, formData })).unwrap();
        updatedBooking = result.data;
      } else {
        result = await dispatch(createBooking(formData)).unwrap();
        updatedBooking = result.data;
      }

      if (result.errCode !== 0) {
        toast.error(result.errMessage || "Có gì đó sai sai");
        return;
      }

      toast.success(editingBooking ? "Cập nhật thành công!" : "Tạo thành công!");

      await dispatch(fetchBookings());
      setIsModalOpen(false);
      setEditingBooking(null);
    } catch (error) {
      console.error(error);
      toast.error("Có gì đó sai sai");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteBooking(id)).unwrap();
      toast.success("Xoá thành công!");
    } catch {
      toast.error("Xoá thất bại.");
    }
  };

  // Hàm tìm kiếm với live search và lọc theo ngày
  const handleSearch = (value) => {
    const filtered = bookings.filter((booking) => {

      const searchMatch =
        booking.customerName.toLowerCase().includes(value.toLowerCase()) ||
        booking.phoneNumber.toLowerCase().includes(value.toLowerCase()) ||
        booking.serviceRequest.toLowerCase().includes(value.toLowerCase());

      return  searchMatch;
    });

    setFilteredBookings(filtered); // Cập nhật danh sách booking đã lọc
  };
  // Format giá trị tiền
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const columns = [
    { title: "Tên khách hàng", dataIndex: "customerName" },
    { title: "Số điện thoại", dataIndex: "phoneNumber" },
    {
      title: "Yêu cầu dịch vụ",
      dataIndex: "serviceRequest",
      ellipsis: { showTitle: false },
      render: (text) => (
        <span title={text}>
          {text?.length > 40 ? `${text.slice(0, 40)}...` : text || '-'}
        </span>
      ),
    },
    {
      title: "Số khách",
      dataIndex: "guestCount",
      width: 80,
      align: 'center',
    },
    {
      title: "Số phòng",
      dataIndex: "roomCount",
      width: 80,
      align: 'center',
    },
    {
      title: "Ngày nhận phòng",
      dataIndex: "checkInDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày trả phòng",
      dataIndex: "checkOutDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Thao tác",
      width: 200, // Đặt chiều rộng cố định cho cột
      align: "center", // Căn giữa nội dung
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setEditingBooking(record);
              setIsModalOpen(true);
            }}
          >
            Chỉnh sửa
          </Button>
          <Button
            size="small"
            type="default"
            onClick={() => setViewingBooking(record)}
          >
            Chi tiết
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
    {
      title: "Chức năng",
      width: 150, // Đặt chiều rộng cố định cho cột
      align: "center", // Căn giữa nội dung
      render: (_, record) => {
        const exportMenu = (
          <Menu
            onClick={({ key }) => handleExport(key, record.id)}
            items={[
              { key: "pdf", label: "PDF" },
              { key: "txt", label: "TXT" },
              { key: "img", label: "IMG" },
            ]}
          />
        );

        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Dropdown overlay={exportMenu} trigger={['click']}>
              <Button size="small" type="default">
                Xuất
              </Button>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {/* Row for actions */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={() => {
              setEditingBooking(null);
              setIsModalOpen(true);
            }}
          >
            Thêm đặt phòng
          </Button>
        </Col>
        <Col xs={24} sm={12} md={16}>
          <Search
            placeholder="Tìm theo tên, số điện thoại, hoặc dịch vụ"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      {/* Table */}
      <Table
        dataSource={filteredBookings}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1000 }} // Cho phép cuộn ngang trên màn hình nhỏ
      />

      {/* Modal for viewing booking details */}
      <Modal
        open={!!viewingBooking}
        title="Chi tiết đặt phòng"
        onCancel={() => setViewingBooking(null)}
        width={700}
        destroyOnClose
        centered
        maskClosable={false}
        closable={false}
        footer={[
          <Button key="close" onClick={() => setViewingBooking(null)}>
            Đóng
          </Button>,
        ]}
      >
        {viewingBooking && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Tên khách hàng">{viewingBooking.customerName}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{viewingBooking.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="Yêu cầu dịch vụ" span={2}>
              {viewingBooking.serviceRequest}
            </Descriptions.Item>
            <Descriptions.Item label="Số khách">{viewingBooking.guestCount}</Descriptions.Item>
            <Descriptions.Item label="Số phòng">{viewingBooking.roomCount}</Descriptions.Item>
            <Descriptions.Item label="Hạng phòng">{viewingBooking.roomClass}</Descriptions.Item>
            <Descriptions.Item label="Ngày nhận phòng">
              {moment(viewingBooking.checkInDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày trả phòng">
              {moment(viewingBooking.checkOutDate).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Giá" span={2}>
              {formatCurrency(viewingBooking.price)}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú" span={2}>
              {viewingBooking.note || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Tên người bán">{viewingBooking.seller?.fullName}</Descriptions.Item>
            <Descriptions.Item label="SĐT người bán">{viewingBooking.seller?.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="Email người bán" span={2}>{viewingBooking.seller?.email}</Descriptions.Item>
            {viewingBooking.seller?.qrCodeUrl && (
              <Descriptions.Item label="Mã QR" span={2}>
                <img
                  src={viewingBooking.seller.qrCodeUrl}
                  alt="QR Code"
                  style={{ maxWidth: "120px", border: "1px solid #eee", padding: 4 }}
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Modal for creating or editing booking */}
      <Modal
        open={isModalOpen}
        title={editingBooking ? "Chỉnh sửa đặt phòng" : "Tạo mới đặt phòng"}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingBooking(null);
        }}
        footer={null}
      >
        <BookingForm
          onFinish={handleCreateOrUpdate}
          initialValues={editingBooking || {}}
          loading={submitLoading}
        />
      </Modal>
    </div>
  );
};
export default BookingManagement;
