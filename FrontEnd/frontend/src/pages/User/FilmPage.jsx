import { Navigate } from "react-router-dom";
import Film from "../../components/film/Film";
import NavBarUser from "../../components/navbar/NavBarUser";

function FilmPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        return ( 
            <>
                <NavBarUser />
                <Film />
            </>
         );
    }
    else {
        return <Navigate to="/login" />;
    }
    
}

export default FilmPage;