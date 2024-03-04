import CreateReviewer from "./CreateReviewer";
import TableReviewer from "./TableReviewer";



const Reviewer = () => {
    


    return (
        <section className="dashboard">
            <div className="top">
                <i className="uil uil-bars sidebar-toggle"></i>
                <div className="search-box">
                    <i className="uil uil-search"></i>
                    <input type="text" placeholder="Search here..." />
                </div>
                <img src="images/3.jpg" alt="" />
            </div>
            <div className="dash-content">
                <TableReviewer />
                    {/* <EditAccount /> */}
                </div>
        </section>
    );
}

export default Reviewer;