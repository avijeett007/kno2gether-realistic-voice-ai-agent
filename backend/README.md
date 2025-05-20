# LiveKit Token Server

This is a simple Flask server that generates LiveKit access tokens for the Kno2gether AI Voice Agent Demo.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables in `.env` file:
   ```
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   LIVEKIT_URL=wss://your-livekit-server.com
   ```

3. Run the server:
   ```bash
   python app.py
   ```

The server will start on port 8000 by default.

## API Endpoints

### GET /get-token

Generates a LiveKit access token.

Query parameters:
- `room` (required): The room name to join
- `identity` (optional): The participant's identity (defaults to a random UUID)
- `name` (optional): The participant's display name (defaults to "User")

Example response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "identity": "user-1234",
  "name": "User",
  "room": "realistic-agent-room"
}
```

### GET /health

Health check endpoint.

Example response:
```json
{
  "status": "healthy"
}
```
