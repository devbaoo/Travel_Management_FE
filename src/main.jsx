import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <ConfigProvider locale={viVN}> {/* ← bọc App */}
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </AuthProvider>
  </Provider>
);