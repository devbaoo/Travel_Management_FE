import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography, Spin } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import axios from "axios";
import { API_ENDPOINTS } from "../../configs/apiConfig";
import { useAuth } from "../../utils/AuthContext";

const { Title } = Typography;

const DashboardStaff = () => {
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (!user || !user.id) return; // Kiểm tra nếu không có user hoặc id

    axios
      .get(API_ENDPOINTS.GET_DASHBOARD_BY_SELLER(user.id)) // Gọi API với id của staff
      .then((res) => {
        setDashboardData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [user]);

  if (loading || !dashboardData) return <Spin fullscreen />;

  const {
    totalBookings = 0,
    totalRevenue = 0,
    totalOriginalPrice = 0,
    profit = 0,
    bookingsByDay = [],
  } = dashboardData?.data || {};

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>DashBoard</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic title="Tổng số lượt đặt phòng" value={totalBookings} />
          </Card>
        </Col>
        <Col span={12}>
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
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
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
        <Col span={12}>
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

      <Row gutter={24}>
        <Col span={24}>
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
      </Row>
    </div>
  );
};

export default DashboardStaff;
