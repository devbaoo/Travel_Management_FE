import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Popconfirm, message, Input, DatePicker,Descriptions} from 'antd';
import { fetchBookings, createBooking, deleteBooking, updateBooking , exportBookingPdf, exportBookingTxt} from "../../features/booking/bookingSlice";
import { fetchSellers } from "../../features/seller/sellerSlice"; // Import fetchSellers
import BookingForm from "../../components/BookingForm";
import moment from 'moment';
import { API_ENDPOINTS } from "../../configs/apiConfig"; // Import API endpoints

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
        : API_ENDPOINTS.EXPORT_BOOKING_TXT(id);
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
        message.error(result.errMessage || "Something went wrong");
        return;
      }

      message.success(editingBooking ? "Booking updated!" : "Booking created!");

      await dispatch(fetchBookings());
      setIsModalOpen(false);
      setEditingBooking(null);
    } catch (error) {
      console.error(error);
      message.error("Request failed.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteBooking(id)).unwrap();
      message.success("Deleted booking!");
    } catch {
      message.error("Delete failed.");
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
    { title: "Customer Name", dataIndex: "customerName" },
    { title: "Phone", dataIndex: "phoneNumber" },
    {
      title: "Service Request",
      dataIndex: "serviceRequest",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <span title={text}>
          {text.length > 40 ? `${text.slice(0, 40)}...` : text}
        </span>
      ),
    },
    {
      title: "Guest Count",
      dataIndex: "guestCount",
      width: 80,
      align: 'center',
    },
    {
      title: "Room Count",
      dataIndex: "roomCount",
      width: 80,
      align: 'center',
    },
    {
      title: "Check-in Date",
      dataIndex: "checkInDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Check-out Date",
      dataIndex: "checkOutDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button
            size="small"
            onClick={() => {
              setEditingBooking(record);
              setIsModalOpen(true);
            }}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            size="small"
            onClick={() => setViewingBooking(record)}
            style={{ marginRight: 8 }}
            type="dashed"
          >
            Detail
          </Button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
    {
      title: "Export",
      render: (_, record) => (
        <>
          <Button
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => handleExport("pdf", record.id)}
          >
            PDF
          </Button>
          <Button
            size="small"
            onClick={() => handleExport("txt", record.id)}
          >
            TXT
          </Button>
        </>
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
          Add Booking
        </Button>

        {/* Search input */}
        <Search
          placeholder="Search by Name, Phone, or Service"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)} // Live search
          style={{ width: 400 }} // Bạn có thể điều chỉnh chiều rộng của ô tìm kiếm tại đây
        />
      </div>

      <Table
        dataSource={filteredBookings} // Render filteredBookings instead of bookings
        columns={columns}
        rowKey="id"
        loading={loading}
      />
      <Modal
        open={!!viewingBooking}
        title="Booking Details"
        onCancel={() => setViewingBooking(null)}
        width={700}
        destroyOnClose
        centered
        maskClosable={false}
        closable={false}
        footer={[
        <Button key="close" onClick={() => setViewingBooking(null)}>
          Close
        </Button>,
  ]}
>
  {viewingBooking && (
    <Descriptions column={1} bordered size="small">
    <Descriptions.Item label="Customer Name">{viewingBooking.customerName}</Descriptions.Item>
      <Descriptions.Item label="Phone">{viewingBooking.phoneNumber}</Descriptions.Item>

      <Descriptions.Item label="Service Request" span={2}>
        {viewingBooking.serviceRequest}
      </Descriptions.Item>

      <Descriptions.Item label="Guest Count">{viewingBooking.guestCount}</Descriptions.Item>
      <Descriptions.Item label="Room Count">{viewingBooking.roomCount}</Descriptions.Item>

      <Descriptions.Item label="Room Class">{viewingBooking.roomClass}</Descriptions.Item>
      <Descriptions.Item label="Check-in Date">
        {moment(viewingBooking.checkInDate).format("DD/MM/YYYY")}
      </Descriptions.Item>
      <Descriptions.Item label="Check-out Date">
        {moment(viewingBooking.checkOutDate).format("DD/MM/YYYY")}
      </Descriptions.Item>

      <Descriptions.Item label="Price" span={2}>
        {formatCurrency(viewingBooking.price)}
      </Descriptions.Item>

      <Descriptions.Item label="Note" span={2}>
        {viewingBooking.note || "-"}
      </Descriptions.Item>
      <Descriptions.Item label="Seller Name">{viewingBooking.seller?.fullName}</Descriptions.Item>
  <Descriptions.Item label="Seller Phone">{viewingBooking.seller?.phoneNumber}</Descriptions.Item>
  <Descriptions.Item label="Seller Email" span={2}>{viewingBooking.seller?.email}</Descriptions.Item>
  {viewingBooking.seller?.qrCodeUrl && (
    <Descriptions.Item label="QR Code" span={2}>
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
        title={editingBooking ? "Edit Booking" : "Create Booking"}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingBooking(null);
        }}
        footer={null}
      >
              <BookingForm onFinish={handleCreateOrUpdate} initialValues={editingBooking || {}} loading={submitLoading} />

      </Modal>
    </div>
  );
};

export default BookingManagement;