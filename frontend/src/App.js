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
      // Get the room name based on the selected agent type
      const chosenRoom = selectedAgent === 'realistic'
        ? process.env.REACT_APP_REALISTIC_AGENT_ROOM
        : process.env.REACT_APP_STANDARD_AGENT_ROOM;

      // Fetch token from our backend API
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/get-token?room=${chosenRoom}`);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setToken(data.accessToken);
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
                // Add these options to improve connection reliability
                options={{
                  adaptiveStream: true,
                  dynacast: true,
                  publishDefaults: {
                    simulcast: true,
                    dtx: true,
                  },
                  rtcConfig: {
                    iceTransportPolicy: 'all',
                    bundlePolicy: 'max-bundle',
                    sdpSemantics: 'unified-plan',
                    // Add STUN servers to help with connection
                    iceServers: [
                      { urls: 'stun:stun.l.google.com:19302' },
                      { urls: 'stun:stun1.l.google.com:19302' },
                    ],
                  },
                }}
                // Add connection state logging
                onConnected={() => console.log('Connected to LiveKit room')}
                onError={(error) => console.error('LiveKit connection error:', error)}
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