import "../../styles/Guest.css"


const Header = () => {


    return (
        <header>
                <div class="navbar">
                    <div class="container">
                        <a href="/" class="navbar-brand">Blog Review Film</a>
                        <div class="navbar-nav">
                            <a href="/">home</a>
                            <a href="/blogs">blog</a>
                            <a href="/reviewers">reviewer</a>
                            <a href="/login">sign in</a>
                            <a href="/signup">sign up</a>
                        </div>
                    </div>
                </div>
                <div class="banner">
                    <div class="container">
                        <h1 class="banner-title">
                            <span>Blog Review Film</span>
                        </h1>
                        <p>The greatest thing you'll ever learn is just to love and be loved in return
                        </p>
                        <form>
                            <input type="text" class="search-input" placeholder="find your food . . ." />
                            <button type="submit" class="search-btn">
                                <i class="fas fa-search"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </header>
    );
}

export default Header;