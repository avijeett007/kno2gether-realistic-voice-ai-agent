import React from 'react';
import './YoutubePromo.css';

const YoutubePromo = () => {
  return (
    <div className="youtube-promo">
      <div className="container promo-container">
        <div className="promo-content">
          <h3>Subscribe to Kno2gether</h3>
          <p>
            Get more examples, tutorials, and insights on AI and voice technology!
          </p>
          <a 
            href="https://youtube.com/@kno2gether" 
            target="_blank" 
            rel="noopener noreferrer"
            className="subscribe-button"
          >
            Visit YouTube Channel
          </a>
        </div>
      </div>
    </div>
  );
};

export default YoutubePromo;