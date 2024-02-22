import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import ReactPaginate from 'react-paginate';
import { fetchAccount, fetchAllUser, fetchBlogByStatus, deleteBlog } from '../services/AdminService';
import Button from 'react-bootstrap/Button';


function UserTable({ listUsers, handleEditUser, handleDeleteBlog }) {
  const renderTableRow = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.phone}</td>
      <td>{item.role}</td>
      <td>{item.email}</td>
      <td>{item.insertDateTime}</td>
      <td>{item.status}</td>
      <td>
        <button type="button" className="btn btn-danger mx-2" onClick={() => handleDeleteBlog(item.id)}>
          Delete
        </button>
        <button type="button" className="btn btn-primary" onClick={() => handleEditUser(item)}>Edit</button>
      </td>
    </tr>
  );

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>id</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Role</th>
          <th>Email</th>
          <th>Update by reviewer</th>
          <th>insertDateTime</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {listUsers && listUsers.length > 0 && listUsers.map(renderTableRow)}
      </tbody>
    </Table>
  );
}

const TableAccount = () => {
  const [listUsers, setListUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); 
  const [showModalAddNew, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState({ filter: false, status: "" });


  useEffect(() => {
    getAccount(currentPage);
  }, [currentPage, statusFilter]);

  const getAccount = async (selectedPage, status) => {
    try {
      
      if (statusFilter.filter) {
        status = statusFilter.status;
      }
      const res = await fetchAccount(selectedPage + 1, localStorage.getItem("jwtToken"), status);
      if (res && res.data) {
        
        const { data, pageInfo } = res.data;
        setListUsers(data);
        setPageCount(pageInfo.total_pages);
      }
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  }

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  }

  const toggleModal = () => {
    setShowModal(!showModalAddNew);
  }

  const updateUserList = () => {
    getAccount(currentPage);
  }

  const handleFilter = (status) => {
    setStatusFilter({ filter: true, status: status });
    setCurrentPage(0); // Reset trang về 0 khi thực hiện bộ lọc
  };

  const handleEditUser = (user) => {
    console.log('Edit user:', user);
  };

  const handleDeleteBlog = async (id) => { // Định nghĩa hàm handleDeleteBlog
    try {
      const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa blog này không?"); // Hiển thị hộp thoại xác nhận
  
      if (isConfirmed) { // Nếu người dùng chọn xác nhận
        const res = await deleteBlog(id, localStorage.getItem("jwtToken")); // Gọi API xóa blog
        if (res && res.data.success) {
          updateUserList(); // Cập nhật danh sách blog sau khi xóa thành công
        }
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };
  console.log(listUsers);

  return (
    <div>
      <div>
        <Button variant="success" onClick={() => handleFilter('ACTIVE')}>Active</Button>{' '}
        <Button variant="warning" onClick={() => handleFilter('INACTIVE')}>In Active</Button>{' '}
      </div>
      <UserTable listUsers={listUsers} handleEditUser={handleEditUser} handleDeleteBlog={handleDeleteBlog} />

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
  );
};

export default TableAccount;