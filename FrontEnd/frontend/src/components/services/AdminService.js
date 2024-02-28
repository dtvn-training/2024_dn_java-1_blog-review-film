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
    
    let query = `/api/admin/films?page=${selectedPage}`;
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

const deleteAccount = async (accountId, jwtToken) => {
    try {
      const response = await axios.delete(`api/admin/reviewers/${accountId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteBlog = async (blogId, jwtToken) => {
    try {
      const response = await axios.delete(`api/admin/blogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteFilm = async (filmId, jwtToken) => {
    try {
      const response = await axios.delete(`api/admin/films/${filmId}`, {
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

  const postCreateAccount  =  async (name, phone, email, password, jwtToken) => {
    try {
      const response = await axios.post("/api/admin/reviewers", {
        name,
        phone,
        email,
        password
      }, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const postCreateFilm = async (categoryId, name, director, country, startDate, description, filmImage, jwtToken) => {
    try {
      const formData = new FormData();
      formData.append('categoryId', categoryId);
      formData.append('nameFilm', name);
      formData.append('director', director);
      formData.append('country', country);
      formData.append('startDate', startDate);
      formData.append('description', description);
      formData.append('filmImage', filmImage); // Assuming filmImage is a File object
      
      console.log(jwtToken);


      const response = await axios.post("/api/admin/films", formData, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const putUpdateAccount = async (userData, jwtToken) => {
    try {
      const response = await axios.put(
        `api/admin/reviewers/${userData.accountId}`, // Thay đổi địa chỉ API của bạn
        userData, // Dữ liệu cần cập nhật, chẳng hạn userData.name, userData.phone, userData.email, userData.password
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Thêm token vào header để xác thực
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  
  

export { fetchAccount, fetchSummaryData, fetchCategories, fetchDashBoard, fetchAllFilm, postCreateUser, updateUser, putUpdateAccount, fetchAllBlog, deleteAccount, deleteFilm, deleteBlog, postCreateFilm, postCreateAccount, updateStatusBlog };
