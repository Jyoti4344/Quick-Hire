import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "../common/AuthService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const response = await AuthService.login(email, password);
    setUser(response.user);
    return response;
  };

  const loginWithOTP = async (email, otp) => {
    const response = await AuthService.verifyLoginOTP(email, otp);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const register = async (username, email, password) => {
    const response = await AuthService.register(username, email, password);
    return response;
  };

  const verifySignupOTP = async (email, otp) => {
    const response = await AuthService.verifySignupOTP(email, otp);
    setUser(response.user);
    return response;
  };

  const sendPasswordResetOTP = async (email) => {
    return await AuthService.sendPasswordResetOTP(email);
  };

  const resetPassword = async (email, newPassword, otp) => {
    return await AuthService.resetPassword(email, newPassword, otp);
  };

  const value = {
    user,
    setUser,
    login,
    loginWithOTP,
    logout,
    register,
    verifySignupOTP,
    sendPasswordResetOTP,
    resetPassword,
    loading,
  };

  if (loading) {
    return <div>Loading...</div>; // Or any loading component
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
