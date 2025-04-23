import { Routes, Route } from "react-router-dom";
import AdminLayout from "./../../components/AdminLayout";
import SellerManagement from "../../pages/admin/SellerManagement";
import BookingManagement from "../../pages/admin/BookingManagement";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="dashboard" element={<div>Dashboard goes here</div>} />
        <Route path="sellers" element={<SellerManagement />} />
        <Route path="bookings" element={<BookingManagement />} />

      </Route>
    </Routes>
  );
};

export default AdminRoutes;