# from dotenv import load_dotenv
# load_dotenv()

# import sys
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# from routers import auth, candidate, recruiter, messages
# from config import settings

# # ======================================
# # Validate environment on startup
# # ======================================

# try:
#     _ = settings.SUPABASE_URL
#     _ = settings.SUPABASE_KEY
#     _ = settings.OPENROUTER_API_KEY
#     _ = settings.JWT_SECRET
# except Exception as e:
#     print(f"FATAL: Missing required environment variables: {e}")
#     sys.exit(1)

# # ======================================
# # Create App
# # ======================================

# app = FastAPI(
#     title="CareeroAi API",
#     description="AI-Powered Recruitment Platform",
#     version="2.0.0"
# )

# # ======================================
# # CORS
# # ======================================

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "http://127.0.0.1:3000"
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ======================================
# # Routers
# # ======================================

# app.include_router(auth.router)
# app.include_router(candidate.router)
# app.include_router(recruiter.router)
# app.include_router(messages.router)

# # ======================================
# # Health
# # ======================================

# @app.get("/health")
# async def health_check():
#     return {
#         "status": "healthy",
#         "service": "CareeroAi API"
#     }

# @app.get("/")
# async def root():
#     return {
#         "message": "CareeroAi API",
#         "docs": "/docs"
#     }

# # ======================================
# # Run
# # ======================================

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
from dotenv import load_dotenv
load_dotenv()

import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, candidate, recruiter, messages
from config import settings

# ======================================
# Validate environment on startup
# ======================================

try:
    _ = settings.SUPABASE_URL
    _ = settings.SUPABASE_KEY
    _ = settings.OPENROUTER_API_KEY
    _ = settings.JWT_SECRET
except Exception as e:
    print(f"FATAL: Missing required environment variables: {e}")
    sys.exit(1)

# ======================================
# Create App
# ======================================

app = FastAPI(
    title="CareeroAi API",
    description="AI-Powered Recruitment Platform",
    version="2.0.0",
)

# ======================================
# CORS
# FIX: origins driven by settings so production deployment works.
# Add ALLOWED_ORIGINS to your .env / config.py:
#   ALLOWED_ORIGINS=["https://careeroai.com","http://localhost:3000"]
# ======================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# ======================================
# Routers
# ======================================

app.include_router(auth.router)
app.include_router(candidate.router)
app.include_router(recruiter.router)
app.include_router(messages.router)

# ======================================
# Health
# ======================================

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "CareeroAi API",
    }


@app.get("/")
async def root():
    return {
        "message": "CareeroAi API",
        "docs": "/docs",
    }

# ======================================
# Run
# ======================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)