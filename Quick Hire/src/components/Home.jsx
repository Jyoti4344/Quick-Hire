import React from "react";
import "./Home.css";

function Home({ onStartClick }) {
  return (
    <div className="hero-section">
      <div className="content">
        <h1 className="title">Welcome to Quick Hire</h1>
        <p className="subtitle">Inspiring great minds to be successful in life</p>
        <button className="start-button" onClick={onStartClick}>Let's Begin</button>
      </div>
      <div className="image-section"></div>
    </div>
  );
}

export default Home;
