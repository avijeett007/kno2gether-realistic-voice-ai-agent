import React from 'react';
import './LoadingState.css';

const LoadingState = ({ message }) => {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>{message || 'Loading...'}</p>
    </div>
  );
};

export default LoadingState;