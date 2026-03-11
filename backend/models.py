from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class UserRegister(BaseModel):
    email: str
    password: str
    role: str  # 'recruiter' or 'candidate'


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str


class ResumeJSON(BaseModel):
    name: str
    email: str
    phone: str
    skills: List[str]
    total_experience: float
    relevant_experience: float
    current_location: str
    preferred_location: str
    professional_summary: str
    github_username: Optional[str] = ""


class JobCreate(BaseModel):
    title: str
    description: str
    job_type: Optional[str] = "Full-time"


class JobResponse(BaseModel):
    id: str
    recruiter_id: str
    title: str
    description: str
    skills: List[str]
    location: Optional[str]
    job_type: str
    created_at: str
    applications_count: Optional[int] = 0


class ApplyRequest(BaseModel):
    job_id: str


class InterviewQuestionsResponse(BaseModel):
    questions: List[str]


class SkillGap(BaseModel):
    skill: str
    resources: List[Dict[str, str]]


class SkillGapsResponse(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str]
    gaps: List[SkillGap]


class InterviewScore(BaseModel):
    clarity: float
    confidence: float
    relevance: float
    communication: float


class InterviewEvaluation(BaseModel):
    scores: InterviewScore
    total_score: float
    feedback: str
    red_flags: List[str]


class CandidateRecommendation(BaseModel):
    candidate_id: str
    name: str
    email: str
    skills: List[str]
    total_experience: float
    location: str
    match_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    reasons: List[str]
    score_breakdown: Dict[str, Any]


class RecommendationsResponse(BaseModel):
    job: Dict[str, Any]
    debug: Dict[str, Any]
    candidates: List[CandidateRecommendation]


class JobRecommendation(BaseModel):
    job_id: str
    title: str
    location: Optional[str]
    skills: List[str]
    match_percentage: float
    matched_skills: List[str]
    missing_skills: List[str]