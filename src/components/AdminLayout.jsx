import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  ScheduleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../utils/AuthContext"; 
import ChangePassword from "./ChangePassword"; 
import UpdateProfile from "./UpdateProfile";
import logo from "../assets/logo.png";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleClick = (e) => {
    if (e.key === "/admin/logout") {
      logout();
      navigate("/login");
    } else {
      navigate(e.key);
    }
  };

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/sellers",
      icon: <UserOutlined />,
      label: "Sellers",
    },
    {
      key: "/admin/bookings",
      icon: <ScheduleOutlined />,
      label: "Bookings",
    },
  ];

  const dropdownMenu = [
    {
      key: "update-profile",
      label: <span onClick={() => setIsProfileModalOpen(true)}>Cập nhật hồ sơ</span>,
    },
    {
      key: "change-password",
      label: <span onClick={() => setIsPasswordModalOpen(true)}>Đổi mật khẩu</span>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span onClick={() => {
        logout();
        navigate("/login");
      }}>Đăng xuất</span>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={200}
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: "#001529",
          transition: "all 0.3s",
        }}
      >
        <div style={{ color: "#fff", textAlign: "center", padding: "16px", fontWeight: "bold" }}>
          Quản lí
        </div>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={logo}
            alt="Brand Logo"
            style={{ width: "80%", height: "auto" }}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleClick}
          items={menuItems}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: "700",
              fontSize: "32px",
              color: "#d49f3a",
              margin: 0,
              letterSpacing: "1px",
            }}
          >
            Thành Phát Global
          </h2>
          <Dropdown menu={{ items: dropdownMenu }}>
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} />
              {user?.fullName}
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "calc(100vh - 64px)",
            backgroundColor: "#fff",
            transition: "all 0.3s",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
      <ChangePassword
  visible={isPasswordModalOpen}
  onClose={() => setIsPasswordModalOpen(false)}
/>
<UpdateProfile visible={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </Layout>
    
  );
};

export default AdminLayout;