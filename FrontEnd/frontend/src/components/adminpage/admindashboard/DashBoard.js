import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import ReactPaginate from 'react-paginate';
import { fetchDashBoard, fetchAllUser, fetchBlogByStatus, updateStatusBlog } from '../../services/AdminService';
import Button from 'react-bootstrap/Button';


function UserTable({ listUsers, handleEditUser, handleRefuseBlog , handleApproveBlog}) {
  const renderTableRow = (item, index) => (
    <tr key={index} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
      <td>{item.id}</td>
      <td  style={{ minWidth: '200px' }}>{item.title}</td>
      <td>{item.filmId}</td>
      <td  style={{ minWidth: '200px' }}>{item.postTime}</td>
      <td  style={{ minWidth: '200px' }}>{item.updateDateTime}</td>
      <td  style={{ minWidth: '150px' }}>{item.updateByReviewerId}</td>
      <td>{item.status}</td>
      <td>
        <div className="d-flex flex-column flex-md-row align-items-md-center">
          <button type="button" className="btn btn-danger mb-2 mb-md-0 me-md-2" onClick={() => handleRefuseBlog(item.id)}>
            Refuse
          </button>
          <button type="button" className="btn btn-primary" onClick={() => handleApproveBlog(item)}>
            Approve
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="table-responsive" style={{ maxWidth: '1600px', minWidth: '1600px' }}>
    <Table striped bordered hover>
      <thead>
        <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
          <th>id</th>
          <th>Title</th>
          <th>Film</th>
          <th>Post Time</th>
          <th>Update DateTime</th>
          <th>Update by reviewer</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {listUsers && listUsers.length > 0 && listUsers.map(renderTableRow)}
      </tbody>
    </Table>
  </div>
  );
}

const DashBoard = () => {
  const [listUsers, setListUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); 
  const [showModalAddNew, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState({ filter: false, status: "" });


  useEffect(() => {
    getBlogs(currentPage);
  }, [currentPage, statusFilter]);

  const getBlogs = async (selectedPage) => {
    try {
      const res = await fetchDashBoard(selectedPage + 1, localStorage.getItem("jwtToken"), 'WAITING');
      if (res && res.data) {
        
        const { data, pageInfo } = res.data;
        setListUsers(data);
        setPageCount(pageInfo.total_pages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  }

  const toggleModal = () => {
    setShowModal(!showModalAddNew);
  }

  const updateUserList = () => {
    getBlogs(currentPage);
  }

  const handleFilter = (status) => {
    setStatusFilter({ filter: true, status: status });
    setCurrentPage(0); // Reset trang về 0 khi thực hiện bộ lọc
  };

  const handleEditUser = (user) => {
    console.log('Edit user:', user);
  };

  const handleRefuseBlog = async (id) => { // Định nghĩa hàm handleRefuseBlog
    try {
      const isConfirmed = window.confirm("Bạn có chắc chắn muốn refuse blog này không?"); // Hiển thị hộp thoại xác nhận
  
      if (isConfirmed) { // Nếu người dùng chọn xác nhận
        const res = await updateStatusBlog(id, localStorage.getItem("jwtToken"), "REFUSE"); // Gọi API xóa blog
        if (res && res.code == 200) {
          updateUserList();// Cập nhật danh sách blog sau khi xóa thành công
        }
      }
    } catch (error) {
      console.error("Error refuse blog:", error);
    }
  };


  const handleApproveBlog = async (id) => { // Định nghĩa hàm handleRefuseBlog
    try {
      const isConfirmed = window.confirm("Bạn có chắc chắn muốn refuse blog này không?"); // Hiển thị hộp thoại xác nhận
  
      if (isConfirmed) { // Nếu người dùng chọn xác nhận
        const res = await updateStatusBlog(id, localStorage.getItem("jwtToken"), "APPROVE"); // Gọi API xóa blog
        if (res && res.code == 200) {
          updateUserList();// Cập nhật danh sách blog sau khi xóa thành công
        }
      }
    } catch (error) {
      console.error("Error refuse blog:", error);
    }
  };
  

  return (
    <div style={{overflowX: 'auto'}}>
      {/* <div>
        <Button variant="primary" onClick={() => handleFilter('REFUSE')}>Refuse</Button>{' '}
        <Button variant="success" onClick={() => handleFilter('APPROVE')}>Approve</Button>{' '}
        <Button variant="warning" onClick={() => handleFilter('WAITING')}>Waiting</Button>{' '}
      </div> */}
      <UserTable listUsers={listUsers} handleApproveBlog={handleApproveBlog} handleRefuseBlog={handleRefuseBlog}  />

      <div style={{ marginTop: '15px' }}>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="Previous"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          activeClassName="active"
          previousClassName="page-item"
          nextClassName="page-item"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
        />
      </div>
    </div>
  );
};

export default DashBoard;