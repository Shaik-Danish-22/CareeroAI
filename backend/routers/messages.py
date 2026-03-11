from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict, Optional
from auth import get_current_user
from database import db
from chat_service import chat_service
from whisper_service import whisper_service
from datetime import datetime

router = APIRouter(prefix="/messages", tags=["messages"])


class MessageCreate(BaseModel):
    recipient_id: str
    application_id: Optional[str] = None
    content: str


class MessageResponse(BaseModel):
    id: str
    sender_id: str
    recipient_id: str
    application_id: Optional[str]
    content: str
    read: bool
    created_at: str
    sender_name: str
    sender_role: str


class ChatMessage(BaseModel):
    message: str
    conversation_history: Optional[List[Dict[str, str]]] = []


class ChatResponse(BaseModel):
    response: str
    timestamp: str


@router.post("/send")
async def send_message(
    message: MessageCreate,
    current_user: Dict = Depends(get_current_user)
):
    """Send a message to another user"""
    try:
        sender_id = current_user["user_id"]
        
        # Get sender info
        sender_data = db.get_client().table("users").select("email, role").eq("id", sender_id).single().execute()
        
        # Insert message
        result = db.get_client().table("messages").insert({
            "sender_id": sender_id,
            "recipient_id": message.recipient_id,
            "application_id": message.application_id,
            "content": message.content,
            "read": False
        }).execute()
        
        return {
            "message": "Message sent successfully",
            "message_id": result.data[0]["id"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")


@router.get("/inbox", response_model=List[MessageResponse])
async def get_inbox(current_user: Dict = Depends(get_current_user)):
    """Get all messages for current user"""
    try:
        user_id = current_user["user_id"]
        
        # Get messages with sender info
        messages = db.get_client().table("messages").select("""
            *,
            sender:users!messages_sender_id_fkey(email, role)
        """).eq("recipient_id", user_id).order("created_at", desc=True).execute()
        
        formatted_messages = []
        for msg in messages.data:
            formatted_messages.append(MessageResponse(
                id=msg["id"],
                sender_id=msg["sender_id"],
                recipient_id=msg["recipient_id"],
                application_id=msg.get("application_id"),
                content=msg["content"],
                read=msg["read"],
                created_at=msg["created_at"],
                sender_name=msg["sender"]["email"].split("@")[0],
                sender_role=msg["sender"]["role"]
            ))
        
        return formatted_messages
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch messages: {str(e)}")


@router.get("/conversation/{other_user_id}")
async def get_conversation(
    other_user_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """Get conversation between two users"""
    try:
        user_id = current_user["user_id"]
        
        # Get messages in both directions
        messages = db.get_client().table("messages").select("""
            *,
            sender:users!messages_sender_id_fkey(email, role)
        """).or_(
            f"and(sender_id.eq.{user_id},recipient_id.eq.{other_user_id}),and(sender_id.eq.{other_user_id},recipient_id.eq.{user_id})"
        ).order("created_at", desc=False).execute()
        
        # Mark messages as read
        db.get_client().table("messages").update({
            "read": True
        }).eq("recipient_id", user_id).eq("sender_id", other_user_id).execute()
        
        return {"messages": messages.data}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch conversation: {str(e)}")


@router.patch("/{message_id}/read")
async def mark_as_read(
    message_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """Mark message as read"""
    try:
        user_id = current_user["user_id"]
        
        result = db.get_client().table("messages").update({
            "read": True
        }).eq("id", message_id).eq("recipient_id", user_id).execute()
        
        return {"message": "Marked as read"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to mark as read: {str(e)}")


@router.get("/unread-count")
async def get_unread_count(current_user: Dict = Depends(get_current_user)):
    """Get count of unread messages"""
    try:
        user_id = current_user["user_id"]
        
        result = db.get_client().table("messages").select(
            "id", count="exact"
        ).eq("recipient_id", user_id).eq("read", False).execute()
        
        return {"unread_count": result.count or 0}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get count: {str(e)}")


# AI Chat Assistant Routes
@router.post("/chat/assistant", response_model=ChatResponse)
async def chat_with_assistant(
    chat_message: ChatMessage,
    current_user: Dict = Depends(get_current_user)
):
    """Chat with AI recruiter assistant"""
    try:
        user_id = current_user["user_id"]
        user_role = current_user["role"]
        
        # Get user context
        user_data = db.get_client().table("users").select("email").eq("id", user_id).single().execute()
        user_name = user_data.data["email"].split("@")[0] if user_data.data else "User"
        
        # Get recent context based on role
        context = {
            "user_role": user_role,
            "user_name": user_name
        }
        
        if user_role == "recruiter":
            jobs = db.get_client().table("jobs").select("title").eq("recruiter_id", user_id).limit(3).execute()
            context["recent_jobs"] = jobs.data if jobs.data else []
        else:
            apps = db.get_client().table("applications").select("id").eq(
                "candidate_profile_id.user_id", user_id
            ).limit(3).execute()
            context["recent_applications"] = apps.data if apps.data else []
        
        # Get AI response
        response = chat_service.get_recruiter_assistant_response(
            message=chat_message.message,
            conversation_history=chat_message.conversation_history,
            context=context
        )
        
        return ChatResponse(
            response=response,
            timestamp=datetime.utcnow().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


@router.post("/transcribe-audio")
async def transcribe_audio(
    audio: UploadFile = File(...),
    current_user: Dict = Depends(get_current_user)
):
    """Transcribe audio file to text using Whisper"""
    try:
        # Validate file type
        allowed_types = ["audio/wav", "audio/mp3", "audio/mpeg", "audio/webm", "audio/ogg"]
        if audio.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid audio format")
        
        # Read audio bytes
        audio_bytes = await audio.read()
        
        # Transcribe
        transcript = whisper_service.transcribe_from_bytes(audio_bytes, audio.filename)
        
        if not transcript:
            raise HTTPException(status_code=500, detail="Transcription failed")
        
        return {
            "transcript": transcript,
            "filename": audio.filename
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")