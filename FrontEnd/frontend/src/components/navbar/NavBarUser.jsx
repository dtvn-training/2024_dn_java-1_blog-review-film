import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/UserPage.css";
import { ToastContainer } from "react-toastify";
import { logout } from "../../services/AuthService";
import React, { useEffect, useState } from 'react';




// ... Import statements ...

const NavBarUser = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user.role === 'ROLE_ADMIN';
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedNav, setSelectedNav] = useState('Dashboard');

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
            localStorage.removeItem("user")
            navigate("/login");
        } catch (error) {
            console.error('Error logging out:', error);
            // Xử lý lỗi nếu có
        }
    };

    const handleNavClick = (navName) => {
        setSelectedNav(navName);
    };

    useEffect(() => {
        // Lấy path từ location và cập nhật selectedNav nếu path khác với selectedNav
        const currentPath = location.pathname.split('/')[2]; // Tách path để lấy phần cần so sánh
        if (currentPath && currentPath !== selectedNav) {
            setSelectedNav(currentPath);
        }
    }, [location, selectedNav]);


    return (
        <div className={'nav_1'}>
            <ToastContainer />
            <link
                rel="stylesheet"
                href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
            ></link>
            <nav>
                <div className="logo-name">
                    <div className="logo-image"></div>
                    <span className="logo_name">{isAdmin ? 'Admin Page' : 'Reviewer'}</span>
                </div>
                <div className="menu-items">
                    <ul className="nav-links">
                        <div>
                            <li className={selectedNav === 'Dashboard' ? "active" : ""}>
                                <Link to="/user" onClick={() => handleNavClick('Dashboard')}>
                                    <i className="uil uil-tachometer-fast-alt"></i>
                                    <span className="link-name">Dashboard</span>
                                </Link>
                            </li>

                            {isAdmin && (
                                <li className={selectedNav === 'reviewers' ? "active" : ""}>
                                    <Link to="/user/reviewers" onClick={() => handleNavClick('Reviewer')}>
                                        <i className="uil uil-user"></i>
                                        <span className="link-name">Reviewer</span>
                                    </Link>
                                </li>
                            )}

                            {isAdmin && (
                                <li className={selectedNav === 'blogs' ? "active" : ""}>
                                    <Link to="/user/blogs" onClick={() => handleNavClick('Blog')}>
                                        <i className="uil uil-blogger-alt"></i>
                                        <span className="link-name">Blog</span>
                                    </Link>
                                </li>
                            )}

                            <li className={selectedNav === 'films' ? "active" : ""}>
                                <Link to="/user/films" onClick={() => handleNavClick('Film')}>
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
        </div>
  );
};

export default NavBarUser;
