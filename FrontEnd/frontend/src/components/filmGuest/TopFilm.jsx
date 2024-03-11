import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchDataHome } from "../../services/GuestService";

function TopFilm() {
    const navigate = useNavigate();
    const [topFilms, setTopFilms] = useState([]);

    useEffect(() => {
        fetchDataTopFilm();
      }, [navigate]);

    const fetchDataTopFilm = async () => {
        try {
            const res = await fetchDataHome();
            if (res && res.data) {
                setTopFilms(res.data.data.topFilms)
              }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }



    return ( 
        <section class="blog" id="blog">
                <div class="container">
                    <div class="title">
                        <h2>Top Film</h2>
                        <p>recent film</p>
                    </div>
                    <div class="blog-content">
                        {topFilms.map((film, index) => (
                            <div key={index} class="blog-item">
                                <div class="film-img">
                                    <img src={film.image} alt=""/>
                                        <span><i class="far fa-heart"></i></span>
                                </div>
                                <div class="blog-text">
                                    <span>{film.startDate}</span>
                                    <h2>{film.nameFilm}</h2>
                                    <p>{film.description}</p>
                                    <Link to="#">Read More</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
     );
}

export default TopFilm;