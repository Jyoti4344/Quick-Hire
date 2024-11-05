import React from 'react';
import '../components/Navbar.css';
import logo1 from '../assets/logo1.jpg';

function Navbar({ onPageChange }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <img src={logo1} alt="none" className='quicklogos' />
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
