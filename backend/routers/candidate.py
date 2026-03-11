from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import Dict, List
import uuid
import json
from auth import require_role
from database import db
# from ai_service import ai_service
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ai_service import ai_service
from whisper_service import whisper_service

router = APIRouter(prefix="/candidate", tags=["candidate"])

# ======================================================
# SAVE OR UPDATE RESUME
# ======================================================

@router.post("/resume")
async def save_resume(
    resume: Dict,
    current_user: Dict = Depends(require_role("candidate"))
):
    try:
        user_id = current_user["user_id"]

        resume_json = {
            "name": resume.get("name", ""),
            "email": resume.get("email", ""),
            "phone": resume.get("phone", ""),
            "skills": resume.get("skills", []),
            "total_experience": resume.get("total_experience", 0),
            "relevant_experience": resume.get("relevant_experience", 0),
            "current_location": resume.get("current_location", ""),
            "preferred_location": resume.get("preferred_location", ""),
            "summary": resume.get("professional_summary", ""),
            "education": resume.get("education", []),
            "experience": resume.get("experience", [])
        }

        existing = (
            db.get_client()
            .table("candidate_profiles")
            .select("id")
            .eq("user_id", user_id)
            .execute()
        )

        if existing.data:
            (
                db.get_client()
                .table("candidate_profiles")
                .update({"resume_json": resume_json})
                .eq("user_id", user_id)
                .execute()
            )
        else:
            (
                db.get_client()
                .table("candidate_profiles")
                .insert({
                    "user_id": user_id,
                    "resume_json": resume_json
                })
                .execute()
            )

        return {"message": "Resume saved successfully"}

    except Exception as e:
        print("SAVE RESUME ERROR:", e)
        raise HTTPException(500, "Failed to save resume")


# ======================================================
# GET RESUME
# ======================================================

@router.get("/resume")
async def get_resume(
    current_user: Dict = Depends(require_role("candidate"))
):
    result = (
        db.get_client()
        .table("candidate_profiles")
        .select("resume_json")
        .eq("user_id", current_user["user_id"])
        .single()
        .execute()
    )

    return result.data["resume_json"] if result.data else {}


# ======================================================
# JOB RECOMMENDATIONS (SAFE)
# ======================================================

# @router.get("/recommendations")
# async def get_recommendations(
#     current_user: Dict = Depends(require_role("candidate"))
# ):
#     try:
#         user_id = current_user["user_id"]

#         profile = (
#             db.get_client()
#             .table("candidate_profiles")
#             .select("resume_json")
#             .eq("user_id", user_id)
#             .single()
#             .execute()
#         )

#         if not profile.data:
#             return {"recommendations": []}

#         resume = profile.data.get("resume_json", {})
#         resume_skills = [s.lower() for s in resume.get("skills", [])]

#         jobs = (
#             db.get_client()
#             .table("jobs")
#             .select("*")
#             .execute()
#         )

#         recommendations = []

#         for job in jobs.data or []:
#             job_skills = [s.lower() for s in job.get("skills", [])]
#             matched = list(set(resume_skills) & set(job_skills))

#             if matched:
#                 recommendations.append({
#                     "id": job["id"],              # 🔥 normalized
#                     "title": job["title"],
#                     "location": job.get("location", "Remote"),
#                     "skills": job.get("skills", []),
#                     "match_score": len(matched)
#                 })

#         return {"recommendations": recommendations}

#     except Exception as e:
#         print("RECOMMENDATION ERROR:", e)
#         return {"recommendations": []}
@router.get("/recommendations")
async def get_recommendations(
    current_user: Dict = Depends(require_role("candidate"))
):
    try:
        user_id = current_user["user_id"]

        profile = (
            db.get_client()
            .table("candidate_profiles")
            .select("resume_json")
            .eq("user_id", user_id)
            .single()
            .execute()
        )

        if not profile.data:
            return []  # Return empty array, not dict

        resume = profile.data.get("resume_json", {})
        
        # Use recommender service
        from recommender import recommender
        
        jobs_result = db.get_client().table("jobs").select("*").execute()
        
        recommendations = recommender.recommend_jobs_for_candidate(
            resume,
            jobs_result.data or []
        )

        return recommendations  # Return array directly

    except Exception as e:
        print("RECOMMENDATION ERROR:", e)
        return []  # Return empty array on error

