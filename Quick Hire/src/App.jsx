import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Team from "./components/Team";
import Interview from "./components/Interview";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Footer from "./components/Footer";
import "./index.css";
import "boxicons/css/boxicons.min.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const handlePageChange = (page) => { 
    setCurrentPage(page);
    if (page === "home") {
      window.scrollTo(0, 0);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "interview":
        return <Interview />;
      case "login":
        return <Login onLoginSuccess={() => handlePageChange("home")} />;
      case "chat":
        return <Chat />;
      default:
        return (
          <>
            <Home onStartClick={() => handlePageChange("interview")} />
            <About />
            <Team />
            <Footer />
          </>
        );
    }
  };

  return (
    <AuthProvider>
      <div className="app">
        <Navbar onPageChange={handlePageChange} currentPage={currentPage} />
        <main className="main-content">{renderPage()}</main>
      </div>
    </AuthProvider>
  );
}

export default App;
