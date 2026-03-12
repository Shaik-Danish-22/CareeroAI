# CareeroAI Frontend Architecture Analysis

**Document Version**: 1.0  
**Date**: March 12, 2026  
**Purpose**: Complete analysis of frontend structure for UI/UX redesign planning

---

## 📋 TABLE OF CONTENTS

1. [Repository Structure](#1-repository-structure)
2. [Folder Organization & File Mapping](#2-folder-organization--file-mapping)
3. [Safe Files to Modify](#3-safe-files-to-modify)
4. [Current Routing Architecture](#4-current-routing-architecture)
5. [Frontend-Backend Communication](#5-frontend-backend-communication)
6. [Dependency Map](#6-dependency-map)
7. [UI Issues Identified](#7-ui-issues-identified)
8. [Suggested UI Architecture](#8-suggested-ui-architecture)
9. [Component Redesign Priority](#9-component-redesign-priority)

---

# 1. REPOSITORY STRUCTURE

## Frontend Directory Tree

```
frontend/
├── package.json                    # Dependencies & scripts
├── package-lock.json               # Locked dependency versions
├── tsconfig.json                   # TypeScript configuration
├── next.config.js                  # Next.js configuration
├── tailwind.config.js              # Tailwind CSS theme
├── postcss.config.js               # CSS processing config
├── next-env.d.ts                   # Next.js type definitions
│
├── src/
│   ├── middleware.ts               # Next.js middleware (DISABLED)
│   │
│   ├── app/                        # Next.js App Router (pages structure)
│   │   ├── layout.tsx              # ROOT LAYOUT - All pages inherit
│   │   ├── page.tsx                # Home page (landing)
│   │   ├── globals.css             # Global CSS styles
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx            # Login page
│   │   │
│   │   ├── signup/
│   │   │   └── page.tsx            # Signup page
│   │   │
│   │   ├── candidate/              # Candidate portal (protected)
│   │   │   ├── layout.tsx          # Candidate layout wrapper
│   │   │   ├── page.tsx            # Candidate dashboard
│   │   │   ├── profile/
│   │   │   │   └── page.tsx        # Profile management
│   │   │   ├── resume/
│   │   │   │   └── page.tsx        # Resume upload/editor
│   │   │   ├── job/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Job details (dynamic route)
│   │   │   ├── interview/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Interview page (dynamic)
│   │   │   ├── applications/
│   │   │   │   └── page.tsx        # Applications list
│   │   │   ├── recommendations/
│   │   │   │   └── page.tsx        # Job recommendations
│   │   │   └── skill-gap/
│   │   │       └── page.tsx        # Skill gap analysis
│   │   │
│   │   └── recruiter/              # Recruiter portal (protected)
│   │       ├── layout.tsx          # Recruiter layout wrapper
│   │       ├── page.tsx            # Recruiter dashboard
│   │       └── job/
│   │           └── [id]/
│   │               └── page.tsx    # Job edit/details
│   │
│   ├── components/                 # Reusable React components
│   │   ├── ChatAssistant.tsx       # AI chat widget
│   │   ├── JobCard.tsx             # Job card display component
│   │   ├── MessagingSystem.tsx     # Direct messaging UI
│   │   ├── ResumeForm.tsx          # Resume form component
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   └── VideoRecorder.tsx       # Video interview recorder
│   │
│   └── lib/                        # Utilities & services
│       ├── api.ts                  # API client & endpoints
│       └── supabase.ts             # Supabase auth client
│
└── node_modules/                   # NPM packages (generated)
```

---

# 2. FOLDER ORGANIZATION & FILE MAPPING

## By Purpose/Function:

### Authentication & Layout
| File | Purpose | Safe to Modify? |
|------|---------|-----------------|
| `src/middleware.ts` | Route protection middleware | ✅ YES - Currently disabled |
| `src/app/layout.tsx` | Root layout wrapper | ✅ YES - Only UI structure |
| `src/app/login/page.tsx` | Login UI form | ✅ YES - UI only |
| `src/app/signup/page.tsx` | Signup UI form | ✅ YES - UI only |
| `src/app/page.tsx` | Landing page | ✅ YES - UI only |

### Dashboard Pages (Layout + UI)
| File | Purpose | Safe to Modify? |
|------|---------|-----------------|
| `src/app/candidate/layout.tsx` | Candidate portal wrapper | ✅ YES - Layout, keep auth |
| `src/app/recruiter/layout.tsx` | Recruiter portal wrapper | ✅ YES - Layout, keep auth |
| `src/app/candidate/page.tsx` | Candidate dashboard | ✅ YES - UI only |
| `src/app/recruiter/page.tsx` | Recruiter dashboard | ✅ YES - UI only |

### Feature Pages (All UI)
| File | Purpose | Safe to Modify? |
|------|---------|-----------------|
| `src/app/candidate/profile/page.tsx` | Profile page | ✅ YES |
| `src/app/candidate/resume/page.tsx` | Resume page | ✅ YES |
| `src/app/candidate/job/[id]/page.tsx` | Job details | ✅ YES |
| `src/app/candidate/interview/[id]/page.tsx` | Interview UI | ✅ YES |
| `src/app/candidate/applications/page.tsx` | Applications list | ✅ YES |
| `src/app/candidate/recommendations/page.tsx` | Job recommendations | ✅ YES |
| `src/app/candidate/skill-gap/page.tsx` | Skill gap tool | ✅ YES |
| `src/app/recruiter/job/[id]/page.tsx` | Job management | ✅ YES |

### Components (Reusable UI)
| File | Purpose | Safe to Modify? |
|------|---------|-----------------|
| `src/components/Sidebar.tsx` | Navigation sidebar | ✅ YES - Complete redesign safe |
| `src/components/JobCard.tsx` | Job card display | ✅ YES - Complete redesign safe |
| `src/components/ChatAssistant.tsx` | Chat widget UI | ✅ YES - Layout only |
| `src/components/MessagingSystem.tsx` | Messaging UI | ✅ YES - Layout only |
| `src/components/ResumeForm.tsx` | Resume form UI | ✅ YES - Layout only |
| `src/components/VideoRecorder.tsx` | Video recorder UI | ✅ YES - Layout only |

### Styling (Safe to Modify)
| File | Purpose | Safe to Modify? |
|------|---------|-----------------|
| `src/app/globals.css` | Global styles | ✅ YES - Complete redesign |
| `tailwind.config.js` | Tailwind theme config | ✅ YES - Colors, fonts, spacing |
| `postcss.config.js` | CSS processing | ✅ YES |
| `next.config.js` | Build configuration | ⚠️ AVOID - Unless adding features |

### API & Configuration (DO NOT MODIFY)
| File | Purpose | Safe to Modify? |
|------|---------|-----------------|
| `src/lib/api.ts` | API endpoints & calls | ❌ NO - Backend communication |
| `src/lib/supabase.ts` | Supabase auth | ❌ NO - Authentication logic |
| `package.json` | Dependencies | ⚠️ AVOID - Only if adding packages |

---

# 3. SAFE FILES TO MODIFY

## ✅ SAFE FOR FULL REDESIGN (No Backend Impact)

### Pages & Layouts
```
✅ src/app/page.tsx                           (Home page)
✅ src/app/login/page.tsx                     (Login UI)
✅ src/app/signup/page.tsx                    (Signup UI)
✅ src/app/candidate/layout.tsx               (Candidate layout)
✅ src/app/candidate/page.tsx                 (Candidate dashboard)
✅ src/app/candidate/profile/page.tsx         (Profile page)
✅ src/app/candidate/resume/page.tsx          (Resume page)
✅ src/app/candidate/job/[id]/page.tsx        (Job details)
✅ src/app/candidate/interview/[id]/page.tsx  (Interview page)
✅ src/app/candidate/applications/page.tsx    (Applications)
✅ src/app/candidate/recommendations/page.tsx (Recommendations)
✅ src/app/candidate/skill-gap/page.tsx       (Skill gap)
✅ src/app/recruiter/layout.tsx               (Recruiter layout)
✅ src/app/recruiter/page.tsx                 (Recruiter dashboard)
✅ src/app/recruiter/job/[id]/page.tsx        (Job management)
```

### Components
```
✅ src/components/Sidebar.tsx          (Navigation - PRIORITY)
✅ src/components/JobCard.tsx          (Job display - PRIORITY)
✅ src/components/ChatAssistant.tsx    (Chat UI)
✅ src/components/MessagingSystem.tsx  (Messaging UI)
✅ src/components/ResumeForm.tsx       (Resume form)
✅ src/components/VideoRecorder.tsx    (Video recorder)
```

### Styling
```
✅ src/app/globals.css         (Global styles - PRIORITY)
✅ tailwind.config.js          (Theme colors, fonts - PRIORITY)
✅ postcss.config.js           (CSS processing)
```

### Layout Wrapper
```
✅ src/app/layout.tsx          (Root layout - PRIORITY)
```

## ⚠️ CAUTION - Keep Logic, Change UI Only

```
⚠️ src/app/candidate/layout.tsx    (Keep auth check, redesign UI)
⚠️ src/app/recruiter/layout.tsx    (Keep auth check, redesign UI)
```

## ❌ DO NOT MODIFY

```
❌ src/lib/api.ts               (Backend communication)
❌ src/lib/supabase.ts          (Authentication)
❌ src/middleware.ts            (Protected routes - currently disabled)
❌ package.json                 (Dependencies - unless adding packages)
❌ tsconfig.json                (TypeScript compilation)
```

---

# 4. CURRENT ROUTING ARCHITECTURE

## Next.js App Router Structure

### Route Map
```
/ (Home/Landing)
├─ /login (Public)
├─ /signup (Public)
├─ /candidate/* (Protected by layout.tsx auth check)
│  ├─ / (Dashboard)
│  ├─ /profile
│  ├─ /resume
│  ├─ /job/[id] (Dynamic - job ID from URL)
│  ├─ /interview/[id] (Dynamic - interview ID)
│  ├─ /applications
│  ├─ /recommendations
│  └─ /skill-gap
└─ /recruiter/* (Protected by layout.tsx auth check)
   ├─ / (Dashboard)
   └─ /job/[id] (Dynamic - job ID)
```

## Protection Mechanism

**Current Implementation** ❌ **CLIENT-SIDE ONLY**
```ts
// src/app/candidate/layout.tsx & recruiter/layout.tsx
useEffect(() => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  
  if (!token || role !== 'candidate') {
    router.replace('/login')
  }
})
```

**Issues with Current Approach:**
- ⚠️ Routes can be accessed before auth check completes
- ⚠️ No server-side protection
- ⚠️ Page flashing before redirect
- ⚠️ Middleware is disabled (`matcher: []`)

## Routing Problems Identified

| Problem | Severity | Impact | Solution |
|---------|----------|--------|----------|
| **Client-side only auth** | 🔴 HIGH | Can briefly access protected routes | Enable/fix middleware for server-side checks |
| **Loading states** | 🟡 MEDIUM | Page shows "Checking..." then redirects | Add proper loading skeletons |
| **No 404 pages** | 🟡 MEDIUM | Invalid routes show blank page | Create `not-found.tsx` or catch-all routes |
| **Missing error boundaries** | 🟡 MEDIUM | API errors crash component | Add error.tsx or try-catch patterns |
| **Dynamic routes unoptimized** | 🟠 LOW | Job/interview IDs not validated | Add validation in page components |
| **No loading.tsx fallbacks** | 🟠 LOW | Instant blank page on navigation | Create loading UI with Suspense |

---

# 5. FRONTEND-BACKEND COMMUNICATION

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                       │
│                                                              │
│  Pages & Components                                         │
│        ↓                                                    │
│  src/lib/api.ts (Axios HTTP Client)                        │
│        ↓                                                    │
│  src/lib/supabase.ts (Auth + Database)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓↑ HTTP Requests
                          CORS
                            ↓↑
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                        │
│                                                              │
│  /auth/register, /auth/login, /auth/me                     │
│  /candidate/* (resume, recommendations, interviews)        │
│  /recruiter/* (jobs, applications, recommendations)        │
│  /messages/* (chat, messaging)                             │
└─────────────────────────────────────────────────────────────┘
                            ↓↑
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (PostgreSQL)                      │
│                   via Supabase                              │
└─────────────────────────────────────────────────────────────┘
```

## API Client (`src/lib/api.ts`)

### Base Configuration
```ts
const API_URL = "http://127.0.0.1:8000"  // Development server
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }
})
```

### Authentication
1. **Request Interceptor** - Automatically attaches JWT token
   ```ts
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem("token")
     if (token) {
       config.headers.Authorization = `Bearer ${token}`
     }
     return config
   })
   ```

2. **Response Interceptor** - Handles errors globally
   ```ts
   api.interceptors.response.use(
     (response) => response,
     (error) => {
       if (error.response?.status === 401) {
         // Redirect to login
       }
     }
   )
   ```

## Authentication Flow

### Login Flow
```
User Input (email, password)
        ↓
api.post("/auth/login")
        ↓
Backend validates credentials
        ↓
Returns: { access_token, role, user_id }
        ↓
localStorage.setItem("token", access_token)
localStorage.setItem("role", role)
        ↓
Redirect to /candidate or /recruiter
```

### Token Storage
```ts
// src/app/login/page.tsx
localStorage.setItem("token", access_token)
localStorage.setItem("role", role)
localStorage.setItem("user_id", user_id)
```

## API Endpoints Used

### Authentication
```ts
POST /auth/register        // Create account
POST /auth/login           // Login user
GET /auth/me               // Get current user
```

### Candidate Features
```ts
POST /candidate/resume              // Save resume
GET /candidate/resume               // Get resume
GET /candidate/recommendations      // Get job recommendations
GET /candidate/skill-gaps           // Skill gap analysis
GET /candidate/interview/questions/:jobId   // Interview questions
POST /candidate/interview/submit-answer     // Submit answer
POST /candidate/interview/complete          // Complete interview
POST /candidate/apply                       // Apply to job
GET /candidate/applications         // List applications
```

### Recruiter Features
```ts
POST /recruiter/jobs                // Create job
GET /recruiter/jobs                 // Get recruiter's jobs
GET /recruiter/job/:jobId/applications     // Job applications
GET /recruiter/job/:jobId/recommendations  // Candidate recommendations
```

### Messages
```ts
POST /messages/chat/assistant       // AI chat
GET /messages/inbox                 // List messages
GET /messages/conversation/:userId  // Get conversation
POST /messages/send                 // Send message
GET /messages/unread-count          // Unread count
```

## Supabase Client (`src/lib/supabase.ts`)

### Purpose
- Real-time user authentication
- Direct database access (though not heavily used in this project)
- Session management

### Auth Helpers
```ts
auth.signUp(email, password, role)
auth.signIn(email, password)
auth.signOut()
auth.getUser()
```

## Data Flow Example: Job Search

```
User navigates to /candidate/recommendations
        ↓
useEffect(() => {
  getRecommendations()  // Calls api.get("/candidate/recommendations")
})
        ↓
API Call w/ Token Header
        ↓
Backend returns jobs array
        ↓
setRecommendations(data)
        ↓
Render jobs with JobCard component
```

---

# 6. DEPENDENCY MAP

## NPM Dependencies

```
Frontend Dependencies (package.json):

├── React Ecosystem
│   ├── next@14.1.0                 (Framework)
│   ├── react@18.2.0                (Core)
│   └── react-dom@18.2.0            (DOM binding)
│
├── Styling
│   ├── tailwindcss@3.4.19          (Utility CSS)
│   ├── autoprefixer@10.4.23        (CSS vendor prefixes)
│   └── postcss@8.5.6               (CSS processor)
│
├── HTTP & Auth
│   ├── axios@1.6.5                 (HTTP client)
│   └── @supabase/supabase-js@2.39.3 (Auth + DB)
│
├── Development
│   ├── typescript@5.3.3            (Type safety)
│   ├── @types/react@18.2.48        (React types)
│   ├── @types/node@20.11.5         (Node types)
│   └── @types/react-dom@18.2.18    (DOM types)
```

## Component Dependency Tree

```
src/app/
├── layout.tsx (ROOT)
│   └── All pages inherit
│
├── page.tsx (Home)
│   └── Links to /login, /signup
│
├── login/page.tsx
│   └── Uses: api.login()
│
├── signup/page.tsx
│   └── Uses: api.register()
│
├── candidate/
│   ├── layout.tsx ← Protects routes
│   │   ├── Sidebar (role="candidate")
│   │   ├── ChatAssistant
│   │   └── {children}
│   │
│   ├── page.tsx (dashboard)
│   │   └── Calls: getRecommendations()
│   │
│   ├── resume/page.tsx
│   │   └── Component: ResumeForm
│   │       └── Calls: saveResume()
│   │
│   ├── job/[id]/page.tsx
│   │   └── Displays: JobCard (variant="candidate")
│   │       └── Calls: getSkillGaps(), applyToJob()
│   │
│   ├── interview/[id]/page.tsx
│   │   └── Component: VideoRecorder
│   │       └── Calls: submitInterviewAnswer(), completeInterview()
│   │
│   ├── applications/page.tsx
│   │   └── Calls: getApplications()
│   │
│   ├── recommendations/page.tsx
│   │   └── Calls: getRecommendations()
│   │
│   └── skill-gap/page.tsx
│       └── Calls: getSkillGaps()
│
└── recruiter/
    ├── layout.tsx ← Protects routes
    │   ├── Sidebar (role="recruiter")
    │   ├── ChatAssistant
    │   └── {children}
    │
    ├── page.tsx (dashboard)
    │   └── Calls: getRecruiterJobs()
    │
    └── job/[id]/page.tsx
        └── Calls: getJobApplications(), getCandidateRecommendations()

Shared Components:
├── Sidebar.tsx → Used in candidate/layout.tsx & recruiter/layout.tsx
├── ChatAssistant.tsx → Used in both layouts
├── JobCard.tsx → Used in candidate pages
├── MessagingSystem.tsx → Used in Sidebar
├── ResumeForm.tsx → Used in resume page
└── VideoRecorder.tsx → Used in interview page
```

---

# 7. UI ISSUES IDENTIFIED

## Critical Issues

### 1. **Authentication Flash/Redirect
- **Issue**: Page visible for 1-2 seconds before redirect to login
- **Cause**: Client-side auth check happens after render
- **Impact**: Poor UX, security perception
- **Fix**: Implement server-side middleware protection

### 2. **No Loading States
- **Issue**: Blank page while data loads
- **Cause**: No `loading.tsx` in directory structure
- **Impact**: Looks broken while API calls complete
- **Fix**: Add loading.tsx with Suspense boundaries

### 3. **Missing Error Boundaries
- **Issue**: API errors crash entire page
- **Cause**: No error.tsx files or try-catch wrappers
- **Impact**: User sees blank page on failure
- **Fix**: Create error.tsx for each route

## Design Issues

### 4. **Inconsistent Navigation
- **Issue**: Only sidebar navigation, no mobile menu optimization
- **Cause**: Mobile menu toggle added but UX not fully considered
- **Impact**: Poor mobile UX on small screens
- **Fix**: Redesign for mobile-first approach

### 5. **Limited Color Palette
- **Issue**: Only blue/emerald/slate colors used throughout
- **Cause**: Basic Tailwind theme
- **Impact**: Monotonous UI despite glass morphism
- **Fix**: Expand color scheme with better hierarchy

### 6. **Inconsistent Spacing
- **Issue**: Various padding/margin values (p-4, p-6, p-8)
- **Cause**: No design system tokens
- **Impact**: Unpolished appearance
- **Fix**: Create consistent spacing system

### 7. **Generic Component Styling
- **Issue**: All cards use same `.glass` class
- **Cause**: Limited differentiation in component designs
- **Impact**: All pages look similar
- **Fix**: Create variant-based styling system

### 8. **No Accessibility Features
- **Issue**: Missing ARIA labels, semantic HTML
- **Cause**: Focus on functionality over accessibility
- **Impact**: Not compliant with WCAG
- **Fix**: Add aria-labels, role attributes, keyboard navigation

### 9. **Forms Lack Validation UI
- **Issue**: Error messages shown but input styling inconsistent
- **Cause**: Basic form handling
- **Impact**: Unclear feedback to users
- **Fix**: Consistent error states on inputs

### 10. **No Dark Mode
- **Issue**: Fixed light theme only
- **Cause**: No theme toggle implementation
- **Impact**: High brightness in dark environments
- **Fix**: Add dark mode support

## Component-Specific Issues

### JobCard
- ⚠️ Match percentage badge overlaps text on some screen sizes
- ⚠️ Skills list truncates without indication of more items
- ⚠️ No hover animations for action buttons

### Sidebar
- ⚠️ Sidebar width fixed (w-64) not responsive for tablets
- ⚠️ No indication of active sub-routes
- ⚠️ Mobile menu doesn't auto-close on navigation

### Forms (ResumeForm)
- ⚠️ No auto-save, only manual save
- ⚠️ No confirmation on leaving with unsaved changes
- ⚠️ Large form with no sections/tabs for organization

### ChatAssistant
- ⚠️ Floating widget position fixed, can cover content
- ⚠️ No minimize/collapse option
- ⚠️ Chat history limited, no pagination

---

# 8. SUGGESTED UI ARCHITECTURE

## Design System Foundation

### 1. Color System
```ts
export const colors = {
  // Primary: Blue for CTAs
  primary: {
    50: '#eff6ff',    // Backgrounds
    500: '#3b82f6',   // Buttons
    600: '#2563eb',   // Hover
    700: '#1d4ed8'    // Active
  },
  
  // Secondary: Emerald for success/positive
  secondary: {
    50: '#ecfdf5',
    500: '#10b981',
    600: '#059669'
  },
  
  // Neutral: Slate for text/backgrounds
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    900: '#0f172a'
  },
  
  // Semantic
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6'
}
```

### 2. Component System

Create dedicated component structure:
```
src/components/
├── ui/                     # Base UI components
│   ├── Button.tsx         # Button variants & sizes
│   ├── Card.tsx           # Card wrapper with variants
│   ├── Input.tsx          # Form input wrapper
│   ├── Select.tsx         # Dropdown select
│   ├── Modal.tsx          # Modal dialog
│   ├── Tabs.tsx           # Tab navigation
│   ├── Badge.tsx          # Status/tag badges
│   └── Loading.tsx        # Loading skeletons
│
├── layout/                 # Layout components
│   ├── Header.tsx         # Top navigation
│   ├── Sidebar.tsx        # Refactored navigation
│   ├── Footer.tsx         # Footer (new)
│   └── Container.tsx      # Content wrapper
│
├── features/              # Feature-specific components
│   ├── JobCard.tsx        # Refactored job display
│   ├── ResumeForm.tsx     # Refactored form
│   ├── ChatAssistant.tsx  # Refactored chat
│   ├── MessagingSystem.tsx
│   └── VideoRecorder.tsx
│
└── common/                # Utility components
    ├── Breadcrumb.tsx
    ├── Pagination.tsx
    ├── ConfirmDialog.tsx
    └── NotFound.tsx
```

### 3. Layout System

```ts
// Consistent spacing scale
const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem'    // 48px
}

// Page layout structure
const pageLayout = {
  sidebar: 'w-64',        // Fixed sidebar
  navHeight: 'h-16',      // Top nav
  contentPadding: 'p-6',  // Consistent content padding
  maxWidth: 'max-w-7xl'   // Content max width
}
```

### 4. Typography System

```ts
const typography = {
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-semibold tracking-tight',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  body: 'text-base leading-relaxed',
  small: 'text-sm text-slate-600',
  caption: 'text-xs text-slate-500'
}
```

### 5. Responsive Design Strategy

```ts
// Mobile-first breakpoints
const breakpoints = {
  mobile: '0px',         // Default
  tablet: '768px',       // md:
  desktop: '1024px',     // lg:
  wide: '1280px'         // xl:
}

// Example usage
<div className="
  w-full                 // Mobile
  md:w-1/2               // Tablet
  lg:flex-row            // Desktop
">
```

## Suggested Page Layouts

### Candidate Portal Layout
```
┌─────────────────────────────────────────────┐
│  Sidebar  │        Page Content              │
│  - Nav    │  ┌──────────────────────┐       │
│  - Logo   │  │ Title & Description  │       │
│  - Menu   │  ├──────────────────────┤       │
│  - Chat   │  │ Main Content Area    │       │
│  - Logout │  │                      │       │
│           │  │ (Cards, Forms, etc)  │       │
│           │  └──────────────────────┘       │
└─────────────────────────────────────────────┘
```

### Form Pages (Resume, Profile)
```
┌────────────────────────────────────────┐
│ Title                                  │
├────────────────────────────────────────┤
│ Tab 1  │ Tab 2  │ Tab 3              │
├────────────────────────────────────────┤
│ Form Section 1                         │
│ ├─ Input field                        │
│ ├─ Input field                        │
│ └─ Action buttons                     │
│                                        │
│ Form Section 2                         │
│ ├─ Input field                        │
│ └─ Action buttons                     │
└────────────────────────────────────────┘
```

---

# 9. COMPONENT REDESIGN PRIORITY

## Priority Tier 1: Foundation (Week 1)
These components are used on every page and affect overall look/feel.

### 1. **Sidebar Navigation** 🔴 CRITICAL
- **Current Issues**
  - Fixed width not responsive
  - Mobile menu UX poor
  - No active state indication
  - Limited visual hierarchy
  
- **Suggested Improvements**
  - Responsive width (sm: collapsed, md: sidebar, lg: full)
  - Better mobile menu with overlay
  - Active route highlighting
  - Icon-only collapsed mode option
  - Groupednavigation sections (Profile, Features, Settings)
  
- **Time Estimate**: 4-6 hours
- **Impact**: Affects all pages

### 2. **Global Layout & Root** 🔴 CRITICAL
- **Current Issues**
  - Inconsistent spacing between pages
  - No consistent page padding/margins
  - Flash of unstyled content
  
- **Suggested Improvements**
  - Consistent page wrapper component
  - Unified spacing system
  - Loading skeleton matching layout
  - Better mobile responsive design
  
- **Time Estimate**: 3-4 hours
- **Impact**: All pages

### 3. **JobCard Component** 🟠 HIGH
- **Current Issues**
  - Not optimized for different contexts
  - Badge positioning causes text overlap
  - No clear CTA (button)
  
- **Suggested Improvements**
  - Separate variants (compact, expanded, recruiter, candidate)
  - Better skill display (chips with scroll or limit)
  - Clear action buttons per role
  - Improved metadata display
  
- **Time Estimate**: 3-4 hours
- **Impact**: Used widely in candidate/recruiter pages

### 4. **Button System** 🟠 HIGH
- **Current Issues**
  - Inline button styling throughout pages
  - No consistent sizes/variants
  - No button component abstraction
  
- **Suggested Improvements**
  - Create `Button.tsx` component
  - Variants: primary, secondary, ghost, danger
  - Sizes: sm, md, lg
  - Icons + loading states
  
- **Time Estimate**: 2-3 hours
- **Impact**: Used in every form/page

## Priority Tier 2: Forms & Input (Week 2)

### 5. **ResumeForm.tsx**
- **Improvements**: Tab organization, auto-save, better validation UI
- **Time**: 5-6 hours

### 6. **Form Inputs Component**
- **Create**: Wrapper component with error states
- **Time**: 2-3 hours

### 7. **Login/Signup Pages**
- **Improvements**: Better visual design, error handling, password strength indicator
- **Time**: 3-4 hours

## Priority Tier 3: Feature Pages (Week 3)

### 8. **Dashboard Pages**
- Candidate dashboard → Better layout with widgets/cards
- Recruiter dashboard → Analytics view improvement
- **Time**: 4-5 hours each

### 9. **Chat & Messaging**
- ChatAssistant redesign (floating widget improvements)
- MessagingSystem UI enhancement
- **Time**: 4-5 hours

### 10. **Details Pages** (Job, Interview, Applications)
- Improve information architecture
- Better visual hierarchy
- **Time**: 3-4 hours each

---

## Recommended Redesign Sequence

```
WEEK 1 - FOUNDATION
├─ Day 1-2: Create Button, Card, Input base components
├─ Day 3-4: Redesign Sidebar navigation
├─ Day 5: Root layout & globals.css updates

WEEK 2 - CORE PAGES
├─ Day 1-2: Login/Signup redesign
├─ Day 3-4: ResumeForm improvements
├─ Day 5: Dashboard pages

WEEK 3 - FEATURES
├─ Day 1-2: Feature pages (job details, etc)
├─ Day 3-4: Chat & Messaging UI
├─ Day 5: Testing & polish
```

---

# 10. KEY FILES SUMMARY

## Most Important Files (Modify First)

| Priority | File | Impact | Difficulty |
|----------|------|--------|------------|
| 🔴 1 | `src/components/Sidebar.tsx` | Changes all navigation | Medium |
| 🔴 2 | `src/app/globals.css` | Changes all styling | Easy |
| 🔴 3 | `tailwind.config.js` | Changes theme/colors | Easy |
| 🔴 4 | `src/app/layout.tsx` | Root layout structure | Medium |
| 🟠 5 | `src/components/JobCard.tsx` | Affects all job displays | Medium |
| 🟠 6 | `src/components/Button.tsx` (NEW) | Standardizes buttons | Medium |
| 🟡 7 | `src/app/login/page.tsx` | First user impression | Medium |
| 🟡 8 | `src/app/candidate/layout.tsx` | Candidate portal layout | Medium |

## Files NEVER to Modify

```
❌ src/lib/api.ts              (API endpoints)
❌ src/lib/supabase.ts         (Auth logic)
❌ src/middleware.ts           (Route protection - unless enabling)
❌ package.json                (Dependencies)
```

---

# FINAL RECOMMENDATIONS

## Quick Wins (Can do immediately)
1. ✅ Update `tailwind.config.js` with expanded color palette
2. ✅ Improve `globals.css` with better defaults
3. ✅ Add basic `Button.tsx` component
4. ✅ Fix Sidebar responsiveness

## Medium-term (1-2 weeks)
1. ⚠️ Create UI component library (Button, Card, Input, Modal)
2. ⚠️ Redesign Sidebar and main layouts
3. ⚠️ Improve form pages (Resume, Profile)

## Long-term (3+ weeks)
1. 🔵 Implement dark mode
2. 🔵 Add accessibility features
3. 🔵 Create loading skeletons for all pages
4. 🔵 Add error boundaries and error pages

## Architecture Improvements
1. Enable middleware.ts for server-side auth
2. Create loading.tsx files for all routes
3. Create error.tsx files for error handling
4. Add data validation and error messages
5. Implement proper TypeScript types

---

**End of Frontend Architecture Analysis**

Generated: March 12, 2026  
Last Updated: March 12, 2026
