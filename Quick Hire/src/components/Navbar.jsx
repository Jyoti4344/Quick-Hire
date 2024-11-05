import React from 'react';
import '../components/Navbar.css';

function Navbar({ onPageChange }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <span>Quick Hire</span>
        </div>
        <div className="navbar-links">
          <a href="#" onClick={() => onPageChange('home')}>Home</a>
          <a href="#" onClick={() => onPageChange('about')}>About</a>
          <a href="#" onClick={() => onPageChange('team')}>Team</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
