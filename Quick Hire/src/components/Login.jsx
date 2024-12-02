import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import AuthService from "../common/AuthService";

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const container = document.getElementById("container");
    if (container) {
      container.classList.add("sign-in");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return false;
    }
    if (isSignUp) {
      if (!formData.username) {
        setError("Username is required");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
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
        const response = await AuthService.register(
          formData.username,
          formData.email,
          formData.password
        );
        if (response.data.message) {
          toggle();
          setFormData((prev) => ({
            ...prev,
            username: "",
            confirmPassword: "",
          }));
        }
      } else {
        const response = await AuthService.login(
          formData.email,
          formData.password
        );
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err.response?.data?.message ||
          "Network error. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    setError("");
    const container = document.getElementById("container");
    if (container) {
      if (container.dataset.animating === "true") return;

      container.dataset.animating = "true";
      container.classList.toggle("sign-in");
      container.classList.toggle("sign-up");

      setTimeout(() => {
        container.dataset.animating = "false";
      }, 1000);
    }
    setIsSignUp(!isSignUp);
  };

  return (
    <div id="container" className="container">
      {error && (
        <div className="error-banner" role="alert">
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
                />
              </div>
              <div className="input-group">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
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
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Sign up"}
              </button>
              <p>
                <span>Already have an account?</span>
                <b onClick={!loading ? toggle : undefined} className="pointer">
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
                <i className="bx bxs-user"></i>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <i className="bx bxs-lock-alt"></i>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Sign in"}
              </button>
              <p>
                <b>Forgot password?</b>
              </p>
              <p>
                <span>Don't have an account?</span>
                <b onClick={!loading ? toggle : undefined} className="pointer">
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
            <h2>Welcome</h2>
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
