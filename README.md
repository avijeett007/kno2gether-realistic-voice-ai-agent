# Kno2gether Realistic Voice AI Agents

This project demonstrates realistic voice AI agents using the LiveKit Agents framework. It features two agent implementations with different levels of realism, along with a professional web frontend for connecting to them.

## Project Overview

This repository includes:

1. **Realistic Office Caller Agent**: An agent with office background ambience and typing sounds during thinking periods to enhance realism
2. **Standard Office Caller Agent**: A version of the same agent without background audio for comparison
3. **Web Frontend**: A professional React-based interface to connect to either agent via LiveKit

## Features

- **Professional Voice Assistants**: Both agents provide office assistant capabilities (scheduling, messaging, etc.)
- **Audio Realism**: The realistic agent includes office ambient sounds and typing effects
- **Speech Recognition**: Powered by Deepgram's Nova-3 model
- **Natural Text Generation**: Uses OpenAI's GPT-4o-mini model
- **Professional Voice**: Uses OpenAI's "Alloy" voice
- **Interactive Frontend**: Modern web interface with agent selection and audio visualization
- **Volume Control**: Adjustable volume control for agent voice with preference persistence

## Repository Structure

```
├── agents/                     # Agent implementations
│   ├── realistic_agent/        # Agent with background audio
│   └── standard_agent/         # Agent without background audio
├── frontend/                   # React web application
├── requirements.txt            # Python dependencies
└── Dockerfile.example          # Example Docker configuration
```

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+ (for the frontend)
- An account with the following services:
  - [LiveKit](https://livekit.io/) for real-time communication
  - [OpenAI](https://openai.com/) for LLM capabilities
  - [Deepgram](https://deepgram.com/) for speech recognition

### Environment Setup

1. Clone this repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file using the provided `.env.example` and add your API keys

### Running the Agents

#### Realistic Agent

```bash
cd agents/realistic_agent
python agent.py
```

#### Standard Agent

```bash
cd agents/standard_agent
python agent.py
```

### Running the Frontend

```bash
cd frontend
npm install
npm start
```

For detailed instructions, refer to the README files in each component directory.

## Docker Deployment

Each component can be containerized using Docker:

### Realistic Agent

```bash
docker build -t kno2gether-realistic-agent -f agents/realistic_agent/Dockerfile .
docker run -p 8000:8000 --env-file .env kno2gether-realistic-agent
```

### Standard Agent

```bash
docker build -t kno2gether-standard-agent -f agents/standard_agent/Dockerfile .
docker run -p 8001:8000 --env-file .env kno2gether-standard-agent
```

### Frontend

```bash
docker build -t kno2gether-frontend -f frontend/Dockerfile frontend/
docker run -p 3000:80 kno2gether-frontend
```

## LiveKit Configuration

You'll need to generate LiveKit access tokens for client-side connections. For a production setup, you should create a token server that generates short-lived tokens based on your API key and secret.

## YouTube Channel

Visit [Kno2gether on YouTube](https://youtube.com/@kno2gether) for more examples and tutorials on voice AI technology.

## Troubleshooting

### Audio Issues

If you experience issues with the agent's audio:

1. **Check Browser Permissions**: Ensure your browser has microphone permissions enabled.
2. **Volume Controls**: Use the volume slider to adjust the agent's volume.
3. **Connection Status**: Look for connection logs in the browser console (F12 > Console).
4. **Audio Track Subscription**: If audio isn't playing, try reconnecting to the agent.
5. **Browser Compatibility**: Chrome and Edge are recommended for best compatibility.

Console logs will show detailed information about audio track subscription and connection status, which can help diagnose issues.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is released under the MIT License - see the LICENSE file for details.