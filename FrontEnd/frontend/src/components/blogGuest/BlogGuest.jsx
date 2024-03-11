import { useEffect, useState } from "react";
import "../../styles/Blog.css"
import { Link } from "react-router-dom";
import { fetchDataBlogs, fetchDataBlogsByFilm, fetchDataSearchBlog } from "../../services/GuestService";
import ReactPaginate from "react-paginate";


const BlogGuest = ( {filmId}) => {
    const [selectedOption, setSelectedOption] = useState([]);
    const [currentSearchText, setCurrentSearchText] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [blogs, setBlogs] = useState([]);



    useEffect(() => {
        fetchDataBlog(currentPage);
    }, [currentPage]);


    const fetchDataBlog = async (selectedPage) => {
        try {
            if (filmId !== undefined) {
                const res = await fetchDataBlogsByFilm(filmId ,selectedPage + 1);
                if (res && res.data) {
                    const { data, pageInfo } = res.data;
                    setBlogs(data)
                    setPageCount(pageInfo.total_pages);
                }
            } else {
                const res = await fetchDataBlogs(selectedPage + 1);
                if (res && res.data) {
                    const { data, pageInfo } = res.data;
                    setBlogs(data)
                    setPageCount(pageInfo.total_pages);
                }
            }
            
            
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const handleSearchChange = (text) => {
        fetchDataSearch(text);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentSearchText !== "") {
                handleSearchChange(currentSearchText);
            } else {
                handleClearSearch()
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [currentSearchText]);



    const fetchDataSearch = async (text) => {
        try {
            const res = await fetchDataSearchBlog(text);
            if (res && res.data) {
                setSelectedOption(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleInputChange = (event) => {
        setCurrentSearchText(event.target.value);
    }

    const handleClearSearch = () => {
        setSelectedOption([])
    }


    return (
        <>
            <header>
                <div className="navbar">
                    <div className="container">
                        <a href="/" className="navbar-brand">Blog Review Film</a>
                        <div className="navbar-nav">
                            <a href="/">home</a>
                            <a href="/blogs">blog</a>
                            <a href="/films">film</a>
                            <a href="/login">sign in</a>
                            <a href="/signup">sign up</a>
                        </div>
                    </div>
                </div>
                <div className="banner">
                    <div className="container">
                        <h1 className="banner-title">
                            <span>Blog Review Film</span>
                        </h1>
                        <p>The greatest thing you'll ever learn is just to love and be loved in return</p>
                        <form>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="find your food . . ."
                                value={currentSearchText}
                                onChange={handleInputChange}
                            />
                            <button type="submit" class="search-btn">
                                <i class="fas fa-search"></i>
                            </button>
                        </form>
                        <div className="search">
                            {currentSearchText !== "" ? (
                                selectedOption.map((item, index) => (
                                    <Link className="link-blog" to={`/blogs/blog-detail/${item.id}`}>
                                        <div className="item-search" key={index}>
                                            <span>{item.title}</span>
                                        </div>
                                    </Link>
                                ))
                            ) : ""}
                        </div>

                    </div>
                </div>
            </header>
            <section class="blog" id="blog">
                <div class="container">
                    <div class="title">
                        <h2>Blog</h2>
                        <p>Be where your feet are</p>
                    </div>
                    <div class="blog-content">
                        {blogs.map((blog, index) => (
                            <Link className="link-blog">
                                <div key={index} class="blog-item">
                                    <div class="blog-img">
                                        <img src={blog.imageIntroduce} alt="" />
                                        <span><i class="uil uil-star"></i> {blog.point}/10</span>
                                    </div>
                                    <div class="blog-text">
                                        <span>{blog.postTime}</span>
                                        <h2>{blog.title}</h2>
                                        <p className="description">{blog.summary}</p>
                                        <Link to={`/blogs/blog-detail/${blog.id}`}>Read More</Link>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <div style={{ marginTop: "15px" }}>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="Previous"
                    renderOnZeroPageCount={null}
                    containerClassName="pagination"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    activeClassName="active"
                    previousClassName="page-item"
                    nextClassName="page-item"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    previousLinkClassName="page-link"
                    nextLinkClassName="page-link"
                />
            </div>
            <footer>
                <div class="social-links">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-pinterest"></i></a>
                </div>
                <span>Review Film</span>
            </footer>
        </>
    );
}

export default BlogGuest;