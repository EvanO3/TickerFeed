import React from 'react'
import "../index.css"
import { AiOutlineStock } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function nav() {
  const navigate = useNavigate()
  
  const goToLogin=()=>{
    navigate("/login")
  }

  const goToSignUp=()=>{
     navigate("/signup");
  }
  return (
    <nav className="nav-bar">
      <div className="logo-container">
        <svg
          className="logo"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="45" fill="#007bff" />
          <text x="50" y="65" fontSize="60" fill="white" textAnchor="middle">
            TF
          </text>
        </svg>
        <span className="company-name">TickerFeed</span>
      </div>

      <div className="auth-buttons">
        <button className="button signIn" onClick={goToLogin}>
          Sign In
        </button>
        <button className="button signUp" onClick={goToSignUp}>Sign Up</button>
      </div>
    </nav>
  );
}

export default nav