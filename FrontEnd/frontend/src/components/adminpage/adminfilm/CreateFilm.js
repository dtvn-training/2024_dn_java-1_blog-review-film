import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Form, Alert, ToastContainer } from 'react-bootstrap';
import { postCreateFilm } from "../../services/AdminService";

const CreateFilm = ({ show, createFilm }) => {
  const handleClose = () => {
    setShowModal(false);
    setFilmData({});
  }
  const handleShow = () => setShowModal(true);

  const [filmData, setFilmData] = useState({
    categoryId: '',
    nameFilm: '',
    director: '',
    country: '',
    startDate: '',
    description: '',
    filmImage: null // Add this line
  });

  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e) => {
    setFilmData({ ...filmData, filmImage: e.target.files[0] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilmData({ ...filmData, [name]: value });
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    let isError = false;
    let errorMessageCategory = "";
    let errorMessageName = "";
    let errorMessageDirector = "";
    let errorMessageCountry = "";
    let errorMessageStartDate = "";
    let errorMessageDescription = "";
    let errorMessageImage = ""; // Add this line

    // Validate category
    if (filmData.categoryId.trim() === "") {
      errorMessageCategory += "Category is required.";
      isError = true;
    }
    // Validate name
    if (filmData.nameFilm.trim() === "") {
      errorMessageName += "Name is required.";
      isError = true;
    } else if (filmData.nameFilm.length > 50) {
      errorMessageName = "Name must be at most 50 characters.";
      isError = true;
    }

    // Validate director
    if (filmData.director.trim() === "") {
      errorMessageDirector += "Director is required.";
      isError = true;
    } else if (filmData.director.length > 30) {
      errorMessageDirector = "Director must be at most 30 characters.";
      isError = true;
    }

    // Validate country
    if (filmData.country.trim() === "") {
      errorMessageCountry += "Country is required.";
      isError = true;
    } else if (filmData.country.length > 5) {
      errorMessageCountry = "Country must be at most 5 characters.";
      isError = true;
    }

    // Validate start date
    if (!filmData.startDate) {
      errorMessageStartDate += "Start Date is required.";
      isError = true;
    }

    // Validate description
    if (filmData.description.trim() === "") {
      errorMessageDescription += "Description is required.";
      isError = true;
    } else if (filmData.description.length > 255) {
      errorMessageDescription = "Description must be at most 255 characters.";
      isError = true;
    }
    
    // validate image
    if (!filmData.filmImage) {
      errorMessageImage += "Image is required.";
      isError = true;
    }

    setFilmData({ ...filmData, errorMessageCategory, errorMessageName, errorMessageDirector, errorMessageCountry, errorMessageStartDate, errorMessageDescription, errorMessageImage });

    // If there's an error, stop the submission
    if (isError) {
      return;
    }
    // Call API to create film
    try {
      const data = await postCreateFilm(filmData.categoryId, filmData.nameFilm, filmData.director, filmData.country, filmData.startDate, filmData.description, filmData.filmImage, localStorage.getItem("jwtToken"));
      console.log("123" ,data)
      if (data.code === 201) {
        toast.success('Create film successfully');
        handleClose();
      }
    } catch (error) {
      let array = error.response.data.message
      for (let i = 0; i < array.length; i++) {
        console.log(array[i].defaultMessage);
        toast.error(array[i].defaultMessage);
      }
      console.error('Error creating film:', error.message);
    }
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
    <ToastContainer />
      <>
        <Button variant="primary" onClick={handleShow} className="mt-100" style={{ marginLeft: '1200px', width: buttonWidth,  position: 'absolute',  right: '30px', top: '130px' }}>
          Create
        </Button>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Fill Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>  
          <Form.Group controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" name="categoryId" value={filmData.categoryId} onChange={handleChange}>
              <option value="">Select category</option>
              <option value="13">Action</option>
              <option value="14">Adventure</option>
              <option value="15">Horror</option>
              <option value="16">Comedy</option>
              <option value="17">Romance</option>
              <option value="18">Science Fiction</option>
            </Form.Control>
            {filmData.errorMessageCategory && <Alert variant="danger">{filmData.errorMessageCategory}</Alert>}
          </Form.Group>
          </Form>
            <Form onSubmit={handleSubmit}>
          {filmData.errorMessage && <Alert variant="danger">{filmData.errorMessage}</Alert>}
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" name="nameFilm" value={filmData.nameFilm} onChange={handleChange} />
            {filmData.errorMessageName && <Alert variant="danger">{filmData.errorMessageName}</Alert>}
          </Form.Group>
          <Form.Group controlId="formDirector">
            <Form.Label>Director</Form.Label>
            <Form.Control type="text" placeholder="Enter director" name="director" value={filmData.director} onChange={handleChange} />
            {filmData.errorMessageDirector && <Alert variant="danger">{filmData.errorMessageDirector}</Alert>}
          </Form.Group>
          <Form.Group controlId="formCountry">
            <Form.Label>Country</Form.Label>
            <Form.Control type="text" placeholder="Enter country" name="country" value={filmData.country} onChange={handleChange} />
            {filmData.errorMessageCountry && <Alert variant="danger">{filmData.errorMessageCountry}</Alert>}
          </Form.Group>
          <Form.Group controlId="formStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" name="startDate" value={filmData.startDate} onChange={handleChange} />
            {filmData.errorMessageStartDate && <Alert variant="danger">{filmData.errorMessageStartDate}</Alert>}
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter description" name="description" value={filmData.description} onChange={handleChange} />
            {filmData.errorMessageDescription && <Alert variant="danger">{filmData.errorMessageDescription}</Alert>}
          </Form.Group>
          <Form.Group controlId="formImage">
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" name="filmImage" onChange={handleImageChange} />
            {filmData.errorMessageImage && <Alert variant="danger">{filmData.errorMessageImage}</Alert>}
          </Form.Group>
        </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
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

  export default CreateFilm;