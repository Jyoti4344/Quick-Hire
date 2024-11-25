import React from "react";
import "./Footer.css";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">Quick Hire</h3>
          <p className="footer-description">
            Empowering your interview journey with AI-driven insights and
            real-time feedback.
          </p>
        </div>
        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#team">Team</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="footer-subtitle">Connect With Us</h4>
          <div className="social-icons">
            <a
              href="https://github.com/quickhire"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/company/quickhire"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://twitter.com/quickhire"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a href="mailto:info@quickhire.com">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>
      {/* <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Quick Hire. All rights reserved.</p>
      </div> */}
    </footer>
  );
}
