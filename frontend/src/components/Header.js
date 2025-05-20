import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <h2>Kno2gether</h2>
        </div>
        <nav className="nav">
          <a href="https://youtube.com/@kno2gether" target="_blank" rel="noopener noreferrer">
            YouTube Channel
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;