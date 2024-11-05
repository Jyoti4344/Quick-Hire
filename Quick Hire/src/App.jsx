import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About'
import Team from './components/Team';
import Interview from './components/Interview';
import './index.css';

function App() { 
  const [currentPage, setCurrentPage] = useState('home');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onStartClick={() => handlePageChange('interview')} />;
      case 'about':
        return <About />;
      case 'team':
        return <Team />;
      case 'interview':
        return <Interview onButtonClick={() => handlePageChange('interview')} />;
      default:
        return <Home onStartClick={() => handlePageChange('interview')} />;
    }
  };

  return (
    <div className="app">
      <Navbar onPageChange={handlePageChange} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;