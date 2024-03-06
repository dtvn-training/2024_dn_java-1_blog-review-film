import { useParams } from "react-router-dom";
import BlogGuest from "./BlogGuest";

const BlogByFilm = () => {

    const { filmId } = useParams();

    return ( 
        <BlogGuest filmId={filmId}/>
     );
}

export default BlogByFilm;