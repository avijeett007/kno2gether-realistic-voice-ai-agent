import React, { useState, useEffect } from 'react';
import {
  useRoomContext,
  useLocalParticipant,
  useRemoteParticipants,
  useTrackToggle,
  ConnectionState,
  RoomAudioRenderer,
  AudioRenderer
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
  
  // Initialize volume from localStorage or default to 100%
  const [volume, setVolume] = useState(() => {
    try {
      const savedVolume = localStorage.getItem('agentVolume');
      return savedVolume ? parseInt(savedVolume, 10) : 100;
    } catch (e) {
      console.error('Failed to load volume preference:', e);
      return 100;
    }
  });

  useEffect(() => {
    if (!room) return;

    console.log('Room object:', room);
    console.log('Room name:', room.name);
    console.log('Room connection state:', room.connectionState);
    console.log('Local participant:', room.localParticipant);

    // Log when participants join or leave
    const onParticipantConnected = (participant) => {
      console.log('Participant connected:', participant.identity);
    };

    const onParticipantDisconnected = (participant) => {
      console.log('Participant disconnected:', participant.identity);
    };

    const onDataReceived = (data) => {
      try {
        // Data might be transcription from the agent
        const message = JSON.parse(new TextDecoder().decode(data));
        console.log('Data received:', message);
        if (message.type === 'transcription' && message.text) {
          setTranscription(message.text);
        }
      } catch (e) {
        console.error('Error parsing data message:', e);
      }
    };

    const onConnectionStateChanged = (state) => {
      console.log('Room connection state changed:', state);
      if (state === ConnectionState.Disconnected) {
        setTranscription('');
      } else if (state === ConnectionState.Connected) {
        console.log('Successfully connected to room:', room.name);
      }
    };

    // Store references to event handlers for proper cleanup
    const onTrackPublished = (publication, participant) => {
      console.log('Track published:', publication.kind, publication.trackName, 'by', participant.identity);
    };

    const onTrackSubscribed = (track, publication, participant) => {
      console.log('Track subscribed:', track.kind, publication.trackName, 'from', participant.identity);

      // If this is an audio track, make sure it's enabled and unmuted
      if (track.kind === 'audio') {
        // Apply the current volume setting
        const audioElement = track.attach();
        audioElement.volume = volume / 100;
        console.log('Audio track attached and volume set to:', volume / 100);
      }
    };

    const onTrackUnsubscribed = (track, publication, participant) => {
      console.log('Track unsubscribed:', track.kind, publication.trackName, 'from', participant.identity);
      // Make sure to detach any elements
      track.detach();
    };

    // Register event listeners
    room.on('connectionStateChanged', onConnectionStateChanged);
    room.on('trackPublished', onTrackPublished);
    room.on('trackSubscribed', onTrackSubscribed);
    room.on('trackUnsubscribed', onTrackUnsubscribed);
    room.on('dataReceived', onDataReceived);
    room.on('participantConnected', onParticipantConnected);
    room.on('participantDisconnected', onParticipantDisconnected);

    return () => {
      // Clean up all event listeners with their specific handler functions
      room.off('connectionStateChanged', onConnectionStateChanged);
      room.off('dataReceived', onDataReceived);
      room.off('participantConnected', onParticipantConnected);
      room.off('participantDisconnected', onParticipantDisconnected);
      room.off('trackPublished', onTrackPublished);
      room.off('trackSubscribed', onTrackSubscribed);
      room.off('trackUnsubscribed', onTrackUnsubscribed);
    };
  }, [room, volume]);

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

    console.log('Remote participant connected:', agent.identity);
    console.log('Agent audio state:', {
      audioEnabled: agent.audioEnabled,
      isSpeaking: agent.isSpeaking
    });

    // Log the available tracks from the agent
    const tracks = agent.getTracks();
    console.log('Agent tracks:', tracks.map(track => ({
      source: track.source,
      kind: track.kind,
      name: track.trackName,
      muted: track.isMuted,
      enabled: track.isEnabled
    })));

    // Apply volume settings to any existing audio tracks
    const audioTracks = tracks.filter(pub => pub.kind === 'audio' && pub.track);
    audioTracks.forEach(pub => {
      if (pub.track) {
        // Detach and reattach to ensure we get the audio element
        pub.track.detach();
        const audioElement = pub.track.attach();
        audioElement.volume = volume / 100;
        console.log('Applied volume setting to existing track:', volume / 100);
      }
    });

    const onIsSpeakingChanged = (speaking) => {
      setIsAgentSpeaking(speaking);
      if (speaking) {
        console.log('Agent is speaking');
      }
    };

    const onTrackSubscribed = (track) => {
      console.log('Agent track subscribed:', track.kind, track.source);
      
      // For audio tracks, apply volume settings immediately
      if (track.kind === 'audio') {
        // First detach any existing elements to avoid duplicates
        track.detach();
        const audioElement = track.attach();
        audioElement.volume = volume / 100;
        console.log('Agent audio track attached with volume:', volume / 100);
      }
    };

    const onTrackUnsubscribed = (track) => {
      console.log('Agent track unsubscribed:', track.kind, track.source);
      track.detach();
    };

    agent.on('isSpeakingChanged', onIsSpeakingChanged);
    agent.on('trackSubscribed', onTrackSubscribed);
    agent.on('trackUnsubscribed', onTrackUnsubscribed);

    return () => {
      agent.off('isSpeakingChanged', onIsSpeakingChanged);
      agent.off('trackSubscribed', onTrackSubscribed);
      agent.off('trackUnsubscribed', onTrackUnsubscribed);
    };
  }, [remoteParticipants, volume]);

  // Function to handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);

    // Set volume for all audio elements - both existing and future ones
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.volume = newVolume / 100;
    });

    // If we have remote participants with audio tracks, update their volume directly
    if (remoteParticipants.length > 0) {
      const agent = remoteParticipants[0];
      const audioTracks = agent.getTracks().filter(pub => pub.kind === 'audio' && pub.track);
      
      audioTracks.forEach(pub => {
        if (pub.track) {
          const elements = pub.track.detach();
          const audioElement = pub.track.attach();
          audioElement.volume = newVolume / 100;
        }
      });
    }

    console.log('Volume changed to:', newVolume);
    
    // Store the volume preference in localStorage for persistence
    try {
      localStorage.setItem('agentVolume', newVolume.toString());
    } catch (e) {
      console.error('Failed to save volume preference:', e);
    }
  };

  return (
    <div className="room-controls">
      {/* RoomAudioRenderer: Handle all participant audio tracks */}
      <RoomAudioRenderer
        // Enhanced options to ensure reliable audio rendering
        options={{
          autoAttach: true,
          attachVisibleOnly: false,
          deviceId: 'default',
          updateOnlyOn: [],
        }}
        onAttach={(track, element) => {
          // Set volume for newly attached audio elements
          if (element instanceof HTMLAudioElement) {
            element.volume = volume / 100;
            console.log(`Audio element attached and volume set to: ${volume / 100}`);
          }
        }}
      />

      <div className="transcription-box">
        {transcription ? (
          <p>{transcription}</p>
        ) : (
          <p className="transcription-placeholder">Transcription will appear here...</p>
        )}
      </div>

      <div className="volume-control">
        <label htmlFor="volume-slider">Agent Volume: {volume}%</label>
        <input
          type="range"
          id="volume-slider"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
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