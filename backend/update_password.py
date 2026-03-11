"""
Update passwords for existing users in Supabase
Run this to set passwords for users that have NULL passwords
"""

import bcrypt
from database import db

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    password_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")

# Password to set for all users
DEFAULT_PASSWORD = "Pass123!"

print("Updating user passwords...")
print("="*60)

# Get all users with NULL password
users = db.get_client().table("users").select("id, email, password").execute()

updated_count = 0

for user in users.data:
    if not user.get("password"):
        print(f"\nUpdating: {user['email']}")
        
        # Hash password
        hashed = hash_password(DEFAULT_PASSWORD)
        
        # Update user
        db.get_client().table("users").update({
            "password": hashed
        }).eq("id", user["id"]).execute()
        
        print(f"✅ Password set to: {DEFAULT_PASSWORD}")
        updated_count += 1

print("\n" + "="*60)
print(f"✅ Updated {updated_count} users")
print(f"Default password: {DEFAULT_PASSWORD}")
print("="*60)