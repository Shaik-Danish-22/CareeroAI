# 📐 CareeroAI Frontend - Visual Architecture Diagrams

## 1. Component Dependency Tree

```
┌─────────────────────────────────────────────────────────────────┐
│                    src/app/layout.tsx (ROOT)                    │
│                    ↓ All pages inherit                           │
└─────────────────────────────────────────────────────────────────┘

├── Public Routes
│   ├── src/app/page.tsx [HOME PAGE]
│   │   └── Links to /login, /signup
│   │
│   ├── src/app/login/page.tsx [LOGIN]
│   │   └── Uses: api.login()
│   │
│   └── src/app/signup/page.tsx [SIGNUP]
│       └── Uses: api.register()
│
├── Protected Route: CANDIDATE
│   │
│   └── src/app/candidate/layout.tsx ← AUTH CHECK
│       ├── Sidebar (role="candidate")
│       ├── ChatAssistant
│       │
│       ├── src/app/candidate/page.tsx [DASHBOARD]
│       │   └── Uses: getRecommendations()
│       │
│       ├── src/app/candidate/profile/page.tsx [PROFILE]
│       │   └── Uses: api calls for profile data
│       │
│       ├── src/app/candidate/resume/page.tsx [RESUME]
│       │   └── Component: ResumeForm
│       │       └── Uses: saveResume()
│       │
│       ├── src/app/candidate/job/[id]/page.tsx [JOB DETAILS]
│       │   └── Component: JobCard
│       │       └── Uses: getSkillGaps(), applyToJob()
│       │
│       ├── src/app/candidate/interview/[id]/page.tsx [INTERVIEW]
│       │   └── Component: VideoRecorder
│       │       └── Uses: submitInterviewAnswer()
│       │
│       ├── src/app/candidate/applications/page.tsx [APPLICATIONS]
│       │   └── Uses: getApplications()
│       │
│       ├── src/app/candidate/recommendations/page.tsx [RECOMMENDATIONS]
│       │   └── Uses: getRecommendations()
│       │
│       └── src/app/candidate/skill-gap/page.tsx [SKILL GAP]
│           └── Uses: getSkillGaps()
│
└── Protected Route: RECRUITER
    │
    └── src/app/recruiter/layout.tsx ← AUTH CHECK
        ├── Sidebar (role="recruiter")
        ├── ChatAssistant
        │
        ├── src/app/recruiter/page.tsx [DASHBOARD]
        │   └── Uses: getRecruiterJobs()
        │
        └── src/app/recruiter/job/[id]/page.tsx [JOB DETAILS]
            └── Uses: getJobApplications(), getCandidateRecommendations()

Shared Components (Used Globally):
├── Sidebar.tsx
│   └── Used by: candidate/layout.tsx, recruiter/layout.tsx
│   └── Internal: MessagingSystem
│
├── ChatAssistant.tsx
│   └── Used by: candidate/layout.tsx, recruiter/layout.tsx
│
├── JobCard.tsx
│   └── Used by: candidate dashboard, recommendations, job details
│
├── MessagingSystem.tsx
│   └── Used by: Sidebar.tsx
│
├── ResumeForm.tsx
│   └── Used by: candidate/resume/page.tsx
│
└── VideoRecorder.tsx
    └── Used by: candidate/interview/[id]/page.tsx
```

---

## 2. Data Flow Architecture

```
┌────────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js)                    │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Pages & Components                                  │
│  (React Components with hooks)                       │
│         │                                            │
│         ↓                                            │
│  useEffect(() => { API_CALL() })                    │
│         │                                            │
│         ↓                                            │
│  src/lib/api.ts (Axios instances)                   │
│  ├─ request interceptor (adds token)                │
│  ├─ response interceptor (error handling)           │
│  └─ exported functions (getRecommendations, etc)    │
│         │                                            │
│         ↓                                            │
│  localStorage.getItem("token")                       │
│  (JWT Token attached to headers)                    │
│                                                        │
└────────────────────────────────────────────────────────┘
                        │
                   HTTP/CORS
                        │
                        ↓
┌────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                    │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Endpoint: POST /auth/login                          │
│  Endpoint: GET /candidate/recommendations            │
│  Endpoint: POST /candidate/apply                     │
│  etc...                                              │
│         │                                            │
│         ↓                                            │
│  Verify JWT Token                                    │
│  Validate user role                                 │
│         │                                            │
│         ↓                                            │
│  Query/Update Database (Supabase PostgreSQL)        │
│                                                        │
└────────────────────────────────────────────────────────┘
                        │
                        ↓
┌────────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL)                     │
│                  via Supabase                         │
└────────────────────────────────────────────────────────┘
```

