import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import ReactPaginate from "react-paginate";
import { fetchDashBoard, updateStatusBlog } from "../../services/AdminService";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

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

  const handleRefuseBlog = async (id) => {
    try {
      const res = await updateStatusBlog(id, localStorage.getItem("jwtToken"), "REFUSE");
      if (res?.code === 200) updateUserList();
      setShow(false);
    } catch (error) {
      console.error("Error refusing blog:", error);
    }
  };

  const handleApproveBlog = async (id) => {
    try {
      const res = await updateStatusBlog(id, localStorage.getItem("jwtToken"), "APPROVE");
      if (res?.code === 200) updateUserList();
      setShow(false);
    } catch (error) {
      console.error("Error approving blog:", error);
    }
  };

  const renderTableRow = (item, index) => (
    <tr key={index} style={{ textAlign: "center", verticalAlign: "middle" }}>
      <td>{item.id}</td>
      <td style={{ minWidth: "200px" }}>{item.title}</td>
      <td>{item.filmId}</td>
      <td style={{ minWidth: "200px" }}>{item.postTime}</td>
      <td style={{ minWidth: "200px" }}>{item.updateDateTime}</td>
      <td style={{ minWidth: "150px" }}>{item.updateByReviewerId}</td>
      <td>{item.status}</td>
      <td>
        <div className="d-flex flex-column flex-md-row align-items-md-center">
          <button
            type="button"
            className="btn btn-danger mb-2 mb-md-0 me-md-2"
            onClick={() => handleShow(item.id)}
          >
            Refuse
          </button>
          <Modal show={show} onHide={handleClose}>
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
          </Modal>
        </div>
      </td>
    </tr>
  );

  return (
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
          {listUsers &&
            listUsers.length > 0 &&
            listUsers.map((item, index) => renderTableRow(item, index))}
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
  );
};

export default Dashboard;
