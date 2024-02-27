import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap'; // Assuming you're using Bootstrap components
import ReactPaginate from 'react-paginate';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { fetchAllFilm, deleteFilm, fetchCategories } from '../../services/AdminService';
const TableFilm = () => {
  const [listUsers, setListUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModalAddNew, setShowModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState({ filter: false, category: "" });
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    getFilms(currentPage);
    getCategories();
  }, [currentPage, categoryFilter]);

  const getFilms = async (selectedPage, category) => {
    try {
      if (categoryFilter.filter) {
        category = categoryFilter.category;
      }
      const res = await fetchAllFilm(selectedPage + 1, localStorage.getItem("jwtToken"), category);
      if (res && res.data) {
        const { data, pageInfo } = res.data;
        setListUsers(data);
        setPageCount(pageInfo.total_pages);
      }
    } catch (error) {
      console.error("Error fetching film:", error);
    }
  }

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  }

  const toggleModal = () => {
    setShowModal(!showModalAddNew);
  }

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
  }

  const handleFilter = (category) => {
    if (category === null) {
      setCurrentPage(0);
      setCategoryFilter({ filter: false, category: "" });
      getFilms(currentPage);
    } else {
      setCategoryFilter({ filter: true, category: category });
      setCurrentPage(0);
    }
  };

  const handleEditUser = (user) => {
    console.log('Edit user:', user);
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
    } else {
      handleFilter(categoryId);
    }
  };

  const handleDeleteFilm = async (id) => {
    try {
      const res = await deleteFilm(id, localStorage.getItem("jwtToken"));
      if (res?.code === 200) updateUserList();
      setShow(false);
    } catch (error) {
      console.error("Error Delete blog:", error);
    }
  };

  const renderTableRow = (item, index) => (
    <tr key={index} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
      <td>{item.id}</td>
      <td>{item.nameFilm}</td>
      <td>{item.director}</td>
      <td>{item.country}</td>
      <td style={{ minWidth: '200px' }}>{item.description}</td>
      <td style={{ minWidth: '150px' }}>{item.startDate}</td>
      <td style={{ minWidth: '200px' }}>{item.updateDateTime}</td>
      <td className="d-flex flex-column flex-md-row align-items-md-center">
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
              <Button variant="primary" onClick={() => handleDeleteFilm(selectedItemId)}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        <button type="button" className="btn btn-primary" onClick={() => handleEditUser(item)}>
          Edit
        </button>
      </td>
    </tr>
  );

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ marginBottom: '15px' }}>
        <Form.Select aria-label="Select category" onChange={handleCategoryChange}>
          <option>All</option>
          {categories && Array.isArray(categories) && categories.map((category, index) => (
            <option key={index} value={category.id}>{category.nameCategory}</option>
          ))}
        </Form.Select>
      </div>
      <div className="table-responsive" style={{ maxWidth: '1600px', minWidth: '1600px' }}>
        <Table striped bordered hover>
          <thead>
            <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              <th>id</th>
              <th>Name</th>
              <th>Director</th>
              <th>Country</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>Update Date TIme</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listUsers && listUsers.length > 0 && listUsers.map(renderTableRow)}
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
};

export default TableFilm;
