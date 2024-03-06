import { Navigate } from "react-router-dom";
import DashBoard from "../../components/dashboard/Dashboard";
import NavBarUser from "../../components/navbar/NavBarUser";


const DashBoardPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        return (
            <>
                <NavBarUser />
                <DashBoard />
            </>
        )
    }
    else {
        return <Navigate to="/login" />
    }
}

export default DashBoardPage;