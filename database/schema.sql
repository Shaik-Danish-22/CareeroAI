-- CareeroAi Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('recruiter', 'candidate')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    location TEXT,
    job_type TEXT DEFAULT 'Full-time',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate profiles table
CREATE TABLE public.candidate_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    resume_json JSONB NOT NULL DEFAULT '{}',
    portfolio_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    candidate_profile_id UUID NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    candidate_json JSONB NOT NULL,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'interview', 'rejected', 'accepted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, candidate_profile_id)
);

-- Interviews table
CREATE TABLE public.interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    video_url TEXT,
    transcript TEXT,
    score JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(application_id)
);

-- Indexes for performance
CREATE INDEX idx_jobs_recruiter ON public.jobs(recruiter_id);
CREATE INDEX idx_jobs_created ON public.jobs(created_at DESC);
CREATE INDEX idx_candidate_profiles_user ON public.candidate_profiles(user_id);
CREATE INDEX idx_applications_job ON public.applications(job_id);
CREATE INDEX idx_applications_candidate ON public.applications(candidate_profile_id);
CREATE INDEX idx_applications_created ON public.applications(created_at DESC);
CREATE INDEX idx_interviews_application ON public.interviews(application_id);

-- GIN indexes for JSONB and array searches
CREATE INDEX idx_jobs_skills ON public.jobs USING GIN(skills);
CREATE INDEX idx_candidate_resume ON public.candidate_profiles USING GIN(resume_json);
CREATE INDEX idx_applications_candidate_json ON public.applications USING GIN(candidate_json);

-- RLS Policies (can be disabled for dev, enable for production)
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Note: For MVP, RLS is disabled. In production, add policies like:
-- CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Recruiters can CRUD own jobs" ON public.jobs FOR ALL USING (auth.uid() = recruiter_id);
-- etc.

-- Messages table for candidate-recruiter communication
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat conversations table (for AI assistant)
CREATE TABLE public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    conversation_history JSONB DEFAULT '[]',
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for messages
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX idx_messages_read ON public.messages(recipient_id, read);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX idx_chat_conversations_user ON public.chat_conversations(user_id);

-- Storage bucket for interviews (create manually in Supabase Dashboard)
-- Bucket name: interviews
-- Public: true (or handle signed URLs)
-- Allowed MIME types: video/mp4, video/webm, audio/wav, audio/mpeg, audio/mp3, audio/ogg
-- Max file size: 100MB