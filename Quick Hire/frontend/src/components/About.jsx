import React from "react";
import "./About.css";

export default function About() {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-box">
          <h2 className="about-title">About Quick Hire</h2>
          <div className="about-content">
            <div className="about-text">
              <p className="about-description">
                Quick Hire is an innovative tool designed to help users enhance
                their interview performance through real-time feedback and
                AI-powered analysis. This platform leverages advanced machine
                learning algorithms to assess key elements of an interviewee's
                presentation, including attire, posture, and confidence level.
              </p>
              <p className="about-description">
                By analyzing visual and vocal cues via integrated camera and
                microphone access, Quick Hire offers tailored feedback to help
                users identify their strengths and areas for improvement.
              </p>
            </div>
            <div className="about-features-container">
              <h3 className="features-title">Key Features</h3>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <span>Real-time AI-powered feedback</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">👁️</div>
                  <span>Visual and vocal cue analysis</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <span>Detailed performance reports</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💻</div>
                  <span>Intuitive user interface</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <span>One-click mock interviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
