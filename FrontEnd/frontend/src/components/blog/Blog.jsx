import { useState, useEffect } from "react";
import TableBlog from "./TableBlog";

const Blog = () => {
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
        <div className="activity">
          <div className="title" style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
            <i className="uil uil-clock-three"></i>
            <span className="text">Blog List</span>
          </div>
          <div className="activity-data">
            <TableBlog searchText={searchText} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Blog;