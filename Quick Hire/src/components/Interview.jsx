"use client"

import React, { useState, useRef, useEffect } from "react"
import "./Interview.css"

const interviewQuestions = [
  "Tell me about yourself.",
  "What are your greatest strengths?",
  "What do you consider to be your weaknesses?",
  "Why do you want this job?",
  "Where do you see yourself in five years?",
]

const INTERVIEW_DURATION = 300 // 5 minutes in seconds
const QUESTION_DURATION = 60 // 1 minute per question in seconds

function Interview() {
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [stream, setStream] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(INTERVIEW_DURATION)
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(QUESTION_DURATION)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [transcript, setTranscript] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [interviewScore, setInterviewScore] = useState(0)

  const videoRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  // Timer effect for overall interview
  useEffect(() => {
    let interval
    if (isInterviewStarted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            completeInterview()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isInterviewStarted, timeRemaining])

  // Timer effect for question progression
  useEffect(() => {
    let interval
    if (isInterviewStarted && questionTimeRemaining > 0) {
      interval = setInterval(() => {
        setQuestionTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            nextQuestion()
            return QUESTION_DURATION
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isInterviewStarted, questionTimeRemaining])

  // Speech recognition setup
  useEffect(() => {
    if (isListening) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
      
        // Increase recognition accuracy
        recognitionRef.current.maxAlternatives = 1;
      
        recognitionRef.current.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(prev => prev + finalTranscript + interimTranscript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          // Restart recognition on error
          if (isListening) {
            recognitionRef.current.stop();
            setTimeout(() => recognitionRef.current.start(), 500);
          }
        };

        recognitionRef.current.onend = () => {
          if (isListening) {
            recognitionRef.current.start();
          }
        };

        recognitionRef.current.start();
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleCamera = async () => {
    try {
      setIsLoading(true)
      if (isCameraOn && stream) {
        stream.getVideoTracks().forEach((track) => track.stop())
        setStream(null)
        setIsCameraOn(false)
      } else {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        })
        setStream(newStream)
        setIsCameraOn(true)
      }
    } catch (err) {
      console.error("Camera access error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleListening = () => {
    setIsListening(prev => !prev);
    if (!isListening) {
      setTranscript("");
    }
  };

  const startInterview = () => {
    setIsInterviewStarted(true)
    setTimeRemaining(INTERVIEW_DURATION)
    setQuestionTimeRemaining(QUESTION_DURATION)
    toggleCamera()
    toggleListening()
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setQuestionTimeRemaining(QUESTION_DURATION)
      setTranscript("")
    } else {
      completeInterview()
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setQuestionTimeRemaining(QUESTION_DURATION)
      setTranscript("")
    }
  }

  const completeInterview = () => {
    const score = Math.min(Math.floor(transcript.length / 100 + (INTERVIEW_DURATION - timeRemaining) / 30), 100)
    setInterviewScore(score)
    setShowFeedback(true)
    endInterview()
  }

  const endInterview = () => {
    setIsInterviewStarted(false)
    if (isCameraOn) toggleCamera()
    if (isListening) toggleListening()
    setTimeRemaining(INTERVIEW_DURATION)
    setQuestionTimeRemaining(QUESTION_DURATION)
    setCurrentQuestionIndex(0)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  return (
    <div className="interview-container">
      {showFeedback && (
        <div className="feedback-overlay">
          <div className="feedback-dialog">
            <h2>Interview Complete!</h2>
            <div className="feedback-content">
              <p>Congratulations on completing your interview!</p>
              <div className="score-section">
                <h3>Your Performance Score: {interviewScore}%</h3>
                <div className="progress-bar">
                  <div className="progress-value" style={{ width: `${interviewScore}%` }}></div>
                </div>
              </div>
              <div className="feedback-details">
                <h3>Feedback Summary:</h3>
                <ul>
                  <li>Questions Answered: {currentQuestionIndex + 1}/5</li>
                  <li>Time Utilized: {formatTime(INTERVIEW_DURATION - timeRemaining)}</li>
                  <li>Response Length: {transcript.split(' ').length} words</li>
                </ul>
              </div>
            </div>
            <button className="close-btn" onClick={() => setShowFeedback(false)}>Close Feedback</button>
          </div>
        </div>
      )}

      <div className="interview-card">
        <div className="card-header">
          <h2 className="card-title">AI-Powered Interview Simulation</h2>
          {isInterviewStarted && (
            <div className="timer-group">
              <div className="timer">Total Time: {formatTime(timeRemaining)}</div>
              <div className="timer">Question Time: {formatTime(questionTimeRemaining)}</div>
            </div>
          )}
        </div>
        <div className="card-content">
          <div className="interview-grid">
            <div className="video-container">
              <div className="video-wrapper">
                {isCameraOn ? (
                  <video ref={videoRef} autoPlay playsInline muted className="camera-feed" />
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
                <div className="question-navigation">
                  <button 
                    className="nav-btn" 
                    onClick={prevQuestion} 
                    disabled={!isInterviewStarted || currentQuestionIndex === 0}
                  >
                    ← Previous
                  </button>
                  <span className="question-counter">
                    Question {currentQuestionIndex + 1} of {interviewQuestions.length}
                  </span>
                  <button 
                    className="nav-btn" 
                    onClick={nextQuestion}
                    disabled={!isInterviewStarted || currentQuestionIndex === interviewQuestions.length - 1}
                  >
                    Next →
                  </button>
                </div>
                <h3>Current Question</h3>
                <p className="current-question">{interviewQuestions[currentQuestionIndex]}</p>
                {isListening && (
                  <div className="transcript-container">
                    <h4>Your Response:</h4>
                    <div className="transcript-text">{transcript}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className="controls">
            <button
              className={`control-btn ${isCameraOn ? "active" : ""}`}
              onClick={toggleCamera}
              disabled={isInterviewStarted || isLoading}
            >
              📷
            </button>
            <button
              className={`control-btn ${isListening ? "active" : ""}`}
              onClick={toggleListening}
              disabled={isInterviewStarted || isLoading}
            >
              🎤
            </button>
          </div>
          {!isInterviewStarted ? (
            <>
              <button className="start-btn" onClick={startInterview} disabled={isLoading}>
                Start Interview
              </button>
              <button className="end-btn" onClick={completeInterview}>
                End Interview
              </button>
            </>
          ) : (
            <div className="interview-controls">
              <button className="next-btn" onClick={nextQuestion} disabled={currentQuestionIndex === interviewQuestions.length - 1}>
                Next Question
              </button>
              <button className="end-btn" onClick={completeInterview}>
                End Interview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Interview

