import { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { deleteBlog, fetchAllBlog } from "../../services/AdminService";

const TableBlog = () => {
    const [listItems, setListItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [showModalAddNew, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState({ filter: false, status: "" });
    const [activeFilter, setActiveFilter] = useState(null);
    const [show, setShow] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, statusFilter]);

    const fetchData = async (selectedPage, status) => {
        try {
            if (statusFilter.filter) {
                status = statusFilter.status;
            }
            const res = await fetchAllBlog(selectedPage + 1, localStorage.getItem("jwtToken"), status);
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
        setStatusFilter({ filter: true, status: status });
        setCurrentPage(0);
        setActiveFilter(status);
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
                        className="btn btn-danger mb-2 mb-md-0 me-md-2"
                        onClick={() => handleShow(item.id)}
                    >
                        Delete
                    </button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Refusal</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to delete this blog?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={() => handleDeleteBlog(selectedItemId)}>
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <button type="button" className="btn btn-primary" onClick={() => handleEditItem(item)}>
                        Edit
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
        </div>
    );
}

export default TableBlog;