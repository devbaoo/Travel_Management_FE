import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <ConfigProvider locale={viVN}> {/* ← bọc App */}
          <App />
          <ToastContainer /> 
        </ConfigProvider>
      </BrowserRouter>
    </AuthProvider>
  </Provider>
);