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

  sendLoginOTP: async (email) => {
    try {
      console.log(`Sending login OTP to ${email}`);
      const response = await axios.post(`${API_URL}auth/send-login-otp`, {
        email,
      });
      console.log("Login OTP sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Send login OTP error:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  verifyLoginOTP: async (email, otp) => {
    try {
      console.log(`Verifying login OTP for ${email}`);
      const response = await axios.post(`${API_URL}auth/verify-login-otp`, {
        email,
        otp,
      });
      console.log("Login OTP verified successfully:", response.data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("Verify login OTP error:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  sendSignupOTP: async (email) => {
    try {
      console.log(`Sending signup OTP to ${email}`);
      const response = await axios.post(`${API_URL}auth/send-signup-otp`, {
        email,
      });
      console.log("Signup OTP sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Send signup OTP error:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  verifySignupOTP: async (email, otp) => {
    try {
      console.log(`Verifying signup OTP for ${email}`);
      const response = await axios.post(`${API_URL}auth/verify-signup-otp`, {
        email,
        otp,
      });
      console.log("Signup OTP verified successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Verify signup OTP error:", error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  sendPasswordResetOTP: async (email) => {
    try {
      const response = await axios.post(`${API_URL}auth/send-reset-otp`, {
        email,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Send password reset OTP error:",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: error.message };
    }
  },

  verifyPasswordResetOTP: async (email, otp) => {
    try {
      const response = await axios.post(`${API_URL}auth/verify-reset-otp`, {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Verify password reset OTP error:",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: error.message };
    }
  },

  resetPassword: async (email, newPassword, otp) => {
    try {
      const response = await axios.post(`${API_URL}auth/reset-password`, {
        email,
        newPassword,
        otp,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Reset password error:",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: error.message };
    }
  },

  checkOTPStatus: async (email, isSignUp) => {
    try {
      const response = await axios.post(`${API_URL}auth/check-otp-status`, {
        email,
        isSignUp,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Check OTP status error:",
        error.response?.data || error.message
      );
      throw error.response?.data || { message: error.message };
    }
  },
};

export default AuthService;

