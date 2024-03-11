import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/UserPage.css"
import { fetchSummaryData } from "../../services/AdminService";
import BlogWaiting from "./BlogWaiting";
import TableBlog from "../blog/TableBlog";


const useSummaryData = () => {
    const [summaryData, setSummaryData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchSummaryData(localStorage.getItem("jwtToken"));

                if (res && res.data) {
                    setSummaryData(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // Đặt dependency array là [] để đảm bảo useEffect chỉ chạy một lần sau khi mount component

    return summaryData;
};



const DashBoard = () => {
    const navigate = useNavigate();
    const summaryData = useSummaryData();
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user.role === 'ROLE_ADMIN';
    const [searchText, setSearchText] = useState("");
    const [currentSearchText, setCurrentSearchText] = useState("");

    useEffect(() => {
        // Thiết lập một timer để chờ 1 giây trước khi gọi hàm handleSearchChange
        const timer = setTimeout(() => {
        handleSearchChange(currentSearchText);
        }, 1000);

        // Hủy timer cũ khi useEffect được gọi lại
        return () => clearTimeout(timer);
    }, [currentSearchText]);

    const handleSearchChange = (text) => {
        setSearchText(text);
    };

    useEffect(() => {
        const checkAuthentication = () => {
            const isAuthenticated = localStorage.getItem("authenticated");
            if (!isAuthenticated || isAuthenticated !== "true") {
                navigate("/login");
            }
        };
        checkAuthentication();
    }, [navigate]);


    return (
        <section className="dashboard">
            <div className="top">
                <i className="uil uil-bars sidebar-toggle"></i>
                <div className="search-box">
                    <i className="uil uil-search"></i>
                    <input
                        type="text"
                        placeholder="Search here..."
                        value={currentSearchText}
                        onChange={(e) => setCurrentSearchText(e.target.value)}
                    />
                </div>
                <img src="images/3.jpg" alt="" />
            </div>

            <div class="dash-content">
                <div class="overview">
                    <div class="title" style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                        <i class="uil uil-chart-line"></i>
                        <span class="text">Summary</span>
                    </div>

                    <div class="boxes">
                        <div class="box box1">
                            <i class="uil uil-document-layout-left"></i>
                            <span class="text">Total Blog</span>
                            <span class="number">{summaryData.totalBlog}</span>
                        </div>
                        <div class="box box2">
                            <i class="uil uil-clapper-board"></i>
                            <span class="text">Total Film</span>
                            <span class="number">{summaryData.totalFilm}</span>
                        </div>
                        <div class="box box3">
                            <i class="uil uil-user-square"></i>
                            <span class="text">{isAdmin ? 'Total Blog' : 'Total Blog Waiting'}</span>
                            <span class="number">{summaryData.totalReviewer}</span>
                        </div>
                    </div>
                </div>
                {isAdmin ? <BlogWaiting searchText={searchText} /> : <TableBlog searchText={searchText} />}
            </div>
        </section>
    );
}

export default DashBoard;