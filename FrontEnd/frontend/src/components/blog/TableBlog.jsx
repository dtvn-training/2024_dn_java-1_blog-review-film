import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { deleteBlog, fetchAllBlog } from "../../services/AdminService";
import DateTimePicker from "react-datetime-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BlogDetail from "../blogDetail/BlogDetail";
import "../../styles/BlogDetail.css"

const TableBlog = ({ searchText }) => {
    const [listItems, setListItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [showModalAddNew, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState({ filter: false, status: "" });
    const [activeFilter, setActiveFilter] = useState(null);
    const [show, setShow] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showBlogDetail, setShowBlogDetail] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    

    const handleShowBlogDetail = (id) => {
        setSelectedBlogId(id);
        setShowBlogDetail(true);
    };
    

    const handleCloseBlogDetail = () => {
        setShowBlogDetail(false);
    };



    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, statusFilter, searchText]);

    const fetchData = async (selectedPage, status) => {
        try {
            if (statusFilter.filter) {
                status = statusFilter.status;
            }
            const res = await fetchAllBlog(selectedPage + 1, localStorage.getItem("jwtToken"), status, searchText);
            if (res && res.data) {
                const { data, pageInfo } = res.data;
                setListItems(data);
                setPageCount(pageInfo.total_pages);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }



    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    }

    const handleFilter = (status) => {
        if (activeFilter === status) {
            setStatusFilter({ filter: false, status: "" });
            setActiveFilter(null);
        } else {
            // Nếu không, cập nhật bình thường
            setStatusFilter({ filter: true, status: status });
            setActiveFilter(status);
        }
        setCurrentPage(0);
    };

    const handleShow = (itemId) => {
        setSelectedItemId(itemId); // Update selectedItemId when clicking the button
        setShow(true);
    };


    const handleClose = () => {
        setSelectedItemId(null); // Reset selectedItemId when closing modal
        setShow(false);
    };

    const updateUserList = () => {
        fetchData(currentPage);
    }

    const handleEditItem = (item) => {
        console.log('Edit item:', item);
    };

    const handleDeleteBlog = async (id) => {
        try {
            const res = await deleteBlog(id, localStorage.getItem("jwtToken"));
            if (res?.code === 200) updateUserList();
            setShow(false);
        } catch (error) {
            console.error("Error Delete blog:", error);
        }
    };

    const handleSearchTime = () => {
        // Thực hiện tìm kiếm theo thời gian dựa trên giá trị startDate và endDate
        console.log("Searching by time:", startDate, endDate);
    };

    const renderTableRow = (item, index) => (
        <tr key={index} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
            <td>{item.id}</td>
            <td style={{ minWidth: '200px' }}>{item.title}</td>
            <td>{item.film.nameFilm}</td>
            <td>{item.postTime}</td>
            <td>{item.updateDateTime}</td>
            <td>{item.updateBy.name}</td>
            <td>{item.status}</td>
            <td>
                <div className="d-flex flex-column flex-md-row align-items-md-center">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleShowBlogDetail(item.id)}
                    >
                        <FontAwesomeIcon icon="fa-solid fa-eye" />
                    </button>
                </div>
            </td>
        </tr>

        
    );
    return (
        <div style={{ overflowX: 'auto' }}>
            <div style={{ marginBottom: '15px' }}>
                <Button
                    variant={activeFilter === 'APPROVE' ? 'success' : 'outline-success'}
                    onClick={() => handleFilter('APPROVE')}
                >
                    Approve
                </Button>{' '}
                <Button
                    variant={activeFilter === 'REFUSE' ? 'secondary' : 'outline-secondary'}
                    onClick={() => handleFilter('REFUSE')}
                >
                    Refuse
                </Button>{' '}
                <Button
                    variant={activeFilter === 'WAITING' ? 'warning' : 'outline-warning'}
                    onClick={() => handleFilter('WAITING')}
                >
                    Waiting
                </Button>{' '}
            </div>
            <div className="table-responsive" style={{ maxWidth: '1600px', minWidth: '1600px' }}>
                <Table striped bordered hover>
                    <thead>
                        <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                            <th>id</th>
                            <th>Title</th>
                            <th>Film</th>
                            <th>Post Time</th>
                            <th>UpdateDateTime</th>
                            <th>Update by reviewer</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listItems && listItems.length > 0 && listItems.map(renderTableRow)}
                    </tbody>
                </Table>
            </div>
            <div style={{ marginTop: '15px' }}>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="Previous"
                    renderOnZeroPageCount={null}
                    containerClassName="pagination"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    activeClassName="active"
                    previousClassName="page-item"
                    nextClassName="page-item"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    previousLinkClassName="page-link"
                    nextLinkClassName="page-link"
                />
            </div>
            <Modal show={showBlogDetail} onHide={handleCloseBlogDetail} dialogClassName="custom-modal-width">
                <Modal.Body>
                    <BlogDetail blogId={selectedBlogId}/>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default TableBlog;