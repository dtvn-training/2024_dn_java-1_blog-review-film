import axios from "./customize-axios";

const login = async (email, password) => {
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};


const logout = async () => {
  try {
    const response = await axios.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { login, logout };
