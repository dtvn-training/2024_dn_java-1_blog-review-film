import React, { useEffect, useState } from "react";
  import { Modal, Button, Form, Alert } from 'react-bootstrap';


  const CreateAccount = ({ show, createUser }) => {
    const handleClose = () => {
      setShowModal(false);
      setUserData({});
    }
    const handleShow = () => setShowModal(true);

    const [userData, setUserData] = useState({
      name: '',
      phone: '',
      email: '',
      password: '',
    });

    const [showModal, setShowModal] = useState(false);  

    const handleChange = (e) => {
      const { name, value } = e.target;
      setUserData({ ...userData, [name]: value });
    };

  const handleSubmit = (event) => {
      event.preventDefault();
      let isError = false;
      let errorMessage = "";
      let errorMessageName = "";
      let errorMessagePhone = "";
      let errorMessageEmail = "";
      let errorMessagePassword = "";
      let isErrorName = false;
      let isErrorPhone = false;
      let isErrorEmail = false;
      let isErrorPassword = false;

      //validate name
      if (userData.name.trim() === "") {
        errorMessageName += "Name is required.";
        isErrorName = true;
      } else if (userData.name.length < 3 || userData.name.length > 30) {
        errorMessageName = "Name must be between 3 and 30 characters.";
        isErrorName = true;
      }

      if (userData.phone.trim() === "") {
        errorMessagePhone += "Phone is required.";
        isErrorPhone = true;
      } else if (!/^\+?\d{10}$/.test(userData.phone)) {
        errorMessagePhone = "Invalid phone number. Phone number must be exactly 10 digits.";
        isErrorPhone = true;
      }
      if (userData.email.trim() === "") {
        errorMessageEmail += "Email is required.";
        isErrorEmail = true;
      } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
        errorMessageEmail = "Email address is invalid.";
        isErrorEmail = true;
      }
      if (userData.password.trim() === "") {
        errorMessagePassword += "Password is required.";
        isErrorPassword = true;
      } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,50}/.test(userData.password)) {
        errorMessagePassword = "Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be between 6 and 50 characters long.";
        isErrorPassword = true;
      }
      setUserData({ ...userData, errorMessageName: errorMessageName, errorMessagePhone: errorMessagePhone, errorMessageEmail: errorMessageEmail, errorMessagePassword: errorMessagePassword });
      
      

      


      // If there's an error, stop the submission
      if (isError) {
        return;
      }

      // If all validations pass, proceed with saving data
     
      // SaveDataFunction(userData);
    };

    const [buttonWidth, setButtonWidth] = useState("200px");
    useEffect(() => {
      const handleResize = () => {
        // Lấy kích thước hiện tại của cửa sổ
        const windowWidth = window.innerWidth;
        
        // Đặt kích thước mới cho nút dựa trên kích thước của cửa sổ
        if (windowWidth < 768) { // Thay 768 bằng kích thước tối thiểu bạn muốn
          setButtonWidth("100px"); // Thay đổi kích thước của nút khi cửa sổ thu nhỏ hơn kích thước nhất định
        } else {
          setButtonWidth("200px"); // Đặt lại kích thước mặc định khi cửa sổ đủ lớn
        }
      };
  
      // Thêm sự kiện lắng nghe cho cửa sổ trình duyệt
      window.addEventListener("resize", handleResize);
  
      // Xóa sự kiện lắng nghe khi component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);



    return (
      <>
        <Button variant="primary" onClick={handleShow} className="mt-100" style={{ marginLeft: '1200px', width: buttonWidth,  position: 'absolute',  right: '30px', top: '130px' }}>
          Create
        </Button>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Điền Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
          {userData.errorMessage && <Alert variant="danger">{userData.errorMessage}</Alert>}
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" name="name" value={userData.name} onChange={handleChange} />
            {userData.errorMessageName && <Alert variant="danger">{userData.errorMessageName}</Alert>}
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" placeholder="Enter phone" name="phone" value={userData.phone} onChange={handleChange} />
            {userData.errorMessagePhone && <Alert variant="danger">{userData.errorMessagePhone}</Alert>}
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" value={userData.email} onChange={handleChange} />
            {userData.errorMessageEmail && <Alert variant="danger">{userData.errorMessageEmail}</Alert>}
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" name="password" value={userData.password} onChange={handleChange} />
            {userData.errorMessagePassword && <Alert variant="danger">{userData.errorMessagePassword}</Alert>}
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
    );
  }

  export default CreateAccount;
