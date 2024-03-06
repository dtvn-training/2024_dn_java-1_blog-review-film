import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const CreateBlog = () => {
    const [formData, setFormData] = useState({
        filmId: '',
        title: '',
        blogImage: null,
        summary: '',
        point: '',
        contents: [{ id: null, image: null, content: '' }]
    });

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setFormData({
            filmId: '',
            title: '',
            blogImage: null,
            summary: '',
            point: '',
            contents: [{ id: null, image: null, content: '' }]
        });
    };
    const handleShow = () => setShow(true);
    
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'blogImage' || name === 'image') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
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
            contents: [...formData.contents, { id: null, image: null, content: '' }]
        });
    };

    const handleRemoveContent = (index) => {
        const updatedContents = [...formData.contents];
        updatedContents.splice(index, 1);
        setFormData({ ...formData, contents: updatedContents });
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('filmId', formData.filmId);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('blogImage', formData.blogImage);
            formDataToSend.append('summary', formData.summary);
            formDataToSend.append('point', formData.point);
            formDataToSend.append('contents', JSON.stringify(formData.contents));

            const response = await axios.post('YOUR_API_ENDPOINT', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            handleClose();
        } catch (error) {
            console.error('Error creating blog:', error.message);
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
                            <Form.Label>Film ID</Form.Label>
                            <Form.Control type="number" name="filmId" value={formData.filmId} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="blogImage">
                            <Form.Label>Blog Image</Form.Label>
                            <Form.Control type="file" name="blogImage" onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="summary">
                            <Form.Label>Summary</Form.Label>
                            <Form.Control as="textarea" rows={3} name="summary" value={formData.summary} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="point">
                            <Form.Label>Point</Form.Label>
                            <Form.Control type="number" name="point" value={formData.point} onChange={handleChange} />
                        </Form.Group>
                        {formData.contents.map((content, index) => (
                            <div key={index}>
                                <Form.Group controlId={`content-${index}`}>
                                    <Form.Label>Content {index + 1}</Form.Label>
                                    <ReactQuill value={content.content} onChange={(value) => handleContentChange(index, value)} />
                                </Form.Group>
                                <Form.Group controlId={`image-${index}`}>
                                    <Form.Label>Image</Form.Label>
                                    <Form.Control type="file" name="image" onChange={handleChange} />
                                </Form.Group>
                                <Button variant="danger" style = {{  marginTop: "20px"  }} onClick={() => handleRemoveContent(index)}>Remove Content</Button>
                            </div>
                        ))}
                        <Button variant="primary" style = {{  marginTop: "20px"  }} onClick={handleAddContent}>Add Content</Button>
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
