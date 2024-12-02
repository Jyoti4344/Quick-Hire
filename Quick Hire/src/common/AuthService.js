import axios from "axios";

const API_URL = "http://localhost:5001/";

const AuthService = {
  register: async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}auth/signup`, {
        username,
        email,
        password,A
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}auth/signin`, {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getProtectedContent: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}api/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default AuthService;
