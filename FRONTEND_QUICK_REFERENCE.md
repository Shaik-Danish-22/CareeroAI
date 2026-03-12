# 🎨 CareeroAI Frontend - Quick Reference Guide

## ✅ Safe to Modify (UI Only)

### Pages & Layouts
```
All page.tsx files in /app
All layout.tsx files (keep auth logic)
src/app/globals.css
src/app/*/page.tsx
```

### Components  
```
src/components/Sidebar.tsx ⭐ PRIORITY
src/components/JobCard.tsx ⭐ PRIORITY
src/components/ChatAssistant.tsx
src/components/ResumeForm.tsx
src/components/MessagingSystem.tsx
src/components/VideoRecorder.tsx
```

### Config
```
tailwind.config.js ⭐ PRIORITY
postcss.config.js
```

---

## ❌ DO NOT MODIFY

```
src/lib/api.ts                (Backend communication)
src/lib/supabase.ts           (Authentication)
backend/ folder               (All backend files)
database/ folder              (Database schema)
package.json                  (Unless adding packages)
```

---

## 🔴 CRITICAL ISSUES TO FIX

1. **Sidebar Navigation** - Not responsive to tablets
2. **Auth Flash** - Page visible before redirect
3. **No Loading States** - Blank pages during data load
4. **Inconsistent Styling** - No design system
5. **No Error Boundaries** - API errors crash pages

---

## 📊 Frontend Tech Stack

- **Framework**: Next.js 14.1
- **UI Library**: React 18.2
- **Styling**: Tailwind CSS 3.4
- **HTTP Client**: Axios 1.6
- **Auth**: Supabase 2.39

---

## 🚀 Component Redesign Priority

### WEEK 1 - FOUNDATION
- [ ] Create Button component
- [ ] Create Card component  
- [ ] Redesign Sidebar
- [ ] Update globals.css

### WEEK 2 - FORMS
- [ ] Redesign Login/Signup
- [ ] Redesign ResumeForm
- [ ] Create Input component

### WEEK 3 - FEATURES
- [ ] Dashboard pages
- [ ] Feature pages
- [ ] Chat & Messaging

---

## 📁 File Safe to Modify Checklist

### Pages
- [ ] `src/app/page.tsx` (Home)
- [ ] `src/app/login/page.tsx`
- [ ] `src/app/signup/page.tsx`
- [ ] `src/app/candidate/page.tsx`
- [ ] `src/app/candidate/profile/page.tsx`
- [ ] `src/app/candidate/resume/page.tsx`
- [ ] `src/app/candidate/job/[id]/page.tsx`
- [ ] `src/app/candidate/interview/[id]/page.tsx`
- [ ] `src/app/candidate/applications/page.tsx`
- [ ] `src/app/candidate/recommendations/page.tsx`
- [ ] `src/app/candidate/skill-gap/page.tsx`
- [ ] `src/app/recruiter/page.tsx`
- [ ] `src/app/recruiter/job/[id]/page.tsx`

### Layouts
- [ ] `src/app/layout.tsx`
- [ ] `src/app/candidate/layout.tsx` (keep auth, redesign UI)
- [ ] `src/app/recruiter/layout.tsx` (keep auth, redesign UI)

### Components
- [ ] `src/components/Sidebar.tsx`
- [ ] `src/components/JobCard.tsx`
- [ ] `src/components/ChatAssistant.tsx`
- [ ] `src/components/ResumeForm.tsx`
- [ ] `src/components/MessagingSystem.tsx`
- [ ] `src/components/VideoRecorder.tsx`

### Styling
- [ ] `src/app/globals.css`
- [ ] `tailwind.config.js`
- [ ] `postcss.config.js`

---

## 🔗 Frontend-Backend Communication

```
Component (useEffect)
    ↓
api.get/post(...) [src/lib/api.ts]
    ↓ (Auto-attaches JWT token)
Backend API (8000)
    ↓
Database (Supabase)
    ↓ (Response)
Component setState
    ↓
Render UI
```

### Token Management
```ts
localStorage.getItem("token")           // Get JWT
localStorage.setItem("token", value)    // Set JWT
localStorage.getItem("role")            // Get user role
```

---

## 🎯 Suggested Component Structure

Create new `/src/components/ui/` folder:
```
ui/
├── Button.tsx        (Primary, Secondary, Ghost, Danger)
├── Card.tsx          (Card wrapper with variants)
├── Input.tsx         (Form input with error state)
├── Select.tsx        (Dropdown select)
├── Modal.tsx         (Modal dialog)
├── Badge.tsx         (Status/tag badges)
└── Loading.tsx       (Loading skeletons)
```

---

## 🚨 Top 3 Routing Issues

1. **Client-side Auth Only** ⚠️
   - Page visible before auth check
   - Fix: Enable middleware.ts for server-side checks

2. **No Loading States** ⚠️
   - Blank page while API loads
   - Fix: Add loading.tsx files

3. **Missing Error Boundaries** ⚠️
   - API errors crash page
   - Fix: Add error.tsx files, try-catch blocks

---

## 📞 Quick API Reference

**Base URL**: `http://127.0.0.1:8000`

### Auth
```
POST /auth/register
POST /auth/login
GET /auth/me
```

### Candidate
```
GET /candidate/recommendations
POST /candidate/resume
GET /candidate/skill-gaps?job_id=...
GET /candidate/interview/questions/:jobId
POST /candidate/apply?job_id=...
```

### Recruiter
```
GET /recruiter/jobs
POST /recruiter/jobs
GET /recruiter/job/:jobId/applications
```

### Messages
```
POST /messages/chat/assistant
GET /messages/inbox
GET /messages/conversation/:userId
```

---

## 💡 Design System Foundation

### Colors
```
Primary (Blue):    #2563eb
Success (Green):   #10b981
Warning (Amber):   #f59e0b
Danger (Red):      #ef4444
Neutral (Slate):   #0f172a
```

### Spacing Scale (Tailwind)
```
xs: 4px    (p-1)
sm: 8px    (p-2)
md: 16px   (p-4)
lg: 24px   (p-6)
xl: 32px   (p-8)
```

### Typography
```
H1: text-4xl font-bold
H2: text-3xl font-semibold
H3: text-2xl font-semibold
Body: text-base leading-relaxed
Small: text-sm text-slate-600
```

---

## 📝 Development Workflow

### To start development:
```bash
cd frontend
npm install
npm run dev
```

### Building:
```bash
npm run build
npm start
```

### Linting:
```bash
npm run lint
```

---

## 🎓 Learning Resources

### Useful Files to Review
1. `src/app/login/page.tsx` - Basic page structure
2. `src/components/JobCard.tsx` - Component structure
3. `src/lib/api.ts` - API communication
4. `tailwind.config.js` - Theme customization

### Testing Route Changes
1. Go to `/candidate/*` → Should redirect if not logged in
2. Go to `/recruiter/*` → Should redirect if role !== recruiter
3. Check console for API calls and token validation

---

## ✨ Next Steps

1. **Copy** full analysis: `FRONTEND_ARCHITECTURE_ANALYSIS.md`
2. **Review** Tier 1 components (Sidebar, Layout, Buttons)
3. **Create** new UI component library in /ui folder
4. **Update** tailwind.config.js with better colors
5. **Redesign** Sidebar as first major component
6. **Test** all changes don't break API communication

---

**Document generated**: March 12, 2026  
**For**: CareeroAI Frontend UI Redesign  
**Author**: Frontend Analysis System
