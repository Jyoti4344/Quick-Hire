'use client'

import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faMicrophone,
  faEllipsisV,
  faTimes,
  faDesktop,
  faComments,
  faSpinner,
  faExclamationTriangle,
  faUserTie
} from "@fortawesome/free-solid-svg-icons";
import Chat from "./Chat";
import "./Interview.css";

function Interview() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const screenShareRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream, screenStream]);

  const handleError = (error, action) => {
    console.error(`Error ${action}:`, error);
    setError(`Could not ${action}. Please check your device permissions.`);
    setIsLoading(false);
  };

  const toggleCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isCameraOn && stream) {
        stream.getVideoTracks().forEach(track => track.stop());
        setStream(null);
        setIsCameraOn(false);
      } else {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        setStream(newStream);
        setIsCameraOn(true);
      }
    } catch (err) {
      handleError(err, 'access camera');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMic = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isMicOn && stream) {
        stream.getAudioTracks().forEach(track => track.stop());
        setIsMicOn(false);
      } else {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(prevStream => {
          const newStream = new MediaStream();
          if (prevStream) {
            prevStream.getVideoTracks().forEach(track => newStream.addTrack(track));
          }
          audioStream.getAudioTracks().forEach(track => newStream.addTrack(track));
          return newStream;
        });
        setIsMicOn(true);
      }
    } catch (err) {
      handleError(err, 'access microphone');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleScreenShare = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isScreenSharing && screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
        setScreenStream(null);
        setIsScreenSharing(false);
      } else {
        const newScreenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });
        
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = newScreenStream;
        }
        setScreenStream(newScreenStream);
        setIsScreenSharing(true);

        newScreenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setScreenStream(null);
        };
      }
    } catch (err) {
      handleError(err, 'share screen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="interview">
      <div className="interview-container">
        <h2 className="interview-title">Let's Begin the Interview</h2>
        
        {error && (
          <div className="error-message">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>{error}</span>
          </div>
        )}
        
        <div className="video-grid">
          <div className="video-wrapper">
            {isCameraOn ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="video-feed"
              />
            ) : (
              <div className="video-placeholder">
                <FontAwesomeIcon icon={faCamera} className="placeholder-icon" />
                <span>Your Camera</span>
              </div>
            )}
          </div>
          
          <div className="video-wrapper ai-interviewer">
            <div className="ai-interviewer-content">
              <FontAwesomeIcon icon={faUserTie} className="ai-avatar" />
              <div className="ai-status">
                <span className="status-dot"></span>
                Online
              </div>
            </div>
            <div className="ai-label">AI Interviewer</div>
          </div>

          {isScreenSharing && (
            <div className="video-wrapper screen-share">
              <video 
                ref={screenShareRef} 
                autoPlay 
                playsInline 
                className="video-feed"
              />
              <div className="screen-share-label">Screen Share</div>
            </div>
          )}
        </div>

        <div className="controls-container">
          <div className="interview-buttons">
            <button
              className={`icon-button ${isCameraOn ? "active" : ""} ${isLoading ? "loading" : ""}`}
              onClick={toggleCamera}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={isCameraOn ? faTimes : faCamera} />
              <span className="button-text">{isCameraOn ? "Stop Camera" : "Start Camera"}</span>
            </button>

            <button
              className={`icon-button ${isMicOn ? "active" : ""} ${isLoading ? "loading" : ""}`}
              onClick={toggleMic}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={isMicOn ? faTimes : faMicrophone} />
              <span className="button-text">{isMicOn ? "Mute" : "Unmute"}</span>
            </button>

            <button
              className={`icon-button ${isScreenSharing ? "active" : ""} ${isLoading ? "loading" : ""}`}
              onClick={toggleScreenShare}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faDesktop} />
              <span className="button-text">
                {isScreenSharing ? "Stop Sharing" : "Share Screen"}
              </span>
            </button>

            <button
              className={`icon-button ${isChatOpen ? "active" : ""}`}
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <FontAwesomeIcon icon={faComments} />
              <span className="button-text">Chat</span>
            </button>

            <button className="icon-button options">
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          </div>
        </div>

        {isChatOpen && <Chat />}

        {isLoading && (
          <div className="loading-overlay">
            <FontAwesomeIcon icon={faSpinner} spin />
          </div>
        )}
      </div>
    </div>
  );
}

export default Interview;