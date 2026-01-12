// src/components/Footer.jsx
import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="app-footer-left">
        © 2025 Retail Management System · College Project
      </div>
      <div className="app-footer-right">
        Built with <span>MongoDB</span> · <span>Express</span> ·{" "}
        <span>React</span> · <span>Node.js</span>
      </div>
    </footer>
  );
};

export default Footer;
