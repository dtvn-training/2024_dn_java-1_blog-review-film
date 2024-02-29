import { Link } from "react-router-dom";
import "./reviewer.module.css";



function ReviewerPage() {
    return (
        <div>
            <link
                rel="stylesheet"
                href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
            ></link>
            <nav>
                <div className="logo-name">
                    <div className="logo-image"></div>
                    <span className="logo_name">Reviewer</span>
                </div>
                <div className="menu-items">
                    <ul className="nav-links">
                        <div>
                            <li>
                                <Link to="/reviewer">
                                    <i className="uil uil-tachometer-fast-alt"></i>
                                    <span className="link-name">Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/reviewer/film">
                                    <i className="uil uil-film"></i>
                                    <span className="link-name">Film</span>
                                </Link>
                            </li>
                        </div>
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
                                {/* <span className="switch"></span> */}
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default ReviewerPage;