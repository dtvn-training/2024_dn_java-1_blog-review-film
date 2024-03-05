import React from"react";
import ReactDOM from"react-dom/client";
import App from"./App";
import { BrowserRouter, Route, Routes } from"react-router-dom";

import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import UserPage from "./pages/User/DashboardPage";
import ReviewerPage from "./pages/User/ReviewerPage";
import FilmPage from "./pages/User/FilmPage";
import BlogPage from "./pages/User/BlogPage";
import HomePage from "./pages/Guest/HomePage";
import BlogDetailPage from "./pages/Guest/BlogDetailPage";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/user/reviewers" element={<ReviewerPage />} />
        <Route path="/user/films" element={<FilmPage />} />
        <Route path="/user/blogs" element={<BlogPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs/blog-detail/:blogId" element={<BlogDetailPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

