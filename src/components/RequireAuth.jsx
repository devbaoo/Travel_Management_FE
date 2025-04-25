// src/components/RequireAuth.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const RequireAuth = ({ role }) => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;



  // If there's no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }


  // If the user's role doesn't match the required role, redirect to NotFound
  if (role && user?.role !== role) {
    return <Navigate to="/not-found" replace />;
  }


  return <Outlet />;
};

export default RequireAuth;
