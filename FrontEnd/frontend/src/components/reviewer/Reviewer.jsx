import React, { useState, useEffect } from "react";
import TableReviewer from "./TableReviewer";

const Reviewer = () => {
    const [currentSearchText, setCurrentSearchText] = useState("");
    const [searchText, setSearchText] = useState("");
    useEffect(() => {
        const timer = setTimeout(() => {
          handleSearchChange(currentSearchText);
        }, 1000);
    
        return () => clearTimeout(timer);
      }, [currentSearchText]);
    
      const handleSearchChange = (text) => {
        setSearchText(text);
      };

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
      <div className="dash-content">
        <TableReviewer searchText={searchText}/>
        {/* <EditAccount /> */}
      </div>
    </section>
  );
};

export default Reviewer;
