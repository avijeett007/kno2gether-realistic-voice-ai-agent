# Implementation Plan for GitHub Issue #1

## Issue Summary

The issue requests the creation of two LiveKit voice AI agents and a production-ready frontend to showcase them:

1. A realistic office caller agent with background audio
2. A standard office caller agent without background audio
3. A frontend application to connect to these agents via LiveKit rooms

## Task Breakdown

### 1. Project Structure Setup

- [x] Analyze existing codebase
- [ ] Create an `agents` directory with two subdirectories:
  - `realistic_agent/` - For the agent with background audio
  - `standard_agent/` - For the agent without background audio
- [ ] Create a `frontend` directory for the web client
- [ ] Update `.gitignore` to include appropriate exclusions

### 2. Realistic Office Caller Agent Implementation

- [ ] Create a realistic agent based on `office_caller_agent.py` example
- [ ] Enhance the agent with:
  - Office ambient sound
  - Keyboard typing sounds during "thinking" periods
  - Professional voice configuration
  - Comprehensive function tools for office-related tasks
- [ ] Add appropriate documentation
- [ ] Create a specialized Dockerfile for the realistic agent
- [ ] Create a sample `.env.example` file

### 3. Standard Office Caller Agent Implementation

- [ ] Create a standard agent without background audio
- [ ] Implement the same function tools as the realistic agent
- [ ] Add appropriate documentation
- [ ] Create a specialized Dockerfile for the standard agent

### 4. Frontend Implementation

- [ ] Set up a modern web frontend using React
- [ ] Implement the LiveKit client SDK
- [ ] Create a professional UI with:
  - Kno2gether branding
  - YouTube link to https://youtube.com/@kno2gether
  - Interactive microphone component
  - Agent selection toggle
  - Responsive design
- [ ] Implement connection to LiveKit rooms
- [ ] Add audio visualizations
- [ ] Implement error handling and loading states

### 5. Documentation and Finalization

- [ ] Create comprehensive documentation
- [ ] Update main README.md with setup and usage instructions
- [ ] Update `requirements.txt` if needed
- [ ] Test both agent implementations
- [ ] Test frontend with both agents

## Implementation Details

### Agent Structure

Both agents will share a similar structure:

```python
class OfficeCallerAgent(Agent):
    def __init__(self):
        super().__init__(instructions="You are a professional office assistant...")

    @function_tool
    async def perform_task(self, ...):
        # Implement office-related functions
        pass
```

The realistic agent will include background audio configuration:

```python
background_audio = BackgroundAudioPlayer(
    ambient_sound=AudioConfig(BuiltinAudioClip.OFFICE_AMBIENCE, volume=0.8),
    thinking_sound=[
        AudioConfig(BuiltinAudioClip.KEYBOARD_TYPING, volume=0.8),
    ],
)
```

### Frontend Structure

The frontend will be implemented using React and the LiveKit client SDK:

```javascript
import { Room, RoomEvent } from 'livekit-client';

// Room connection logic
const connectToRoom = async (roomName, token) => {
  const room = new Room();
  await room.connect(`wss://your-livekit-server.com`, token);
  // Set up event listeners
  room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
  return room;
};
```

The UI will feature:
- A large, interactive microphone button
- A toggle to switch between agent types
- Kno2gether branding elements
- A YouTube subscription link

## Docker Configuration

Each agent will have its own Dockerfile based on the example but customized for their specific needs. The Dockerfiles will:

1. Use a slim Python image
2. Install dependencies
3. Copy the agent code
4. Pre-download any necessary models
5. Set the appropriate entrypoint and CMD

## Environment Variables

A `.env.example` file will be created with necessary configuration:

```
# LiveKit Configuration
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# AI Service Provider Keys
OPENAI_API_KEY=your_openai_key
DEEPGRAM_API_KEY=your_deepgram_key
```

## Timeline

1. Project structure setup: Day 1
2. Realistic agent implementation: Days 1-2
3. Standard agent implementation: Day 3
4. Frontend implementation: Days 4-6
5. Documentation and testing: Day 7

## Next Steps

1. Set up the project structure
2. Implement the realistic agent
3. Implement the standard agent
4. Develop the frontend
5. Test and finalize the implementation