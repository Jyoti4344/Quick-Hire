import React from 'react';
import '../components/Navbar.css';
import logo1 from '../assets/logo1.jpg';

function Navbar({ onPageChange, currentPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <img src={logo1} alt="none" className='quicklogos' />
          <span className='quicky'>Quick Hire</span>
        </div>
        <div className="navbar-links">
          {currentPage !== 'home' && (
            <a href="#" onClick={() => onPageChange('home')}>Home</a>
          )}
          {currentPage !== 'login' && (
            <a href="#" onClick={() => onPageChange('login')}>Login</a>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;