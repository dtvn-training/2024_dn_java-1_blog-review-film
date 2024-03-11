import { Navigate } from "react-router-dom";
import NavBarUser from "../../components/navbar/NavBarUser";
import Reviewer from "../../components/reviewer/Reviewer";

function ReviewerPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        return ( 
            <>
                <NavBarUser />
                <Reviewer />
            </>
         );
    }
    else {
        return <Navigate to="/login" />;
    }
}

export default ReviewerPage;