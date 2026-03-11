from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()  # 👈 THIS IS REQUIRED

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print("URL:", SUPABASE_URL)
print("KEY LOADED:", bool(SUPABASE_KEY))

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

res = supabase.auth.admin.list_users()
print(res)
