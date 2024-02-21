// Import các thư viện và component cần thiết
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import AdminPage from './AdminPage';
import LoginPage from './LoginPage';

// Component App
function App() {
  // Trạng thái đăng nhập
  const [isLoggedIn, setLoggedIn] = useState(false);

  // Hàm xác thực đăng nhập
  const handleLogin = () => {
    // Thực hiện xác thực đăng nhập ở đây
    // Sau khi xác thực thành công, đặt isLoggedIn thành true
    setLoggedIn(true);
  };

  return (
    <Router>
      <Route exact path="/">
        {/* Nếu đăng nhập thành công, chuyển hướng sang trang admin, ngược lại, chuyển hướng sang trang đăng nhập */}
        {isLoggedIn ? <Redirect to="/admin" /> : <Redirect to="/login" />}
      </Route>
      <Route path="/login">
        {/* Trang đăng nhập */}
        <LoginPage onLogin={handleLogin} />
      </Route>
      <Route path="/admin">
        {/* Trang admin */}
        {isLoggedIn ? <AdminPage /> : <Redirect to="/login" />}
      </Route>
    </Router>
  );
}

export default App;
