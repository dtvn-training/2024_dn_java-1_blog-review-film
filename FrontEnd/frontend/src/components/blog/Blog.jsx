import TableBlog from "./TableBlog";

const Blog = () => {
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
              <span className="text">Blog List</span>
            </div>
            <div className="activity-data">
            <TableBlog />
            </div>
          </div>
        </div>
      </section>
     );
}

export default Blog;