import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./pages/admin/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/sellers" replace />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;