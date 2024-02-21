import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import ReactPaginate from 'react-paginate';
import { fetchAllBlog, fetchAllUser, fetchBlogByStatus } from '../services/AdminService';

function UserTable({ listUsers, handleEditUser }) {
  const renderTableRow = (item, index) => (
    <tr key={index}>
      <td>{item.filmId}</td>
      <td>{item.title}</td>
      <td>{item.postTime}</td>
      <td>{item.updateDateTime}</td>
      <td>{item.updateByReviewerId}</td>
      <td>{item.status}</td>
      <td>
        <button type="button" className="btn btn-danger mx-3">
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
          <th>FilmID</th>
          <th>Title</th>
          <th>Post Time</th>
          <th>UpdateDateTime</th>
          <th>Update by reviewer</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {listUsers && listUsers.length > 0 && listUsers.map(renderTableRow)}
      </tbody>
    </Table>
  );
}

const TableBlogs = () => {
  const [listUsers, setListUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); 
  const [showModalAddNew, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState({ filter: false, status: "" });


  useEffect(() => {
    getBlogs(currentPage);
  }, [currentPage, statusFilter]);

  const getBlogs = async (selectedPage, status) => {
    try {
      
      if (statusFilter.filter) {
        status = statusFilter.status;
      }
      const res = await fetchAllBlog(selectedPage + 1, localStorage.getItem("jwtToken"), status);
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

  return (
    <div>
      <div>
        <button onClick={() => handleFilter('REFUSE')}>Refuse</button>
        <button onClick={() => handleFilter('APPROVE')}>Approve</button>
        <button onClick={() => handleFilter('WAITING')}>Waiting</button>
      </div>
      <UserTable listUsers={listUsers} handleEditUser={handleEditUser} />
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

export default TableBlogs;