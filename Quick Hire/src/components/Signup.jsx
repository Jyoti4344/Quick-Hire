import React, { useState } from "react";
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      // Here you would typically send an API request to create an account and send OTP
      console.log("Account creation initiated:", { name, email, password });
      setStep(2);
    } else {
      // Here you would typically verify the OTP
      console.log("OTP submitted:", otp);
      // If OTP is correct, create the account
      console.log("Account created successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {step === 1 ? (
        <>
          <div className="input-group">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="glowing-input"
            />
            <label htmlFor="name">Name</label>
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
      <button type="submit" className="login-button">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        {step === 1 ? "Sign Up" : "Verify OTP"}
      </button>
    </form>
  );
}

export default Signup;