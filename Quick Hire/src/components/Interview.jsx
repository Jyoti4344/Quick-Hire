import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faMicrophone,
  faEllipsisV,
  faTimes,
  faComments,
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import * as tmImage from "@teachablemachine/image";
import * as speechCommands from "@tensorflow-models/speech-commands";
import "./Interview.css";

function Interview() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [bodyLanguageScore, setBodyLanguageScore] = useState(0);
  const [voiceScore, setVoiceScore] = useState(0);

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const labelContainerRef = useRef(null);

  const cameraModelURL = "/my_model/cam_model";
  const micModelURL = "/my_model/mic_model";

  let cameraModel, webcam;
  let micRecognizer;

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/questions");
        const data = await response.json();
        setQuestions(data.questions);
        setChat((prevChat) => [
          ...prevChat,
          { sender: "HR", message: data.questions[0] },
        ]);
      } catch (err) {
        setError("Could not load interview questions. Try again later.");
      }
    };
    fetchQuestions();
  }, []);

  const initCameraModel = async () => {
    const modelURL = cameraModelURL + "model.json";
    const metadataURL = cameraModelURL + "metadata.json";

    cameraModel = await tmImage.load(modelURL, metadataURL);
    webcam = new tmImage.Webcam(200, 200, true); // width, height, flip
    await webcam.setup();
    await webcam.play();

    videoRef.current.appendChild(webcam.canvas);
    labelContainerRef.current.innerHTML = "";
    for (let i = 0; i < cameraModel.getTotalClasses(); i++) {
      labelContainerRef.current.appendChild(document.createElement("div"));
    }

    window.requestAnimationFrame(loopCamera);
  };

  const loopCamera = async () => {
    webcam.update();
    const predictions = await cameraModel.predict(webcam.canvas);
    const scores = predictions.map((p) => p.probability * 100);
    setBodyLanguageScore(scores.reduce((a, b) => a + b) / scores.length);

    predictions.forEach((prediction, index) => {
      labelContainerRef.current.childNodes[index].innerHTML = `${
        prediction.className
      }: ${(prediction.probability * 100).toFixed(2)}%`;
    });
    window.requestAnimationFrame(loopCamera);
  };

  const initMicModel = async () => {
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
      },
      { probabilityThreshold: 0.75 }
    );
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
      setError("Could not access the microphone. Check permissions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setChat((prevChat) => [
        ...prevChat,
        { sender: "HR", message: questions[nextIndex] },
      ]);
    } else {
      setChat((prevChat) => [
        ...prevChat,
        {
          sender: "HR",
          message: "Thank you for your responses! The interview is complete.",
        },
      ]);
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
              <div ref={videoRef}></div>
            ) : (
              <div className="video-placeholder">
                <FontAwesomeIcon icon={faCamera} className="placeholder-icon" />
                <span>Your Camera</span>
              </div>
            )}
          </div>
          <div id="label-container" ref={labelContainerRef}></div>
        </div>
        <div className="controls-container">
          <button onClick={toggleCamera}>
            {isCameraOn ? "Stop Camera" : "Start Camera"}
          </button>
          <button onClick={toggleListening}>
            {isListening ? "Stop Listening" : "Start Listening"}
          </button>
        </div>
        <div className="results">
          <p>Body Language Score: {bodyLanguageScore.toFixed(2)}%</p>
          <p>Voice Score: {voiceScore.toFixed(2)}%</p>
        </div>
        {/* Chat UI */}
      </div>
    </div>
  );
}

export default Interview;
