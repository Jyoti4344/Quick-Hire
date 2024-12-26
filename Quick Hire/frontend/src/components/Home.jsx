import React from "react";
import "./Home.css";
import { useAuth } from "../context/AuthContext";

function Home({ onStartClick }) {
  const { user } = useAuth();

  const handleStartClick = () => {
    // If user is logged in, go to interview, otherwise go to login
    onStartClick(user ? "interview" : "login");
  };

  return (
    <div className="hero-section">
      <div className="content">
        <h1 className="title">Welcome to Quick Hire</h1>
        <p className="subtitle">
          Inspiring great minds to be successful in life
        </p>
        <button className="start-button" onClick={handleStartClick}>
          Let's Begin
        </button>
      </div>
      <div className="image-section"></div>
    </div>
  );
}

export default Home;

