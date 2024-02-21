import React, { useEffect } from 'react';
import styles from   './AdminBlog.module.css';
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
    <div className={styles.adminpage_function_AdminBlog_module}>
      <nav>
        <div className={styles.logo_name}>
          <div className= {styles.logo_image}>
          </div>
          <span className={styles.logo_name}>Admin Page</span>
        </div>
        <div className={styles.menu_items}>
          <ul className={styles.nav_links}>
            <li>
              <a href="#">
                <i className="uil uil-tachometer-fast-alt"></i>
                <span className={styles.link_name}>Dahsboard</span>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="uil uil-user"></i>
                <span className={styles.link_name}>Account</span>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="uil uil-blogger-alt"></i>
                <span className={styles.link_name}>Blog</span>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="uil uil-film"></i>
                <span className={styles.link_name}>Film</span>
              </a>
            </li>
          </ul>
          <ul className={styles.logout_mode}>
            <li>
              <a href="#">
                <i className="uil uil-signout"></i>
                <span className={styles.link_name}>Logout</span>
              </a>
            </li>
            <li className="styles.mode">
              <a href="#">
                <i className="uil uil-moon"></i>
                <span className={styles.link_name}>Dark Mode</span>
              </a>
              <div className="mode-toggle">
                <span className={styles.switch}></span>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <section className={styles.dashboard}>
        <div className={styles.top}>
          <i className="uil uil-bars sidebar-toggle"></i>
          <div className={styles.search_box}>
            <i className="uil uil-search"></i>
            <input type="text" placeholder="Search here..." />
          </div>
          <img src="images/3.jpg" alt="" />
        </div>
        <div className={styles.dash_content}>
          <div className={styles.activity}>
            <div className={styles.title}>
              <i className="uil uil-clock-three"></i>
              <span className={styles.text}>Recent Activity</span>
            </div>
            <div className={styles.activity_data}>
            <TableBlog />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminBlog;
