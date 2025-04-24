import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login";
import AdminRoutes from "./pages/admin/AdminRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element= {<AdminRoutes />}/>
    </Routes>
  );
};

export default AppRoutes;