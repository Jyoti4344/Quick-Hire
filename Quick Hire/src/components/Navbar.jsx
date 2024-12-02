import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../components/Navbar.css';
import logo1 from '../assets/logo1.jpg';

function Navbar({ onPageChange, currentPage }) {
  const { user, setUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    onPageChange('home');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <img src={logo1} alt="Quick Hire Logo" className='quicklogos' />
          <span className='quicky'>Quick Hire</span>
        </div>
        <div className="navbar-links">
          {currentPage !== 'home' && (
            <a href="#" onClick={() => onPageChange('home')}>Home</a>
          )}
          {!user && currentPage !== 'login' && (
            <a href="#" onClick={() => onPageChange('login')}>Login</a>
          )}
          {user && (
            <div className="user-profile-container" ref={dropdownRef}>
              <div 
                className="user-profile" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="user-avatar">
                  <i className='bx bxs-user-circle'></i>
                  <span className="user-email">{user.email}</span>
                  <i className={`bx ${isDropdownOpen ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
                </div>
              </div>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => onPageChange('profile')} className="dropdown-item">
                    <i className='bx bxs-user'></i>
                    Profile
                  </button>
                  {/* <button onClick={() => onPageChange('settings')} className="dropdown-item">
                    <i className='bx bxs-cog'></i>
                    Settings
                  </button> */}
                  <hr className="dropdown-divider" />
                  <button onClick={handleSignOut} className="dropdown-item text-red">
                    <i className='bx bx-log-out'></i>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

