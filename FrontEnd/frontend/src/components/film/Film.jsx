import CreateFilm from "./CreateFilm";
import TableFilm from "./TableFilm";
import { useState, useEffect } from "react";

const Film = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user.role === "ROLE_ADMIN";
  const [searchText, setSearchText] = useState("");
  const [currentSearchText, setCurrentSearchText] = useState("");


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
            {isAdmin && <CreateFilm />}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Film;
