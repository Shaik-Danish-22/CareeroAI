from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str                    # anon public key
    SUPABASE_SERVICE_ROLE_KEY: str       # service role key

    OPENROUTER_API_KEY: str
    JWT_SECRET: str

    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    OPENAI_API_KEY: str = ""

    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings():
    try:
        return Settings()
    except Exception as e:
        raise RuntimeError(f"Failed to load settings. Ensure .env file exists with required variables: {e}")


# Validate on import
settings = get_settings()