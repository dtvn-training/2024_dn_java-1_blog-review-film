import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { fetchAllFilmList, postEditBlog } from "../../services/AdminService";
import { toast } from "react-toastify";

const EditBlog = ({ editBlogData }) => {
  const [formData, setFormData] = useState({
    filmId: "",
    blogImageIntroduce: null,
    title: "",
    blogImage: null,
    summary: "",
    point: "",
    contents: [{ id: null, image: null, content: "" }],
  });
  const [show, setShow] = useState(false);
    const [filmList, setFilmList] = useState([]);

  console.log("edit: ",editBlogData);

  useEffect(() => {
    if (editBlogData) {
      setFormData(editBlogData);
      setShow(true);
    } else {
      setFormData({
        filmId: "",
        blogImageIntroduce: null,
        title: "",
        blogImage: null,
        summary: "",
        point: "",
        contents: [{ id: null, image: null, content: "" }],
      });
      setShow(false);
    }
  }, [editBlogData]);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await fetchAllFilmList();
        setFilmList(response.data.data);
      } catch (error) {
        console.error("Error fetching films:", error.message);
      }
    };
    fetchFilms();
  }, []);

  const handleClose = () => {
    setFormData({
      filmId: "",
      blogImageIntroduce: null,
      title: "",
      blogImage: null,
      summary: "",
      point: "",
      contents: [{ id: null, image: null, content: "" }],
    });
    setShow(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContentChange = (index, value) => {
    const updatedContents = [...formData.contents];
    updatedContents[index].content = value;
    setFormData({ ...formData, contents: updatedContents });
  };

  const handleAddContent = () => {
    setFormData({
      ...formData,
      contents: [...formData.contents, { id: null, image: null, content: "" }],
    });
  };

  const handleRemoveContent = (index) => {
    const updatedContents = [...formData.contents];
    updatedContents.splice(index, 1);
    setFormData({ ...formData, contents: updatedContents });
  };

  const handleSubmit = async () => {
    const jwtToken = localStorage.getItem("jwtToken");
    const { filmId, blogImageIntroduce, title, blogImage, summary, point, contents } = formData;

    const contentData = [];

    contents.forEach((content) => {
      if (content.content) {
        contentData.push({ content: content.content, image: content.image });
      }
    });

    try {
      const response = await postEditBlog(
        editBlogData.id,
        filmId,
        blogImageIntroduce,
        title,
        blogImage,
        summary,
        point,
        contentData,
        jwtToken
      );
      if (response.status === 200) {
        toast.success("Edit blog successfully");
        handleClose();
      } else {
        toast.error("Edit blog failed");
        console.error("Edit blog failed", response.message);
      }
    } catch (error) {
      toast.error("Edit blog failed");
      console.error("Edit blog failed", error.message);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="filmId">
              <Form.Label>Choose Film</Form.Label>
              <Form.Control
                as="select"
                name="filmId"
                value={formData.filmId}
                onChange={handleChange}
              >
                <option value="">Select Film</option>
                {/* Thêm code hiển thị danh sách phim tương tự như trong component CreateBlog */}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="blogImageIntroduce">
              <Form.Label>Introduction Image</Form.Label>
              <Form.Control
                type="file"
                name="blogImageIntroduce"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="blogImage">
              <Form.Label>Blog Image</Form.Label>
              <Form.Control
                type="file"
                name="blogImage"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="summary">
              <Form.Label>Summary</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="summary"
                value={formData.summary}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="point">
              <Form.Label>Point</Form.Label>
              <Form.Control
                type="number"
                name="point"
                value={formData.point}
                onChange={handleChange}
              />
            </Form.Group>
            {formData.contents.map((content, index) => (
              <div key={index}>
                <Form.Group controlId={`content-${index}`}>
                  <Form.Label>Content {index + 1}</Form.Label>
                  <ReactQuill
                    value={content.content}
                    onChange={(value) => handleContentChange(index, value)}
                  />
                </Form.Group>
                <Form.Group controlId={`image-${index}`}>
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    name={`image-${index}`}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button
                  variant="danger"
                  style={{ marginTop: "20px", marginBottom: "20px" }}
                  onClick={() => handleRemoveContent(index)}
                >
                  Remove Content
                </Button>
              </div>
            ))}
            <Button variant="primary" onClick={handleAddContent}>
              Add Content
            </Button>
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

export default EditBlog;
