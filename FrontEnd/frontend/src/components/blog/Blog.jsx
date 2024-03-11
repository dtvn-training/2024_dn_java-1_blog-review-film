import { useState, useEffect } from "react";
import TableBlog from "./TableBlog";
import CreateBlog from "./CreateBlog";
import { Toast, ToastContainer } from "react-bootstrap";
const Blog = () => {
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
        < TableBlog searchText={searchText} />
      </div>
    </section>
  );
}

export default Blog;
