
import React from"react";
import ReactDOM from"react-dom/client";
import App from"./App";
import { BrowserRouter, Route, Routes } from"react-router-dom";
import Login from"./components/login/Login";
import AdminBlog from"./components/adminpage/adminblog/AdminBlog";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="login" element={<Login />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

