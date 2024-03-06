import RecentBlog from "../../components/blogGuest/RecentBlog";
import Footer from "../../components/default/Footer";
import Header from "../../components/default/Header";
import TopFilm from "../../components/filmGuest/TopFilm";

const HomePage = () => {
    return ( 
        <>
            <Header />
            <RecentBlog />
            <TopFilm />
            <Footer />
        </>
     );
}

export default HomePage;