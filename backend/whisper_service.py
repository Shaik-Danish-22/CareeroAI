import os
import tempfile
from typing import Optional
import requests
from config import settings


class WhisperService:
    """Audio transcription using OpenAI Whisper via OpenRouter"""
    
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        # OpenRouter doesn't support Whisper directly, so we'll use OpenAI's Whisper API
        # For MVP, you can use OpenAI's Whisper API or a local Whisper model
        self.whisper_api_url = "https://api.openai.com/v1/audio/transcriptions"
    
    def transcribe_audio(self, audio_file_path: str) -> Optional[str]:
        """
        Transcribe audio file to text using Whisper
        
        For production, you can:
        1. Use OpenAI's Whisper API directly
        2. Use faster-whisper locally
        3. Use a cloud transcription service
        """
        try:
            # Option 1: Using OpenAI Whisper API (requires OPENAI_API_KEY)
            if hasattr(settings, 'OPENAI_API_KEY'):
                with open(audio_file_path, 'rb') as audio_file:
                    response = requests.post(
                        self.whisper_api_url,
                        headers={
                            "Authorization": f"Bearer {settings.OPENAI_API_KEY}"
                        },
                        files={
                            "file": audio_file
                        },
                        data={
                            "model": "whisper-1",
                            "language": "en"
                        },
                        timeout=60
                    )
                
                if response.status_code == 200:
                    return response.json().get("text", "")
            
            # Fallback: Return placeholder for MVP
            print("Whisper API not configured. Returning placeholder.")
            return "[Audio transcription not available. Please configure OPENAI_API_KEY or use local Whisper model]"
            
        except Exception as e:
            print(f"Transcription error: {e}")
            return None
    
    def transcribe_from_bytes(self, audio_bytes: bytes, filename: str = "audio.wav") -> Optional[str]:
        """Transcribe audio from bytes"""
        try:
            # Save bytes to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as temp_file:
                temp_file.write(audio_bytes)
                temp_file_path = temp_file.name
            
            # Transcribe
            transcript = self.transcribe_audio(temp_file_path)
            
            # Cleanup
            os.unlink(temp_file_path)
            
            return transcript
            
        except Exception as e:
            print(f"Transcription from bytes error: {e}")
            return None


whisper_service = WhisperService()