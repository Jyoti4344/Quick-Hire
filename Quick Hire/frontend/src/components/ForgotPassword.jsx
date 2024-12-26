import React, { useState } from "react";
import OTPVerification from "../components/OtpVerification";
import "./Login.css";

const ForgotPassword = ({ onClose, onPasswordReset }) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email"); // email, otp, newPassword
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await AuthService.sendPasswordResetOTP(email);
      setStep("otp");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleOTPVerify = async (otp) => {
    try {
      await AuthService.verifyPasswordResetOTP(email, otp);
      setStep("newPassword");
    } catch (err) {
      throw new Error("Invalid OTP");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    try {
      await AuthService.resetPassword(email, newPassword);
      onPasswordReset();
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="forgot-password-container">
      {step === "email" && (
        <form onSubmit={handleEmailSubmit}>
          <h3>Reset Password</h3>
          {error && <div className="error-message">{error}</div>}
          <div className="input-group">
            <i className="bx bx-mail-send"></i>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Send Reset Code</button>
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </form>
      )}

      {step === "otp" && (
        <OTPVerification
          email={email}
          onVerify={handleOTPVerify}
          onResend={() => AuthService.sendPasswordResetOTP(email)}
          onCancel={onClose}
        />
      )}

      {step === "newPassword" && (
        <form onSubmit={handlePasswordReset}>
          <h3>Set New Password</h3>
          {error && <div className="error-message">{error}</div>}
          <div className="input-group">
            <i className="bx bxs-lock-alt"></i>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="input-group">
            <i className="bx bxs-lock-alt"></i>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <button type="submit">Reset Password</button>
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
