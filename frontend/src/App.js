import React, { useState } from 'react';
import { LiveKitRoom } from '@livekit/components-react';
import '@livekit/components-styles';
import './App.css';

// Components
import Header from './components/Header';
import AgentSelector from './components/AgentSelector';
import RoomControls from './components/RoomControls';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import YoutubePromo from './components/YoutubePromo';

function App() {
  const [token, setToken] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [roomName, setRoomName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [agentType, setAgentType] = useState('realistic'); // 'realistic' or 'standard'

  const generateToken = async (selectedAgent) => {
    setIsConnecting(true);
    setError(null);

    try {
      // In a real app, you would generate a token from your backend
      // For this demo, we'll simulate this with a timeout
      const chosenRoom = selectedAgent === 'realistic'
        ? process.env.REACT_APP_REALISTIC_AGENT_ROOM
        : process.env.REACT_APP_STANDARD_AGENT_ROOM;

      // Simulate token generation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For a real implementation, you would fetch a token from your server
      // const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/get-token?room=${chosenRoom}`);
      // const data = await response.json();

      // For demo purposes, provide a mock token
      // Creating a properly formatted token with the room name
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjQwMDAwMDAsImlzcyI6IkFQSV9LRVkiLCJuYmYiOjE2MjMwMDAwMDAsInN1YiI6InVzZXIiLCJyb29tIjoiJyArIGNob3NlblJvb20gKyAnIiwidmlkZW8iOnsicm9vbUpvaW4iOnRydWV9fQ.mockSignature';

      setToken(mockToken);
      setRoomName(chosenRoom);
    } catch (err) {
      console.error('Error generating token:', err);
      setError('Failed to connect to agent. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const connectToAgent = () => {
    generateToken(agentType);
  };

  const handleAgentChange = (type) => {
    setAgentType(type);
    // Disconnect if already connected
    if (token) {
      setToken(null);
      setRoomName('');
    }
  };

  const handleDisconnect = () => {
    setToken(null);
    setRoomName('');
  };

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <div className="container">
          <h1>Kno2gether AI Voice Agent Demo</h1>

          <AgentSelector
            selectedAgent={agentType}
            onChange={handleAgentChange}
            disabled={isConnecting || !!token}
          />

          {error && <ErrorState message={error} onRetry={connectToAgent} />}

          {!token && !isConnecting && (
            <div className="connection-container">
              <p>
                {agentType === 'realistic'
                  ? 'Connect to our realistic voice agent with office background sounds.'
                  : 'Connect to our standard voice agent with no background audio.'}
              </p>
              <button
                className="connect-button"
                onClick={connectToAgent}
                disabled={isConnecting}
              >
                Connect to Agent
              </button>
            </div>
          )}

          {isConnecting && <LoadingState message="Connecting to agent..." />}

          {token && (
            <div className="room-container">
              <LiveKitRoom
                serverUrl={process.env.REACT_APP_LIVEKIT_URL || 'wss://your-livekit-server.com'}
                token={token}
                audio={true}
                video={false}
                onDisconnected={handleDisconnect}
              >
                <RoomControls agentType={agentType} />
              </LiveKitRoom>
            </div>
          )}
        </div>
      </main>

      <YoutubePromo />
    </div>
  );
}

export default App;