---

## 3. Routing & Protection Structure

```
PUBLIC ROUTES (No auth required)
│
├─ /                    (src/app/page.tsx)
│  └─ Landing page with Login/Signup buttons
│
├─ /login               (src/app/login/page.tsx)
│  └─ Email + password form
│
└─ /signup              (src/app/signup/page.tsx)
   └─ Email + password + role selection


PROTECTED ROUTES (Auth required)
│
├─ /candidate/*         (src/app/candidate/layout.tsx checks auth)
│  ├─ / (dashboard)
│  ├─ /profile
│  ├─ /resume
│  ├─ /job/[id]
│  ├─ /interview/[id]
│  ├─ /applications
│  ├─ /recommendations
│  └─ /skill-gap
│
└─ /recruiter/*         (src/app/recruiter/layout.tsx checks auth)
   ├─ / (dashboard)
   └─ /job/[id]


PROTECTION FLOW (Current - Client-side):
1. User navigates to /candidate/resume
2. layout.tsx renders
3. useEffect checks localStorage.getItem("token")
4. If no token → router.replace("/login")
5. If token exists → setIsAuthorized(true)
6. Render page content

⚠️ ISSUE: Page visible for 1-2 seconds before redirect
```

---

## 4. Component Communication Flow

```
Example: User applies to a job

1. USER INTERACTION
   └─ Click "Apply" button on job card
      (src/components/JobCard.tsx)
   
2. COMPONENT STATE
   └─ Trigger onClick handler
      └─ Call applyToJob(job.id)
   
3. API CALL
   └─ src/lib/api.ts
      └─ api.post(`/candidate/apply?job_id=${jobId}`)
      └─ Interceptor adds Authorization header
      └─ Axios sends HTTP POST request
   
4. BACKEND PROCESSING
   └─ FastAPI receives request
   └─ Validates JWT token
   └─ Performs validation
   └─ Updates database
      
5. RESPONSE
   └─ Returns success/error response
   └─ Response interceptor handles errors
   └─ Returns data to component
   
6. UI UPDATE
   └─ setApplications([...newApplication])
   └─ Component re-renders
   └─ Show success message
```

---

## 5. File Modification Impact Analysis

```
MODIFYING: src/components/Sidebar.tsx
┌────────────────────────────────────────────┐
│ AFFECTED PAGES:                            │
│ - /candidate/*              (ALL PAGES)    │
│ - /recruiter/*              (ALL PAGES)    │
│ IMPACT: HIGH (Used on every protected page)
│ SAFE: YES (UI only, no logic change)       │
│ TIME: 4-6 hours                            │
└────────────────────────────────────────────┘

MODIFYING: src/lib/api.ts
┌────────────────────────────────────────────┐
│ AFFECTED: ALL API communication            │
│ IMPACT: SEVERE (All endpoints)             │
│ SAFE: NO (Backend communication)           │
│ DO NOT MODIFY UNLESS NECESSARY!            │
└────────────────────────────────────────────┘

MODIFYING: tailwind.config.js
┌────────────────────────────────────────────┐
│ AFFECTED: ALL STYLING                      │
│ IMPACT: HIGH (All pages)                   │
│ SAFE: YES (Theme/colors only)              │
│ TIME: 1-2 hours                            │
└────────────────────────────────────────────┘

MODIFYING: src/app/globals.css
┌────────────────────────────────────────────┐
│ AFFECTED: ALL PAGES                        │
│ IMPACT: HIGH                               │
│ SAFE: YES (UI styles)                      │
│ TIME: 2-3 hours                            │
└────────────────────────────────────────────┘
```

---

## 6. State Management Flow

```
USER LOGS IN
    │
    ├─ localStorage.setItem("token", access_token)
    ├─ localStorage.setItem("role", "candidate")
    └─ localStorage.setItem("user_id", user_id)
    
USER NAVIGATES TO /candidate/resume
    │
    ├─ Sidebar.tsx reads localStorage.getItem("role")
    ├─ Renders "candidate" navigation links
    │
    └─ Page component fetches data:
        ├─ useEffect(() => { getResume() })
        ├─ api.get() interceptor attaches token
        ├─ Backend validates token
        ├─ Returns resume data
        ├─ setResume(data)
        └─ Render UI with data
    
USER SUBMITS RESUME FORM
    │
    ├─ Form validation (client-side)
    ├─ Errors? → Show validation messages
    ├─ Valid? → Call saveResume(data)
    ├─ Post request includes JWT token
    ├─ Backend validates & updates database
    ├─ Response returns updated resume
    ├─ setResume(newData)
    └─ Show success message
```

---

## 7. Suggested Component Library Structure

```
CURRENT (No library structure):
src/components/
├── Sidebar.tsx
├── JobCard.tsx
├── ChatAssistant.tsx
├── MessagingSystem.tsx
├── ResumeForm.tsx
└── VideoRecorder.tsx


SUGGESTED (Organized by purpose):
src/components/
│
├── ui/                           [NEW - Base components]
│   ├── Button.tsx               (Variants: primary, secondary, ghost)
│   ├── Card.tsx                 (Layout wrapper)
│   ├── Input.tsx                (Form input with error state)
│   ├── Select.tsx               (Dropdown)
│   ├── Modal.tsx                (Dialog)
│   ├── Badge.tsx                (Tags/status)
│   ├── Loading.tsx              (Skeleton loaders)
│   ├── Tabs.tsx                 (Tab navigation)
│   └── Breadcrumb.tsx           (Navigation path)
│
├── layout/                       [Navigation & structure]
│   ├── Sidebar.tsx              (Redesigned - PRIORITY)
│   ├── Header.tsx               (New - top navigation)
│   ├── Footer.tsx               (New - footer)
│   └── Container.tsx            (New - content wrapper)
│
├── features/                     [Feature-specific]
│   ├── JobCard.tsx              (Redesigned)
│   ├── ResumeForm.tsx           (Redesigned)
│   ├── ChatAssistant.tsx        (Redesigned)
│   ├── MessagingSystem.tsx      (Redesigned)
│   └── VideoRecorder.tsx        (Redesigned)
│
└── common/                       [Utilities]
    ├── NoResults.tsx            (Empty state)
    ├── ErrorBoundary.tsx        (Error handling)
    ├── ConfirmDialog.tsx        (Confirmation)
    └── Pagination.tsx           (Pagination)
```

---

## 8. Authentication Flow Diagram

```
SIGNUP FLOW
┌─────────────────────────────────────────────┐
│ User fills signup form                      │
│ (email, password, role)                     │
└────────────────┬────────────────────────────┘
                 │
                 ↓
         ┌───────────────────┐
         │  client-side      │
         │ validate form     │
         └────────┬──────────┘
                  │
                  ↓
        ┌──────────────────┐
        │  POST /auth/     │
        │  register        │
        │  + JWT token     │
        └─────────┬────────┘
                  │
                  ↓
      ┌───────────────────────────┐
      │  Backend validates:       │
      │  - Email format          │
      │  - Password strength     │
      │  - User not exists       │
      └────────────┬─────────────┘
                   │
                   ↓
      ┌─────────────────────────┐
      │  Create user in DB      │
      │  & return JWT token     │
      └────────────┬────────────┘
                   │
                   ↓
      ┌──────────────────────────┐
      │ Frontend:                │
      │ localStorage.setItem(    │
      │   "token",              │
      │   response.token        │
      │ )                        │
      └────────────┬─────────────┘
                   │
                   ↓
      ┌──────────────────────────┐
      │ router.push("/candidate")│
      │ OR                       │
      │ router.push("/recruiter")│
      └──────────────────────────┘


LOGIN FLOW (Similar)
┌─────────────────────────────────────────────┐
│ User fills login form                       │
│ (email, password)                           │
└────────────────┬────────────────────────────┘
                 │
                 ↓
        ┌──────────────────┐
        │  POST /auth/     │
        │  login           │
        └─────────┬────────┘
                  │
                  ↓
      ┌──────────────────────────┐
      │ Backend validates:       │
      │ - Email exists          │
      │ - Password correct      │
      │ - Return JWT + role     │
      └────────────┬─────────────┘
                   │
                   ↓
      ┌──────────────────────────┐
      │ Frontend stores token &  │
      │ role in localStorage     │
      └────────────┬─────────────┘
                   │
                   ↓
      ┌──────────────────────────┐
      │ Redirect based on role   │
      │ (candidate vs recruiter) │
      └──────────────────────────┘
```

---

## 9. API Request Interceptor Flow

```
EVERY API CALL FOLLOWS THIS PATTERN:

1. Component calls method from src/lib/api.ts
   └─ Example: getRecommendations()
   
2. Function triggers: api.get("/candidate/recommendations")

3. REQUEST INTERCEPTOR (runs before sending)
   ├─ Check: typeof window !== "undefined"
   ├─ Get token: localStorage.getItem("token")
   ├─ Add header: Authorization: Bearer ${token}
   ├─ Log: console.log("🔑 Token attached...")
   └─ Return modified config
   
4. HTTP REQUEST SENT
   ├─ URL: http://127.0.0.1:8000/candidate/recommendations
   ├─ Headers include: Authorization: Bearer eyJhbGc...
   └─ Axios sends request
   
5. BACKEND RECEIVES
   ├─ Extracts token from header
   ├─ Validates token signature
   ├─ Checks token expiration
   ├─ Identifies user from token
   ├─ Verifies user role
   └─ Proceeds with request or returns 401
   
6. RESPONSE INTERCEPTOR (runs after response)
   ├─ Success (200-299)?
   │  └─ Return response data
   ├─ Error (400-599)?
   │  ├─ 401 (Unauthorized)?
   │  │  └─ Token expired → Redirect to login
   │  ├─ Log error
   │  └─ Reject promise
   
7. COMPONENT RECEIVES
   ├─ Success: setRecommendations(data)
   ├─ Error: catch block handles error
   └─ Update UI accordingly
```

---

## 10. Current Issues Map

```
ISSUE: Authentication Flash
┌─────────────────────────────────────────────┐
│ 1. User navigates to /candidate/resume      │
│ 2. Page renders with loading state          │
│ 3. useEffect runs after render (too late!)  │
│ 4. Check: No token                          │
│ 5. Redirect: router.replace("/login")       │
│                                              │
│ Problem: User SAW /candidate/resume briefly │
│ before redirect                             │
│                                              │
│ Solution: Move auth check to middleware.ts  │
│ (Runs before page renders)                  │
└─────────────────────────────────────────────┘


ISSUE: No Loading States
┌─────────────────────────────────────────────┐
│ 1. Component renders empty/blank            │
│ 2. useEffect: const [loading, setLoading]   │
│ 3. Calls API → 1-2 seconds                  │
│ 4. User sees blank page                     │
│                                              │
│ Problem: No visual feedback during loading  │
│                                              │
│ Solution: Add loading.tsx files with        │
│ skeleton loaders in each route              │
└─────────────────────────────────────────────┘


ISSUE: No Error Handling
┌─────────────────────────────────────────────┐
│ 1. API call fails (network error)           │
│ 2. catch block not implemented              │
│ 3. setData = undefined                      │
│ 4. Component tries to map undefined         │
│ 5. Runtime error → Page crashes             │
│                                              │
│ Problem: Unhandled errors crash page        │
│                                              │
│ Solution: Add error.tsx files & try-catch   │
└─────────────────────────────────────────────┘
```

---

**End of Visual Architecture Diagrams**  
Generated: March 12, 2026
