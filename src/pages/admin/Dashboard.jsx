import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography, Spin } from "antd";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import axios from "axios";
import { API_ENDPOINTS } from "../../configs/apiConfig";
// import AnimatedPage from "../../components/AnimationPage";

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
    bookingsByDay = [],
    bookingsBySeller = [],
  } = dashboardData?.data || {};

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Booking Dashboard</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic title="Total Bookings" value={totalBookings} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              suffix="VND"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={14}>
          <Card title="Bookings in the Last 7 Days">
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
        <Col span={10}>
          <Card title="Bookings by Seller">
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