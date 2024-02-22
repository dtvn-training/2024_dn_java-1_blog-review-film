import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';



function FormModalButton() {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="mt-100">
        Create Account
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Điền Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Đặt các trường form bạn muốn ở đây */}
          <form>
            <input type="text" placeholder="Tên" />
            <input type="email" placeholder="Email" />
            {/* Thêm các trường form khác cần thiết */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FormModalButton;