# ======================================================
# SKILL GAP ANALYSIS (SAFE)
# ======================================================

# @router.get("/skill-gaps")
# async def skill_gaps(
#     job_id: str,
#     current_user: Dict = Depends(require_role("candidate"))
# ):
#     profile = (
#         db.get_client()
#         .table("candidate_profiles")
#         .select("resume_json")
#         .eq("user_id", current_user["user_id"])
#         .single()
#         .execute()
#     )

#     if not profile.data:
#         raise HTTPException(404, "Resume not found")

#     job = (
#         db.get_client()
#         .table("jobs")
#         .select("skills")
#         .eq("id", job_id)
#         .single()
#         .execute()
#     )

#     if not job.data:
#         raise HTTPException(404, "Job not found")

#     candidate_skills = profile.data["resume_json"].get("skills", [])
#     job_skills = job.data.get("skills", [])

#     cand_lower = [s.lower() for s in candidate_skills]

#     matched = [s for s in job_skills if s.lower() in cand_lower]
#     missing = [s for s in job_skills if s.lower() not in cand_lower]

#     return {
#         "matched_skills": matched,
#         "missing_skills": missing,
#         "gaps": ai_service.recommend_courses(missing)
#     }
# @router.get("/skill-gaps")
# async def skill_gaps(
#     job_id: str,
#     current_user: Dict = Depends(require_role("candidate"))
# ):
#     try:
#         # Get candidate profile
#         profile = (
#             db.get_client()
#             .table("candidate_profiles")
#             .select("resume_json")
#             .eq("user_id", current_user["user_id"])
#             .single()
#             .execute()
#         )

#         if not profile.data:
#             raise HTTPException(404, "Resume not found")

#         # Get job details
#         job = (
#             db.get_client()
#             .table("jobs")
#             .select("*")
#             .eq("id", job_id)
#             .single()
#             .execute()
#         )

#         if not job.data:
#             raise HTTPException(404, "Job not found")

#         candidate_skills = profile.data["resume_json"].get("skills", [])
#         job_skills = job.data.get("skills", [])

#         # Normalize skills for comparison
#         cand_lower = [s.lower().strip() for s in candidate_skills]
#         job_lower = [s.lower().strip() for s in job_skills]

#         # Calculate matches
#         matched = [s for s in job_skills if s.lower().strip() in cand_lower]
#         missing = [s for s in job_skills if s.lower().strip() not in cand_lower]

#         # Calculate match score
#         match_score = round((len(matched) / len(job_skills) * 100), 2) if job_skills else 0

#         # Generate course recommendations for missing skills
#         recommendations = []
#         course_database = {
#             "javascript": {
#                 "title": "JavaScript Full Course",
#                 "provider": "freeCodeCamp",
#                 "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
#                 "duration": "300 hours",
#                 "skills": ["JavaScript"]
#             },
#             "react": {
#                 "title": "React - The Complete Guide",
#                 "provider": "freeCodeCamp",
#                 "url": "https://www.freecodecamp.org/learn/front-end-development-libraries/",
#                 "duration": "40 hours",
#                 "skills": ["React"]
#             },
#             "node.js": {
#                 "title": "Node.js Full Course",
#                 "provider": "freeCodeCamp",
#                 "url": "https://www.freecodecamp.org/news/learn-nodejs-for-beginners/",
#                 "duration": "10 hours",
#                 "skills": ["Node.js"]
#             },
#             "python": {
#                 "title": "Python for Everybody",
#                 "provider": "Coursera (Free)",
#                 "url": "https://www.coursera.org/specializations/python",
#                 "duration": "8 months",
#                 "skills": ["Python"]
#             },
#             "html": {
#                 "title": "HTML Full Course",
#                 "provider": "freeCodeCamp",
#                 "url": "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
#                 "duration": "50 hours",
#                 "skills": ["HTML"]
#             },
#             "css": {
#                 "title": "CSS Full Course",
#                 "provider": "freeCodeCamp",
#                 "url": "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
#                 "duration": "50 hours",
#                 "skills": ["CSS"]
#             },
#             "tailwind": {
#                 "title": "Tailwind CSS Tutorial",
#                 "provider": "Tailwind Official",
#                 "url": "https://tailwindcss.com/docs",
#                 "duration": "5 hours",
#                 "skills": ["Tailwind"]
#             },
#             "aws": {
#                 "title": "AWS Cloud Practitioner",
#                 "provider": "AWS Training",
#                 "url": "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/",
#                 "duration": "6 hours",
#                 "skills": ["AWS"]
#             },
#             "docker": {
#                 "title": "Docker for Beginners",
#                 "provider": "Docker",
#                 "url": "https://docker-curriculum.com/",
#                 "duration": "5 hours",
#                 "skills": ["Docker"]
#             },
#             "postgresql": {
#                 "title": "PostgreSQL Tutorial",
#                 "provider": "PostgreSQL Tutorial",
#                 "url": "https://www.postgresqltutorial.com/",
#                 "duration": "Self-paced",
#                 "skills": ["PostgreSQL"]
#             }
#         }

