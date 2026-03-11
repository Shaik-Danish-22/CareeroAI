# import logging
# import traceback

# from fastapi import APIRouter, HTTPException, Depends, Query
# from typing import Dict, List

# from auth import require_role
# from database import db
# from ai_service import ai_service

# logger = logging.getLogger(__name__)

# router = APIRouter(prefix="/recruiter", tags=["recruiter"])


# # ======================================
# # POST /recruiter/jobs
# # ======================================

# @router.post("/jobs")
# async def create_job(
#     job_data: Dict,
#     current_user: Dict = Depends(require_role("recruiter")),
# ):
#     """Create a new job posting."""
#     try:
#         recruiter_id = current_user["user_id"]
#         logger.info("Creating job", extra={"recruiter_id": recruiter_id, "title": job_data.get("title")})

#         # Extract skills and location using AI
#         extracted = ai_service.extract_job_skills(
#             title=job_data.get("title", ""),
#             description=job_data.get("description", ""),
#         )

#         skills = extracted.get("skills", [])
#         location = extracted.get("location", job_data.get("location", "Remote"))

#         logger.info("Extracted skills", extra={"skills": skills, "location": location})

#         result = (
#             db.get_client()
#             .table("jobs")
#             .insert({
#                 "recruiter_id": recruiter_id,
#                 "title": job_data.get("title"),
#                 "description": job_data.get("description"),
#                 "skills": skills,
#                 "location": location,
#                 "job_type": job_data.get("job_type", "Full-time"),
#                 "company": job_data.get("company", ""),
#             })
#             .execute()
#         )

#         if not result.data:
#             raise HTTPException(500, "Failed to create job in database")

#         job = result.data[0]
#         job["applications_count"] = 0

#         logger.info("Job created", extra={"job_id": job["id"]})
#         return job

#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.exception("Job creation failed")
#         raise HTTPException(500, f"Failed to create job: {str(e)}")


# # ======================================
# # GET /recruiter/jobs
# # FIX: pagination added; application counts batched in one query (no N+1)
# # ======================================

# @router.get("/jobs")
# async def get_jobs(
#     page: int = Query(default=1, ge=1),
#     page_size: int = Query(default=20, ge=1, le=100),
#     current_user: Dict = Depends(require_role("recruiter")),
# ):
#     """Get all jobs posted by this recruiter (paginated)."""
#     try:
#         recruiter_id = current_user["user_id"]
#         offset = (page - 1) * page_size

#         logger.info("Fetching jobs", extra={"recruiter_id": recruiter_id, "page": page})

#         jobs_response = (
#             db.get_client()
#             .table("jobs")
#             .select("*")
#             .eq("recruiter_id", recruiter_id)
#             .order("created_at", desc=True)
#             .range(offset, offset + page_size - 1)
#             .execute()
#         )

#         jobs = jobs_response.data or []

#         if not jobs:
#             return {"jobs": [], "page": page, "page_size": page_size}

#         # FIX: batch application counts — one query instead of N queries
#         job_ids = [j["id"] for j in jobs]
#         counts_response = (
#             db.get_client()
#             .table("applications")
#             .select("job_id")
#             .in_("job_id", job_ids)
#             .execute()
#         )

#         # Build count map in Python
#         count_map: Dict[str, int] = {}
#         for row in (counts_response.data or []):
#             jid = row["job_id"]
#             count_map[jid] = count_map.get(jid, 0) + 1

#         for job in jobs:
#             job["applications_count"] = count_map.get(job["id"], 0)

#         logger.info("Jobs fetched", extra={"count": len(jobs)})
#         return {"jobs": jobs, "page": page, "page_size": page_size}

#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.exception("Failed to fetch jobs")
#         raise HTTPException(500, f"Failed to fetch jobs: {str(e)}")


# # ======================================
# # GET /recruiter/job/{job_id}/applications
# # FIX: pagination added
# # ======================================

