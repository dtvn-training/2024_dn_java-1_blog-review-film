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
        <TableFilm searchText={searchText} />
        {isAdmin && <CreateFilm />}
      </div>
    </section>
  );
};

export default Film;
