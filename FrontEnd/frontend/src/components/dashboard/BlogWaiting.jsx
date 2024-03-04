// Import useState
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import ReactPaginate from "react-paginate";
import { fetchDashBoard, updateStatusBlog } from "../../services/AdminService";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../../styles/UserPage.css";

const BlogWaiting = () => {
  // Define state variables
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
  const [selectedItems, setSelectedItems] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);


  // Fetch data from API
  useEffect(() => {
    const savedListUsers = JSON.parse(localStorage.getItem("listUsers"));
    if (savedListUsers) {
      setListUsers(savedListUsers);
    }
  }, []);

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

  const handleApproveSelectedBlogs = async () => {
    try {
      // Gọi hàm updateStatusBlog để gửi yêu cầu PATCH đến API
      try {
        await updateStatusBlog(selectedItems, localStorage.getItem("jwtToken"), "APPROVE");
        console.log("Approve selected blogs successfully");
        handleCloseApproveModal();
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error(`Error approving blog with ids ${selectedItems}:`, error);
        throw error;
      }
  
      // Cập nhật danh sách blog sau khi duyệt
      getBlogs(currentPage);
  
      // Hiển thị thông báo thành công
      toast.success("Approve selected blogs successfully");
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error approving selected blogs:", error);
      // Hiển thị thông báo lỗi cho người dùng
      toast.error("An error occurred while approving selected blogs");
    }
  };
  
  const handleRefuseSelectedBlogs = async () => {
    try {
      // Gọi hàm updateStatusBlog để gửi yêu cầu PATCH đến API
      try {
        await updateStatusBlog(selectedItems, localStorage.getItem("jwtToken"), "REFUSE");
        handleCloseRefuseModal();
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error(`Error refuse blog with ids ${selectedItems}:`, error);
        throw error;
      }
  
      // Cập nhật danh sách blog sau khi duyệt
      getBlogs(currentPage);
  
      // Hiển thị thông báo thành công
      toast.success("Refuse selected blogs successfully");
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error refuse selected blogs:", error);
      // Hiển thị thông báo lỗi cho người dùng
      toast.error("An error occurred while refuse selected blogs");
    }
  };
  


  const renderTableRow = (item, index) => (
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
        {item.postTime}
      </td>
      <td style={{ minWidth: "150px", textAlign: "center" }}>
        {item.updateBy.name}
      </td>
      <td style={{ textAlign: "center" }}>{item.status}</td>
    </tr>
  );

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
        <span className="text">Blog Waiting List</span>
        {/* Chỉ hiển thị nút khi có các mục đã được chọn */}
        {selectedItems.length > 0 && (
          <div
            style={{ position: "absolute", top: 0, right: 0, margin: "10px" }}
          >
            <button
              className="btn btn-primary mr-2"
              onClick={handleShowApproveModal}
              style = {{marginRight: "10px"}}
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
                <Button
                  variant="primary"
                onClick={ handleApproveSelectedBlogs}
                >
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
            <button
              className="btn btn-danger"
              onClick={handleShowRefuseModal}
            >
              Refuse
            </button>
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
                <Button
                  variant="primary"
                  onClick={handleRefuseSelectedBlogs}
                >
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogWaiting;