// import axios from "axios"

// const API_URL = "http://127.0.0.1:8000"

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// // ================================
// // Attach JWT token automatically
// // ================================
// api.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("token")
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//   }
//   return config
// })

// // ================================
// // AUTH
// // ================================
// export const register = (email: string, password: string, role: string) =>
//   api.post("/auth/register", { email, password, role })

// export const login = (email: string, password: string) =>
//   api.post("/auth/login", { email, password })

// export const getMe = () =>
//   api.get("/auth/me")

// // ================================
// // CANDIDATE
// // ================================
// export const saveResume = (resumeData: any) =>
//   api.post("/candidate/resume", resumeData)

// export const getResume = () =>
//   api.get("/candidate/resume")

// export const getRecommendations = () =>
//   api.get("/candidate/recommendations")

// export const getSkillGaps = (jobId: string) =>
//   api.get(`/candidate/skill-gaps?job_id=${jobId}`)

// // export const getInterviewQuestions = (jobId: string) =>
// //   api.get(`/candidate/interview-questions?job_id=${jobId}`)

// // Interview endpoints
// export const getInterviewQuestions = async (jobId: string) => {
//   return api.get(`/candidate/interview/questions/${jobId}`)
// }

// export const submitInterviewAnswer = async (data: {
//   question: string
//   answer: string
//   questionType: string
// }) => {
//   return api.post('/candidate/interview/submit-answer', data)
// }

// export const completeInterview = async (data: {
//   job_id: string
//   answers: any[]
//   overall_score: number
// }) => {
//   return api.post('/candidate/interview/complete', data)
// }
// // export const applyToJob = (jobId: string) =>
// //   api.post("/candidate/apply", { job_id: jobId })

// // ✅ Upload interview (video/audio/transcript)
// export const uploadInterview = (formData: FormData) =>
//   api.post("/candidate/interview/upload", formData, {
//     headers: { "Content-Type": "multipart/form-data" }
//   })

// export const getInterviewResult = (applicationId: string) =>
//   api.get(`/candidate/interview/result?application_id=${applicationId}`)

// export const applyToJob = async (jobId: string) => {
//   return api.post(`/candidate/apply?job_id=${jobId}`)
// }

// export const getApplications = async () => {
//   return api.get('/candidate/applications')
// }
// // ================================
// // RECRUITER
// // ================================
// export const createJob = (jobData: any) =>
//   api.post("/recruiter/jobs", jobData)

// export const getRecruiterJobs = () =>
//   api.get("/recruiter/jobs")

// export const getJobApplications = (jobId: string) =>
//   api.get(`/recruiter/job/${jobId}/applications`)

// export const getCandidateRecommendations = (
//   jobId: string,
//   topN: number = 5
// ) =>
//   api.get(`/recruiter/job/${jobId}/recommendations?top_n=${topN}`)

// export default api
import axios from "axios"

const API_URL = "http://127.0.0.1:8000"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// ================================
// Attach JWT token automatically
// ================================
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log(`🔑 Token attached to ${config.method?.toUpperCase()} ${config.url}`)
      } else {
        console.warn(`⚠️ No token found for ${config.method?.toUpperCase()} ${config.url}`)
      }
    }
    return config
  },
  (error) => {
    console.error("❌ Request interceptor error:", error)
    return Promise.reject(error)
  }
)

// ================================
// Response interceptor for errors
// ================================
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`)
    return response
  },
  (error) => {
    if (error.response) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response.status}`)
      console.error("Error details:", error.response.data)
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        console.error("🚫 Unauthorized - clearing token and redirecting to login")
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          localStorage.removeItem("role")
          window.location.href = "/login"
        }
      }
      
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error("🚫 Forbidden - insufficient permissions")
        alert("Access denied: " + (error.response.data.detail || "Insufficient permissions"))
      }
    } else {
      console.error("❌ Network error:", error.message)
    }
    return Promise.reject(error)
  }
)

// ================================
// AUTH
// ================================
export const register = (email: string, password: string, role: string, name?: string) =>
  api.post("/auth/register", { email, password, role, name })

export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password })

export const getMe = () =>
  api.get("/auth/me")

// ================================
// CANDIDATE
// ================================
export const saveResume = (resumeData: any) =>
  api.post("/candidate/resume", resumeData)

export const getResume = () =>
  api.get("/candidate/resume")

export const getRecommendations = () =>
  api.get("/candidate/recommendations")

export const getSkillGaps = (jobId: string) =>
  api.get(`/candidate/skill-gaps?job_id=${jobId}`)

export const getInterviewQuestions = async (jobId: string) => {
  return api.get(`/candidate/interview/questions/${jobId}`)
}

export const submitInterviewAnswer = async (data: {
  question: string
  answer: string
  questionType: string
}) => {
  return api.post('/candidate/interview/submit-answer', data)
}

export const completeInterview = async (data: {
  job_id: string
  answers: any[]
  overall_score: number
}) => {
  return api.post('/candidate/interview/complete', data)
}

export const uploadInterview = (formData: FormData) =>
  api.post("/candidate/interview/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })

export const getInterviewResult = (applicationId: string) =>
  api.get(`/candidate/interview/result?application_id=${applicationId}`)

export const applyToJob = async (jobId: string) => {
  return api.post(`/candidate/apply?job_id=${jobId}`)
}

export const getApplications = async () => {
  return api.get('/candidate/applications')
}

// ================================
// RECRUITER
// ================================
export const createJob = (jobData: any) => {
  console.log("📤 Creating job:", jobData)
  return api.post("/recruiter/jobs", jobData)
}

export const getRecruiterJobs = () => {
  console.log("📤 Fetching recruiter jobs")
  return api.get("/recruiter/jobs")
}

export const getJobApplications = (jobId: string) => {
  console.log("📤 Fetching applications for job:", jobId)
  return api.get(`/recruiter/job/${jobId}/applications`)
}

export const getCandidateRecommendations = (
  jobId: string,
  topN: number = 5
) => {
  console.log("📤 Fetching recommendations for job:", jobId)
  return api.get(`/recruiter/job/${jobId}/recommendations?top_n=${topN}`)
}

// ================================
// CHAT & AI ASSISTANT
// ================================
export const chatWithAssistant = (message: string, conversationHistory: any[] = []) => {
  console.log("💬 Sending chat message to AI assistant")
  return api.post("/messages/chat/assistant", {
    message,
    conversation_history: conversationHistory
  })
}

export default api