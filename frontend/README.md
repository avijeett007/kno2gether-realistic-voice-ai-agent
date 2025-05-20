# Kno2gether Voice AI Frontend

A modern web frontend for interacting with Kno2gether Voice AI agents. This application allows users to connect to either the realistic agent (with background audio) or the standard agent (without background audio) via LiveKit rooms.

## Features

- **Agent Selection**: Choose between realistic and standard agent experiences
- **LiveKit Integration**: Connect to LiveKit rooms for real-time audio communication
- **Audio Visualization**: Visual feedback for both user and agent audio activity
- **Transcription Display**: See text transcriptions of the conversation
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