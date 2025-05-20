import asyncio
import logging
from datetime import datetime
from typing import List, Optional

from dotenv import load_dotenv

from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    RunContext,
    WorkerOptions,
    cli,
    function_tool,
)
from livekit.plugins import deepgram, openai, silero

logger = logging.getLogger("standard-office-agent")

load_dotenv()

class OfficeCallerAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions=(
                "You are a professional office assistant named Knotie from Knolabs AI Agency. "
                "You speak in a clear, friendly, and professional tone. "
                "You are helpful, attentive, and efficient when assisting callers. "
                "You work at a modern tech company and have access to general information "
                "about schedules, meeting coordination, and basic office tasks. "
                "When you don't know something specific, you'll offer to take a message "
                "or suggest alternative ways to help. "
                "You should avoid making up specific company details that you don't know. Use Knolabs AI Agency as an UK Registered Company which helps different companies with their AI Automation needs. "
                "Always maintain a professional demeanor while being personable."
                "You must ask one question at a time to make sure its more conversational."
            )
        )
        self._meetings = []
        self._notes = {}
        
    async def on_enter(self):
        # When the agent is added to the session, generate an initial greeting
        self.session.generate_reply(instructions="Introduce yourself and ask how you can help.")
    
    @function_tool
    async def schedule_meeting(
        self, 
        context: RunContext,
        name: str, 
        date: str, 
        time: str, 
        topic: Optional[str] = None,
        participants: Optional[List[str]] = None
    ) -> str:
        """
        Schedule a meeting in the calendar.
        
        Args:
            name: The name of the person scheduling the meeting
            date: The date of the meeting in YYYY-MM-DD format
            time: The time of the meeting in HH:MM format
            topic: Optional topic for the meeting
            participants: Optional list of participant names
        """
        # Simulate scheduling process
        logger.info(f"Scheduling meeting for {name} on {date} at {time}")
        
        # Add meeting to internal tracking
        meeting_id = len(self._meetings) + 1
        meeting = {
            "id": meeting_id,
            "name": name,
            "date": date,
            "time": time,
            "topic": topic or "Unspecified",
            "participants": participants or []
        }
        self._meetings.append(meeting)
        
        # Simulate thinking time
        await asyncio.sleep(2)
        
        return (
            f"Meeting scheduled successfully. "
            f"Meeting ID: {meeting_id}, "
            f"Date: {date}, "
            f"Time: {time}, "
            f"Topic: {topic or 'Unspecified'}"
        )

    @function_tool
    async def check_availability(
        self, 
        context: RunContext,
        date: str, 
        time_range: str
    ) -> str:
        """
        Check availability for a specific date and time range.
        
        Args:
            date: The date to check in YYYY-MM-DD format
            time_range: The time range to check (e.g., "10:00-11:00")
        """
        logger.info(f"Checking availability for {date} at {time_range}")
        
        # Simulate database lookup
        await asyncio.sleep(2)
        
        # Simulate random availability
        # In a real implementation, this would check against an actual calendar
        is_available = not any(
            meeting["date"] == date and time_range in meeting["time"] 
            for meeting in self._meetings
        )
        
        if is_available:
            return f"The requested time slot ({date}, {time_range}) is available."
        else:
            return f"Sorry, the requested time slot ({date}, {time_range}) is already booked."

    @function_tool
    async def take_message(
        self, 
        context: RunContext,
        from_name: str, 
        to_name: str, 
        message: str, 
        urgency: Optional[str] = "normal"
    ) -> str:
        """
        Take a message for someone in the office.
        
        Args:
            from_name: The name of the person leaving the message
            to_name: The name of the person the message is for
            message: The content of the message
            urgency: The urgency level (low, normal, high)
        """
        logger.info(f"Taking message from {from_name} for {to_name}")
        
        # Store the message
        if to_name not in self._notes:
            self._notes[to_name] = []
            
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self._notes[to_name].append({
            "from": from_name,
            "message": message,
            "urgency": urgency,
            "timestamp": timestamp
        })
        
        # Simulate processing time
        await asyncio.sleep(1.5)
        
        return (
            f"Message from {from_name} to {to_name} saved successfully. "
            f"Urgency: {urgency}. I'll make sure {to_name} receives your message."
        )

    @function_tool
    async def provide_company_info(
        self, 
        context: RunContext,
        topic: str
    ) -> str:
        """
        Provide general information about the company based on the requested topic.
        
        Args:
            topic: The topic to provide information about (e.g., "hours", "location", "website")
        """
        logger.info(f"Providing company info about: {topic}")
        
        # Simulate thinking/lookup
        await asyncio.sleep(3)
        
        # Basic company information
        company_info = {
            "hours": "Our office hours are Monday through Friday, 9:00 AM to 5:00 PM Eastern Time.",
            "location": "Our main office is located in the downtown business district. For specific address details, please visit our website.",
            "website": "You can find more information on our website at kno2gether.com or visit our YouTube channel at youtube.com/@kno2gether.",
            "contact": "You can reach our general office line at 555-KNO-2GTH or email us at info@kno2gether.com."
        }
        
        # Default response for unknown topics
        default_response = "I don't have specific information about that topic. For more details, I'd recommend checking our website at kno2gether.com or contacting our main office."
        
        return company_info.get(topic.lower(), default_response)

    @function_tool
    async def find_person(
        self, 
        context: RunContext,
        name: str
    ) -> str:
        """
        Check if a person is available in the office.
        
        Args:
            name: The name of the person to find
        """
        logger.info(f"Checking if {name} is available")
        
        # Simulate database lookup
        await asyncio.sleep(2)
        
        # Simulate random availability
        import random
        statuses = [
            f"{name} is currently in a meeting and will be available in about an hour.",
            f"{name} is out of the office today. Would you like to leave a message?",
            f"{name} is currently available. Would you like me to transfer your call?",
            f"I don't see {name} in our directory. Could you provide their department or job title?"
        ]
        
        return random.choice(statuses)


def prewarm(proc):
    # Preload VAD model during worker startup
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    await ctx.connect()
    
    # Create agent session with OpenAI LLM, Deepgram STT, and OpenAI TTS
    session = AgentSession(
        vad=ctx.proc.userdata["vad"],
        llm=openai.LLM(model="gpt-4o-mini"),  # Using GPT-4o-mini for better capabilities 
        stt=deepgram.STT(model="nova-3"),     # Using Deepgram's latest Nova model
        tts=openai.TTS(voice="alloy"),        # Professional voice
    )
    
    # Start the agent session (without background audio)
    await session.start(OfficeCallerAgent(), room=ctx.room)


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))