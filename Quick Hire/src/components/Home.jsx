import React from 'react';
import './Home.css';

function Home({ onStartClick }) {
  return (
    <div className="home">
      <div className="home-content">
        <div className="home-box">
          <h1>Quick Hire</h1>
        </div>
        <button className="start-button" onClick={onStartClick}>
          Start
        </button>
      </div>
    </div>
  );
}

export default Home;