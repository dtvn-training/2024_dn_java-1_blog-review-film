<<<<<<< Updated upstream
import Login from './components/login/Login';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <div className="App">
      <Login />
      <ToastContainer />
    </div>
=======
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
>>>>>>> Stashed changes
  );
}

export default App;