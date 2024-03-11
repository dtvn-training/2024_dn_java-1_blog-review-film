// Import useState
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../../styles/UserPage.css";
import { deleteBlog } from "../../services/AdminService";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchDashBoard, updateStatusBlog } from "../../services/AdminService";
import BlogDetail from "../blogDetail/BlogDetail";

const BlogWaiting = ({ searchText }) => {
  // Define state variables
  const [listUsers, setListUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter] = useState({
    filter: false,
    status: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [showBlogDetail, setShowBlogDetail] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [blogToRemove, setBlogToRemove] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user.role === "ROLE_ADMIN";

  // Fetch data from API
  useEffect(() => {
    const savedListUsers = JSON.parse(localStorage.getItem("listUsers"));
    if (savedListUsers) {
      setListUsers(savedListUsers);
    }
  }, []);

  useEffect(() => {
    getBlogs(currentPage);
  }, [currentPage, statusFilter, searchText]);

  const handleRemoveBlog = (blogId) => {
    setBlogToRemove(blogId);
  };

  const getBlogs = async (selectedPage) => {
    try {
      const res = await fetchDashBoard(
        selectedPage + 1,
        localStorage.getItem("jwtToken"),
        "WAITING",
        searchText
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
    setSelectedItemId(null);
    setShow(false);
  };

  const handleShow = (itemId) => {
    setSelectedItemId(itemId);
    setShow(true);
  };

  const handleShowModal = (itemId) => {
    setSelectedItemId(itemId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedItemId(null);
    setShowModal(false);
  };

  const handleShowApproveModal = () => {
    setShowApproveModal(true);
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
  };

  const handleShowRefuseModal = (itemId) => {
    setSelectedItemId(itemId);
    setShowRefuseModal(true);
  };

  const handleCloseRefuseModal = () => {
    setSelectedItemId(null);
    setShowRefuseModal(false);
  };

  const handleEditItem = (item) => {
    console.log("Edit item:", item);
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleShowBlogDetail = (id) => {
    setSelectedBlogId(id);
    setShowBlogDetail(true);
  };

  const handleCloseBlogDetail = () => {
    setSelectedBlogId(null);
    setShowBlogDetail(false);
    getBlogs(currentPage);
  };

  const handleSelectItem = (id) => {
    const selectedIndex = selectedItems.indexOf(id);
    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, id]);
      console.log(selectedItems);
    } else {
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems.splice(selectedIndex, 1);
      setSelectedItems(updatedSelectedItems);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === listUsers.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(listUsers.map((item) => item.id));
    }
  };

  const handleApproveBlog = async () => {
    try {
      const res = await updateStatusBlog(
        selectedItems,
        localStorage.getItem("jwtToken"),
        "APPROVE"
      );
      if (res.code === 200) {
        updateUserList();
        handleCloseApproveModal();
        toast.success("Approve blog successfully");
        setSelectedItems([]);
      } else {
        toast.error("Failed to approve blog. Please try again later.");
      }
    } catch (error) {
      console.error("Error active blog:", error);
      toast.error("An error occurred while approve blog.");
    }
  };

  const handleRefuseBlog = async () => {
    try {
      const res = await updateStatusBlog(
        selectedItems,
        localStorage.getItem("jwtToken"),
        "REFUSE"
      );
      console.log(res);
      if (res.code === 200) {
        updateUserList();
        handleCloseRefuseModal();
        toast.success("Refuse blog successfully");
        setSelectedItems([]);
      } else {
        toast.error("Failed to refuse blog. Please try again later.");
      }
    } catch (error) {
      console.error("Error refuse blog:", error);
      toast.error("An error occurred while refuse blog.");
    }
  };

  const handleDeleteBlog = async () => {
    try {
      const res = await deleteBlog(
        selectedItems,
        localStorage.getItem("jwtToken")
      );
      if (res.data.code === 200) {
        updateUserList();
        handleCloseDeleteModal();
        toast.success("Delete blog successfully");
        setSelectedItems([]);
      } else {
        toast.error("Failed to delete blog. Please try again later.");
      }
    } catch (error) {
      console.error("Error delete blog:", error);
      toast.error("An error occurred while delete blog.");
    }
  };

  const renderTableRow = (item, index) => {
    const formattedStartDate = moment(item.postTime).format("DD/MM/YYYY HH:mm:ss");
  
    return (
      <tr key={index} style={{ textAlign: "center", height: "30px" }}>
        <td style={{ textAlign: "center" }}>
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => handleSelectItem(item.id)}
          />
        </td>
        <td style={{ textAlign: "right", height: "10px" }}>{index + 1}</td>
        <td style={{ minWidth: "200px", textAlign: "left" }}>{item.title}</td>
        <td style={{ textAlign: "left" }}>{item.film.nameFilm}</td>
        <td style={{ minWidth: "200px", textAlign: "center" }}>
          {formattedStartDate}
        </td>
        <td style={{ minWidth: "150px", textAlign: "center" }}>
          {item.updateBy.name}
        </td>
        <td style={{ textAlign: "center" }}>{item.status}</td>
        <td>
          <div className="d-flex flex-column flex-md-row align-items-md-center">
            <button
              style={{ display: "block", margin: "auto" }}
              type="button"
              className="btn btn-primary"
              onClick={() => handleShowBlogDetail(item.id)}
            >
              {/* Correct usage of FontAwesomeIcon component */}
              <FontAwesomeIcon icon={["fas", "eye"]} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="activity" style={{ position: "relative" }}>
      <div
        className="title"
        style={{
          backgroundColor: "#f0f0f0",
          padding: "10px",
          borderRadius: "5px",
          position: "relative", // Đảm bảo phần tử cha có kiểu hiển thị là relative
        }}
      >
        <i className="uil uil-clock-three"></i>
        <span class="text">{isAdmin ? "Blog Waiting List" : "Blog List"}</span>
        {/* Chỉ hiển thị nút khi có các mục đã được chọn */}
        {selectedItems.length > 0 ? (
          <div
            style={{ position: "absolute", top: 0, right: '10px', margin: "10px" }}
          >
            <button
              className="btn btn-danger mb-2 mb-md-0 me-md-2"
              onClick={handleShowDeleteModal}
              style={{ marginRight: "10px" }}
            >
              Delete
            </button>
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete all this blog?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDeleteModal}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleDeleteBlog}>
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
            <button
              className="btn btn-primary mr-2"
              onClick={handleShowApproveModal}
              style={{ marginRight: "10px" }}
            >
              Approve
            </button>
            <Modal show={showApproveModal} onHide={handleCloseApproveModal}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Approve</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to approve all this blog?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseApproveModal}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleApproveBlog}>
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
            <Button variant="secondary" onClick={handleShowRefuseModal}>
              Refuse
            </Button>
            <Modal show={showRefuseModal} onHide={handleCloseRefuseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Refusal</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to refuse this blog?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseRefuseModal}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleRefuseBlog}>
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        ) : (
          <div
            style={{ position: "absolute", top: 0, right: '10px', margin: "10px" }}
          >
            <button
              className="btn btn-danger mb-2 mb-md-0 me-md-2"
              style={{ marginRight: "10px", opacity: 0.5 }}
            >
              Delete
            </button>
            <button
              className="btn btn-primary mr-2"
              style={{ marginRight: "10px", opacity: 0.5 }}
            >
              Approve
            </button>
            <Button
              variant="secondary"
              style={{ opacity: 0.5 }}
              onClick={handleShowRefuseModal}
            >
              Refuse
            </Button>
          </div>
        )}
      </div>

      <div className="activity-data">
        <div style={{ overflowX: "auto" }}>
          <div
            className="table-responsive"
            style={{ maxWidth: "1600px", minWidth: "1600px" }}
          >
            <Table striped bordered hover>
              <thead>
                <tr style={{ textAlign: "center", verticalAlign: "middle" }}>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedItems.length === listUsers.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>STT</th>
                  <th>Title</th>
                  <th>Film</th>
                  <th>Post Time</th>
                  <th>Update by reviewer</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {listUsers &&
                  listUsers.length > 0 &&
                  listUsers.map(renderTableRow)}
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
            <Modal
              show={showBlogDetail}
              onHide={handleCloseBlogDetail}
              dialogClassName="custom-modal-width"
            >
              <Modal.Body>
                <BlogDetail
                  blogId={selectedBlogId}
                  onCloseModal={handleCloseBlogDetail}
                />
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogWaiting;
