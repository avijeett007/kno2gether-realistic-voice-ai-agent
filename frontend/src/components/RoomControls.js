import React, { useState, useEffect } from 'react';
import {
  useRoomContext,
  useLocalParticipant,
  useRemoteParticipants,
  useTrackToggle,
  ConnectionState
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import './RoomControls.css';

const RoomControls = ({ agentType = 'standard' }) => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const { toggle: toggleMic, enabled: isMicEnabled } = useTrackToggle({ source: Track.Source.Microphone });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [transcription, setTranscription] = useState('');

  useEffect(() => {
    if (!room) return;

    const onDataReceived = (data, participant) => {
      try {
        // Data might be transcription from the agent
        const message = JSON.parse(new TextDecoder().decode(data));
        if (message.type === 'transcription' && message.text) {
          setTranscription(message.text);
        }
      } catch (e) {
        console.error('Error parsing data message:', e);
      }
    };

    room.on('connectionStateChanged', (state) => {
      if (state === ConnectionState.Disconnected) {
        setTranscription('');
      }
    });

    // Handle data messages (transcriptions)
    room.on('dataReceived', onDataReceived);

    return () => {
      room.off('dataReceived', onDataReceived);
    };
  }, [room]);

  useEffect(() => {
    if (!localParticipant) return;

    // Check if the local participant is speaking
    const onIsSpeakingChanged = (speaking) => {
      setIsSpeaking(speaking);
    };

    localParticipant.on('isSpeakingChanged', onIsSpeakingChanged);

    return () => {
      localParticipant.off('isSpeakingChanged', onIsSpeakingChanged);
    };
  }, [localParticipant]);

  useEffect(() => {
    if (remoteParticipants.length === 0) return;

    // Assuming the first remote participant is the agent
    const agent = remoteParticipants[0];

    const onIsSpeakingChanged = (speaking) => {
      setIsAgentSpeaking(speaking);
    };

    agent.on('isSpeakingChanged', onIsSpeakingChanged);

    return () => {
      agent.off('isSpeakingChanged', onIsSpeakingChanged);
    };
  }, [remoteParticipants]);

  return (
    <div className="room-controls">
      <div className="transcription-box">
        {transcription ? (
          <p>{transcription}</p>
        ) : (
          <p className="transcription-placeholder">Transcription will appear here...</p>
        )}
      </div>

      <div className="audio-visualization">
        <div className={`visualization-container ${isAgentSpeaking ? 'active' : ''} ${agentType === 'realistic' ? 'realistic' : 'standard'}`}>
          <div className="agent-avatar">
            {agentType === 'realistic' ? 'Realistic Agent' : 'Standard Agent'}
            {agentType === 'realistic' && <span className="agent-badge">Office Audio</span>}
          </div>
          <div className={`visualization-bars ${agentType === 'realistic' ? 'more-dynamic' : ''}`}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>

        <div className="mic-button-container">
          <button
            className={`mic-button ${isMicEnabled ? 'active' : ''} ${isSpeaking ? 'speaking' : ''}`}
            onClick={toggleMic}
          >
            {isMicEnabled ? 'Mute' : 'Unmute'}
          </button>
        </div>

        <div className={`visualization-container user ${isSpeaking ? 'active' : ''}`}>
          <div className="user-avatar">You</div>
          <div className="visualization-bars">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      </div>

      <button
        className="disconnect-button"
        onClick={() => room.disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
};

export default RoomControls;