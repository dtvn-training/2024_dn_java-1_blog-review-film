import { useEffect, useState } from "react";
import { fetchDataFilms, fetchDataSearchFilm } from "../../services/GuestService";
import { Link } from "react-router-dom";
import "../../styles/Film.css"
import ReactPaginate from "react-paginate";

const FilmGuest = () => {

    const [selectedOption, setSelectedOption] = useState([]);
    const [currentSearchText, setCurrentSearchText] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [films, setFilms] = useState([]);



    useEffect(() => {
        fetchDataBlog(currentPage);
    }, [currentPage]);


    const fetchDataBlog = async (selectedPage) => {
        try {
            const res = await fetchDataFilms(selectedPage + 1);
            if (res && res.data) {
                const { data, pageInfo } = res.data;
                setFilms(data)
                setPageCount(pageInfo.total_pages);
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
            const res = await fetchDataSearchFilm(text);
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


    console.log(films)

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
                                            <span>{item.nameFilm}</span>
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
                        <h2>List Film</h2>
                        <p>recent film</p>
                    </div>
                    <div class="blog-content">
                        {films.map((film, index) => (
                            <div key={index} class="blog-item">
                            <div class="film-img">
                                <img src={film.image} alt="" />
                                <span><i class="far fa-heart"></i></span>
                            </div>
                            <div class="blog-text">
                                <span>{film.startDate}</span>
                                <h2>{film.nameFilm}</h2>
                                <p className="description">{film.description}</p>
                                <Link to={`/films/film-detail/${film.id}`}>Read More</Link>
                            </div>
                        </div>
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

export default FilmGuest;