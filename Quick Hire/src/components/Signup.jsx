import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";

function Signup() {
  const [username, setUsername] = useState(""); // Renamed from `name` for clarity
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);

    try {
      if (step === 1) {
        // Step 1: Send Signup Request and Trigger OTP
        await axios.post("http://localhost:5000/auth/signup", {
          username,
          email,
          password,
        });
        alert("OTP sent to your email. Verify to complete registration.");
        setStep(2); // Move to OTP verification step
      } else {
        // Step 2: Verify OTP
        await axios.post("http://localhost:5000/auth/verify", { email, otp });
        alert("Account created successfully!");
        // Redirect to login page or dashboard after successful verification
        window.location.href = "/login";
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      {step === 1 ? (
        <>
          <div className="input-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="glowing-input"
            />
            <label htmlFor="username">Username</label>
          </div>
          <div className="input-group">
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glowing-input"
            />
            <label htmlFor="signup-email">Email</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glowing-input"
            />
            <label htmlFor="signup-password">Create Password</label>
          </div>
        </>
      ) : (
        <div className="input-group">
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="glowing-input"
          />
          <label htmlFor="otp">Enter OTP</label>
        </div>
      )}
      <button type="submit" className="login-button" disabled={loading}>
        {loading ? "Processing..." : step === 1 ? "Sign Up" : "Verify OTP"}
      </button>
    </form>
  );
}

export default Signup;
