import axios from "axios";

const API_URL = "http://localhost:5001/";

const AuthService = {
  register: async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}auth/signup`, {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: error.message };
    }
  },

  login: async (email, password) => {
    try {
      console.log("Attempting login for:", email);
      const response = await axios.post(`${API_URL}auth/signin`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getProtectedContent: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}api/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Protected content error:",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: error.message };
    }
  },
};

export default AuthService;
