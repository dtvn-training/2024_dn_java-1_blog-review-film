import axios from "./customize-axios";
const fetchAllBlog = (selectedPage, accessToken, status, searchText, startTime, endTime) => {
    
    let query = `/api/admin/blogs?page=${selectedPage}`;
    if (status) {
        query += `&status=${status}`;
    }
    if (searchText) {
        query += `&searchText=${searchText}`;
    }
    if (startTime) {
        query += `&startTime=${startTime}`;
    }
    if (endTime) {
        query += `&endTime=${endTime}`;
    }
    
    // console.log(query);
    return axios.get(query, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    
}

const fetchAccount = (selectedPage, accessToken, status, searchText) => {
    
  let query = `api/admin/reviewers?page=${selectedPage}`;
  if (status) {
      query += `&status=${status}`;
  }
  if (searchText) {
      query += `&searchText=${searchText}`;
  }
  // console.log(query);
  return axios.get(query, {
      headers: {
          'Authorization': `Bearer ${accessToken}`
      }
  });
  
}

const fetchDashBoard = (selectedPage, accessToken, status) => {
    const query = `/api/admin/blogs?page=${selectedPage}` + `&status=${status}`;
    return axios.get(query, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
}


const fetchSummaryData = (accessToken) => {
    const query = `/api/admin/dashboard`;
    console.log(query);
    return axios.get(query, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
   
  };

  const fetchAllFilm = (selectedPage, accessToken, category, searchText) => {
    
    let query = `/api/admin/film?page=${selectedPage}`;
    if (category) {
        query += `&category=${category}`;
    }
    if (searchText) {
        query += `&searchText=${searchText}`;
    }
    console.log(accessToken);
    return axios.get(query, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    
}

const fetchCategories = (accessToken) => {
  const query = `/api/categories`; // Đường dẫn API để lấy danh sách các categories
  console.log(query);
  return axios.get(query, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
};


const postCreateUser = (name, job) => {
    return axios.post("/api/users", { name, job });
}

const updateUser = (userId, name, job) => {
    return axios.put(`/api/users/${userId}`, { name, job });
}

const deleteBlog = async (blogId, jwtToken) => {
    try {
      const response = await axios.delete(`/api/blogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateStatusBlog = async (id, jwtToken, status) => {
    try {
      const response = await axios.patch(`/api/admin/blogs/${id}`, { status: status }, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export { fetchAccount, fetchSummaryData, fetchCategories, fetchDashBoard, fetchAllFilm, postCreateUser, updateUser, fetchAllBlog, deleteBlog, updateStatusBlog };
