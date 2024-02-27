import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import ReactPaginate from 'react-paginate';
import { fetchAccount, deleteAccount } from '../../services/AdminService';
import Button from 'react-bootstrap/Button';
import CreateAccount from './CreateAccount';
import Modal from 'react-bootstrap/Modal';

const TableAccount = () => {
  const [listUsers, setListUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); 
  const [statusFilter, setStatusFilter] = useState({ filter: false, status: "" });
  const [activeFilter, setActiveFilter] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    getAccount(currentPage);
  }, [currentPage, statusFilter]);

  const getAccount = async (selectedPage, status) => {
    try {
      if (statusFilter.filter) {
        status = statusFilter.status;
      }
      const res = await fetchAccount(selectedPage + 1, localStorage.getItem("jwtToken"), status);
      if (res && res.data) {
        const { data, pageInfo } = res.data;
        setListUsers(data);
        setPageCount(pageInfo.total_pages);
      }
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  }

  const handleShow = (itemId) => {
    setSelectedItemId(itemId); // Update selectedItemId when clicking the button
    setShow(true);
  };

  
  const handleClose = () => {
    setSelectedItemId(null); // Reset selectedItemId when closing modal
    setShow(false);
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  }

  const updateUserList = () => {
    getAccount(currentPage);
  }

  const handleFilter = (status) => {
    setActiveFilter(status);
    setCurrentPage(0);
    setStatusFilter({ filter: true, status: status });
  };

  const handleEditUser = (user) => {
    console.log('Edit user:', user);
  };
  const handleDeleteAccount = async (id) => {
    try {
      const res = await deleteAccount(id, localStorage.getItem("jwtToken"));
      if (res?.code === 200) updateUserList();
      setShow(false);
    } catch (error) {
      console.error("Error Delete blog:", error);
    }
  };

  const renderTableRow = (item, index) => (
    <tr key={index} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.phone}</td>
      <td>{item.role}</td>
      <td>{item.email}</td>
      <td style={{ minWidth: '150px' }}>{item.insertDateTime}</td>
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
              <Button variant="primary" onClick={() => handleDeleteAccount(selectedItemId)}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
          <button type="button" className="btn btn-primary" onClick={() => handleEditUser(item)}>
            Edit
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div style={{overflowX: 'auto'}}>
      <div style={{ marginBottom: '15px' }}>
        <Button
          variant={activeFilter === 'ACTIVE' ? 'success' : 'outline-success'}
          onClick={() => handleFilter('ACTIVE')}
        >
          Active
        </Button>{' '}
        <Button
          variant={activeFilter === 'SUSPENDED' ? 'secondary' : 'outline-secondary'}
          onClick={() => handleFilter('SUSPENDED')}
        >
          Suspended
        </Button>{' '}
        <Button
          variant={activeFilter === 'INACTIVE' ? 'warning' : 'outline-warning'}
          onClick={() => handleFilter('INACTIVE')}
        >
          In Active
        </Button>{' '}
      </div>
      <div className="table-responsive" style={{ maxWidth: '1600px', minWidth: '1600px' }}>
        <Table striped bordered hover>
          <thead>
            <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              <th>id</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Email</th>
              <th>Insert Date Time</th>
              <th>Status</th>
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

export default TableAccount;
