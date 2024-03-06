import React, { useEffect, useState } from "react";
import "../../styles/Guest.css";
import { fetchDataSearch } from "../../services/GuestService";
import { Link } from "react-router-dom";

const Header = () => {
    const [selectedOption, setSelectedOption] = useState([]);
    const [currentSearchText, setCurrentSearchText] = useState("");

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

    const handleSearchChange = (text) => {
        fetchData(text);
    };

    const fetchData = async (text) => {
        try {
            const res = await fetchDataSearch(text);
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
                                <Link className="link-blog" to={item.title ? `/blogs/blog-detail/${item.id}` : `/blogs/film/${item.id}`}>
                                    <div className="item-search" key={index}>
                                        <span>{item.title ?'Blog - ' + item.title : 'Film - ' + item.nameFilm}</span>
                                    </div>
                                </Link>
                            ))
                        ) : ""}
                    </div>
                   
                </div>
            </div>
        </header>
    );
}

export default Header;
