import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography, Spin, DatePicker, Table } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { API_ENDPOINTS } from "../../configs/apiConfig";
import moment from "moment";

const { Title } = Typography;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#00B8D9'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [sellerRevenue, setSellerRevenue] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment());

  useEffect(() => {
    axios.get(API_ENDPOINTS.GET_DASHBOARD)
      .then((res) => {
        setDashboardData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const fetchSellerRevenue = (month, year) => {
    setLoading(true);
    axios
      .get(API_ENDPOINTS.GET_REVENUE_BY_SELLER(month, year))
      .then((res) => {
        setSellerRevenue(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleDateChange = (date) => {
    const month = date.month() + 1;
    const year = date.year();
    setSelectedDate(date);
    fetchSellerRevenue(month, year);
  };

  if (loading || !dashboardData) return <Spin fullscreen />;

  const {
    totalBookings = 0,
    totalRevenue = 0,
    totalOriginalPrice = 0,
    profit = 0,
    bookingsByDay = [],
    bookingsBySeller = [],
  } = dashboardData?.data || {};

  const sellerColumns = [
    {
      title: "Tên người bán",
      dataIndex: "sellerName",
      key: "sellerName",
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (value) => `${value.toLocaleString()} VND`,
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
      sortDirections: ["ascend",],
      defaultSortOrder: "descend", // Default sorting order
    },
    {
      title: "Giá nhập",
      dataIndex: "totalOriginalPrice",
      key: "totalOriginalPrice",
      render: (value) => `${value.toLocaleString()} VND`,
    },
    {
      title: "Lợi nhuận",
      dataIndex: "profit",
      key: "profit",
      render: (value) => `${value.toLocaleString()} VND`,
      sorter: (a, b) => a.profit - b.profit,
      sortDirections: ["ascend"],
      defaultSortOrder: "descend", // Default sorting order
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        DashBoard
      </Title>

      {/* Các phần khác của dashboard */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic title="Tổng số lượt đặt phòng" value={totalBookings} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              suffix="VND"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="Giá nhập"
              value={totalOriginalPrice}
              precision={0}
              valueStyle={{ color: "#cf1322" }}
              suffix="VND"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card>
            <Statistic
              title="Lợi nhuận"
              value={profit}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              suffix="VND"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={14}>
          <Card title="Lượt đặt trong 7 ngày qua">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <Card title="Lượt đặt theo người bán">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingsBySeller}
                  dataKey="count"
                  nameKey="seller.fullName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {bookingsBySeller.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* DatePicker được đặt dưới cùng */}
      <Card style={{ marginTop: 24, textAlign: "center" }}>
        <Title level={5} style={{ marginBottom: 16 }}>
          Chọn tháng và năm để xem doanh thu
        </Title>
        <DatePicker
          picker="month"
          value={selectedDate}
          onChange={handleDateChange}
          format="MM/YYYY"
          style={{ width: 200 }}
        />
      </Card>

      {/* Bảng hiển thị doanh thu với phân trang */}
      <Card title="Doanh thu theo người bán" style={{ marginTop: 24 }}>
        <Table

          dataSource={sellerRevenue}
          columns={sellerColumns}
          rowKey="sellerId"
          pagination={{
            pageSize: 5, // Số dòng trên mỗi trang
            showSizeChanger: true, // Cho phép thay đổi số dòng trên mỗi trang
            pageSizeOptions: ["5", "10", "20"], // Các tùy chọn số dòng
          }}
          loading={loading}
          scroll={{
            y: 300 }} // Kích thước cuộn ngang
        />
      </Card>
    </div>
  );
};

export default Dashboard;