# @router.get("/job/{job_id}/applications")
# async def get_job_applications(
#     job_id: str,
#     page: int = Query(default=1, ge=1),
#     page_size: int = Query(default=50, ge=1, le=200),
#     current_user: Dict = Depends(require_role("recruiter")),
# ):
#     """Get all applications for a job (paginated)."""
#     try:
#         recruiter_id = current_user["user_id"]
#         offset = (page - 1) * page_size

#         logger.info("Fetching applications", extra={"job_id": job_id, "recruiter_id": recruiter_id})

#         # Verify job ownership
#         job_response = (
#             db.get_client()
#             .table("jobs")
#             .select("*")
#             .eq("id", job_id)
#             .eq("recruiter_id", recruiter_id)
#             .execute()
#         )

#         if not job_response.data:
#             raise HTTPException(404, "Job not found or access denied")

#         job = job_response.data[0]

#         # Get applications with interview scores (paginated)
#         applications_response = (
#             db.get_client()
#             .table("applications")
#             .select("*, interviews(score)")
#             .eq("job_id", job_id)
#             .order("created_at", desc=True)
#             .range(offset, offset + page_size - 1)
#             .execute()
#         )

#         applications = applications_response.data or []

#         formatted_apps = []
#         for app in applications:
#             candidate_data = app.get("candidate_json", {})
#             interviews = app.get("interviews") or []
#             formatted_apps.append({
#                 "application_id": app["id"],
#                 "candidate_name": candidate_data.get("name", "Unknown"),
#                 "candidate_email": candidate_data.get("email", ""),
#                 "skills": candidate_data.get("skills", []),
#                 "experience": candidate_data.get("total_experience", 0),
#                 "location": candidate_data.get("current_location", ""),
#                 "status": app.get("status", "applied"),
#                 "applied_at": app.get("created_at"),
#                 "interview_score": interviews[0].get("score") if interviews else None,
#             })

#         logger.info("Applications fetched", extra={"count": len(formatted_apps)})
#         return {"job": job, "applications": formatted_apps, "page": page, "page_size": page_size}

#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.exception("Failed to fetch applications")
#         raise HTTPException(500, f"Failed to fetch applications: {str(e)}")


# # ======================================
# # GET /recruiter/job/{job_id}/recommendations
# # ======================================

# @router.get("/job/{job_id}/recommendations")
# async def get_candidate_recommendations(
#     job_id: str,
#     top_n: int = Query(default=5, ge=1, le=20),
#     current_user: Dict = Depends(require_role("recruiter")),
# ):
#     """Get AI-ranked candidate recommendations for a job."""
#     try:
#         recruiter_id = current_user["user_id"]

#         logger.info("Getting recommendations", extra={"job_id": job_id})

#         # Verify job ownership
#         job_response = (
#             db.get_client()
#             .table("jobs")
#             .select("*")
#             .eq("id", job_id)
#             .eq("recruiter_id", recruiter_id)
#             .execute()
#         )

#         if not job_response.data:
#             raise HTTPException(404, "Job not found or access denied")

#         job = job_response.data[0]

#         # Get all applications for this job
#         applications_response = (
#             db.get_client()
#             .table("applications")
#             .select("*")
#             .eq("job_id", job_id)
#             .execute()
#         )

#         applications = applications_response.data or []

#         if not applications:
#             return {
#                 "job": job,
#                 "candidates": [],
#                 "total_applications": 0,
#                 "message": "No applications yet for this job",
#             }

#         # Build candidate list for AI ranking
#         candidates = []
#         for app in applications:
#             candidate_json = app.get("candidate_json", {})
#             candidates.append({
#                 "name": candidate_json.get("name", "Unknown"),
#                 "email": candidate_json.get("email", ""),
#                 "skills": candidate_json.get("skills", []),
#                 "total_experience": candidate_json.get("total_experience", 0),
#                 "professional_summary": candidate_json.get("summary", ""),
#                 "application_id": app["id"],
#             })

