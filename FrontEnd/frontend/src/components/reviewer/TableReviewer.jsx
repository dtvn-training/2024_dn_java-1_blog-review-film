import React, { useEffect, useState } from "react";
import { Alert, Button, Form, Modal, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import moment from "moment";
import {
  deleteAccount,
  fetchAccount,
  putUpdateAccount,
  updateStatusAccount,
} from "../../services/AdminService";
import CreateReviewer from "./CreateReviewer";
import EditBlog from "../blog/EditBlog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TableReviewer = ({ searchText }) => {
  const [listUsers, setListUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState({
    filter: false,
    status: "",
  });
  const [activeFilter, setActiveFilter] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [editUser, setEditUser] = useState(null); // Thêm state để lưu thông tin tài khoản đang chỉnh sửa
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State để hiển thị modal xác nhận xóa
  const [showEditModal, setShowEditModal] = useState(false); // State để hiển thị modal chỉnh sửa
  const [selectedItems, setSelectedItems] = useState([]);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [showInActiveModal, setShowInActiveModal] = useState(false);

  useEffect(() => {
    getAccount(currentPage);
  }, [currentPage, statusFilter, searchText]);

  const getAccount = async (selectedPage, status) => {
    try {
      if (statusFilter.filter) {
        status = statusFilter.status;
      }
      const res = await fetchAccount(
        selectedPage + 1,
        localStorage.getItem("jwtToken"),
        status,
        searchText
      );
      if (res && res.data) {
        const { data, pageInfo } = res.data;
        setListUsers(data);
        setPageCount(pageInfo.total_pages);
      }
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  };

  const handleShow = (itemId) => {
    setSelectedItemId(itemId);
    setShow(true);
  };

  const handleClose = () => {
    setSelectedItemId(null);
    setShow(false);
  };

  const handleShowDeleteModal = (itemId) => {
    setSelectedItemId(itemId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedItemId(null);
    setShowDeleteModal(false);
    setSelectedItems([]);
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditUser(null);
    setShowEditModal(false);
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const updateUserList = () => {
    getAccount(currentPage);
  };

  const handleFilter = (status) => {
    // Nếu đã chọn nút đã được chọn trước đó, thì đặt lại giá trị của activeFilter và setStatusFilter
    if (activeFilter === status) {
      setActiveFilter(null); // Đặt lại activeFilter về null
      setStatusFilter({ filter: false, status: "" }); // Đặt lại statusFilter về giá trị mặc định
      setSelectedItems([]);
    } else {
      // Nếu không, thực hiện như bình thường
      setActiveFilter(status);
      setCurrentPage(0);
      setStatusFilter({ filter: true, status: status });
    }
  };

  const handleShowActiveModal = () => {
    setShowActiveModal(true);
  };

  const handleCloseActiveModal = () => {
    setShowActiveModal(false);
    setSelectedItems([]);
  };

  const handleShowInActiveModal = () => {
    setShowInActiveModal(true);
  };

  const handleCloseInActiveModal = () => {
    setShowInActiveModal(false);
    setSelectedItems([]);
  };

  const handleActiveSelectedBlogs = async () => {
    try {
      const res = await updateStatusAccount(
        selectedItems,
        localStorage.getItem("jwtToken"),
        "ACTIVE"
      );
      console.log(res);
      if (res.code === 200) {
        updateUserList();
        handleCloseActiveModal();
        toast.success("Active account successfully");
      } else {
        toast.error("Failed to active account. Please try again later.");
      }
    } catch (error) {
      console.error("Error active account:", error);
      toast.error("An error occurred while active account.");
    }
  };

  const handleInActiveSelectedBlogs = async () => {
    try {
      const res = await updateStatusAccount(
        selectedItems,
        localStorage.getItem("jwtToken"),
        "INACTIVE"
      );
      if (res.code === 200) {
        updateUserList();
        handleCloseInActiveModal();
        toast.success("Inactive account successfully");
      } else {
        toast.error("Failed to inactive account. Please try again later.");
      }
    } catch (error) {
      console.error("Error inactive account:", error);
      toast.error("An error occurred while inactive account.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Gửi yêu cầu DELETE đến API endpoint để xóa tài khoản
      const res = await deleteAccount(
        selectedItems,
        localStorage.getItem("jwtToken")
      );
      console.log(res.data.code);
      // Kiểm tra xem yêu cầu đã thành công hay không
      if (res.data.code === 200) {
        // Nếu thành công, cập nhật danh sách người dùng
        updateUserList();
        // Ẩn modal xác nhận xóa
        // Hiển thị thông báo thành công
        handleCloseDeleteModal();
        toast.success("Delete account successfully");
      } else {
        // Nếu có lỗi từ phía server, hiển thị thông báo lỗi
        toast.error("Failed to delete account. Please try again later.");
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error deleting account:", error);
      // Hiển thị thông báo lỗi cho người dùng
      toast.error("An error occurred while deleting account.");
    }
  };
  const handleUpdateAccount = async (event) => {
    console.log(editUser);

    event.preventDefault();
    let isError = false;
    let errorMessageName = "";
    let errorMessagePhone = "";
    //validate name
    if (editUser.name.trim() === "") {
      errorMessageName += "Name is required.";
      isError = true;
    } else if (editUser.name.length < 3 || editUser.name.length > 30) {
      errorMessageName = "Name must be between 3 and 30 characters.";
      isError = true;
    }
    //validate phone
    if (editUser.phone.trim() === "") {
      errorMessagePhone += "Phone is required.";
      isError = true;
    } else if (!/^\+?\d{10}$/.test(editUser.phone)) {
      errorMessagePhone =
        "Invalid phone number. Phone number must be exactly 10 digits.";
      isError = true;
    }
    setEditUser({ ...editUser, errorMessageName, errorMessagePhone });
    if (isError) {
      return;
    }

    try {
      const res = await putUpdateAccount(
        editUser,
        localStorage.getItem("jwtToken")
      ); // Gọi hàm putUpdateAccount từ service
      if (res?.code === 200) {
        updateUserList();
        setShowEditModal(false);
        toast.success("Update account successfully");
      }
    } catch (error) {
      console.error("Error updating account:", error);
    }
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

  const renderTableRow = (item, index) => {
    const formattedStartDate = moment(item.insertDateTime).format("DD/MM/YYYY HH:mm:ss");
  
    return (
      <tr key={index} style={{ textAlign: "center" }}>
        <td style={{ textAlign: "center", verticalAlign: "middle" }}>
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => handleSelectItem(item.id)}
          />
        </td>
        <td style={{ textAlign: "right", height: "10px" }}>{index + 1}</td>
        <td>{item.name}</td>
        <td style={{ textAlign: "right", height: "10px" }}>{item.phone}</td>
        <td style={{ textAlign: "left" }}>{item.email}</td>
        <td style={{ minWidth: "150px" }}>{formattedStartDate}</td> {/* Use formattedStartDate instead of item.insertDateTime */}
        <td>{item.status}</td>
        <td>
          <div className="d-flex flex-column flex-md-row align-items-md-center">
            <button
              style={{ display: "block", margin: "auto" }}
              type="button"
              className="btn btn-primary"
              onClick={() => handleEditUser(item)}
            >
              <FontAwesomeIcon icon={["fas", "pen"]} /> {/* Correct usage of FontAwesomeIcon component */}
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
        <span className="text">Account</span>

        {/* Chỉ hiển thị nút khi có các mục đã được chọn */}
        {selectedItems.length > 0 ? (
  <>
    {console.log(selectedItems)}
    <div
      style={{
        position: "absolute",
        top: 0,
        right: "210px",
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
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete all this account?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDeleteAccount}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {activeFilter !== "ACTIVE" && (
        <Button
          variant="success"
          onClick={handleShowActiveModal}
          style={{ marginRight: "10px" }}
        >
          Active
        </Button>
      )}
      <Modal show={showActiveModal} onHide={handleCloseActiveModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Active</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to active all this account?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseActiveModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleActiveSelectedBlogs}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {activeFilter !== "INACTIVE" && (
        <Button
          style={{ marginRight: "10px" }}
          variant="warning"
          onClick={handleShowInActiveModal}
        >
          InActive
        </Button>
      )}
      <Modal show={showInActiveModal} onHide={handleCloseInActiveModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm InActive</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to inactive this account?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseInActiveModal}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleInActiveSelectedBlogs}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  </>
) : (
  <>
    <div
      style={{
        position: "absolute",
        top: 0,
        right: "210px",
        margin: "10px",
      }}
    >
      <button
        className="btn btn-danger mb-2 mb-md-0 me-md-2"
        style={{ marginRight: "10px", opacity: 0.5 }} // Thêm thuộc tính opacity để làm cho nút mờ đi khi không được chọn
      >
        Delete
      </button>
      <Button
        variant="success"
        style={{ marginRight: "10px", opacity: 0.5 }}
      >
        Active
      </Button>
      <Button
        style={{ marginRight: "10px", opacity: 0.5 }}
        variant="warning"
      >
        InActive
      </Button>
    </div>
  </>
)}

      </div>
      <div style={{ overflowX: "auto" }}>
        <CreateReviewer />
      </div>

      <div className="activity-data">
        <div style={{ overflowX: "auto" }}>
          <div style={{ marginBottom: "15px" }}>
            <Button
              variant={
                activeFilter === "ACTIVE" || !statusFilter.filter ? "success" : "outline-success"
              }
              onClick={() => handleFilter("ACTIVE")}
            >
              Active
            </Button>{" "}
            <Button
              variant={
                activeFilter === "SUSPENDED" || !statusFilter.filter ? "secondary" : "outline-secondary"
              }
              onClick={() => handleFilter("SUSPENDED")}
            >
              Suspended
            </Button>{" "}
            <Button
              variant={
                activeFilter === "INACTIVE" || !statusFilter.filter ? "warning" : "outline-warning"
              }
              onClick={() => handleFilter("INACTIVE")}
            >
              In Active
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
                      checked={selectedItems.length === listUsers.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>STT</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Insert Date Time</th>
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
          <Modal show={showEditModal} onHide={handleCloseEditModal}>
            <Modal.Header closeButton>
              <Modal.Title>
                {editUser ? "Edit Account" : "Create Account"}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form onSubmit={editUser ? handleUpdateAccount : handleClose}>
                {/* Input cho thông tin tài khoản */}

                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    value={editUser ? editUser.name : ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, name: e.target.value })
                    }
                  />
                </Form.Group>
                {editUser?.errorMessageName && (
                  <Alert className="text-danger">
                    {editUser.errorMessageName}
                  </Alert>
                )}
                <Form.Group controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone"
                    name="phone"
                    value={editUser ? editUser.phone : ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, phone: e.target.value })
                    }
                  />
                </Form.Group>
                {editUser?.errorMessagePhone && (
                  <Alert className="text-danger">
                    {editUser.errorMessagePhone}
                  </Alert>
                )}
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={editUser ? editUser.email : ""}
                    readOnly
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={editUser ? handleUpdateAccount : handleUpdateAccount}
              >
                {editUser ? "Save Changes" : "Create"}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default TableReviewer;
