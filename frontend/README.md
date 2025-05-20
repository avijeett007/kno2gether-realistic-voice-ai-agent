# Kno2gether Voice AI Frontend

A modern web frontend for interacting with Kno2gether Voice AI agents. This application allows users to connect to either the realistic agent (with background audio) or the standard agent (without background audio) via LiveKit rooms.

## Features

- **Agent Selection**: Choose between realistic and standard agent experiences
- **LiveKit Integration**: Connect to LiveKit rooms for real-time audio communication
- **Audio Visualization**: Visual feedback for both user and agent audio activity
- **Transcription Display**: See text transcriptions of the conversation
- **Volume Control**: Adjustable volume control for agent voice with persistent settings
- **Enhanced Audio Reliability**: Improved audio track handling and connection stability
- **Responsive Design**: Works on desktop and mobile devices
- **Kno2gether Branding**: Professional interface with Kno2gether styling

## Setup and Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```
   REACT_APP_LIVEKIT_URL=wss://your-livekit-server.com
   REACT_APP_REALISTIC_AGENT_ROOM=realistic-agent-room
   REACT_APP_STANDARD_AGENT_ROOM=standard-agent-room
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Building for Production

To create a production build:

```bash
npm run build
```

This will generate optimized static files in the `build` directory that can be deployed to any static hosting service.

## Docker Deployment

You can build and run the frontend in a Docker container:

```bash
# Build the Docker image
docker build -t kno2gether-frontend .

# Run the container
docker run -p 3000:80 kno2gether-frontend
```

## Project Structure

- `src/components/`: React components for the UI
- `src/assets/`: Static assets like images
- `public/`: Public static files

## Technology Stack

- React
- LiveKit Client SDK
- CSS3 for styling
- Web APIs for audio visualization

## Audio Implementation Details

The application includes several improvements for reliable audio handling:

1. **RoomAudioRenderer Component**: Uses LiveKit's built-in audio rendering with enhanced configuration
2. **Volume Control System**: Dynamically adjusts volume for all audio elements
3. **Persistent Settings**: Saves volume preferences to localStorage
4. **Track Subscription Handling**: Proper event listeners for track subscription/unsubscription
5. **Debug Logging**: Extensive console logging for troubleshooting connection issues

## Troubleshooting

### Common Audio Issues

If agent audio isn't working:

1. **Check Console Logs**: Open browser developer tools (F12) and check the console for connection and track-related messages
2. **Browser Permissions**: Ensure microphone permissions are granted
3. **Volume Settings**: Verify volume slider isn't set to zero
4. **Audio Output**: Check your system's default audio output device
5. **Connection Status**: Verify the room connection is established correctly

### Testing Audio Functionality

For development and testing, you can use the included test utilities:

```javascript
// In browser console
import('./test-audio.js').then(() => {
  // Test volume control
  window.testAudio.testVolumeChange();
  
  // Simulate audio track publishing
  window.testAudio.simulateTrackPublished();
});
```