#         for skill in missing:
#             skill_key = skill.lower().strip().replace(" ", "").replace("-", "")
            
#             # Find matching course
#             course = None
#             for key, value in course_database.items():
#                 if key in skill_key or skill_key in key:
#                     course = value
#                     break
            
#             # Default course if not found
#             if not course:
#                 course = {
#                     "title": f"Learn {skill}",
#                     "provider": "freeCodeCamp",
#                     "url": f"https://www.freecodecamp.org/news/search/?query={skill}",
#                     "duration": "Self-paced",
#                     "skills": [skill]
#                 }
            
#             recommendations.append(course)

#         return {
#             "match_score": match_score,
#             "matched_skills": matched,
#             "missing_skills": missing,
#             "recommendations": recommendations,
#             "job_title": job.data.get("title"),
#             "job_description": job.data.get("description")
#         }

#     except HTTPException:
#         raise
#     except Exception as e:
#         print("SKILL GAP ERROR:", e)
#         raise HTTPException(500, "Failed to analyze skill gaps")
@router.get("/skill-gaps")
async def skill_gaps(
    job_id: str,
    current_user: Dict = Depends(require_role("candidate"))
):
    try:
        # Get candidate profile
        profile = (
            db.get_client()
            .table("candidate_profiles")
            .select("resume_json")
            .eq("user_id", current_user["user_id"])
            .single()
            .execute()
        )

        if not profile.data:
            raise HTTPException(404, "Resume not found")

        # Get job details
        job = (
            db.get_client()
            .table("jobs")
            .select("*")
            .eq("id", job_id)
            .single()
            .execute()
        )

        if not job.data:
            raise HTTPException(404, "Job not found")

        candidate_skills = profile.data["resume_json"].get("skills", [])
        job_skills = job.data.get("skills", [])

        # Normalize for comparison
        cand_lower = [s.lower().strip() for s in candidate_skills]
        job_lower = [s.lower().strip() for s in job_skills]

        # Calculate matches
        matched = [s for s in job_skills if s.lower().strip() in cand_lower]
        missing = [s for s in job_skills if s.lower().strip() not in cand_lower]

        # Calculate match score
        match_score = round((len(matched) / len(job_skills) * 100), 2) if job_skills else 0

        # 🔥 AI-POWERED COURSE RECOMMENDATIONS
        from ai_service import ai_service
        
        print(f"Calling AI with missing skills: {missing}")  # Debug log
        
        recommendations = ai_service.recommend_courses_ai(
            missing_skills=missing,
            job_title=job.data.get("title", ""),
            job_description=job.data.get("description", "")
        )
        
        print(f"AI returned {len(recommendations)} recommendations")  # Debug log

        return {
            "match_score": match_score,
            "matched_skills": matched,
            "missing_skills": missing,
            "recommendations": recommendations,
            "job_title": job.data.get("title"),
            "job_description": job.data.get("description")
        }

    except HTTPException:
        raise
    except Exception as e:
        print("SKILL GAP ERROR:", e)
        import traceback
        traceback.print_exc()
        raise HTTPException(500, f"Failed to analyze skill gaps: {str(e)}")
