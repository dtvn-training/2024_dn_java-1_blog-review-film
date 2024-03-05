import React, { useEffect, useState } from "react";
import "./BlogDetail.css"
import { fetchBlogById } from "../../services/AdminService";

const BlogDetail = ({ blogId }) => {


    const authenticated = JSON.parse(localStorage.getItem('authenticated'));
    const [blogDetail, setBlogDetail] = useState(null);
    const [id, setId] = useState(blogId);

    useEffect(() => {
        console.log("1")
        fetchBlogDetail(blogId);
    }, [id]);

    const fetchBlogDetail = async (blogId) => {
        try {
            const res = await fetchBlogById(blogId, localStorage.getItem("jwtToken"));
            if (res && res.data) {
                console.log(res.data)
                setBlogDetail(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        (blogDetail ? (
            <div className="blogdetail_container">
                <div className="div">
                    {authenticated == null ? (
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
                            </div>
                        </div>
                        {blogDetail.contents.map((content, index) => (
                                    <div key={index} className="content-container">
                                        <p>{content.content}</p>
                                        {content.imageUrl && <img src={content.imageUrl} alt={`Content ${index + 1}`} />}
                                    </div>
                                ))}
                    </div>
                    {!authenticated && (
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