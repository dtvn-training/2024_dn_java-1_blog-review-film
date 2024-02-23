
import React from"react";
import ReactDOM from"react-dom/client";
import App from"./App";
import { BrowserRouter, Route, Routes } from"react-router-dom";
import Login from"./components/login/Login";
import AdminBlog from"./components/adminpage/adminblog/AdminBlog";
import BlogDetail from "./components/adminpage/blogdetail/BlogDetail";
import CreateBlog from "./components/adminpage/createblog/CreateBlog";
import AdminDashBoard from "./components/adminpage/admindashboard/AdminDashBoard";
import AdminFilm from "./components/adminpage/adminfilm/AdminFilm";
import AdminAccount from "./components/adminpage/adminaccount/AdminAccount";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/edit" element={<BlogDetail />} />
        <Route path="/admin/dashboard" element={<AdminDashBoard />} />
        <Route path="/admin/film" element={<AdminFilm />} />
        <Route path="/admin/account" element={<AdminAccount />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

