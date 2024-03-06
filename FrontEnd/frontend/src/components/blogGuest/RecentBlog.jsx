import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchDataHome } from "../../services/GuestService";
import "../../styles/Guest.css"

const RecentBlog = () => {

    const navigate = useNavigate();
    const [recentBlogs, setRecentBlogs] = useState([]);


    useEffect(() => {
        fetchDataRecentBlog();
    }, [navigate]);

    const fetchDataRecentBlog = async () => {
        try {
            const res = await fetchDataHome();
            if (res && res.data) {
                setRecentBlogs(res.data.data.recentBlogs)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    return (
        <section class="design" id="design">
            <div class="container">
                <div class="title">
                    <h2>Recent Blog</h2>
                    <p>recent film and movie on the blog</p>
                </div>

                <div class="design-content">
                    {recentBlogs.map((blog, index) => (
                        <div key={index} class="design-item">
                            <Link className="link-blog" to={`/blogs/blog-detail/${blog.id}`}>
                                <div class="design-img">
                                    <img src={blog.imageIntroduce} alt="" />
                                    <span><i class="uil uil-star"></i> {blog.point}/10</span>
                                    <span></span>
                                </div>
                                <div class="design-title">
                                    {blog.title}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default RecentBlog;