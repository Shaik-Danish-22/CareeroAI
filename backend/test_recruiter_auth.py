
# import requests

# BASE_URL = "http://127.0.0.1:8000"

# # Test login with existing recruiter
# print("\n" + "="*60)
# print("Testing Recruiter Login")
# print("="*60)

# response = requests.post(
#     f"{BASE_URL}/auth/login",
#     json={
#         "email": "danny1@gmail.com",
#         "password": "Pass123!"
#     }
# )

# print(f"\nStatus: {response.status_code}")
# data = response.json()

# if response.status_code == 200:
#     print("\n✅ LOGIN SUCCESSFUL!")
#     print(f"Response: {data}")
    
#     # Extract token (handle both response formats)
#     token = data.get('access_token') or data.get('token')
#     role = data.get('role') or data.get('user', {}).get('role')
#     user_id = data.get('user_id') or data.get('user', {}).get('id')
    
#     print(f"\nRole: {role}")
#     print(f"User ID: {user_id}")
#     print(f"Token: {token[:50]}...")
    
#     # Test creating a job
#     print("\n" + "="*60)
#     print("Testing Job Creation")
#     print("="*60)
    
#     job_response = requests.post(
#         f"{BASE_URL}/recruiter/jobs",
#         json={
#             "title": "Senior Python Developer",
#             "description": "Looking for experienced Python developer with FastAPI and PostgreSQL",
#             "job_type": "Full-time",
#             "location": "Remote"
#         },
#         headers={"Authorization": f"Bearer {token}"}
#     )
    
#     print(f"\nStatus: {job_response.status_code}")
    
#     if job_response.status_code == 200:
#         job = job_response.json()
#         print("✅ JOB CREATED!")
#         print(f"Job ID: {job['id']}")
#         print(f"Title: {job['title']}")
#         print(f"Skills: {job.get('skills', [])}")
        
#         print("\n" + "="*60)
#         print("✅ ALL TESTS PASSED!")
#         print("="*60)
#     else:
#         print(f"❌ Job creation failed: {job_response.json()}")
# else:
#     print(f"❌ Login failed: {data}")
import requests

response = requests.post(
    "http://127.0.0.1:8000/auth/login",
    json={"email": "danny1@gmail.com", "password": "Pass123!"}
)

print("Status:", response.status_code)
print("\nResponse JSON:")
import json
print(json.dumps(response.json(), indent=2))

# Check what keys are present
data = response.json()
print("\nKeys in response:")
for key in data.keys():
    print(f"  - {key}: {data[key] if key != 'access_token' else data[key][:30] + '...'}")

# Verify format
required_keys = ['access_token', 'role', 'user_id', 'email']
missing = [k for k in required_keys if k not in data]

if missing:
    print(f"\n❌ MISSING KEYS: {missing}")
else:
    print(f"\n✅ All required keys present!")