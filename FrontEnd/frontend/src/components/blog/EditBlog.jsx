import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { fetchAllFilmList, postEditBlog } from "../../services/AdminService";
import { toast } from "react-toastify";

const EditBlog = ({ key, editBlogData }) => {
  const [formData, setFormData] = useState({
    filmId: "",
    blogImageIntroduce: "",
    title: "",
    blogImage: null,
    summary: "",
    point: "",
    contents: [{ id: null, image: null, content: "" }],
  });
  const [show, setShow] = useState(false);
  const [filmList, setFilmList] = useState([]);
  const [blogIntroduceImageUrl, setBlogIntroduceImageUrl] = useState(null); // Thêm state blogImageUrl
  const [blogImageUrl, setBlogImageUrl] = useState("");
  const [contentImageUrls, setContentImageUrls] = useState([]);

  useEffect(() => {
    if (editBlogData) {
      setFormData({
        ...formData,
        filmId: editBlogData.film.id,
        blogImageIntroduce: editBlogData.imageIntroduce,
        title: editBlogData.title,
        blogImage: editBlogData.image,
        summary: editBlogData.summary,
        point: editBlogData.point,
        contents: editBlogData.contents.map((content) => ({
          id: content.id,
          imageUrl: content.imageUrl,
          content: content.content,
        })),
      });
      handleShow();
    } else {
      // Clear form data when there's no editBlogData
      setFormData({
        filmId: "",
        blogImageIntroduce: null,
        title: "",
        blogImage: null,
        summary: "",
        point: "",
        contents: [{ id: "", imageUrl: "", content: "" }],
      });
      handleClose();
    }
  }, [editBlogData, key]); // Thêm key vào dependency array của useEffect

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

  useEffect(() => {
    if (editBlogData && editBlogData.image) {
      setBlogImageUrl(editBlogData.image);
      setBlogIntroduceImageUrl(editBlogData.imageIntroduce);
      setContentImageUrls(editBlogData.contents.map((content) => content.imageUrl));

    }
  }, [editBlogData]);

  const handleClose = () => {
    // Clear form data and hide modal
    setFormData({
      filmId: "",
      blogImageIntroduce: null,
      title: "",
      blogImage: null,
      summary: "",
      point: "",
      contents: [{ id: null, imageUrl: null, content: "" }],
    });
    setShow(false);
  
  };
  const handleShow = () => {
    console.log("Edit Blog Data", editBlogData);
    setShow(true);
  }
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Kiểm tra tên trường để xác định cách xử lý
    switch (name) {
      case "filmId":
      case "title":
      case "summary":
      case "point":
        // Các trường thông tin chính của biểu mẫu, cập nhật giá trị vào state `formData`
        setFormData({
          ...formData,
          [name]: value,
        });
        break;
      case "blogImageIntroduce":
        // Xử lý tải lên hình ảnh giới thiệu
        const introImageFile = event.target.files[0];
        setFormData({
          ...formData,
          blogImageIntroduce: introImageFile,
        });
        break;

      case "blogImage":
        // Xử lý tải lên hình ảnh của blog
        const imageFile = event.target.files[0];
        setFormData({
          ...formData,
          blogImage: imageFile,
        });
        break;
      default:
        // Xử lý các trường cho nội dung bài viết
        if (name.startsWith("content-")) {
          const index = parseInt(name.split("-")[1]); // Lấy chỉ số của nội dung từ tên trường
          const updatedContents = [...formData.contents];
          updatedContents[index].content = value; // Cập nhật nội dung tương ứng
          setFormData({
            ...formData,
            contents: updatedContents,
          });
        } else if (name.startsWith("image-")) {
          // Xử lý khi thay đổi hình ảnh trong nội dung bài viết
          const contentIndex = parseInt(name.split("-")[1]); // Lấy chỉ số của nội dung từ tên trường
          const imageFile = event.target.files[0];
          const updatedContents = [...formData.contents];
          // Lưu đường dẫn hình ảnh vào trường image của nội dung tương ứng
          updatedContents[contentIndex].image = imageFile;
          setFormData({
            ...formData,
            contents: updatedContents,
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
    const {
      filmId,
      blogImageIntroduce,
      title,
      blogImage,
      summary,
      point,
      contents,
    } = formData;

    const contentData = [];

    contents.forEach((content) => {
      if (content.content) {
        contentData.push({id : content.id , content: content.content, image: content.image });
      }
    });
    console.log("Content Data", contentData);
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
        console.log("Edit blog successfully", response.data);
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
                {filmList.map((film) => (
                  <option key={film.id} value={film.id}>
                    {" "}
                    {film.nameFilm}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Blog Image Introduce</Form.Label>
                {blogImageUrl && (
                  <img
                    src={formData.blogIntroduceImage ? URL.createObjectURL(formData.blogIntroduceImageUrl) : editBlogData.image}
                    alt="Blog Image"
                    style={{ maxWidth: "100%" }}
                  />
                )}
                <Form.Control
                  id="blogImageIntroInput"
                  type="file"
                  name="blogImageIntroduce"
                  onChange={handleChange}
                />
              </Form.Group>

            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              <Form.Group>
                <Form.Label>Blog Image</Form.Label>
                {blogImageUrl && (
                  <img
                    src={blogImageUrl}
                    alt="Blog Image"
                    style={{ maxWidth: "100%" }}
                  />
                )}
                <Form.Control
                  id="blogImageInput"
                  type="file"
                  name="blogImage"
                  onChange={handleChange}
                />
              </Form.Group>
            </Form.Group>
            <Form.Group>
              <Form.Label>Summary</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="summary"
                value={formData.summary}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
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
                  <img 
                  src={contentImageUrls[index]}
                  style={{ maxWidth: "100%" }}
                  />
                  <Form.Control
                    type="file"
                    name={`image-${index}`}
                    onChange={handleChange}
                  />
                </Form.Group>

        
              </div>
            ))}
            <Button variant="primary" onClick={handleAddContent} style={{marginTop: '10px'}}>
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
