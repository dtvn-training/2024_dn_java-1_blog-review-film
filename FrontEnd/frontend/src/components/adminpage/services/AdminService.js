import axios from "./customize-axios";
const fetchAllBlog = (selectedPage, accessToken, status, searchText, startTime, endTime) => {
    
    var query = `/api/admin/blogs?page=${selectedPage}`;
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
    console.log(query);
    return axios.get(query, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
}

const fetchAllUser = (selectedPage) => {
    return axios.get(`/api/admin/blogs?page=${selectedPage}`);
}


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

export { fetchAllUser, postCreateUser, updateUser, fetchAllBlog, deleteBlog };