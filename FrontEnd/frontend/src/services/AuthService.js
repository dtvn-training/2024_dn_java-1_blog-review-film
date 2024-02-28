import axios from "./customize-axios";

const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
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

  const signup = async (name, phone, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { name, phone, email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export { login, logout, signup };