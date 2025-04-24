import { Routes, Route } from "react-router-dom";
import AdminLayout from "./../../components/AdminLayout";
import SellerManagement from "../../pages/admin/SellerManagement";
import BookingManagement from "../../pages/admin/BookingManagement";
import Dashboard from "./Dashboard";
import RequireAuth from "../../components/RequireAuth"; // import vào

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sellers" element={<SellerManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;