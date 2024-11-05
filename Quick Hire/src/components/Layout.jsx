import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2023 Quick Hire. All rights reserved.</p>
      </footer>
    </div>
  );
}