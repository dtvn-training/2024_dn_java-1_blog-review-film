// Import useState
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import ReactPaginate from "react-paginate";
import { fetchDashBoard, updateStatusBlog } from "../../services/AdminService";
import { toast } from "react-toastify";
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

  const handleSelectItem = (id) => {
    const selectedIndex = selectedItems.indexOf(id);
    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, id]);
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
      const promises = selectedItems.map((id) =>
        updateStatusBlog(id, localStorage.getItem("jwtToken"), "APPROVE")
      );
      await Promise.all(promises);
      getBlogs(currentPage);
      toast.success("Approve selected blogs successfully");
    } catch (error) {
      console.error("Error approving selected blogs:", error);
    }
  };

  const handleRefuseSelectedBlogs = async () => {
    try {
      const promises = selectedItems.map((id) =>
        updateStatusBlog(id, localStorage.getItem("jwtToken"), "REFUSE")
      );
      await Promise.all(promises);
      getBlogs(currentPage);
      toast.success("Refuse selected blogs successfully");
    } catch (error) {
      console.error("Error refusing selected blogs:", error);
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
    <div className="activity">
      <div
        class="title"
        style={{
          backgroundColor: "#f0f0f0",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <i class="uil uil-clock-three"></i>
        <span class="text">Blog Waiting List</span>
        <div style ={{  right: "10px",  }}> 
        {/* Render buttons only if there are selected items */}
        {selectedItems.length > 0 && (
          <div style={{ margin: "10px", textAlign: "center", }}>
            <button
              className="btn btn-primary mr-2"
              onClick={handleApproveSelectedBlogs}
            >
              Approve All
            </button>
            <button
              className="btn btn-danger"
              onClick={handleRefuseSelectedBlogs}
            >
              Reject All
            </button>
          </div>
        )}
      </div>
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
