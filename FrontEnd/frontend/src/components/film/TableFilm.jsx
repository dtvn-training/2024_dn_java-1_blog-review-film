import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import moment from "moment";
import {
  deleteFilm,
  fetchAllFilm,
  fetchCategories,
} from "../../services/AdminService";
import EditFilm from "./EditFilm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";


const TableFilm = ({ searchText }) => {
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModalAddNew, setShowModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState({
    filter: false,
    category: "",
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [listUsers, setListUsers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user.role === "ROLE_ADMIN";
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [key, setKey] = useState(0);
  const [editFilm, setEditFilm] = useState({});

  useEffect(() => {
    getFilms(currentPage);
    getCategories();
  }, [currentPage, categoryFilter, searchText]);

  const getFilms = async (selectedPage, category) => {
    try {
      if (categoryFilter.filter) {
        category = categoryFilter.category;
      }
      const res = await fetchAllFilm(
        selectedPage + 1,
        localStorage.getItem("jwtToken"),
        category,
        searchText
      );
      if (res && res.data) {
        const { data, pageInfo } = res.data;
        setListUsers(data);
        setPageCount(pageInfo.total_pages);
      }
    } catch (error) {
      console.error("Error fetching film:", error);
    }
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const toggleModal = () => {
    setShowModal(!showModalAddNew);
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
    getFilms(currentPage);
  };

  const handleFilter = (category) => {
    if (category === null) {
      setCurrentPage(0);
      setCategoryFilter({ filter: false, category: "" });
      console.log("All2");
    } else {
      setCategoryFilter({ filter: true, category: category });
      setCurrentPage(0);
    }
  };

  const handleEditUser = (user) => {
    setEditFilm(user);
    console.log("editFilm", editFilm);
    setKey(prevKey => prevKey + 1); 
  };

  const getCategories = async () => {
    try {
      const res = await fetchCategories(localStorage.getItem("jwtToken"));
      if (res && res.data) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    if (categoryId === "All") {
      handleFilter(null);
      console.log("All");
    } else {
      handleFilter(categoryId);
      console.log(categoryId);
    }
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteBlog = async () => {
    try {
      const res = await deleteFilm(
        selectedItems,
        localStorage.getItem("jwtToken")
      );
      console.log(res);
      if (res && res.data) {
        toast.success("Delete film successfully");
        updateUserList();
        setSelectedItems([]);
        setShowDeleteModal(false);
      }
    } catch (error) {
      toast.error("Error deleting film");
      console.error("Error deleting film:", error);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === listUsers.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(listUsers.map((item) => item.id));
    }
  };

  const handleCreateBlog = async (id) => {};

  const renderTableRow = (item, index) => (
    <tr key={index} style={{ verticalAlign: "middle" }}>
      {isAdmin && (
        <td style={{ textAlign: "center" }}>
        <input
          type="checkbox"
          checked={selectedItems.includes(item.id)}
          onChange={() => handleSelectItem(item.id)}
        />
      </td>
      )}
      <td style={{ textAlign: "right" }}>{index + 1}</td>
      <td>{item.nameFilm}</td>
      <td>{item.director}</td>
      <td>{item.country}</td>
      <td style={{ minWidth: "150px", textAlign: "center" }} >{item.startDate}</td>
      {isAdmin && (
      <td className="d-flex flex-column flex-md-row align-items-md-center"
      style={{justifyContent:"center"}}>
        
          <>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleEditUser(item)}
              style = {{justifyContent: "center"}}
            >
              <FontAwesomeIcon icon="fa-solid fa-pen" />
            </button>
          </>
      </td>
      )}
    </tr>
  );
  console.log("editFilm", isAdmin);
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
        <span className="text">Film List</span>
        {/* Chỉ hiển thị nút khi có các mục đã được chọn */}
        {selectedItems.length > 0 &&
          (console.log(selectedItems),
          (
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
                  Are you sure you want to delete all this film?
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
            </div>
          ))}
      </div>
      <div className="activity-data">
        <div style={{ overflowX: "auto" }}>
          <div style={{ marginBottom: "15px" }}>
            <Form.Select
              aria-label="Select category"
              onChange={handleCategoryChange}
            >
              <option>All</option>
              {categories &&
                Array.isArray(categories) &&
                categories.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.nameCategory}
                  </option>
                ))}
            </Form.Select>
          </div>
          <div
            className="table-responsive"
            style={{ maxWidth: "1600px", minWidth: "1600px" }}
          >
            <Table striped bordered hover>
              <thead>
                <tr style={{ textAlign: "center", verticalAlign: "middle" }}>
                  {isAdmin && (
                    <th>
                    <input
                      type="checkbox"
                      checked={selectedItems.length === listUsers.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  )}
                  <th>STT</th>
                  <th>Name</th>
                  <th>Director</th>
                  <th>Country</th>
                  <th>Start Date</th>
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
        </div>
      </div>
      <EditFilm key={key} editFilmData={editFilm}  />
    </div>
    
  );
};

export default TableFilm;
