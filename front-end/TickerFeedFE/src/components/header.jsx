import React from "react";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
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
    </header>
  );
};

export default Header;
