import React from 'react';
import './AgentSelector.css';

const AgentSelector = ({ selectedAgent, onChange, disabled }) => {
  return (
    <div className="agent-selector">
      <div className="agent-toggle">
        <button 
          className={`agent-toggle-btn ${selectedAgent === 'realistic' ? 'active' : ''}`}
          onClick={() => onChange('realistic')}
          disabled={disabled}
        >
          Realistic Agent
          <span className="agent-desc">With background audio</span>
        </button>
        <button 
          className={`agent-toggle-btn ${selectedAgent === 'standard' ? 'active' : ''}`}
          onClick={() => onChange('standard')}
          disabled={disabled}
        >
          Standard Agent
          <span className="agent-desc">No background audio</span>
        </button>
      </div>
    </div>
  );
};

export default AgentSelector;