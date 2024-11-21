import React, { useState } from "react";
import "./Login.css";
import Signup from "./Signup";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", email, password);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-content">
          <h2>{isLogin ? "ENTER THE VOID" : "JOIN THE VOID"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glowing-input"
                placeholder="Email"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glowing-input"
                placeholder="Password"
              />
            </div>
            <button type="submit" className="login-button">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <p className="switch-form">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <a href="#" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign up" : "Login"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
