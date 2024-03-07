import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { fetchAllFilmList, postEditFilm } from "../../services/AdminService";
import { toast } from "react-toastify";

const EditFilm = ({ key, editFilmData }) => {
  const [formData, setFormData] = useState({
    categoryId: "",
    nameFilm: "",
    director: "",
    country: "",
    startDate: "",
    description: "",
    filmImage: null,
  });
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (Object.keys(editFilmData).length !== 0 && key !== 0) {
      setFormData({
        categoryId: editFilmData.category ? editFilmData.category.id : "",
        nameFilm: editFilmData.nameFilm,
        director: editFilmData.director,
        country: editFilmData.country,
        startDate: editFilmData.startDate,
        description: editFilmData.description,
        filmImage: null,
      });
      setShowEditModal(true);
      console.log("editFilmData", editFilmData);
    } else {
        console.log("hihi");
        setShowEditModal(false);
      // Clear form data when there's no editFilmData
      setFormData({
        categoryId: "",
        nameFilm: "",
        director: "",
        country: "",
        startDate: "",
        description: "",
        filmImage: null,
      });
      handleClose();
    }
  }, [editFilmData, key]);
  


  const handleClose = () => {
    // Clear form data and hide modal
    setFormData({
      categoryId: "",
      nameFilm: "",
      director: "",
      country: "",
      startDate: "",
      description: "",
      filmImage: null,
    });
    setShowEditModal(false);
  };

  const handleShow = () => {
    setShowEditModal(true);
  };

  const handleChange = (event) => {
    switch (event.target.name) {
        case "categoryId":
        setFormData({ ...formData, categoryId: event.target.value });
        break;
      case "nameFilm":
        setFormData({ ...formData, nameFilm: event.target.value });
        break;
      case "director":
        setFormData({ ...formData, director: event.target.value });
        break;
      case "country":
        setFormData({ ...formData, country: event.target.value });
        break;
      case "startDate":
        setFormData({ ...formData, startDate: event.target.value });
        break;
      case "description":
        setFormData({ ...formData, description: event.target.value });
        break;
      default:
        break;
    }

  };

  const handleImageChange = (event) => {
    setFormData({ ...formData, filmImage: event.target.files[0] });
  };

  const handleSubmit = async () => {
    const jwtToken = localStorage.getItem("jwtToken");
    try {
      const response = await postEditFilm(
        editFilmData.id,
        formData.categoryId,
        formData.nameFilm,
        formData.director,
        formData.country,
        formData.startDate,
        formData.description,
        formData.filmImage,
        jwtToken
      );
      if (response.status === 200) {
        toast.success("Edit film successfully");
        handleClose();
      } else {
        toast.error("Edit film failed");
        console.error("Edit film failed", response.message);
      }
    } catch (error) {
      toast.error("Edit film failed");
      console.error("Edit film failed", error.message);
    }
  };
  return (
    <>
      <Modal show={showEditModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Film</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="categoryId">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                <option value="13">Action</option>
                <option value="14">Adventure</option>
                <option value="15">Horror</option>
                <option value="16">Comedy</option>
                <option value="17">Romance</option>
                <option value="18">Science Fiction</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="nameFilm">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="nameFilm"
                value={formData.nameFilm}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="director">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="filmImage">
              <Form.Label>Film Image</Form.Label>
              <img 
              src={formData.filmImage ? URL.createObjectURL(formData.filmImage) : editFilmData.image}
                alt="filmImage"
                style={{ maxWidth: "100%" }}
                />
              <Form.Control
                type="file"
                name="filmImage"
                onChange={handleImageChange}
              />
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
  );
};

export default EditFilm;
