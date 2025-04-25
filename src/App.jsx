import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login';
import AdminRoutes from './pages/admin/AdminRoute';
import StaffRoutes from './pages/staff/StaffRoute';
import RequireAuth from './components/RequireAuth';
import NotFound from './pages/NotFound'; // Import the NotFound page



const AppRoutes = () => {

  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;


  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="/" element={!user? <LoginPage/> : user.role === "admin" ? <AdminRoutes/> : <StaffRoutes/>} />


      {/* Admin Routes, protected for admin role */}
      <Route element={<RequireAuth role="admin" />}>
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Route>

      <Route element={<RequireAuth role="staff" />}>
        <Route path="/staff/*" element={<StaffRoutes />} />
      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};


export default AppRoutes;
