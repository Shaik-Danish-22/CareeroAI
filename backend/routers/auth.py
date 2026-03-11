from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from database import db
from auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: str
    name: str = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
async def register(data: RegisterRequest):
    """Register new user"""
    try:
        print(f"\n📝 REGISTER: {data.email} as {data.role}")
        
        if data.role not in ["candidate", "recruiter"]:
            raise HTTPException(400, "Role must be 'candidate' or 'recruiter'")
        
        existing = db.get_client().table("users").select("id").eq("email", data.email).execute()
        if existing.data:
            raise HTTPException(400, "Email already registered")
        
        hashed_password = hash_password(data.password)
        
        user_result = db.get_client().table("users").insert({
            "email": data.email,
            "password": hashed_password,
            "role": data.role
        }).execute()
        
        user = user_result.data[0]
        user_id = user["id"]
        
        if data.role == "candidate":
            db.get_client().table("candidate_profiles").insert({
                "user_id": user_id,
                "resume_json": {
                    "name": data.name or data.email.split("@")[0],
                    "email": data.email,
                    "skills": [],
                    "total_experience": 0
                }
            }).execute()
        else:
            db.get_client().table("recruiter_profiles").insert({
                "user_id": user_id,
                "company_name": data.name or "Company",
                "company_info": {}
            }).execute()
        
        token = create_access_token({
            "sub": user_id,
            "email": data.email,
            "role": data.role
        })
        
        print(f"✅ Registered: {data.email} ({data.role})\n")
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": data.role,
            "user_id": user_id,
            "email": data.email
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Registration error: {e}")
        raise HTTPException(500, f"Registration failed: {str(e)}")


@router.post("/login")
async def login(data: LoginRequest):
    """Login user"""
    try:
        print(f"\n🔐 LOGIN: {data.email}")
        
        user_result = db.get_client().table("users").select("*").eq("email", data.email).execute()
        
        if not user_result.data:
            print(f"❌ User not found")
            raise HTTPException(401, "Invalid email or password")
        
        user = user_result.data[0]
        
        if not verify_password(data.password, user["password"]):
            print(f"❌ Password incorrect")
            raise HTTPException(401, "Invalid email or password")
        
        token = create_access_token({
            "sub": user["id"],
            "email": user["email"],
            "role": user["role"]
        })
        
        print(f"✅ Login successful: {user['email']} ({user['role']})\n")
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": user["role"],
            "user_id": user["id"],
            "email": user["email"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Login error: {e}")
        raise HTTPException(500, f"Login failed: {str(e)}")