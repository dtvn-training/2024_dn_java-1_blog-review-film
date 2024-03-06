import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { fetchAllFilmList, postCreateBlog } from "../../services/AdminService";
const CreateBlog = () => {
  const [formData, setFormData] = useState({
    nameFilm: "",
    title: "",
    blogImage: null,
    summary: "",
    point: "",
    contents: [{ id: null, image: null, content: "" }],
  });

  const [show, setShow] = useState(false);
  const [filmList, setFilmList] = useState([{}]);

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
    setShow(false);
    setFormData({
      filmId: "",
      title: "",
      blogImage: null,
      summary: "",
      point: "",
      contents: [{ id: null, image: null, content: "" }],
    });
  };
  const handleShow = () => setShow(true);

const handleChange = (event) => {
  const { name, value } = event.target;

  // Kiểm tra tên trường để xác định cách xử lý
  switch (name) {
    case 'filmId':
    case 'title':
    case 'summary':
    case 'point':
      // Các trường thông tin chính của biểu mẫu, cập nhật giá trị vào state `formData`
      setFormData({
        ...formData,
        [name]: value
      });
      break;
    case 'blogImage':
     // Xử lý tải lên hình ảnh của blog
     const imageFile = event.target.files[0];
     setFormData({
       ...formData,
       blogImage: imageFile
     });
     break;
    default:
      // Xử lý các trường cho nội dung bài viết
      if (name.startsWith('content-')) {
        const index = parseInt(name.split('-')[1]); // Lấy chỉ số của nội dung từ tên trường
        const updatedContents = [...formData.contents];
        updatedContents[index].content = value; // Cập nhật nội dung tương ứng
        setFormData({
          ...formData,
          contents: updatedContents
        });
      } else if (name.startsWith('image-')) {
        // Xử lý khi thay đổi hình ảnh trong nội dung bài viết
        const contentIndex = parseInt(name.split('-')[1]); // Lấy chỉ số của nội dung từ tên trường
        const imageFile = event.target.files[0];
        const updatedContents = [...formData.contents];
        // Lưu đường dẫn hình ảnh vào trường image của nội dung tương ứng
        updatedContents[contentIndex].image = imageFile;
        setFormData({
          ...formData,
          contents: updatedContents
        });
      }
      break;
  }
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
    const { filmId, title, blogImage, summary, point, contents } = formData;

    // Tạo một mảng mới để lưu trữ tất cả các cặp content và image
    const contentData = [];

    // Lặp qua mỗi phần tử trong mảng contents
    contents.forEach((content, index) => {
      // Nếu content có dữ liệu
      if (content.content) {
        // Thêm cặp content và image vào mảng contentData
        contentData.push({ content: content.content, image: content.image });
      }
    });
    console.log("filmId:", filmId);
    console.log("Title:", title);
    console.log("Summary:", summary);
    console.log("Point:", point);
    
    console.log("Content data:", contentData);
    console.log("Blog Image:", blogImage);

    try {
      // Gọi API với dữ liệu mới đã được xử lý
      const response = await postCreateBlog(
        filmId,
        title,
        blogImage,
        summary,
        point,
        contentData,
        jwtToken
      );
      console.log("Create blog response:", response);
      handleClose();
    } catch (error) {
      console.error("Error creating blog:", error.message);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create Blog
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="filmId">
              {/* Thay đổi controlId từ filmId thành nameFilm */}
              <Form.Label>Choose Film</Form.Label>
              <Form.Control
                as="select"
                name="filmId"
                value={formData.filmId} // Thay đổi từ formData.id thành formData.filmId
                onChange={handleChange}
              >
                <option value="">Select Film</option>
                {filmList.map((film) => (
                  <option key={film.id} value={film.id}>
                    {" "}
                    {/* Thay đổi từ film.nameFilm thành film.id */}
                    {film.nameFilm}
                  </option>
                ))}
              </Form.Control>
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
                    name={`image-${index}`} // Đặt tên trường là duy nhất và phản ánh chỉ số của nội dung
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

export default CreateBlog;
