import React, { useState } from 'react';
import '../components/Interview.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

function Interview({ onButtonClick }) {
  // State to track the active status of each button
  const [activeButtons, setActiveButtons] = useState({
    camera: false,
    microphone: false,
    dots: false,
  });

  const handleButtonClick = (button) => {
    // Toggle the active state of the clicked button
    setActiveButtons((prev) => ({ ...prev, [button]: !prev[button] }));
    onButtonClick(); // Call the passed function
  };

  return (
    <div className="interview">
      <div className="interview-box">
        <h2>Let's Begin the Interview</h2>
      </div>
      <div className="interview-buttons">
        <button 
          className={`icon-button ${activeButtons.camera ? 'active' : ''}`} 
          onClick={() => handleButtonClick('camera')}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faCamera} />
          </span>
        </button>
        <button 
          className={`icon-button ${activeButtons.microphone ? 'active' : ''}`} 
          onClick={() => handleButtonClick('microphone')}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faMicrophone} />
          </span>
        </button>
        <button 
          className={`three-dots ${activeButtons.dots ? 'active' : ''}`} 
          onClick={() => handleButtonClick('dots')}
        >
          <span>
            <FontAwesomeIcon icon={faEllipsisH} />
          </span>
        </button>
      </div>
    </div>
  );
}

export default Interview;
