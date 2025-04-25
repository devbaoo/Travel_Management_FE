import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));  // Lấy user từ localStorage
        setToken(storedToken);  // Lấy token từ localStorage


      }
    } catch (err) {
      console.error("Lỗi khi đọc user từ localStorage:", err);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, []);
  const login = (userData, token) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);
      setToken(token);
    } catch (err) {
      console.error("Lỗi khi lưu thông tin đăng nhập:", err);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  const isAdmin = () => user && user.role === 'admin';
  const isStaff = () => user && user.role === 'staff';


  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