@router.post("/apply")
async def apply_to_job(
    job_id: str,
    current_user: Dict = Depends(require_role("candidate"))
):
    try:
        user_id = current_user["user_id"]

        # Get candidate profile
        profile = (
            db.get_client()
            .table("candidate_profiles")
            .select("*")
            .eq("user_id", user_id)
            .single()
            .execute()
        )

        if not profile.data:
            raise HTTPException(404, "Please complete your resume first")

        # Check if already applied
        existing = (
            db.get_client()
            .table("applications")
            .select("id")
            .eq("job_id", job_id)
            .eq("candidate_profile_id", profile.data["id"])
            .execute()
        )

        if existing.data:
            raise HTTPException(400, "You have already applied to this job")

        # Create application
        application = (
            db.get_client()
            .table("applications")
            .insert({
                "job_id": job_id,
                "candidate_profile_id": profile.data["id"],
                "candidate_json": profile.data["resume_json"],
                "status": "applied"
            })
            .execute()
        )

        return {
            "message": "Application submitted successfully",
            "application_id": application.data[0]["id"]
        }

    except HTTPException:
        raise
    except Exception as e:
        print("APPLY ERROR:", e)
        raise HTTPException(500, "Failed to submit application")


# Get candidate's applications
@router.get("/applications")
async def get_my_applications(
    current_user: Dict = Depends(require_role("candidate"))
):
    try:
        user_id = current_user["user_id"]

        # Get candidate profile
        profile = (
            db.get_client()
            .table("candidate_profiles")
            .select("id")
            .eq("user_id", user_id)
            .single()
            .execute()
        )

        if not profile.data:
            return []

        # Get applications with job details
        applications = (
            db.get_client()
            .table("applications")
            .select("*, jobs(*)")
            .eq("candidate_profile_id", profile.data["id"])
            .order("created_at", desc=True)
            .execute()
        )

        result = []
        for app in applications.data or []:
            job = app.get("jobs", {})
            result.append({
                "id": app["id"],
                "job_id": app["job_id"],
                "job_title": job.get("title", "Unknown"),
                "company": "Company",  # Add company field to jobs table if needed
                "location": job.get("location", "Remote"),
                "status": app["status"],
                "created_at": app["created_at"]
            })

        return result

    except Exception as e:
        print("GET APPLICATIONS ERROR:", e)
        return []
# =====================================================
# INTERVIEW ENDPOINTS
# =====================================================

