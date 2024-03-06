import { Navigate } from "react-router-dom";
import Blog from "../../components/blog/Blog";
import NavBarUser from "../../components/navbar/NavBarUser";

const BlogPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        return (
            <>
                <NavBarUser />
                <Blog />
            </>
        );
    }
    else {
        return <Navigate to="/login" />;
    }

}

export default BlogPage;