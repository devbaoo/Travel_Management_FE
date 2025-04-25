import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography, Spin } from "antd";
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

const { Title } = Typography;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#00B8D9'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

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

  if (loading || !dashboardData) return <Spin fullscreen />;

  const {
    totalBookings = 0,
    totalRevenue = 0,
    totalOriginalPrice = 0,
    profit = 0,
    bookingsByDay = [],
    bookingsBySeller = [],
  } = dashboardData?.data || {};

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        DashBoard
      </Title>

      {/* Row for statistics */}
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

      {/* Row for charts */}
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
    </div>
  );
};

export default Dashboard;
