import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Popconfirm, message, Input, DatePicker } from 'antd';
import { fetchBookings, createBooking, deleteBooking, updateBooking } from "../../features/booking/bookingSlice";
import { fetchSellers } from "../../features/seller/sellerSlice"; // Import fetchSellers
import BookingForm from "../../components/BookingForm";
import moment from 'moment';

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

  useEffect(() => {
    dispatch(fetchBookings());
    dispatch(fetchSellers()); // Fetch sellers when component mounts
  }, [dispatch]);

  useEffect(() => {
    setFilteredBookings(bookings); // Update filtered bookings when `bookings` state changes
  }, [bookings]);

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
      // Lọc theo checkInDate và checkOutDate nếu đã chọn
      const checkInMatch = checkInDate
        ? moment(booking.checkInDate).isBetween(checkInDate, checkOutDate, null, '[]') || moment(booking.checkInDate).isSameOrAfter(checkInDate) // Kiểm tra ngày check-in trong khoảng
        : true;  // Nếu không chọn checkInDate thì không lọc theo checkInDate
  
      const checkOutMatch = checkOutDate
        ? moment(booking.checkOutDate).isBetween(checkInDate, checkOutDate, null, '[]') || moment(booking.checkOutDate).isSameOrBefore(checkOutDate) // Kiểm tra ngày check-out trong khoảng
        : true;  // Nếu không chọn checkOutDate thì không lọc theo checkOutDate
  
      // Kết hợp với việc tìm kiếm theo customerName, phoneNumber, hoặc serviceRequest
      const searchMatch =
        booking.customerName.toLowerCase().includes(value.toLowerCase()) ||
        booking.phoneNumber.toLowerCase().includes(value.toLowerCase()) ||
        booking.serviceRequest.toLowerCase().includes(value.toLowerCase());
  
      // Lọc các booking theo ngày và tìm kiếm
      return checkInMatch && checkOutMatch && searchMatch;
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
    { title: "Service Request", dataIndex: "serviceRequest", 
      render: (text) => <div style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{text}</div> },
    { title: "Guest Count", dataIndex: "guestCount" },
    { title: "Room Count", dataIndex: "roomCount" },
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
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
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

        {/* Date Pickers for filtering
        <DatePicker
          placeholder="Check-in Date"
          onChange={(date) => {
            setCheckInDate(date);
            handleSearch(""); // Re-trigger search when date changes
          }}
          format="DD/MM/YYYY"
          style={{ marginLeft: 16 }}
        />
        <DatePicker
          placeholder="Check-out Date"
          onChange={(date) => {
            setCheckOutDate(date);
            handleSearch(""); // Re-trigger search when date changes
          }}
          format="DD/MM/YYYY"
          style={{ marginLeft: 16 }}
        /> */}
      </div>

      <Table
        dataSource={filteredBookings} // Render filteredBookings instead of bookings
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false} // Disable pagination if you want to show all results
      />

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