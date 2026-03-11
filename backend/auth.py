from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security.http import HTTPBearer, HTTPAuthorizationCredentials
from config import settings
from typing import Dict

security = HTTPBearer()


def hash_password(password: str) -> str:
    """Hash password using bcrypt (auto-truncates to 72 bytes)"""
    password_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against bcrypt hash"""
    if not hashed_password:
        return False
    password_bytes = plain_password.encode("utf-8")[:72]
    hashed_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def create_access_token(data: dict) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> Dict:
    """Decode JWT token"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    """Get current user from token"""
    token = credentials.credentials
    payload = decode_token(token)
    user_id: str = payload.get("sub")
    role: str = payload.get("role")
    
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    return {
        "user_id": user_id,
        "role": role,
        "email": payload.get("email")
    }


def require_role(required_role: str):
    """Require specific role"""
    async def role_checker(current_user: Dict = Depends(get_current_user)) -> Dict:
        if current_user["role"] != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {required_role}"
            )
        return current_user
    return role_checker

# from datetime import datetime, timedelta
# from jose import JWTError, jwt
# from passlib.context import CryptContext
# from fastapi import Depends, HTTPException, status
# from fastapi.security.http import HTTPBearer, HTTPAuthorizationCredentials
# from config import settings
# from typing import Optional, Dict

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# security = HTTPBearer()


# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)


# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)


# def create_access_token(data: dict) -> str:
#     to_encode = data.copy()
#     expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
#     return encoded_jwt


# def decode_token(token: str) -> Dict:
#     try:
#         payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
#         return payload
#     except JWTError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Could not validate credentials",
#             headers={"WWW-Authenticate": "Bearer"},
#         )


# async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
#     token = credentials.credentials
#     payload = decode_token(token)
#     user_id: str = payload.get("sub")
#     role: str = payload.get("role")
#     if user_id is None:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Could not validate credentials"
#         )
#     return {"user_id": user_id, "role": role, "email": payload.get("email")}


# def require_role(required_role: str):
#     async def role_checker(current_user: Dict = Depends(get_current_user)):
#         if current_user["role"] != required_role:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail=f"Access denied. Required role: {required_role}"
#             )
#         return current_user
#     return role_checker
# 1
# from datetime import datetime, timedelta, timezone
# from jose import JWTError, jwt
# import bcrypt
# from fastapi import Depends, HTTPException, status
# from fastapi.security.http import HTTPBearer, HTTPAuthorizationCredentials
# from config import settings
# from typing import Dict

# security = HTTPBearer()

# ALLOWED_ROLES = {"recruiter", "candidate"}


# # ======================================
# # Password Hashing
# # ======================================

# def hash_password(password: str) -> str:
#     """Hash a password using bcrypt."""
#     password_bytes = password.encode("utf-8")[:72]
#     salt = bcrypt.gensalt()
#     hashed = bcrypt.hashpw(password_bytes, salt)
#     return hashed.decode("utf-8")


# # def verify_password(plain_password: str, hashed_password: str) -> bool:
# #     """Verify a plain password against a bcrypt hash."""
# #     password_bytes = plain_password.encode("utf-8")[:72]
# #     hashed_bytes = hashed_password.encode("utf-8")
# #     return bcrypt.checkpw(password_bytes, hashed_bytes)

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     """Verify a plain password against a bcrypt hash."""

#     if not hashed_password:
#         return False

#     password_bytes = plain_password.encode("utf-8")[:72]
#     hashed_bytes = hashed_password.encode("utf-8")

#     return bcrypt.checkpw(password_bytes, hashed_bytes)
# # ======================================
# # JWT
# # ======================================

# def create_access_token(data: dict) -> str:
#     """Create a signed JWT access token."""
#     to_encode = data.copy()
#     # FIX: use timezone-aware datetime (datetime.utcnow() is deprecated in 3.12+)
#     expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


# def decode_token(token: str) -> Dict:
#     """Decode and validate a JWT token."""
#     try:
#         payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
#         return payload
#     except JWTError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Could not validate credentials",
#             headers={"WWW-Authenticate": "Bearer"},
#         )


# # ======================================
# # Dependencies
# # ======================================

# async def get_current_user(
#     credentials: HTTPAuthorizationCredentials = Depends(security),
# ) -> Dict:
#     """Extract and validate the current user from the Bearer token."""
#     token = credentials.credentials
#     payload = decode_token(token)

#     user_id: str = payload.get("sub")
#     role: str = payload.get("role")

#     if user_id is None:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Could not validate credentials",
#         )

#     # FIX: validate role against known allowed values
#     if role not in ALLOWED_ROLES:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid role in token",
#         )

#     return {"user_id": user_id, "role": role, "email": payload.get("email")}


# def require_role(required_role: str):
#     """Dependency factory: only allows users with the specified role."""
#     async def role_checker(current_user: Dict = Depends(get_current_user)) -> Dict:
#         if current_user["role"] != required_role:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail=f"Access denied. Required role: {required_role}",
#             )
#         return current_user
#     return role_checker