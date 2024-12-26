import React, { useState, useEffect } from "react";
import "./Login.css";

const OTPVerification = ({ email, onVerify, onResend, onCancel, isSignUp, otpStatus }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(true);

  useEffect(() => {
    const countdown = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  useEffect(() => {
    if (timer === 0 && otpSent) {
      setError("OTP expired. Please request a new one.");
      setOtpSent(false);
    }
  }, [timer, otpSent]);

  useEffect(() => {
    if (otpStatus) {
      console.log("OTP status:", otpStatus);
      // Handle OTP status (e.g., show a message if OTP was not sent)
    }
  }, [otpStatus]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all digits");
      return;
    }
    setVerifying(true);
    try {
      console.log("Verifying OTP:", otpString);
      await onVerify(otpString);
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Invalid OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      console.log("Resending OTP for:", email);
      await onResend();
      setTimer(30);
      setError("");
      setOtpSent(true);
      console.log("OTP resent successfully");
    } catch (err) {
      console.error("Failed to resend OTP:", err);
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="otp-container">
      <h3>Enter Verification Code</h3>
      <p className="otp-info">We have sent a verification code to {email}</p>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="otp-input-group">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
              className="otp-input"
            />
          ))}
        </div>
        <div className="timer-container">
          {timer > 0 ? (
            <p>Time remaining: {timer} seconds</p>
          ) : (
            <p>OTP has expired</p>
          )}
        </div>
        <button type="submit" className="verify-btn" disabled={verifying || timer === 0}>
          {verifying ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      <div className="otp-footer">
        <p>
          {timer > 0 ? (
            `Resend code in ${timer}s`
          ) : (
            <button onClick={handleResend} className="resend-btn">
              Resend Code
            </button>
          )}
        </p>
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
      {!otpSent && (
        <p className="otp-not-received">
          Didn't receive the OTP? Check your spam folder or click "Resend Code".
        </p>
      )}
    </div>
  );
};

export default OTPVerification;

