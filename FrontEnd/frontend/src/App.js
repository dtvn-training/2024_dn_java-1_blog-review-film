import React from 'react';
import AdminDashboard from './components/adminpage/AdminDashBoard';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import BlogDetail from './components/adminpage/blogdetail/BlogDetail';
const App = () => {
  return (
    <>
      <BlogDetail />
      <ToastContainer />
    </>
  );
}

export default App;