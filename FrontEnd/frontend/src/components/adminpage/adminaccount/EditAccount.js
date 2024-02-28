import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Form, Alert, ToastContainer } from 'react-bootstrap';
import { putUpdateAccount } from "../../services/AdminService"; // Sửa import API từ postCreateAccount sang putUpdateAccount

const EditAccount = ({ show, updateUser, userData }) => { // Thay đổi tên component thành EditAccount và truyền props userData để hiển thị dữ liệu cũ
  const handleClose = () => {
    setShowModal(false);
  }
  const handleShow = () => setShowModal(true);

  const [showModal, setShowModal] = useState(false);

  const [updatedUserData, setUpdatedUserData] = useState(userData); // Sử dụng userData từ props để khởi tạo dữ liệu chỉnh sửa

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData({ ...updatedUserData, [name]: value });
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    let isError = false;
    let errorMessageName = "";
    let errorMessagePhone = "";
    let errorMessageEmail = "";
    let errorMessagePassword = "";

    // Validate name
    if (updatedUserData.name.trim() === "") {
      errorMessageName += "Name is required.";
      isError = true;
    } else if (updatedUserData.name.length < 3 || updatedUserData.name.length > 30) {
      errorMessageName = "Name must be between 3 and 30 characters.";
      isError = true;
    }

    // Validate phone
    if (updatedUserData.phone.trim() === "") {
      errorMessagePhone += "Phone is required.";
      isError = true;
    } else if (!/^\+?\d{10}$/.test(updatedUserData.phone)) {
      errorMessagePhone = "Invalid phone number. Phone number must be exactly 10 digits.";
      isError = true;
    }

    // Validate email
    if (updatedUserData.email.trim() === "") {
      errorMessageEmail += "Email is required.";
      isError = true;
    } else if (!/\S+@\S+\.\S+/.test(updatedUserData.email)) {
      errorMessageEmail = "Email address is invalid.";
      isError = true;
    }


    setUpdatedUserData({ ...updatedUserData, errorMessageName, errorMessagePhone, errorMessageEmail, errorMessagePassword });

    // If there's an error, stop the submission
    if (isError) {
      return;
    }

    // Call API to update account
    try {
      const data = await putUpdateAccount(updatedUserData, localStorage.getItem("jwtToken")); // Sửa gọi API từ postCreateAccount thành putUpdateAccount và truyền userData
      // check status success
      if (data.status === 200) {
        toast.success('Account updated successfully');
        updateUser(data.data);
        handleClose();
      }
    } catch (error) {
      let array = error.response.data.message
      for (let i = 0; i < array.length; i++) {
        console.log(array[i].defaultMessage);
        toast.error(array[i].defaultMessage);
      }
      console.error('Error updating account:', error.message);
    }
  };

  return (
    <>
    <ToastContainer />
      <>
        <Button variant="primary" onClick={handleShow} className="mt-100" style={{ marginLeft: '1200px', width: '200px',  position: 'absolute',  right: '30px', top: '130px' }}>
          Edit
        </Button>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Fill Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" name="name" value={updatedUserData.name} onChange={handleChange} />
            {updatedUserData.errorMessageName && <Alert variant="danger">{updatedUserData.errorMessageName}</Alert>}
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" placeholder="Enter phone" name="phone" value={updatedUserData.phone} onChange={handleChange} />
            {updatedUserData.errorMessagePhone && <Alert variant="danger">{updatedUserData.errorMessagePhone}</Alert>}
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" value={updatedUserData.email} onChange={handleChange} />
            {updatedUserData.errorMessageEmail && <Alert variant="danger">{updatedUserData.errorMessageEmail}</Alert>}
          </Form.Group>
          {/* Uncomment if allowing password update */}
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" name="password" value={updatedUserData.password} onChange={handleChange} />
            {updatedUserData.errorMessagePassword && <Alert variant="danger">{updatedUserData.errorMessagePassword}</Alert>}
          </Form.Group>
        </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
    );
  }

export default EditAccount;
