import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import ReactPaginate from 'react-paginate';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'; // Import Form từ react-bootstrap.
import Alert from 'react-bootstrap/Alert'; // Import Alert từ react-bootstrap.
import { toast } from 'react-toastify'; // Import toast từ react-toastify.
import { fetchAccount, deleteAccount } from '../../services/AdminService'; // Import hàm updateAccount từ service
import { putUpdateAccount } from '../../services/AdminService'; // Import hàm updateAccount từ service
import CreateAccount from './CreateAccount';

const TableAccount = () => {
  const [listUsers, setListUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); 
  const [statusFilter, setStatusFilter] = useState({ filter: false, status: "" });
  const [activeFilter, setActiveFilter] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [editUser, setEditUser] = useState(null); // Thêm state để lưu thông tin tài khoản đang chỉnh sửa
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State để hiển thị modal xác nhận xóa
  const [showEditModal, setShowEditModal] = useState(false); // State để hiển thị modal chỉnh sửa

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
  }

  const updateUserList = () => {
    getAccount(currentPage);
  }

  const handleFilter = (status) => {
    setActiveFilter(status);
    setCurrentPage(0);
    setStatusFilter({ filter: true, status: status });
  };


  const handleDeleteAccount = async (id) => {
    try {
      const res = await deleteAccount(id, localStorage.getItem("jwtToken"));
      if (res?.code === 200) updateUserList();
      setShowDeleteModal(false);
      toast.success("Delete account successfully");
    } catch (error) {
      console.error("Error Delete blog:", error);
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
        errorMessagePhone = "Invalid phone number. Phone number must be exactly 10 digits.";
        isError = true;
      }
      setEditUser({ ...editUser, errorMessageName, errorMessagePhone });
      if (isError) {
        return;
      }

      try {
        const res = await putUpdateAccount(editUser, localStorage.getItem("jwtToken")); // Gọi hàm putUpdateAccount từ service
        if (res?.code === 200) {
          updateUserList();
          setShowEditModal(false);
          toast.success("Update account successfully");
        }
      } catch (error) {
        console.error("Error updating account:", error);
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
          <div>
            <button
              type="button"
              className="btn btn-danger mb-2 mb-md-0 me-md-2"
              onClick={() =>  handleShowDeleteModal(item.id)}
            >
              Delete
            </button>
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Refusal</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete this blog?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDeleteModal}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => handleDeleteAccount(selectedItemId)}>
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
          </div>

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
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editUser ? 'Edit Account' : 'Create Account'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Form onSubmit={editUser ? handleUpdateAccount : handleClose}>
          
          {/* Input cho thông tin tài khoản */}
          
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" name="name" value={editUser ? editUser.name : ''} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
          </Form.Group>
          {editUser?.errorMessageName && <Alert className="text-danger">{editUser.errorMessageName}</Alert>}
          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" placeholder="Enter phone" name="phone" value={editUser ? editUser.phone : ''} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} />
          </Form.Group> 
          {editUser?.errorMessagePhone && <Alert className="text-danger">{editUser.errorMessagePhone}</Alert>}
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" value={editUser ? editUser.email : ''} readOnly />
          </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={editUser ? handleUpdateAccount : handleUpdateAccount}>
            {editUser ? 'Save Changes' : 'Create'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    
  );
};

export default TableAccount;