#         # AI-powered ranking
#         job_skills = job.get("skills", [])
#         ranked_candidates = ai_service.recommend_candidates_for_job(
#             job_skills=job_skills,
#             candidates=candidates,
#         )

#         top_candidates = ranked_candidates[:top_n]
#         logger.info("Recommendations ready", extra={"returned": len(top_candidates)})

#         return {
#             "job": job,
#             "candidates": top_candidates,
#             "total_applications": len(applications),
#         }

#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.exception("Failed to get recommendations")
#         raise HTTPException(500, f"Failed to get recommendations: {str(e)}")
from fastapi import APIRouter, HTTPException, Depends, Query
from models import JobCreate, JobResponse, RecommendationsResponse
from auth import require_role
from database import db
from ai_service import ai_service
from recommender import recommender
from typing import Dict, List

router = APIRouter(prefix="/recruiter", tags=["recruiter"])


@router.post("/jobs", response_model=JobResponse)
async def create_job(job: JobCreate, current_user: Dict = Depends(require_role("recruiter"))):
    """Create a new job posting"""
    try:
        recruiter_id = current_user["user_id"]
        
        # Extract skills and location using AI
        extracted = ai_service.extract_job_skills(job.title, job.description)
        
        # Create job
        result = db.get_client().table("jobs").insert({
            "recruiter_id": recruiter_id,
            "title": job.title,
            "description": job.description,
            "skills": extracted.get("skills", []),
            "location": extracted.get("location", "Remote"),
            "job_type": job.job_type
        }).execute()
        
        job_data = result.data[0]
        job_data["applications_count"] = 0
        
        return JobResponse(**job_data)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create job: {str(e)}")


@router.get("/jobs")
async def get_jobs(current_user: Dict = Depends(require_role("recruiter"))):
    """Get all jobs posted by recruiter"""
    try:
        recruiter_id = current_user["user_id"]
        
        # Get jobs
        jobs = db.get_client().table("jobs").select("*").eq("recruiter_id", recruiter_id).order("created_at", desc=True).execute()
        
        # Get application counts
        jobs_with_counts = []
        for job in jobs.data:
            app_count = db.get_client().table("applications").select("id", count="exact").eq("job_id", job["id"]).execute()
            job["applications_count"] = app_count.count if app_count.count else 0
            jobs_with_counts.append(JobResponse(**job))
        
        return {"jobs": jobs_with_counts}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch jobs: {str(e)}")


