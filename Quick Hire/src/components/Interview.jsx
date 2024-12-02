import React, { useState, useRef, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import * as speechCommands from "@tensorflow-models/speech-commands";
import "./Interview.css";

const interviewQuestions = [
  "Tell me about yourself.",
  "What are your greatest strengths?",
  "What do you consider to be your weaknesses?",
  "Why do you want this job?",
  "Where do you see yourself in five years?",
];

const INTERVIEW_DURATION = 300; // 5 minutes in seconds

function Interview() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bodyLanguageScore, setBodyLanguageScore] = useState(0);
  const [voiceScore, setVoiceScore] = useState(0);
  const [voiceConfidence, setVoiceConfidence] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(INTERVIEW_DURATION);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const cameraModelURL = "./my_model/cam_model/";
  const micModelURL = "./my_model/mic_model/";

  let cameraModel, webcam;
  let micRecognizer;

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    let interval;
    if (isInterviewStarted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      endInterview();
    }
    return () => clearInterval(interval);
  }, [isInterviewStarted, timeRemaining]);

  const initCameraModel = async () => {
    try {
      const modelURL = cameraModelURL + "model.json";
      const metadataURL = cameraModelURL + "metadata.json";

      cameraModel = await tmImage.load(modelURL, metadataURL);
      webcam = new tmImage.Webcam(1280, 720, true);
      await webcam.setup();
      await webcam.play();

      canvasRef.current.width = webcam.canvas.width;
      canvasRef.current.height = webcam.canvas.height;
      const ctx = canvasRef.current.getContext("2d");

      const loopCamera = async () => {
        webcam.update();
        ctx.drawImage(webcam.canvas, 0, 0);
        const predictions = await cameraModel.predict(canvasRef.current);
        const scores = predictions.map((p) => p.probability * 100);
        setBodyLanguageScore(scores.reduce((a, b) => a + b) / scores.length);

        if (isCameraOn) {
          requestAnimationFrame(loopCamera);
        }
      };

      loopCamera();
    } catch (err) {
      console.error("Camera model initialization error:", err);
      setError("Error loading camera model.");
    }
  };

  const initMicModel = async () => {
    try {
      micRecognizer = speechCommands.create(
        "BROWSER_FFT",
        undefined,
        micModelURL + "model.json",
        micModelURL + "metadata.json"
      );
      await micRecognizer.ensureModelLoaded();
      micRecognizer.listen(
        (result) => {
          const scores = result.scores.map((s) => s * 100);
          setVoiceScore(scores.reduce((a, b) => a + b) / scores.length);
          setVoiceConfidence((prevConfidence) => [...prevConfidence, scores.reduce((a, b) => a + b) / scores.length]);
        },
        { probabilityThreshold: 0.75 }
      );
    } catch (err) {
      console.error("Mic model initialization error:", err);
      setError("Error loading microphone model.");
    }
  };

  const toggleCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (isCameraOn && stream) {
        stream.getVideoTracks().forEach((track) => track.stop());
        setStream(null);
        setIsCameraOn(false);
      } else {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(newStream);
        setIsCameraOn(true);
        await initCameraModel();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Could not access the camera. Check permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = async () => {
    try {
      setIsLoading(true);
      if (isListening) {
        micRecognizer.stopListening();
      } else {
        await initMicModel();
      }
      setIsListening(!isListening);
    } catch (err) {
      console.error("Mic access error:", err);
      setError("Could not access the microphone. Check permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  const startInterview = () => {
    setIsInterviewStarted(true);
    toggleCamera();
    toggleListening();
  };

  const endInterview = () => {
    setIsInterviewStarted(false);
    if (isCameraOn) toggleCamera();
    if (isListening) toggleListening();
    setTimeRemaining(INTERVIEW_DURATION);
    setCurrentQuestionIndex(0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="interview-container">
      <div className="interview-card">
        <div className="card-header">
          <h2 className="card-title">AI-Powered Interview Simulation</h2>
        </div>
        <div className="card-content">
          {error && (
            <div className="error-message" role="alert">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}
          <div className="interview-grid">
            <div className="video-container">
              <div className="video-wrapper">
                {isCameraOn ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="camera-feed" />
                    <canvas ref={canvasRef} className="camera-canvas" />
                  </>
                ) : (
                  <div className="camera-placeholder">
                    <span className="camera-icon">📷</span>
                    <span>Camera Off</span>
                  </div>
                )}
              </div>
            </div>
            <div className="metrics-container">
              <div className="metrics-card">
                <h3>Performance Metrics</h3>
                <div className="metric">
                  <label>Body Language</label>
                  <div className="progress-bar">
                    <div className="progress-value" style={{width: `${bodyLanguageScore}%`}}></div>
                  </div>
                  <span>{bodyLanguageScore.toFixed(2)}%</span>
                </div>
                <div className="metric">
                  <label>Voice Score</label>
                  <div className="progress-bar">
                    <div className="progress-value" style={{width: `${voiceScore}%`}}></div>
                  </div>
                  <span>{voiceScore.toFixed(2)}%</span>
                </div>
                <div className="metric">
                  <label>Voice Confidence</label>
                  <div className="progress-bar">
                    <div className="progress-value" style={{width: `${(voiceConfidence.reduce((a, b) => a + b, 0) / voiceConfidence.length || 0)}%`}}></div>
                  </div>
                  <span>{(voiceConfidence.reduce((a, b) => a + b, 0) / voiceConfidence.length || 0).toFixed(2)}%</span>
                </div>
              </div>
              {isInterviewStarted && (
                <div className="timer-card">
                  <div className="timer">{formatTime(timeRemaining)}</div>
                  <div className="progress-bar">
                    <div className="progress-value" style={{width: `${(INTERVIEW_DURATION - timeRemaining) / INTERVIEW_DURATION * 100}%`}}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {isInterviewStarted && (
            <div className="questions-card">
              <h3>Interview Questions</h3>
              <div className="questions-tabs">
                {interviewQuestions.map((_, index) => (
                  <button
                    key={index}
                    className={`tab ${currentQuestionIndex === index ? 'active' : ''}`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    Q{index + 1}
                  </button>
                ))}
              </div>
              <div className="question-content">
                <p>{interviewQuestions[currentQuestionIndex]}</p>
              </div>
              <div className="question-navigation">
                <button onClick={prevQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
                <button onClick={nextQuestion} disabled={currentQuestionIndex === interviewQuestions.length - 1}>Next</button>
              </div>
            </div>
          )}
        </div>
        <div className="card-footer">
          <div className="controls">
            <button
              className={`control-btn ${isCameraOn ? 'active' : ''}`}
              onClick={toggleCamera}
              disabled={isInterviewStarted || isLoading}
            >
              📷
            </button>
            <button
              className={`control-btn ${isListening ? 'active' : ''}`}
              onClick={toggleListening}
              disabled={isInterviewStarted || isLoading}
            >
              🎤
            </button>
          </div>
          {!isInterviewStarted ? (
            <button className="start-btn" onClick={startInterview} disabled={isLoading}>
              ▶️ Start Interview
            </button>
          ) : (
            <button className="end-btn" onClick={endInterview}>
              ⏹️ End Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Interview;