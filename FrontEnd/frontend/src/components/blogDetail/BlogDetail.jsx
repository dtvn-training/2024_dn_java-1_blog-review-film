import React, { useEffect, useState } from "react";
import "./BlogDetail.css"
import { fetchBlogById, fetchBlogByIdGuest, updateStatusBlog } from "../../services/AdminService";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BlogDetail = ({ blogId, onCloseModal, guest }) => {

    const authenticated = JSON.parse(localStorage.getItem('authenticated'));
    const [blogDetail, setBlogDetail] = useState(null);
    const [id, setId] = useState(blogId);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRefuseModal, setShowRefuseModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    useEffect(() => {
        setSelectedItems([id]);
        fetchBlogDetail(blogId);
    }, [id]);

    const fetchBlogDetail = async (blogId) => {
        try {
            if (authenticated && !guest) {
                const res = await fetchBlogById(blogId, localStorage.getItem("jwtToken"));
                if (res && res.data) {
                    setBlogDetail(res.data.data);
                }
            } else {
                const res = await fetchBlogByIdGuest(blogId);
                if (res && res.data) {
                    console.log(res.data)
                    setBlogDetail(res.data.data);
                }
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleShowApproveModal = () => {
        setShowApproveModal(true);
    };

    const handleCloseApproveModal = () => {
        setShowApproveModal(false);
    };

    const handleShowRefuseModal = (itemId) => {
        setShowRefuseModal(true);
    };

    const handleCloseRefuseModal = () => {
        setShowRefuseModal(false);
    };

    const handleApproveBlogs = async () => {
        try {

            // Gọi hàm updateStatusBlog để gửi yêu cầu PATCH đến API
            try {
                console.log(selectedItems)
                await updateStatusBlog(selectedItems, localStorage.getItem("jwtToken"), "APPROVE");
                console.log("Approve selected blogs successfully");
                handleCloseApproveModal();

                if (onCloseModal) {
                    onCloseModal();
                }
            } catch (error) {
                // Xử lý lỗi nếu có
                console.error(`Error approving blog with ids ${selectedItems}:`, error);
                throw error;
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error approving selected blogs:", error);
            // Hiển thị thông báo lỗi cho người dùng
            toast.error("An error occurred while approving selected blogs");
        }
    };

    const handleRefuseBlogs = async () => {
        try {
            // Gọi hàm updateStatusBlog để gửi yêu cầu PATCH đến API
            try {
                await updateStatusBlog(selectedItems, localStorage.getItem("jwtToken"), "REFUSE");
                handleCloseRefuseModal();

                if (onCloseModal) {
                    onCloseModal();
                }
            } catch (error) {
                // Xử lý lỗi nếu có
                console.error(`Error refuse blog with ids ${selectedItems}:`, error);
                throw error;
            }

            // Hiển thị thông báo thành công
            toast.success("Refuse selected blogs successfully");
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error refuse selected blogs:", error);
            // Hiển thị thông báo lỗi cho người dùng
            toast.error("An error occurred while refuse selected blogs");
        }
    };


    return (
        (blogDetail ? (
            <div className="blogdetail_container">
                <div className="div">
                    {guest ? (
                        <div className="div-2">
                            <div className="div-3">
                                <div className="div-4">Blog Review Film</div>
                                <div classNameName="div-5">
                                </div>
                            </div>
                        </div>
                    ) : ''}
                    <div className="div-10">
                        <div className="div-11">
                            <div className="column">
                                <div className="div-12">
                                    <div className="div-13">{blogDetail.title}</div>
                                    <img
                                        loading="lazy"
                                        srcset={blogDetail.image}
                                        className="img"
                                    />
                                </div>
                            </div>
                            <div className="column-2">
                                <div className="div-14">
                                    <div className="div-15">
                                        <div className="div-16">
                                            <div className="column-3">
                                                <div className="div-17">
                                                    <div className="div-18">Post Date</div>
                                                    <div className="div-19">{blogDetail.postTime}</div>
                                                    <div className="div-20">Catagory</div>
                                                    <div className="div-21">{blogDetail.film.category.nameCategory}</div>
                                                </div>
                                            </div>
                                            <div className="column-4">
                                                <div className="div-22">
                                                    <div className="div-23">Region</div>
                                                    <div className="div-24">{blogDetail.film.country}</div>
                                                    <div className="div-25">Score</div>
                                                    <div className="div-26">{blogDetail.point}/10</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="div-27">{blogDetail.summary}</div>
                                </div>
                                {authenticated !== null && user.role === "ROLE_ADMIN" && (
                                    <div className="btn-updateBlog">
                                        <button
                                            className="btn btn-primary mr-2"
                                            onClick={handleShowApproveModal}
                                            style={{ marginRight: "10px" }}
                                        >
                                            Approve
                                        </button>
                                        <Modal show={showApproveModal} onHide={handleCloseApproveModal}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Confirm Approve</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                Are you sure you want to approve all this blog?
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleCloseApproveModal}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    onClick={handleApproveBlogs}
                                                >
                                                    Confirm
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                        <Button
                                            variant="secondary"
                                            onClick={handleShowRefuseModal}
                                        >
                                            Refuse
                                        </Button>
                                        <Modal show={showRefuseModal} onHide={handleCloseRefuseModal}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Confirm Refusal</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                Are you sure you want to refuse this blog?
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleCloseRefuseModal}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    onClick={handleRefuseBlogs}
                                                >
                                                    Confirm
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </div>
                                )}
                            </div>
                        </div>
                        {blogDetail.contents.map((content, index) => (
                            <div key={index} className="content-container">
                                <div dangerouslySetInnerHTML={{ __html: content.content }} />
                                {content.imageUrl && <img key={`image-${index}`} src={content.imageUrl} alt={`Content ${index + 1}`} />}
                            </div>
                        ))}
                    </div>
                    {guest && (
                        <div className="div-29">
                            <div className="div-30">
                                <div className="div-31">Home</div>
                                <div className="div-32">About us</div>
                                <div className="div-33">Services</div>
                                <div className="div-34">Terms</div>
                                <div className="div-35">Privacy</div>
                            </div>
                            <div className="div-36">
                                <div className="div-37">Blog</div>
                                <div className="div-38">Recent Blog</div>
                                <div className="div-39">List Blog</div>
                                <div className="div-40">Top Film</div>
                            </div>
                            <div className="div-41">
                                <div className="div-42">Reviewer</div>
                                <div className="div-43">Sign in</div>
                                <div className="div-44">List Reviewer</div>
                                <div className="div-45">Top Reviewer</div>
                                <div className="div-46">Privacy</div>
                            </div>
                            <div className="div-47">
                                <div className="div-48">Contact</div>
                                <div className="div-49">43 Hoa Thuan, Da Nang</div>
                                <div className="div-50">+84-456-7890</div>
                                <div className="div-51">+84-456-7890</div>
                                <div className="div-52">java1@gmail.com</div>
                            </div>
                        </div>
                    )}
                    {!authenticated && (
                        <div className="div-53">
                            <div className="div-54">
                                <div className="div-55">
                                    <div className="div-56"></div>
                                    <div className="div-57"></div>
                                    <div className="div-58"></div>
                                    <div className="div-59"></div>
                                </div>
                                <div className="div-60">Review Film</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ) : "")
    );


}
export default BlogDetail;   