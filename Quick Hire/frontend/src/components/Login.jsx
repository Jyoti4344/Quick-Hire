import React, { useState, useEffect } from "react";
import AuthService from "../common/AuthService";
import { useAuth } from "../context/AuthContext";
import OTPVerification from "./OtpVerification";
import ForgotPassword from "./ForgotPassword";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const { setUser } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("password"); // 'password' or 'otp'
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempEmail, setTempEmail] = useState("");
  const [otpStatus, setOtpStatus] = useState(null);

  useEffect(() => {
    const container = document.getElementById("container");
    if (container) {
      container.classList.add("sign-in");
    }
  }, []);

  useEffect(() => {
    if (showOTP) {
      const checkStatus = async () => {
        try {
          const status = await AuthService.checkOTPStatus(tempEmail, isSignUp);
          setOtpStatus(status);
        } catch (err) {
          console.error("Error checking OTP status:", err);
        }
      };
      checkStatus();
    }
  }, [showOTP, tempEmail, isSignUp]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.email) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (isSignUp) {
      if (!formData.username) {
        setError("Username is required");
        return false;
      }
      if (loginMethod === "password") {
        if (!formData.password) {
          setError("Password is required");
          return false;
        }
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
      }
    } else if (loginMethod === "password" && !formData.password) {
      setError("Password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        console.log("Attempting to register:", formData.email);
        const response = await AuthService.register(
          formData.username,
          formData.email,
          formData.password
        );
        console.log("Registration successful:", response);
        setTempEmail(formData.email);
        setShowOTP(true);
      } else {
        if (loginMethod === "password") {
          console.log("Attempting password login for:", formData.email);
          const response = await AuthService.login(
            formData.email,
            formData.password
          );
          console.log("Login successful:", response);
          setUser(response.user);
          onLoginSuccess();
        } else {
          console.log("Sending login OTP for:", formData.email);
          await AuthService.sendLoginOTP(formData.email);
          console.log("Login OTP sent successfully");
          setTempEmail(formData.email);
          setShowOTP(true);
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp) => {
    try {
      let response;
      if (isSignUp) {
        console.log("Verifying signup OTP for:", tempEmail);
        response = await AuthService.verifySignupOTP(tempEmail, otp);
      } else {
        console.log("Verifying login OTP for:", tempEmail);
        response = await AuthService.verifyLoginOTP(tempEmail, otp);
      }
      console.log("OTP verification successful:", response);
      setUser(response.user);
      onLoginSuccess();
    } catch (err) {
      console.error("OTP verification error:", err);
      throw new Error(err.message || "Invalid OTP");
    }
  };

  const handleOTPCancel = () => {
    setShowOTP(false);
    setTempEmail("");
  };

  const toggle = () => {
    if (loading) return;
    setIsSignUp((prev) => !prev);
    setLoginMethod("password");
    setFormData({
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    });
    setError("");
    const container = document.getElementById("container");
    if (container) {
      container.classList.toggle("sign-in");
      container.classList.toggle("sign-up");
    }
  };

  if (showOTP) {
    return (
      <OTPVerification
        email={tempEmail}
        onVerify={handleOTPVerify}
        onResend={() => isSignUp ? AuthService.sendSignupOTP(tempEmail) : AuthService.sendLoginOTP(tempEmail)}
        onCancel={handleOTPCancel}
        isSignUp={isSignUp}
        otpStatus={otpStatus}
      />
    );
  }

  if (showForgotPassword) {
    return (
      <ForgotPassword
        onClose={() => setShowForgotPassword(false)}
        onPasswordReset={() => {
          setShowForgotPassword(false);
          setError(
            "Password reset successful. Please login with your new password."
          );
        }}
      />
    );
  }

  return (
    <div id="container" className="container">
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <div className="row">
        <div className="col align-items-center flex-col sign-up">
          <div className="form-wrapper align-items-center">
            <form onSubmit={handleSubmit} className="form sign-up">
              <div className="input-group">
                <i className="bx bxs-user"></i>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="input-group">
                <i className="bx bx-mail-send"></i>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="input-group">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type="password"
                  placeholder="Password (min. 8 characters)"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                  minLength={8}
                />
              </div>
              <div className="input-group">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type="password"
                  placeholder="Confirm password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Sign up"}
              </button>
              <p>
                <span>Already have an account?</span>
                <b onClick={toggle} className="pointer">
                  Sign in here
                </b>
              </p>
            </form>
          </div>
        </div>
        <div className="col align-items-center flex-col sign-in">
          <div className="form-wrapper align-items-center">
            <form onSubmit={handleSubmit} className="form sign-in">
              <div className="input-group">
                <i className="bx bx-mail-send"></i>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>
              {loginMethod === "password" && (
                <div className="input-group">
                  <i className="bx bxs-lock-alt"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                </div>
              )}
              <div className="login-options">
                <label>
                  <input
                    type="radio"
                    name="loginMethod"
                    value="password"
                    checked={loginMethod === "password"}
                    onChange={(e) => setLoginMethod(e.target.value)}
                  />
                  Password
                </label>
                <label>
                  <input
                    type="radio"
                    name="loginMethod"
                    value="otp"
                    checked={loginMethod === "otp"}
                    onChange={(e) => setLoginMethod(e.target.value)}
                  />
                  OTP
                </label>
              </div>
              <button type="submit" disabled={loading}>
                {loading
                  ? "Processing..."
                  : loginMethod === "password"
                  ? "Sign in"
                  : "Send OTP"}
              </button>
              {loginMethod === "password" && (
                <p>
                  <b
                    onClick={() => setShowForgotPassword(true)}
                    className="pointer"
                  >
                    Forgot password?
                  </b>
                </p>
              )}
              <p>
                <span>Don't have an account?</span>
                <b onClick={toggle} className="pointer">
                  Sign up here
                </b>
              </p>
            </form>
          </div>
        </div>
      </div>
      <div className="row content-row">
        <div className="col align-items-center flex-col">
          <div className="text sign-in">
            <h2>Welcome Back</h2>
          </div>
          <div className="img sign-in"></div>
        </div>
        <div className="col align-items-center flex-col">
          <div className="img sign-up"></div>
          <div className="text sign-up">
            <h2>Join with us</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

