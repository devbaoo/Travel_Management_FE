import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Popconfirm, Input, Descriptions } from 'antd';
import { fetchBookingsBySeller, createBooking, deleteBooking, updateBooking, exportBookingPdf, exportBookingTxt } from "../../features/booking/bookingSlice";
import BookingForm from "../../components/BookingForm";
import moment from 'moment';
import { API_ENDPOINTS } from "../../configs/apiConfig";
import { toast } from 'react-toastify';
import { useAuth } from "../../utils/AuthContext"; // Import AuthContext

const { Search } = Input;

const BookingStaffManagement = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.booking);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filteredBookings, setFilteredBookings] = useState(bookings);
  const [viewingBooking, setViewingBooking] = useState(null);
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext

  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchBookingsBySeller(user.id)); // Gọi API lấy danh sách bookings theo sellerId
    }
  }, [dispatch, user]);

  useEffect(() => {
    setFilteredBookings(bookings); // Cập nhật danh sách bookings khi state thay đổi
  }, [bookings]);

  const handleExport = (type, id) => {
    const url =
      type === "pdf"
        ? API_ENDPOINTS.EXPORT_BOOKING_PDF(id)
        : API_ENDPOINTS.EXPORT_BOOKING_TXT(id);
    window.open(url, "_blank");
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      setSubmitLoading(true);

      let result;
      if (editingBooking) {
        result = await dispatch(updateBooking({ id: editingBooking.id, formData })).unwrap();
      } else {
        result = await dispatch(createBooking(formData)).unwrap();
      }

      if (result.errCode !== 0) {
        toast.error(result.errMessage || "Có gì đó sai sai");
        return;
      }

      toast.success(editingBooking ? "Cập nhật thành công!" : "Tạo thành công!");

      if (user && user.id) {
        dispatch(fetchBookingsBySeller(user.id)); // Làm mới danh sách bookings
      }
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

      if (user && user.id) {
        dispatch(fetchBookingsBySeller(user.id)); // Làm mới danh sách bookings
      }
    } catch {
      toast.error("Xoá thất bại.");
    }
  };

  const handleSearch = (value) => {
    const filtered = bookings.filter((booking) => {
      const searchMatch =
        booking.customerName.toLowerCase().includes(value.toLowerCase()) ||
        booking.phoneNumber.toLowerCase().includes(value.toLowerCase()) ||
        booking.serviceRequest.toLowerCase().includes(value.toLowerCase());

      return searchMatch;
    });

    setFilteredBookings(filtered);
  };

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
      title: "Xuất",
      width: 150, // Đặt chiều rộng cố định cho cột
      align: "center", // Căn giữa nội dung
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            size="small"
            type="default"
            onClick={() => handleExport("pdf", record.id)}
          >
          PDF
          </Button>
          <Button
            size="small"
            type="default"
            onClick={() => handleExport("txt", record.id)}
          >
          TXT
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          style={{ marginRight: 16 }}
          onClick={() => {
            setEditingBooking(null);
            setIsModalOpen(true);
          }}
        >
          Thêm đặt phòng
        </Button>

        <Search
          placeholder="Tìm theo tên, số điện thoại, hoặc dịch vụ"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 400 }}
        />
      </div>

      <Table
        dataSource={filteredBookings}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
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
            <Descriptions.Item label="Giá nhập" span={2}>
              {formatCurrency(viewingBooking.originalPrice)}
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

export default BookingStaffManagement;
