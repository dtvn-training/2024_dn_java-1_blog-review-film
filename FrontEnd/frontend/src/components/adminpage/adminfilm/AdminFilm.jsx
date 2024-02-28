import React, { useEffect, useState } from 'react';
import TableFilm from './TableFilm';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/AuthService';
import '../css/AdminPage.css';
import { Toast } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import CreateFilm from './CreateFilm';
const AdminFilm = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = () => {
      const isAuthenticated = localStorage.getItem("authenticated");
      if (!isAuthenticated || isAuthenticated !== "true") {
        navigate("/login");
      }
    };
    checkAuthentication();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("authenticated");
      localStorage.removeItem("jwtToken");
      navigate("/login");
    } catch (error) {
      console.error('Error logging out:', error);
      // Xử lý lỗi nếu có
    }
  };

  return (
    <div>
      <ToastContainer />
      <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"></link>
      <nav>
        <div className="logo-name">
          <div className="logo-image">
          </div>
          <span className="logo_name">Admin Page</span>
        </div>
        <div className="menu-items">
          <ul className="nav-links">
          <div>
              <li>
                <Link to="/admin/dashboard">
                  <i className="uil uil-tachometer-fast-alt"></i>
                  <span className="link-name">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/account">
                  <i className="uil uil-user"></i>
                  <span className="link-name">Reviewer</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/blog">
                  <i className="uil uil-blogger-alt"></i>
                  <span className="link-name">Blog</span>
                </Link>
              </li>
              <li style={{ backgroundColor: "lightblue", color: "black" }}>
                <Link to="/admin/film">
                  <i className="uil uil-film"></i>
                  <span className="link-name">Film</span>
                </Link>
              </li>
            </div>
          </ul>
          <ul className="logout-mode">
            <li>
              <a href="#" onClick={handleLogout}>
                <i className="uil uil-signout"></i>
                <span className="link-name">Logout</span>
              </a>
            </li>
            <li className="mode">
              <a href="#">
                <i className="uil uil-moon"></i>
                <span className="link-name">Dark Mode</span>
              </a>
              <div className="mode-toggle">
                {/* <span className="switch"></span> */}
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <section className="dashboard">
        <div className="top">
          <i className="uil uil-bars sidebar-toggle"></i>
          <div className="search-box">
            <i className="uil uil-search"></i>
            <input type="text" placeholder="Search here..." />
          </div>
          <img src="images/3.jpg" alt="" />
        </div>
        <div className="dash-content">
          <div className="activity">
            <div className="title" style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
              <i className="uil uil-clock-three"></i>
              <span className="text">Film List</span>
            </div>
            <div className="activity-data">
            <TableFilm />
            <CreateFilm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


export default AdminFilm;
