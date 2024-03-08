import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { deleteBlog, fetchAllBlog } from "../../services/AdminService";
import DateTimePicker from "react-datetime-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BlogDetail from "../blogDetail/BlogDetail";
import moment from "moment";
import "../../styles/BlogDetail.css";
import { updateStatusBlog } from "../../services/AdminService";
import CreateBlog from "./CreateBlog";
import EditBlog from "./EditBlog";

const TableBlog = ({ searchText }) => {
  const [listItems, setListItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModalAddNew, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState({
    filter: false,
    status: "",
  });
  const [activeFilter, setActiveFilter] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showBlogDetail, setShowBlogDetail] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [editBlogData, setEditBlogData] = useState(null);
  const authentication = localStorage.getItem("jwtToken");
  const user = JSON.parse(localStorage.getItem("user"));

  
  const handleShowBlogDetail = (id) => {
    setSelectedBlogId(id);
    setShowBlogDetail(true);
  };
  const [key, setKey] = useState(0);

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
      const res = await fetchAllBlog(
        selectedPage + 1,
        localStorage.getItem("jwtToken"),
        status,
        searchText
      );
      if (res && res.data) {
        const { data, pageInfo } = res.data;
        setListItems(data);
        setPageCount(pageInfo.total_pages);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleFilter = (status) => {
    // Nếu đã chọn nút đã được chọn trước đó, thì đặt lại giá trị của activeFilter và setStatusFilter
    if (activeFilter === status) {
      setActiveFilter(null); // Đặt lại activeFilter về null
      setStatusFilter({ filter: false, status: "" }); // Đặt lại statusFilter về giá trị mặc định
    } else {
      // Nếu không, thực hiện như bình thường
      setActiveFilter(status);
      setCurrentPage(0);
      setStatusFilter({ filter: true, status: status });
    }
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedItemId(null);
    setSelectedItemId([]);
    setSelectedItems([]);
  };

  const handleShowApproveModal = () => {
    setShowApproveModal(true);
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
    setSelectedItemId(null);
    setSelectedItems([]);
  };

  const handleShowRefuseModal = () => {
    setShowRefuseModal(true);
  };

  const handleCloseRefuseModal = () => {
    setShowRefuseModal(false);
    setSelectedItemId(null);
    setSelectedItems([]);
  };
  useEffect(() => {
    updateUserList();
  }, [selectedItems]);

  const updateUserList = () => {
    fetchData(currentPage);
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  const handleSelectAll = () => {
    if (selectedItems.length === listItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(listItems.map((item) => item.id));
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
      } else {
        toast.error("Failed to delete blog. Please try again later.");
      }
    } catch (error) {
      console.error("Error delete blog:", error);
      toast.error("An error occurred while delete blog.");
    }
  };

  const handleEditItem = (item) => {
    console.log("Edit item:", item);
    setEditBlogData(item);
    setKey((prevKey) => prevKey + 1); // Sử dụng setKey để cập nhật giá trị mới cho key
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
      } else {
        toast.error("Failed to refuse blog. Please try again later.");
      }
    } catch (error) {
      console.error("Error refuse blog:", error);
      toast.error("An error occurred while refuse blog.");
    }
  };
  const renderTableRow = (item, index) => {
    const formattedStartDate = moment(item.postTime).format("DD/MM/YYYY HH:mm:ss");
  
    return (
      <tr key={index} style={{ textAlign: "center", verticalAlign: "middle" }}>
        <td style={{ textAlign: "center" }}>
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => handleSelectItem(item.id)}
          />
        </td>
        <td style={{ textAlign: "right", height: "10px" }}>{index + 1}</td>
        <td style={{ minWidth: "200px", textAlign: "left" }}>{item.title}</td>
        <td style={{ minWidth: "200px", textAlign: "left" }}>
          {item.film.nameFilm}
        </td>
        <td>{formattedStartDate}</td>
        <td style={{ minWidth: "150px", textAlign: "center" }}>
          {item.updateBy.name}
        </td>
        <td style={{ textAlign: "center" }}>{item.status}</td>
        <td>
          <div
            className="d-flex flex-column flex-md-row align-items-md-center"
            style={{ justifyContent: "center" }}
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleShowBlogDetail(item.id)}
              style={{ marginRight: "10px" }}
            >
              <FontAwesomeIcon icon={["fas", "eye"]} /> {/* Correct usage of FontAwesomeIcon component */}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleEditItem(item)}
            >
              <FontAwesomeIcon icon={["fas", "edit"]} /> {/* Correct usage of FontAwesomeIcon component */}
            </button>
          </div>
        </td>
      </tr>
    );
  };
  return (
    <div className="activity">
      <div
        className="title"
        style={{
          backgroundColor: "#f0f0f0",
          padding: "10px",
          borderRadius: "5px",
          position: "relative",
        }}
      >
        <i className="uil uil-clock-three"></i>
        <span className="text">Blog List</span>
        <CreateBlog />
        {/* < CreateBlog /> */}
        {/* Chỉ hiển thị nút khi có các mục đã được chọn */}
        {selectedItems.length > 0 ? (
          <>
            {console.log(selectedItems)}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: "220px",
                margin: "10px",
              }}
            >
              <button
                className="btn btn-danger mb-2 mb-md-0 me-md-2"
                onClick={handleShowDeleteModal}
                style={{ marginRight: "10px" }}
              >
                Delete
              </button>
              {authentication !== null && user.role === "ROLE_ADMIN" && (
                <>
                  <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Are you sure you want to delete all this blog?
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={handleCloseDeleteModal}
                      >
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleDeleteBlog}>
                        Confirm
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Button
                    variant="success"
                    onClick={handleShowApproveModal}
                    style={{ marginRight: "10px" }}
                  >
                    Approve
                  </Button>
                  <Modal
                    show={showApproveModal}
                    onHide={handleCloseApproveModal}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Confirm Approve</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Are you sure you want to approve all this blog?
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={handleCloseApproveModal}
                        style={{ marginRight: "10px" }}
                      >
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleApproveBlog}>
                        Confirm
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Button
                    variant="secondary"
                    onClick={handleShowRefuseModal}
                    style={{ marginRight: "10px" }}
                  >
                    Refuse
                  </Button>
                  <Modal show={showRefuseModal} onHide={handleCloseRefuseModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Confirm Refuse</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Are you sure you want to refuse all this blog?
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={handleCloseRefuseModal}
                      >
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleRefuseBlog}>
                        Confirm
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: "220px",
                margin: "10px",
              }}
            >
              <button
                className="btn btn-danger mb-2 mb-md-0 me-md-2"
                style={{ marginRight: "10px", opacity: 0.5 }}
              >
                Delete
              </button>
              {authentication !== null && user.role === "ROLE_ADMIN" && (
                <>
                  <Button
                    variant="success"
                    style={{ marginRight: "10px", opacity: 0.5 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="secondary"
                    style={{ marginRight: "10px", opacity: 0.5 }}
                  >
                    Refuse
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <div className="activity-data"></div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ marginBottom: "15px" }}>
          <Button
            variant={
              activeFilter === "APPROVE" || !statusFilter.filter
                ? "success"
                : "outline-success"
            }
            onClick={() => handleFilter("APPROVE")}
          >
            Approve
          </Button>{" "}
          <Button
            variant={
              activeFilter === "REFUSE" || !statusFilter.filter
                ? "secondary"
                : "outline-secondary"
            }
            onClick={() => handleFilter("REFUSE")}
          >
            Refuse
          </Button>{" "}
          <Button
            variant={
              activeFilter === "WAITING" || !statusFilter.filter
                ? "warning"
                : "outline-warning"
            }
            onClick={() => handleFilter("WAITING")}
          >
            Waiting
          </Button>{" "}
        </div>

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
                    checked={selectedItems.length === listItems.length}
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
              {listItems &&
                listItems.length > 0 &&
                listItems.map(renderTableRow)}
            </tbody>
          </Table>
        </div>
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
            <BlogDetail blogId={selectedBlogId} />
          </Modal.Body>
        </Modal>
      </div>
      <EditBlog key={key} editBlogData={editBlogData} />
    </div>
  );
};

export default TableBlog;
