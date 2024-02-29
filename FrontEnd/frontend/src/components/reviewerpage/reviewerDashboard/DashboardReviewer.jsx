import ReviewerPage from "../../../pages/Reviewer/reviewer"
import React, { useEffect, useState } from "react";
import { fetchSummaryData } from "../../../services/ReviewerService";
import { useNavigate } from "react-router-dom";


const useSummaryData = () => {
    const [summaryData, setSummaryData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchSummaryData(localStorage.getItem("jwtToken"));

                if (res && res.data) {
                    console.log(res.data)
                    setSummaryData(res.data.data);

                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return summaryData;
};

    const DashBoardReviewer = () => {
        const navigate = useNavigate();
        const summaryData = useSummaryData();

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
            <>
                <ReviewerPage />
                <div>
                    <section className="dashboard">
                        <div className="top">
                            <i className="uil uil-bars sidebar-toggle"></i>
                            <div className="search-box">
                                <i className="uil uil-search"></i>
                                <input type="text" placeholder="Search here..." />
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
                                        <span class="number">{summaryData.totalFilm }</span>
                                    </div>
                                    <div class="box box3">
                                        <i class="uil uil-clapper-board"></i>
                                        <span class="text">Total Blog WAITING</span>
                                        <span class="number">{summaryData.totalReviewer }</span>
                                    </div>
                                </div>
                            </div>

                            <div className="activity">
                                <div class="title" style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                                    <i class="uil uil-clock-three"></i>
                                    <span class="text">Recent Activity</span>
                                </div>
                                <div className="activity-data">
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </>

        );
    }

    export default DashBoardReviewer;