import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import ReactPaginate from 'react-paginate';
import { fetchAllFilm, fetchCategories, deleteBlog } from '../../services/AdminService';
import Form from 'react-bootstrap/Form';



function UserTable({ listUsers, handleEditUser, handleDeleteBlog }) {
  const renderTableRow = (item, index) => (
    <tr key={index} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
      <td>{item.id}</td>
      <td>{item.nameFilm}</td>
      <td >{item.director}</td>
      <td>{item.country}</td>
      <td style={{ minWidth: '200px' }}>{item.description}</td>
      <td style={{ minWidth: '150px' }}>{item.startDate}</td>
      <td style={{ minWidth: '200px' }}>{item.updateDateTime}</td>
      <div className="d-flex flex-column flex-md-row align-items-md-center">
          <button type="button" className="btn btn-danger mb-2 mb-md-0 me-md-2" onClick={() => handleDeleteBlog(item.id)}>
            Delete
          </button>
          <button type="button" className="btn btn-primary" onClick={() => handleEditUser(item)}>
            Edit
          </button>
        </div>
    </tr>
  );

  return (
<div className="table-responsive" style={{ maxWidth: '1600px', minWidth: '1600px' }}>
<Table striped bordered hover >
  <thead>
    <tr style={{ textAlign: 'center', verticalAlign: 'middle' }}>
      <th>id</th>
      <th>Name</th>
      <th>Director</th>
      <th>Country</th>
      <th>Description</th>
      <th>Start Date</th>
      <th>Update Date TIme</th>
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

const TableFilm = () => {
  const [listUsers, setListUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); 
  const [showModalAddNew, setShowModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState({ filter: false, category: "" });
  const [categories, setCategories] = useState([]);


//   useEffect(() => {
//     getFilms(currentPage);
//   }, [currentPage, statusFilter]);

  useEffect(() => {
    getFilms(currentPage);
    getCategories(); // Gọi hàm để lấy danh sách categories khi component được mount
  }, [currentPage, categoryFilter]);

  const getFilms = async (selectedPage, category) => {
    try {
      
      if (categoryFilter.filter) {
        category = categoryFilter.category;
      }
      const res = await fetchAllFilm(selectedPage + 1, localStorage.getItem("jwtToken"), category);
      if (res && res.data) {
        
        const { data, pageInfo } = res.data;
        setListUsers(data);
        setPageCount(pageInfo.total_pages);
      }
    } catch (error) {
      console.error("Error fetching film:", error);
    }
  }

  

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  }

  const toggleModal = () => {
    setShowModal(!showModalAddNew);
  }

  const updateUserList = () => {
    getFilms(currentPage);
  }

  const handleFilter = (category) => {
    if (category === null) {
        setCurrentPage(0);
        setCategoryFilter({ filter: false, category: category });
        getFilms(currentPage);
    } else {
        setCategoryFilter({ filter: true, category: category });
        setCurrentPage(0);
    }
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

  const getCategories = async () => {
    try {
      // Gọi API để lấy danh sách categories
      const res = await fetchCategories(localStorage.getItem("jwtToken"));
      if (res && res.data) {
        // Cập nhật state với danh sách categories đã lấy được từ API
        setCategories(res.data.data);
        console.log(res.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
        
  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    if (categoryId === "All") {
        // Nếu chọn tất cả, không áp dụng bộ lọc category
        handleFilter(null);
    } else {
        // Ngược lại, áp dụng bộ lọc với categoryId mới
        handleFilter(categoryId);
    }
  };
  

  return (
    <div style={{overflowX: 'auto'}}>
      <div style={{  marginBottom: '15px'  }}>
        <Form.Select aria-label="Select category" onChange={handleCategoryChange}>
            <option>All</option>
            {categories && Array.isArray(categories) && categories.map((category, index) => (
                <option key={index} value={category.id}>{category.nameCategory}</option>
            ))}
        </Form.Select>
        </div>
      <UserTable listUsers={listUsers} handleEditUser={handleEditUser} handleDeleteBlog={handleDeleteBlog} />
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

export default TableFilm;