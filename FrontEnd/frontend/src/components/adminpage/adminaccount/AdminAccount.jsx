import React, { useEffect } from 'react';
import '../css/AdminPage.css';
import TableAccount from './TableAccount';
import { Link } from 'react-router-dom';
import FormModalButton from './CreateAccount';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/AuthService';

function AdminAccount() {

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

  useEffect(() => {
    const body = document.querySelector("body");
    const sidebar = document.querySelector("nav");
    const modeToggle = body.querySelector(".mode-toggle");
    const sidebarToggle = body.querySelector(".sidebar-toggle");

    let getMode = localStorage.getItem("mode");
    if (getMode && getMode === "dark") {
      body.classList.toggle("dark");
    }

    let getStatus = localStorage.getItem("status"); 
    if (getStatus && getStatus === "close") {
      sidebar.classList.toggle("close");
    }

    const handleModeToggle = () => {
      body.classList.toggle("dark");
      if (body.classList.contains("dark")) {
        localStorage.setItem("mode", "dark");
      } else {
        localStorage.setItem("mode", "light");
      }
    };

    const handleSidebarToggle = () => {
      sidebar.classList.toggle("close");
      if (sidebar.classList.contains("close")) {
        localStorage.setItem("status", "close");
      } else {
        localStorage.setItem("status", "open");
      }
    };

    modeToggle.addEventListener("click", handleModeToggle);
    sidebarToggle.addEventListener("click", handleSidebarToggle);

    // Clean-up function to remove event listeners
    return () => {
      modeToggle.removeEventListener("click", handleModeToggle);
      sidebarToggle.removeEventListener("click", handleSidebarToggle);
    };
  }, []);

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
              <li>
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
            <div className="title">
              <i className="uil uil-clock-three"></i>
              <span className="text">Account</span>
            </div>
            {/* <FormModalButton /> */}
            <div className="activity-data">
            <TableAccount />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


export default AdminAccount;
