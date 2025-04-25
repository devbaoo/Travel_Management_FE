import { Routes, Route } from "react-router-dom";
import RequireAuth from "../../components/RequireAuth";
import StaffLayout from "../../components/StaffLayout";
import NotFound from "../NotFound";
import BookingStaffManagement from "./BookingStaffmanagement";
import DashboardStaff from "./DashboardStaff";

const StaffRoutes = () => {
  return (
    <Routes>
      <Route element={<RequireAuth role="staff" />}>
        <Route path="/" element={<StaffLayout />}>
          <Route path="dashboard" element={<DashboardStaff />} />
          <Route path="bookings" element={<BookingStaffManagement />} />

        </Route>
        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  );
};

export default StaffRoutes;
