import React, { useEffect } from 'react';
import './AdminBlog.css';
import TableBlog from './TableBlog';

function AdminBlog() {
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
            <li>
              <a href="#">
                <i className="uil uil-tachometer-fast-alt"></i>
                <span className="link-name">Dahsboard</span>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="uil uil-user"></i>
                <span className="link-name">Account</span>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="uil uil-blogger-alt"></i>
                <span className="link-name">Blog</span>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="uil uil-film"></i>
                <span className="link-name">Film</span>
              </a>
            </li>
          </ul>
          <ul className="logout-mode">
            <li>
              <a href="#">
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
                <span className="switch"></span>
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
              <span className="text">Recent Activity</span>
            </div>
            <div className="activity-data">
            <TableBlog />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


export default AdminBlog;