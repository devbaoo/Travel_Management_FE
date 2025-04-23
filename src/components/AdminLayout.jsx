import { Layout, Menu } from "antd";
import { UserOutlined, DashboardOutlined, ScheduleOutlined } from "@ant-design/icons";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png"; // Adjust the import based on your project structure

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false); // Track the collapsed state of the Sider

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

  const handleClick = ({ key }) => {
    if (key === "/logout") {
      // Handle logout logic here
      return;
    }
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}> {/* Make sure the layout takes full height */}
      <Sider
        width={200}
        collapsible
        collapsed={collapsed}  // Control collapse state
        onCollapse={(collapsed) => setCollapsed(collapsed)}  // Toggle collapse state
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: "#001529", // You can customize the color
          transition: "all 0.3s", // Smooth transition effect for the layout when sidebar collapses
        }}
      >
        <div style={{ color: "#fff", textAlign: "center", padding: "16px", fontWeight: "bold" }}>
          Quản lí
        </div>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={logo} // Replace with the actual path to your logo
            alt="Brand Logo"
            style={{ width: "80%", height: "auto" }} // You can adjust the size here
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
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}> {/* Offset the content to the right when collapsed */}
      <Header style={{
          background: "#fff", 
          paddingLeft: 20,
          display: "flex",
          justifyContent: "center",  // Center the text horizontally
          alignItems: "center", // Center the text vertically
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", // Artistic font from Google Fonts
            fontWeight: "700", // Bold font
            fontSize: "36px",  // Larger font size
            color: "#d49f3a",  // Make the text standout
            letterSpacing: "2px", // Add spacing between letters
            margin: 0,  // Remove default margin
            textAlign: "center",  // Ensure the text is centered
          }}>
            Thành Phát Global
          </h2>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "calc(100vh - 64px)", // Adjust content height based on header
            backgroundColor: "#fff",
            transition: "all 0.3s",  // Smooth transition effect for content when sidebar collapses
          }}
        >
          <Outlet /> {/* Nested route render */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;