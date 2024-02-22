import React from 'react';
import AdminDashboard from './components/adminpage/admindashboard/AdminDashBoard';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import BlogDetail from './components/adminpage/blogdetail/BlogDetail';
import CreateBlog from './components/adminpage/createblog/CreateBlog';
import Login from './components/login/Login';

const App = () => {
  return (
    <>
      <Login />
    </>
  );
}

export default App;