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
          <TableBlog />
        </div>
      </section>
     );
}

export default Blog;