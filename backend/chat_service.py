from openai import OpenAI
from config import settings
from typing import List, Dict, Any
import json


class ChatService:
    """AI Recruiter Assistant Chat Service"""
    
    def __init__(self):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY,
            default_headers={
                "HTTP-Referer": "https://careeroai.com",
                "X-Title": "CareeroAi"
            }
        )
        self.model = "openai/gpt-3.5-turbo"
    
    def get_recruiter_assistant_response(
        self,
        message: str,
        conversation_history: List[Dict[str, str]],
        context: Dict[str, Any] = None
    ) -> str:
        """
        Get AI recruiter assistant response
        
        Context can include:
        - user_role: 'recruiter' or 'candidate'
        - user_name: User's name
        - recent_jobs: List of recent jobs
        - recent_applications: List of recent applications
        """
        
        # Build system prompt based on user role
        system_prompt = self._build_system_prompt(context)
        
        # Prepare messages
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history (limit to last 10 messages)
        messages.extend(conversation_history[-10:])
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Chat error: {e}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again."
    
    def _build_system_prompt(self, context: Dict[str, Any] = None) -> str:
        """Build system prompt based on context"""
        
        if not context:
            context = {}
        
        user_role = context.get('user_role', 'user')
        user_name = context.get('user_name', 'there')
        
        base_prompt = f"""You are an AI Recruiter Assistant for CareeroAi, a recruitment platform.
You're helping {user_name}, who is a {user_role}.

Your capabilities:
- Answer questions about the platform features
- Provide recruitment advice and best practices
- Help with resume optimization tips
- Suggest interview preparation strategies
- Explain how AI matching works
- Guide users through the application process

You are professional, helpful, and knowledgeable about:
- Recruitment processes
- Resume writing
- Interview techniques
- Job market trends
- Skill development
- Career growth

Keep responses concise (2-3 paragraphs max) and actionable.
"""
        
        # Add role-specific context
        if user_role == 'recruiter':
            base_prompt += """
As a recruiter assistant, help with:
- Job posting best practices
- Candidate evaluation criteria
- Interview question suggestions
- Diversity and inclusion in hiring
- Candidate engagement strategies
"""
        else:  # candidate
            base_prompt += """
As a candidate assistant, help with:
- Resume optimization
- Job application strategies
- Interview preparation
- Skill gap identification
- Career development advice
- Salary negotiation tips
"""
        
        # Add dynamic context
        if context.get('recent_jobs'):
            jobs = context['recent_jobs'][:3]
            base_prompt += f"\n\nUser's recent jobs: {', '.join([j.get('title', 'Unknown') for j in jobs])}"
        
        if context.get('recent_applications'):
            apps = context['recent_applications'][:3]
            base_prompt += f"\n\nUser's recent applications: {len(apps)} applications"
        
        return base_prompt
    
    def generate_conversation_summary(self, conversation: List[Dict[str, str]]) -> str:
        """Generate a summary of the conversation"""
        
        if not conversation:
            return "No conversation to summarize."
        
        # Prepare messages for summarization
        messages_text = "\n".join([
            f"{msg['role'].upper()}: {msg['content']}"
            for msg in conversation
        ])
        
        prompt = f"""Summarize this conversation in 2-3 sentences:

{messages_text}

Summary:"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=150
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Summary error: {e}")
            return "Conversation summary unavailable."


chat_service = ChatService()