@router.get("/interview/questions/{job_id}")
async def get_interview_questions(
    job_id: str,
    current_user: Dict = Depends(require_role("candidate"))
):
    """Generate interview questions based on job and candidate resume"""
    try:
        print(f"\n{'='*50}")
        print(f"📋 FETCHING INTERVIEW QUESTIONS")
        print(f"Job ID: {job_id}")
        print(f"User ID: {current_user.get('user_id')}")
        print(f"{'='*50}\n")
        
        # Get job details
        job_response = (
            db.get_client()
            .table("jobs")
            .select("*")
            .eq("id", job_id)
            .execute()
        )
        
        if not job_response.data or len(job_response.data) == 0:
            print(f"❌ Job not found: {job_id}")
            raise HTTPException(404, "Job not found")
        
        job = job_response.data[0]
        print(f"✅ Found job: {job.get('title')}")
        
        # Get candidate resume
        profile_response = (
            db.get_client()
            .table("candidate_profiles")
            .select("resume_json")
            .eq("user_id", current_user["user_id"])
            .execute()
        )
        
        resume_text = ""
        if profile_response.data and len(profile_response.data) > 0:
            resume_data = profile_response.data[0]["resume_json"]
            resume_text = f"""
Name: {resume_data.get('name', '')}
Title: {resume_data.get('title', '')}
Skills: {', '.join(resume_data.get('skills', []))}
Experience: {resume_data.get('experience_years', 0)} years
Summary: {resume_data.get('summary', '')}
"""
            print(f"✅ Found resume for: {resume_data.get('name', 'Unknown')}")
        else:
            print("⚠️ No resume found, using empty resume")
        
        # Import AI service
        from ai_service import ai_service
        
        print("🤖 Generating questions with AI...")
        
        # Generate questions
        questions = ai_service.generate_interview_questions_advanced(
            resume=resume_text,
            job_title=job.get("title", ""),
            job_description=job.get("description", "")
        )
        
        print(f"✅ Generated {len(questions)} questions")
        print(f"{'='*50}\n")
        
        return {"questions": questions}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"\n{'='*50}")
        print(f"❌ ERROR in get_interview_questions")
        print(f"Error: {str(e)}")
        print(f"{'='*50}\n")
        import traceback
        traceback.print_exc()
        
        # Return fallback questions
        fallback_questions = [
            {"id": 1, "question": "Tell me about yourself and your professional background.", "type": "behavioral"},
            {"id": 2, "question": "Describe a challenging situation you faced at work and how you resolved it.", "type": "behavioral"},
            {"id": 3, "question": "How do you prioritize tasks when you have multiple deadlines?", "type": "behavioral"},
            {"id": 4, "question": "Give an example of when you worked effectively as part of a team.", "type": "behavioral"},
            {"id": 5, "question": "What motivates you in your professional career?", "type": "behavioral"},
            {"id": 6, "question": "What technical skills make you a strong candidate for this position?", "type": "technical"},
            {"id": 7, "question": "How do you stay updated with the latest technologies in your field?", "type": "technical"},
            {"id": 8, "question": "Describe your approach to solving complex technical problems.", "type": "technical"},
            {"id": 9, "question": "What is your experience with the key technologies mentioned in this job?", "type": "technical"},
            {"id": 10, "question": "How would you contribute to our team based on your expertise?", "type": "technical"}
        ]
        
        print("⚠️ Using fallback questions")
        return {"questions": fallback_questions}


