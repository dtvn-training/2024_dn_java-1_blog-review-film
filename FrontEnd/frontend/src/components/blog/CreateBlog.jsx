import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { fetchAllFilmList, postCreateBlog } from "../../services/AdminService";
import { toast } from "react-toastify";
import Select from 'react-select';


const CreateBlog = () => {
    const [buttonWidth, setButtonWidth] = useState("200px");
    const [formData, setFormData] = useState({
        nameFilm: "",
        blogImageIntroduce: null,
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
            blogImageIntroduce: null,
            title: "",
            blogImage: null,
            summary: "",
            point: "",
            contents: [{ id: null, image: null, content: "" }],
        });
    };
    const handleShow = () => {
        setShow(true);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Kiểm tra tên trường để xác định cách xử lý
        switch (name) {
            case "filmId":
                const selectedFilm = filmList.find(film => film.id === value);
                setFormData({
                    ...formData,
                    [name]: value,
                    filmName: selectedFilm ? selectedFilm.nameFilm : '', // Thêm trường filmName để lưu trữ tên phim
                });
                break;
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
        const { filmId, blogImageIntroduce, title, blogImage, summary, point, contents } = formData;

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
        console.log("blogImageIntroduce:", blogImageIntroduce)
        console.log("Content data:", contentData);
        console.log("Blog Image:", blogImage);

        try {
            // Gọi API với dữ liệu mới đã được xử lý
            const response = await postCreateBlog(
                filmId,
                blogImageIntroduce,
                title,
                blogImage,
                summary,
                point,
                contentData,
                jwtToken
            );
            if (response.status === 201) {
                toast.success("Create blog successfully");
                console.log("Create blog successfully");
                handleClose();
            } else {
                toast.error("Create blog failed");
                console.error("Create blog failed", response.message);
            }
        }
        catch (error) {
            toast.error("Create blog failed");
            console.error("Create blog failed", error.message);
        }
    };
    useEffect(() => {
        const handleResize = () => {
            // Lấy kích thước hiện tại của cửa sổ
            const windowWidth = window.innerWidth;

            // Đặt kích thước mới cho nút dựa trên kích thước của cửa sổ
            if (windowWidth < 768) {
                // Thay 768 bằng kích thước tối thiểu bạn muốn
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
            <Button
                variant="primary"
                onClick={handleShow}
                style={{
                    marginLeft: "1200px",
                    width: buttonWidth,
                    position: "absolute",
                    right: "30px"
                }}
            >
                Create
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* <Form.Group controlId="filmId">
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
            </Form.Group> */}
                        <Form.Group controlId="filmId">
                            <Form.Label>Choose Film</Form.Label>
                            <Select
                                name="filmId"
                                value={{ value: formData.filmId, label: formData.filmName }} // Đổi từ formData.id thành formData.filmId và thêm label để hiển thị tên phim
                                onChange={(selectedOption) => handleChange({ target: { name: 'filmId', value: selectedOption ? selectedOption.value : '' } })}
                                options={filmList.map(film => ({ value: film.id, label: film.nameFilm }))}
                                placeholder="Select Film"
                            />
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
