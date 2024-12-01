import axios from "axios";

const API_URL = "http://localhost:5001/"; // Update port to match your server.js (default: 5001)

// User registration
const register = (username, email, password) => {
    return axios.post(`${API_URL}auth/signup`, { username, email, password });
};

// User login
const login = (email, password) => {
    return axios.post(`${API_URL}auth/signin`, { email, password });
};

// Fetch protected content (with JWT token)
const getProtectedContent = (token) => {
    return axios.get(`${API_URL}api/protected`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// Exporting the AuthService object
export default { register, login, getProtectedContent };
