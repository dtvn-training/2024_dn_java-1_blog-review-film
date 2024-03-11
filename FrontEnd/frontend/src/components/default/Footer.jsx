import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
    return ( 
        <footer>
                <div class="social-links">
                    <a href="#"><FontAwesomeIcon icon="fa-brands fa-facebook-f" /></a>
                    <a href="#"><FontAwesomeIcon icon="fa-brands fa-twitter" /></a>
                    <a href="#"><FontAwesomeIcon icon="fa-brands fa-instagram" /></a>
                    <a href="#"><FontAwesomeIcon icon="fa-brands fa-pinterest" /></a>
                </div>
                <span>Review Film</span>
            </footer>
     );
}

export default Footer;