@router.get("/job/{job_id}/applications")
async def get_job_applications(job_id: str, current_user: Dict = Depends(require_role("recruiter"))):
    """Get all applications for a job"""
    try:
        recruiter_id = current_user["user_id"]
        
        # Verify job ownership
        job = db.get_client().table("jobs").select("*").eq("id", job_id).eq("recruiter_id", recruiter_id).single().execute()
        if not job.data:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Get applications with interview scores
        applications = db.get_client().table("applications").select("""
            *,
            interviews(score)
        """).eq("job_id", job_id).order("created_at", desc=True).execute()
        
        # Format response
        formatted_apps = []
        for app in applications.data:
            candidate_data = app["candidate_json"]
            formatted_apps.append({
                "application_id": app["id"],
                "candidate_name": candidate_data.get("name", "Unknown"),
                "candidate_email": candidate_data.get("email", ""),
                "skills": candidate_data.get("skills", []),
                "experience": candidate_data.get("total_experience", 0),
                "location": candidate_data.get("current_location", ""),
                "status": app["status"],
                "applied_at": app["created_at"],
                "interview_score": app["interviews"][0]["score"] if app.get("interviews") and app["interviews"] else None
            })
        
        return {
            "job": job.data,
            "applications": formatted_apps
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch applications: {str(e)}")


@router.get("/job/{job_id}/recommendations", response_model=RecommendationsResponse)
async def get_candidate_recommendations(
    job_id: str,
    top_n: int = Query(default=5, ge=1, le=20),
    current_user: Dict = Depends(require_role("recruiter"))
):
    """Get AI-ranked candidate recommendations for a job"""
    try:
        recruiter_id = current_user["user_id"]
        
        # Verify job ownership
        job = db.get_client().table("jobs").select("*").eq("id", job_id).eq("recruiter_id", recruiter_id).single().execute()
        if not job.data:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Get all applications for this job
        applications = db.get_client().table("applications").select("*").eq("job_id", job_id).execute()
        
        if not applications.data:
            return RecommendationsResponse(
                job=job.data,
                debug={
                    "total_applied": 0,
                    "location_filtered": 0,
                    "no_skill_filtered": 0,
                    "passed_to_ai": 0,
                    "final_returned": 0
                },
                candidates=[]
            )
        
        # Filter and rank candidates
        candidates, debug = recommender.filter_and_rank_candidates(
            job.data,
            applications.data,
            top_n=top_n
        )
        
        # AI reranking
        if candidates:
            candidates = ai_service.rerank_candidates(job.data, candidates)
        
        return RecommendationsResponse(
            job=job.data,
            debug=debug,
            candidates=candidates
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get recommendations: {str(e)}")
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Dict, List
from auth import require_role  # Make sure this is imported
from database import db
from ai_service import ai_service

router = APIRouter(prefix="/recruiter", tags=["recruiter"])


@router.post("/jobs")
async def create_job(
    job_data: Dict,
    current_user: Dict = Depends(require_role("recruiter"))
):
    """Create a new job posting"""
    try:
        recruiter_id = current_user["user_id"]
        
        print(f"\n{'='*60}")
        print(f"📝 CREATING JOB")
        print(f"Recruiter ID: {recruiter_id}")
        print(f"Job Title: {job_data.get('title')}")
        print(f"{'='*60}\n")
        
        # Extract skills using AI
        extracted = ai_service.extract_job_skills(
            title=job_data.get("title", ""),
            description=job_data.get("description", "")
        )
        
        skills = extracted.get("skills", [])
        location = extracted.get("location", job_data.get("location", "Remote"))
        
        print(f"✅ Extracted {len(skills)} skills: {skills}")
        print(f"✅ Location: {location}")
        
        # Create job in database
        result = (
            db.get_client()
            .table("jobs")
            .insert({
                "recruiter_id": recruiter_id,
                "title": job_data.get("title"),
                "description": job_data.get("description"),
                "skills": skills,
                "location": location,
                "job_type": job_data.get("job_type", "Full-time"),
                "company": job_data.get("company", "")
            })
            .execute()
        )
        
        job = result.data[0]
        print(f"✅ Job created with ID: {job['id']}")
        
        return {
            **job,
            "applications_count": 0
        }
    
    except Exception as e:
        print(f"❌ Job creation error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(500, f"Failed to create job: {str(e)}")


@router.get("/jobs")
async def get_jobs(
    current_user: Dict = Depends(require_role("recruiter"))
):
    """Get all jobs posted by this recruiter"""
    try:
        recruiter_id = current_user["user_id"]
        
        print(f"\n📋 Fetching jobs for recruiter: {recruiter_id}")
        
        # Get jobs
        jobs_response = (
            db.get_client()
            .table("jobs")
            .select("*")
            .eq("recruiter_id", recruiter_id)
            .order("created_at", desc=True)
            .execute()
        )
        
        jobs = jobs_response.data
        
        # Get application counts for each job
        jobs_with_counts = []
        for job in jobs:
            app_count_response = (
                db.get_client()
                .table("applications")
                .select("id", count="exact")
                .eq("job_id", job["id"])
                .execute()
            )
            
            job["applications_count"] = app_count_response.count or 0
            jobs_with_counts.append(job)
        
        print(f"✅ Found {len(jobs_with_counts)} jobs")
        
        return {"jobs": jobs_with_counts}
    
    except Exception as e:
        print(f"❌ Get jobs error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(500, f"Failed to fetch jobs: {str(e)}")


@router.get("/job/{job_id}/applications")
async def get_job_applications(
    job_id: str,
    current_user: Dict = Depends(require_role("recruiter"))
):
    """Get all applications for a specific job"""
    try:
        recruiter_id = current_user["user_id"]
        
        print(f"\n📋 Fetching applications for job: {job_id}")
        
        # Verify job ownership
        job_response = (
            db.get_client()
            .table("jobs")
            .select("*")
            .eq("id", job_id)
            .eq("recruiter_id", recruiter_id)
            .execute()
        )
        
        if not job_response.data or len(job_response.data) == 0:
            raise HTTPException(404, "Job not found or you don't have access")
        
        job = job_response.data[0]
        
        # Get applications
        applications_response = (
            db.get_client()
            .table("applications")
            .select("*, interviews(score)")
            .eq("job_id", job_id)
            .order("created_at", desc=True)
            .execute()
        )
        
        applications = applications_response.data or []
        
        # Format applications
        formatted_apps = []
        for app in applications:
            candidate_data = app.get("candidate_json", {})
            
            formatted_apps.append({
                "application_id": app["id"],
                "candidate_name": candidate_data.get("name", "Unknown"),
                "candidate_email": candidate_data.get("email", ""),
                "skills": candidate_data.get("skills", []),
                "experience": candidate_data.get("total_experience", 0),
                "location": candidate_data.get("current_location", ""),
                "status": app.get("status", "applied"),
                "applied_at": app.get("created_at"),
                "interview_score": app.get("interviews", [{}])[0].get("score") if app.get("interviews") else None
            })
        
        print(f"✅ Found {len(formatted_apps)} applications")
        
        return {
            "job": job,
            "applications": formatted_apps
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Get applications error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(500, f"Failed to fetch applications: {str(e)}")
@router.get("/job/{job_id}/recommendations")
async def get_candidate_recommendations(
    job_id: str,
    top_n: int = Query(default=5, ge=1, le=20),
    current_user: Dict = Depends(require_role("recruiter"))
):
    """
    Candidate recommendation pipeline:
    1️⃣ Local scoring
    2️⃣ AI reranking
    """

    try:
        recruiter_id = current_user["user_id"]

        # ------------------------------------------------
        # 1️⃣ Verify job ownership
        # ------------------------------------------------
        job_response = (
            db.get_client()
            .table("jobs")
            .select("*")
            .eq("id", job_id)
            .eq("recruiter_id", recruiter_id)
            .execute()
        )

        if not job_response.data:
            raise HTTPException(404, "Job not found")

        job = job_response.data[0]

        # ------------------------------------------------
        # 2️⃣ Get applications
        # ------------------------------------------------
        apps_response = (
            db.get_client()
            .table("applications")
            .select("*")
            .eq("job_id", job_id)
            .execute()
        )

        applications = apps_response.data or []

        if not applications:
            return {
                "job": job,
                "candidates": [],
                "debug": {
                    "total": 0,
                    "scored": 0,
                    "passed_to_ai": 0
                }
            }

        # ------------------------------------------------
        # 3️⃣ Local scoring
        # ------------------------------------------------
        job_skills = [s.lower() for s in job.get("skills", [])]
        job_location = job.get("location", "").lower()

        scored_candidates = []

        for app in applications:

            candidate = app.get("candidate_json", {})

            skills = [s.lower() for s in candidate.get("skills", [])]
            location = candidate.get("current_location", "").lower()
            experience = candidate.get("total_experience", 0)

            # skill matches
            matches = len(set(job_skills) & set(skills))

            if matches == 0:
                continue

            score = matches + min(experience, 20)

            if location == job_location:
                score += 2

            candidate["score"] = score
            candidate["application_id"] = app["id"]

            scored_candidates.append(candidate)

        # sort locally
        scored_candidates.sort(key=lambda x: x["score"], reverse=True)

        # ------------------------------------------------
        # 4️⃣ AI rerank
        # ------------------------------------------------
        reranked = scored_candidates

        if scored_candidates:
            try:
                reranked = ai_service.rerank_candidates(
                    job,
                    scored_candidates[:10]
                )
            except Exception as e:
                print("AI rerank failed:", e)

        # ------------------------------------------------
        return {
            "job": job,
            "debug": {
                "total": len(applications),
                "scored": len(scored_candidates),
                "passed_to_ai": min(len(scored_candidates), 10)
            },
            "candidates": reranked[:top_n]
        }

    except Exception as e:
        raise HTTPException(500, f"Recommendation error: {str(e)}")
# from fastapi import APIRouter, HTTPException, Depends, Query
# from typing import Dict, List
# from auth import require_role
# from database import db
# from ai_service import ai_service

# router = APIRouter(prefix="/recruiter", tags=["recruiter"])


# @router.post("/jobs")
# async def create_job(
#     job_data: Dict,
#     current_user: Dict = Depends(require_role("recruiter"))
# ):
#     """Create a new job posting"""
#     try:
#         recruiter_id = current_user["user_id"]
        
#         print(f"\n{'='*60}")
#         print(f"📝 CREATING JOB")
#         print(f"Recruiter ID: {recruiter_id}")
#         print(f"Job Title: {job_data.get('title')}")
#         print(f"{'='*60}\n")
        
#         # Extract skills and location using AI
#         extracted = ai_service.extract_job_skills(
#             title=job_data.get("title", ""),
#             description=job_data.get("description", "")
#         )
        
#         skills = extracted.get("skills", [])
#         location = extracted.get("location", job_data.get("location", "Remote"))
        
#         print(f"✅ Extracted {len(skills)} skills: {skills}")
#         print(f"✅ Location: {location}")
        
#         # Create job
#         result = (
#             db.get_client()
#             .table("jobs")
#             .insert({
#                 "recruiter_id": recruiter_id,
#                 "title": job_data.get("title"),
#                 "description": job_data.get("description"),
#                 "skills": skills,
#                 "location": location,
#                 "job_type": job_data.get("job_type", "Full-time"),
#                 "company": job_data.get("company", "")
#             })
#             .execute()
#         )
        
#         if not result.data:
#             raise HTTPException(500, "Failed to create job in database")
        
#         job = result.data[0]
#         job["applications_count"] = 0
        
#         print(f"✅ Job created successfully: {job['id']}")
#         print(f"{'='*60}\n")
        
#         return job
    
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Job creation error: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(500, f"Failed to create job: {str(e)}")


# @router.get("/jobs")
# async def get_jobs(
#     current_user: Dict = Depends(require_role("recruiter"))
# ):
#     """Get all jobs posted by this recruiter"""
#     try:
#         recruiter_id = current_user["user_id"]
        
#         print(f"\n📋 Fetching jobs for recruiter: {recruiter_id}")
        
#         # Get jobs
#         jobs_response = (
#             db.get_client()
#             .table("jobs")
#             .select("*")
#             .eq("recruiter_id", recruiter_id)
#             .order("created_at", desc=True)
#             .execute()
#         )
        
#         jobs = jobs_response.data or []
        
#         # Get application counts
#         jobs_with_counts = []
#         for job in jobs:
#             app_count_response = (
#                 db.get_client()
#                 .table("applications")
#                 .select("id", count="exact")
#                 .eq("job_id", job["id"])
#                 .execute()
#             )
            
#             job["applications_count"] = app_count_response.count or 0
#             jobs_with_counts.append(job)
        
#         print(f"✅ Found {len(jobs_with_counts)} jobs")
        
#         return {"jobs": jobs_with_counts}
    
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Get jobs error: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(500, f"Failed to fetch jobs: {str(e)}")


# @router.get("/job/{job_id}/applications")
# async def get_job_applications(
#     job_id: str,
#     current_user: Dict = Depends(require_role("recruiter"))
# ):
#     """Get all applications for a job"""
#     try:
#         recruiter_id = current_user["user_id"]
        
#         print(f"\n📋 Fetching applications for job: {job_id}")
        
#         # Verify job ownership
#         job_response = (
#             db.get_client()
#             .table("jobs")
#             .select("*")
#             .eq("id", job_id)
#             .eq("recruiter_id", recruiter_id)
#             .execute()
#         )
        
#         if not job_response.data or len(job_response.data) == 0:
#             raise HTTPException(404, "Job not found or access denied")
        
#         job = job_response.data[0]
        
#         # Get applications with interview scores
#         applications_response = (
#             db.get_client()
#             .table("applications")
#             .select("*, interviews(score)")
#             .eq("job_id", job_id)
#             .order("created_at", desc=True)
#             .execute()
#         )
        
#         applications = applications_response.data or []
        
#         # Format applications
#         formatted_apps = []
#         for app in applications:
#             candidate_data = app.get("candidate_json", {})
            
#             formatted_apps.append({
#                 "application_id": app["id"],
#                 "candidate_name": candidate_data.get("name", "Unknown"),
#                 "candidate_email": candidate_data.get("email", ""),
#                 "skills": candidate_data.get("skills", []),
#                 "experience": candidate_data.get("total_experience", 0),
#                 "location": candidate_data.get("current_location", ""),
#                 "status": app.get("status", "applied"),
#                 "applied_at": app.get("created_at"),
#                 "interview_score": app.get("interviews", [{}])[0].get("score") if app.get("interviews") else None
#             })
        
#         print(f"✅ Found {len(formatted_apps)} applications")
        
#         return {
#             "job": job,
#             "applications": formatted_apps
#         }
    
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Get applications error: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(500, f"Failed to fetch applications: {str(e)}")


# @router.get("/job/{job_id}/recommendations")
# async def get_candidate_recommendations(
#     job_id: str,
#     top_n: int = Query(default=5, ge=1, le=20),
#     current_user: Dict = Depends(require_role("recruiter"))
# ):
#     """Get AI-ranked candidate recommendations for a job"""
#     try:
#         recruiter_id = current_user["user_id"]
        
#         print(f"\n🤖 Getting recommendations for job: {job_id}")
        
#         # Verify job ownership
#         job_response = (
#             db.get_client()
#             .table("jobs")
#             .select("*")
#             .eq("id", job_id)
#             .eq("recruiter_id", recruiter_id)
#             .execute()
#         )
        
#         if not job_response.data or len(job_response.data) == 0:
#             raise HTTPException(404, "Job not found or access denied")
        
#         job = job_response.data[0]
        
#         # Get all applications for this job
#         applications_response = (
#             db.get_client()
#             .table("applications")
#             .select("*")
#             .eq("job_id", job_id)
#             .execute()
#         )
        
#         applications = applications_response.data or []
        
#         if not applications:
#             return {
#                 "job": job,
#                 "candidates": [],
#                 "total_applications": 0,
#                 "message": "No applications yet for this job"
#             }
        
#         print(f"Found {len(applications)} applications")
        
#         # Prepare candidates for AI ranking
#         candidates = []
#         for app in applications:
#             candidate_json = app.get("candidate_json", {})
#             candidates.append({
#                 "name": candidate_json.get("name", "Unknown"),
#                 "email": candidate_json.get("email", ""),
#                 "skills": candidate_json.get("skills", []),
#                 "total_experience": candidate_json.get("total_experience", 0),
#                 "professional_summary": candidate_json.get("summary", ""),
#                 "application_id": app["id"]
#             })
        
#         # AI-powered ranking
#         job_skills = job.get("skills", [])
#         ranked_candidates = ai_service.recommend_candidates_for_job(
#             job_skills=job_skills,
#             candidates=candidates
#         )
        
#         # Return top N
#         top_candidates = ranked_candidates[:top_n]
        
#         print(f"✅ Returning top {len(top_candidates)} candidates")
        
#         return {
#             "job": job,
#             "candidates": top_candidates,
#             "total_applications": len(applications)
#         }
    
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Get recommendations error: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(500, f"Failed to get recommendations: {str(e)}")