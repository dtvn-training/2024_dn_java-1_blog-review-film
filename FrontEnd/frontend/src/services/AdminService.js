import axios from "./customize-axios";

const fetchAllBlog = (selectedPage, accessToken, status, searchText, startTime, endTime) => {
    
    let query = `/api/reviewer/blogs?page=${selectedPage}`;
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
    return axios.get(query, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    
}

const fetchBlogById = (id, accessToken) => {
  return axios.get(`/api/reviewer/blogs/${id}`, {
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
  return axios.get(query, {
      headers: {
          'Authorization': `Bearer ${accessToken}`
      }
  });
  
}

const fetchDashBoard = (selectedPage, accessToken, status, searchText) => {
    const query = `/api/reviewer/blogs?page=${selectedPage}` + `&status=${status}` + `&searchText=${searchText}`;

    return axios.get(query, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
}


const fetchSummaryData = (accessToken) => {
  const user = JSON.parse(localStorage.getItem('user'));
  let query = `/api/reviewer/dashboard`;
  if (user.role === 'ROLE_ADMIN') {
    query = `/api/reviewer/dashboard`;
  }
    return axios.get(query, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
   
  };

  const fetchAllFilm = (selectedPage, accessToken, category, searchText) => {
    let query = `/api/films?page=${selectedPage}`;
    
    if (category) {
        query += `&category=${category}`;
    }
    if (searchText) {
        query += `&searchText=${searchText}`;
    }
    return axios.get(query, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    
}

const fetchCategories = (accessToken) => {
  const query = `/api/categories`; // Đường dẫn API để lấy danh sách các categories
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

const deleteAccount = async (accountIds, jwtToken) => {
  console.log(jwtToken);
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      },
      data: {
        ids: accountIds
      }
    };

    const query = `/api/admin/reviewers`;
    // Make the DELETE request using axios with the config object
    return axios.delete(query, config);
  } catch (error) {
    // Handle errors if any
    throw error;
  }
};

const deleteBlog = async (accountIds, jwtToken) => {
  console.log(jwtToken);
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      },
      data: {
        ids: accountIds
      }
    };

    const query = `/api/admin/blogs`;
    // Make the DELETE request using axios with the config object
    return axios.delete(query, config);
  } catch (error) {
    // Handle errors if any
    throw error;
  }
};


const deleteFilm = async (filmIds, jwtToken) => {
  console.log("a" ,filmIds);
  console.log("b", jwtToken);
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      },
      data: {
        ids: filmIds
      }
    };
    const query = `/api/admin/films`;
    // Make the DELETE request using axios with the config object
    return axios.delete(query, config);
  } catch (error) {
    // Handle errors if any
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

  const updateStatusAccount = async (ids, jwtToken, status) => {
    try {
      // Tạo đối tượng dữ liệu để gửi lên API
      const data = {
        ids: ids,
        status: status
      };
  
      // Gửi yêu cầu PATCH đến API endpoint
      const response = await axios.patch(`/api/admin/reviewers`, data, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json' // Thiết lập header Content-Type
        }
      });
  
      // Trả về dữ liệu từ phản hồi
      return response.data;
    } catch (error) {
      // Xử lý lỗi nếu có
      throw error;
    }
  }

  const updateStatusBlog = async (ids, jwtToken, status) => {
    try {
      // Tạo đối tượng dữ liệu để gửi lên API
      const data = {
        ids: ids,
        status: status
      };
  
      // Gửi yêu cầu PATCH đến API endpoint
      const response = await axios.patch(`/api/admin/blogs`, data, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json' // Thiết lập header Content-Type
        }
      });
  
      // Trả về dữ liệu từ phản hồi
      return response.data;
    } catch (error) {
      // Xử lý lỗi nếu có
      throw error;
    }
  }
  
  export { fetchAccount, fetchSummaryData, fetchCategories, fetchDashBoard, fetchAllFilm, postCreateUser, updateUser, putUpdateAccount, fetchAllBlog, deleteAccount, deleteFilm, deleteBlog, postCreateFilm, postCreateAccount, updateStatusBlog, updateStatusAccount, fetchBlogById };