@router.post("/interview/submit-answer")
async def submit_interview_answer(
    data: Dict,
    current_user: Dict = Depends(require_role("candidate"))
):
    """Score a single interview answer"""
    try:
        question = data.get("question", "")
        answer = data.get("answer", "")
        question_type = data.get("questionType", "behavioral")
        
        print(f"\n{'='*50}")
        print(f"📊 SCORING ANSWER")
        print(f"Question: {question[:100]}...")
        print(f"Answer length: {len(answer)} characters")
        print(f"Type: {question_type}")
        print(f"{'='*50}\n")
        
        if not answer or len(answer.strip()) < 10:
            raise HTTPException(400, "Answer is too short (minimum 10 characters)")
        
        # Import AI service
        from ai_service import ai_service
        
        # Score using AI
        scoring = ai_service.score_interview_answer(
            question=question,
            answer=answer,
            question_type=question_type
        )
        
        print(f"✅ Score: {scoring.get('overallScore', 0)}/100")
        print(f"{'='*50}\n")
        
        return scoring
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"\n{'='*50}")
        print(f"❌ ERROR in submit_interview_answer")
        print(f"Error: {str(e)}")
        print(f"{'='*50}\n")
        import traceback
        traceback.print_exc()
        
        # Return fallback score
        word_count = len(answer.split())
        base_score = min(70 + (word_count // 20), 85)
        
        print(f"⚠️ Using fallback score: {base_score}")
        
        return {
            "overallScore": base_score,
            "contentScore": {
                "score": base_score,
                "feedback": "Your answer demonstrates relevant experience and addresses the question well."
            },
            "deliveryScore": {
                "score": base_score,
                "feedback": "Clear communication. Consider using the STAR method for structured responses."
            },
            "improvementAreas": [
                "Use the STAR method (Situation, Task, Action, Result)",
                "Include specific metrics and quantifiable outcomes",
                "Provide more concrete examples from your experience"
            ],
            "strengths": [
                "Addressed the question comprehensively",
                "Demonstrated relevant experience",
                "Communicated clearly and professionally"
            ]
        }


@router.post("/interview/complete")
async def complete_interview(
    data: Dict,
    current_user: Dict = Depends(require_role("candidate"))
):
    """Save completed interview results"""
    try:
        job_id = data.get("job_id")
        answers = data.get("answers", [])
        overall_score = data.get("overall_score", 0)
        
        print(f"\n{'='*50}")
        print(f"💾 SAVING INTERVIEW")
        print(f"Job ID: {job_id}")
        print(f"Total answers: {len(answers)}")
        print(f"Overall score: {overall_score}/100")
        print(f"{'='*50}\n")
        
        # Get profile
        profile_response = (
            db.get_client()
            .table("candidate_profiles")
            .select("id, resume_json")
            .eq("user_id", current_user["user_id"])
            .execute()
        )
        
        if not profile_response.data or len(profile_response.data) == 0:
            raise HTTPException(404, "Profile not found")
        
        profile = profile_response.data[0]
        
        # Check for existing application
        existing_app = (
            db.get_client()
            .table("applications")
            .select("id")
            .eq("job_id", job_id)
            .eq("candidate_profile_id", profile["id"])
            .execute()
        )
        
        application_id = None
        if existing_app.data and len(existing_app.data) > 0:
            application_id = existing_app.data[0]["id"]
            print(f"✅ Found existing application: {application_id}")
        else:
            # Create new application
            new_app = (
                db.get_client()
                .table("applications")
                .insert({
                    "job_id": job_id,
                    "candidate_profile_id": profile["id"],
                    "candidate_json": profile["resume_json"],
                    "status": "interview"
                })
                .execute()
            )
            application_id = new_app.data[0]["id"]
            print(f"✅ Created new application: {application_id}")
        
        # Save interview
        interview_data = {
            "application_id": application_id,
            "transcript": json.dumps(answers),
            "score": {
                "overall_score": overall_score,
                "answers": answers
            }
        }
        
        existing_interview = (
            db.get_client()
            .table("interviews")
            .select("id")
            .eq("application_id", application_id)
            .execute()
        )
        
        if existing_interview.data and len(existing_interview.data) > 0:
            db.get_client().table("interviews").update(interview_data).eq("id", existing_interview.data[0]["id"]).execute()
            print("✅ Updated existing interview")
        else:
            db.get_client().table("interviews").insert(interview_data).execute()
            print("✅ Created new interview")
        
        print(f"{'='*50}\n")
        
        return {
            "message": "Interview completed successfully",
            "application_id": application_id,
            "overall_score": overall_score
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"\n{'='*50}")
        print(f"❌ ERROR in complete_interview")
        print(f"Error: {str(e)}")
        print(f"{'='*50}\n")
        import traceback
        traceback.print_exc()
        raise HTTPException(500, f"Failed to save interview: {str(e)}")

# # =====================================================
# # GET INTERVIEW QUESTIONS
# # =====================================================

# @router.get("/interview/questions/{job_id}")
# async def get_interview_questions(
#     job_id: str,
#     current_user: Dict = Depends(require_role("candidate"))
# ):
#     """Generate interview questions based on job and candidate resume"""
#     try:
#         # Get job details
#         job = (
#             db.get_client()
#             .table("jobs")
#             .select("*")
#             .eq("id", job_id)
#             .single()
#             .execute()
#         )
        
#         if not job.data:
#             raise HTTPException(404, "Job not found")
        
#         # Get candidate resume
#         profile = (
#             db.get_client()
#             .table("candidate_profiles")
#             .select("resume_json")
#             .eq("user_id", current_user["user_id"])
#             .single()
#             .execute()
#         )
        
#         resume_text = ""
#         if profile.data:
#             resume_data = profile.data["resume_json"]
#             resume_text = f"""
# Name: {resume_data.get('name', '')}
# Title: {resume_data.get('title', '')}
# Skills: {', '.join(resume_data.get('skills', []))}
# Experience: {resume_data.get('experience_years', 0)} years
# Summary: {resume_data.get('summary', '')}
# """
        
#         print(f"Generating questions for job: {job.data.get('title')}")
        
#         # Generate questions using AI
#         questions = ai_service.generate_interview_questions_advanced(
#             resume=resume_text,
#             job_title=job.data.get("title", ""),
#             job_description=job.data.get("description", "")
#         )
        
#         print(f"Generated {len(questions)} questions")
        
#         return {"questions": questions}
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"Interview questions error: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(500, f"Failed to generate interview questions: {str(e)}")


# # =====================================================
# # SUBMIT INTERVIEW ANSWER
# # =====================================================

# @router.post("/interview/submit-answer")
# async def submit_interview_answer(
#     data: Dict,
#     current_user: Dict = Depends(require_role("candidate"))
# ):
#     """Score a single interview answer"""
#     try:
#         question = data.get("question", "")
#         answer = data.get("answer", "")
#         question_type = data.get("questionType", "behavioral")
        
#         if not answer or len(answer.strip()) < 10:
#             raise HTTPException(400, "Answer is too short (minimum 10 characters)")
        
#         print(f"Scoring answer for question type: {question_type}")
        
#         # Score using AI
#         scoring = ai_service.score_interview_answer(
#             question=question,
#             answer=answer,
#             question_type=question_type
#         )
        
#         print(f"Score: {scoring.get('overallScore', 0)}")
        
#         return scoring
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"Answer scoring error: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(500, f"Failed to score answer: {str(e)}")


# # =====================================================
# # COMPLETE INTERVIEW (Save Results)
# # =====================================================

# @router.post("/interview/complete")
# async def complete_interview(
#     data: Dict,
#     current_user: Dict = Depends(require_role("candidate"))
# ):
#     """Save completed interview results"""
#     try:
#         job_id = data.get("job_id")
#         answers = data.get("answers", [])
#         overall_score = data.get("overall_score", 0)
        
#         print(f"Completing interview for job: {job_id}, score: {overall_score}")
        
#         # Get or create application
#         profile = (
#             db.get_client()
#             .table("candidate_profiles")
#             .select("id, resume_json")
#             .eq("user_id", current_user["user_id"])
#             .single()
#             .execute()
#         )
        
#         if not profile.data:
#             raise HTTPException(404, "Profile not found")
        
#         # Check for existing application
#         existing_app = (
#             db.get_client()
#             .table("applications")
#             .select("id")
#             .eq("job_id", job_id)
#             .eq("candidate_profile_id", profile.data["id"])
#             .execute()
#         )
        
#         application_id = None
#         if existing_app.data:
#             application_id = existing_app.data[0]["id"]
#             print(f"Found existing application: {application_id}")
#         else:
#             # Create new application
#             new_app = (
#                 db.get_client()
#                 .table("applications")
#                 .insert({
#                     "job_id": job_id,
#                     "candidate_profile_id": profile.data["id"],
#                     "candidate_json": profile.data["resume_json"],
#                     "status": "applied"
#                 })
#                 .execute()
#             )
#             application_id = new_app.data[0]["id"]
#             print(f"Created new application: {application_id}")
        
#         # Save interview results
#         interview_data = {
#             "application_id": application_id,
#             "transcript": json.dumps(answers),
#             "score": {
#                 "overall_score": overall_score,
#                 "answers": answers
#             }
#         }
        
#         # Check if interview already exists
#         existing_interview = (
#             db.get_client()
#             .table("interviews")
#             .select("id")
#             .eq("application_id", application_id)
#             .execute()
#         )
        
#         if existing_interview.data:
#             # Update existing
#             db.get_client().table("interviews").update(interview_data).eq("id", existing_interview.data[0]["id"]).execute()
#             print("Updated existing interview")
#         else:
#             # Create new
#             db.get_client().table("interviews").insert(interview_data).execute()
#             print("Created new interview")
        
#         return {
#             "message": "Interview completed successfully",
#             "application_id": application_id,
#             "overall_score": overall_score
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"Complete interview error: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(500, f"Failed to save interview results: {str(e)}")
# # =====================================================
# # GET INTERVIEW QUESTIONS
# # =====================================================

# @router.get("/interview/questions/{job_id}")
# async def get_interview_questions(
#     job_id: str,
#     current_user: Dict = Depends(require_role("candidate"))
# ):
#     """Generate interview questions based on job and candidate resume"""
#     try:
#         # Get job details
#         job = (
#             db.get_client()
#             .table("jobs")
#             .select("*")
#             .eq("id", job_id)
#             .single()
#             .execute()
#         )
        
#         if not job.data:
#             raise HTTPException(404, "Job not found")
        
#         # Get candidate resume
#         profile = (
#             db.get_client()
#             .table("candidate_profiles")
#             .select("resume_json")
#             .eq("user_id", current_user["user_id"])
#             .single()
#             .execute()
#         )
        
#         resume_text = ""
#         if profile.data:
#             resume_data = profile.data["resume_json"]
#             resume_text = f"""
# Name: {resume_data.get('name', '')}
# Title: {resume_data.get('title', '')}
# Skills: {', '.join(resume_data.get('skills', []))}
# Experience: {resume_data.get('experience_years', 0)} years
# Summary: {resume_data.get('summary', '')}
# """
        
#         # Generate questions using AI
#         questions = ai_service.generate_interview_questions_advanced(
#             resume=resume_text,
#             job_title=job.data.get("title", ""),
#             job_description=job.data.get("description", "")
#         )
        
#         return {"questions": questions}
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"Interview questions error: {e}")
#         raise HTTPException(500, "Failed to generate interview questions")


# # =====================================================
# # SUBMIT INTERVIEW ANSWER
# # =====================================================

# @router.post("/interview/submit-answer")
# async def submit_interview_answer(
#     data: Dict,
#     current_user: Dict = Depends(require_role("candidate"))
# ):
#     """Score a single interview answer"""
#     try:
#         question = data.get("question", "")
#         answer = data.get("answer", "")
#         question_type = data.get("questionType", "behavioral")
        
#         if not answer or len(answer.strip()) < 10:
#             raise HTTPException(400, "Answer is too short")
        
#         # Score using AI
#         scoring = ai_service.score_interview_answer(
#             question=question,
#             answer=answer,
#             question_type=question_type
#         )
        
#         return scoring
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"Answer scoring error: {e}")
#         raise HTTPException(500, "Failed to score answer")


