# Standard Office Caller Agent

This agent provides a professional office assistant experience without background audio effects. It delivers a clean, focused voice experience for users who prefer a simpler audio interaction.

## Features

- **Professional voice**: Uses OpenAI's professional "Alloy" voice
- **No background effects**: Clean audio with no ambient sounds
- **Professional assistant capabilities**:
  - Schedule meetings
  - Check calendar availability
  - Take messages
  - Provide company information
  - Find personnel

## Environment Variables

Make sure to set up your `.env` file with the necessary API keys and configuration:

```
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_key
DEEPGRAM_API_KEY=your_deepgram_key
```

## Running Locally

1. Install dependencies:
   ```bash
   pip install -r ../../requirements.txt
   ```

2. Run the agent:
   ```bash
   python agent.py
   ```

## Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t kno2gether-standard-agent -f Dockerfile ../..
   ```

2. Run the container:
   ```bash
   docker run -p 8000:8000 --env-file ../../.env kno2gether-standard-agent
   ```

## Agent Configuration

The standard agent is configured with:
- GPT-4o-mini LLM for enhanced capabilities
- Deepgram Nova-3 for accurate speech recognition
- OpenAI Alloy voice for a professional sound
- Silero VAD (Voice Activity Detection) for improved interaction

## Comparison with Realistic Agent

Unlike the realistic agent, this standard version does not include:
- Office ambient sounds
- Keyboard typing sounds during thinking

This makes it ideal for users who prefer a cleaner audio experience without background noises.