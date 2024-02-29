  import React, { useEffect, useState } from "react";
  import Table from "react-bootstrap/Table";
  import ReactPaginate from "react-paginate";
  import { fetchDashBoard, updateStatusBlog } from "../../services/AdminService";
  import Button from "react-bootstrap/Button";
  import Modal from "react-bootstrap/Modal";
  import { toast } from "react-toastify";
  const Dashboard = () => {
    const [listUsers, setListUsers] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [statusFilter] = useState({
      filter: false,
      status: "",
    });
    const [show, setShow] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      getBlogs(currentPage);
    }, [currentPage, statusFilter]);

    const getBlogs = async (selectedPage) => {
      try {
        const res = await fetchDashBoard(
          selectedPage + 1,
          localStorage.getItem("jwtToken"),
          "WAITING"
        );
        if (res && res.data) {
          const { data, pageInfo } = res.data;
          setListUsers(data);
          setPageCount(pageInfo.total_pages);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const handlePageClick = (selectedPage) => {
      setCurrentPage(selectedPage.selected);
    };

    const updateUserList = () => {
      getBlogs(currentPage);
    };

    const handleClose = () => {
      setSelectedItemId(null); // Reset selectedItemId when closing modal
      setShow(false);
    };

    const handleShow = (itemId) => {
      setSelectedItemId(itemId); // Update selectedItemId when clicking the button
      setShow(true);
    };

    const handleShowModal = (itemId) => {
      setSelectedItemId(itemId); // Update selectedItemId when clicking the button
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setSelectedItemId(null); // Reset selectedItemId when closing modal
      setShowModal(false);
    };

    const handleRefuseBlog = async (id) => {
      try {
        const res = await updateStatusBlog(id, localStorage.getItem("jwtToken"), "REFUSE");
        if (res?.code === 200) updateUserList();
        console.log(res)
        toast.success("Refuse blog successfully");
        handleCloseModal();
        
      } catch (error) {
        console.error("Error refusing blog:", error);
      }
    };

    const handleApproveBlog = async (id) => {
      try {
        const res = await updateStatusBlog(id, localStorage.getItem("jwtToken"), "APPROVE");
        if (res?.code === 200) updateUserList();
        toast.success("Approve blog successfully");
        setShow(false);
      } catch (error) {
        console.error("Error approving blog:", error);
      }
    };

    const renderTableRow = (item, index) => (
      <tr key={index} style={{ textAlign: "center", verticalAlign: "middle" }}>
        <td>{item.id}</td>
        <td style={{ minWidth: "200px" }}>{item.title}</td>
        <td>{item.film.nameFilm}</td>
        <td style={{ minWidth: "200px" }}>{item.postTime}</td>
        <td style={{ minWidth: "200px" }}>{item.updateDateTime}</td>
        <td style={{ minWidth: "150px" }}>{item.updateBy.name}</td>
        <td>{item.status}</td>
        <td>
        {/* <button
              type="button"
              className="btn btn-danger mb-2 mb-md-0 me-md-2"
              onClick={() => handleShowModal(item.id)}
            >
              Refuse
            </button>
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Refusal</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to refuse this blog?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => handleRefuseBlog(selectedItemId)}>
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleShow(item.id)}
            >
              Approve
            </button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Approval</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to approve this blog?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => handleApproveBlog(selectedItemId)}>
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal> */}
             <a>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="eye"><path fill="#6563FF" d="M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z" style={{height: '8px', color: 'blueviolet'}}></path></svg>
             </a>
        </td>
      </tr>
    );

    return (
      <div style={{overflowX: 'auto'}}>
        <div className="table-responsive" style={{ maxWidth: "1600px", minWidth: "1600px" }}>
        <Table striped bordered hover>
          <thead>
            <tr style={{ textAlign: "center", verticalAlign: "middle" }}>
              <th>id</th>
              <th>Title</th>
              <th>Film</th>
              <th>Post Time</th>
              <th>Update DateTime</th>
              <th>Update by reviewer</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listUsers && listUsers.length > 0 && listUsers.map(renderTableRow)}
          </tbody>
        </Table>

        <div style={{ marginTop: "15px" }}>
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

      </div>
      
    );
  };

  export default Dashboard;