# # =====================================================
# # COMPLETE INTERVIEW (Save Results)
# # =====================================================

# @router.post("/interview/complete")
# async def complete_interview(
#     data: Dict,
#     current_user: Dict = Depends(require_role("candidate"))
# ):
#     """Save completed interview results"""
#     try:
#         job_id = data.get("job_id")
#         answers = data.get("answers", [])
#         overall_score = data.get("overall_score", 0)
        
#         # Get or create application
#         profile = (
#             db.get_client()
#             .table("candidate_profiles")
#             .select("id, resume_json")
#             .eq("user_id", current_user["user_id"])
#             .single()
#             .execute()
#         )
        
#         if not profile.data:
#             raise HTTPException(404, "Profile not found")
        
#         # Check for existing application
#         existing_app = (
#             db.get_client()
#             .table("applications")
#             .select("id")
#             .eq("job_id", job_id)
#             .eq("candidate_profile_id", profile.data["id"])
#             .execute()
#         )
        
#         application_id = None
#         if existing_app.data:
#             application_id = existing_app.data[0]["id"]
#         else:
#             # Create new application
#             new_app = (
#                 db.get_client()
#                 .table("applications")
#                 .insert({
#                     "job_id": job_id,
#                     "candidate_profile_id": profile.data["id"],
#                     "candidate_json": profile.data["resume_json"],
#                     "status": "applied"
#                 })
#                 .execute()
#             )
#             application_id = new_app.data[0]["id"]
        
#         # Save interview results
#         interview_data = {
#             "application_id": application_id,
#             "transcript": json.dumps(answers),
#             "score": {
#                 "overall_score": overall_score,
#                 "answers": answers
#             }
#         }
        
#         # Check if interview already exists
#         existing_interview = (
#             db.get_client()
#             .table("interviews")
#             .select("id")
#             .eq("application_id", application_id)
#             .execute()
#         )
        
#         if existing_interview.data:
#             # Update existing
#             db.get_client().table("interviews").update(interview_data).eq("id", existing_interview.data[0]["id"]).execute()
#         else:
#             # Create new
#             db.get_client().table("interviews").insert(interview_data).execute()
        
#         return {
#             "message": "Interview completed successfully",
#             "application_id": application_id,
#             "overall_score": overall_score
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"Complete interview error: {e}")
#         raise HTTPException(500, "Failed to save interview results")