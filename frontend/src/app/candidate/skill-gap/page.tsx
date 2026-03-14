'use client'

import { useEffect, useState } from 'react'
import { getRecommendations, getSkillGaps } from '@/lib/api'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import GlassPanel from '@/components/ui/GlassPanel'
import Card from '@/components/ui/Card'
import { BookOpen, Target, CheckCircle, TrendingUp } from 'lucide-react'

export default function SkillGapAnalysisPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [selectedJob, setSelectedJob] = useState<string>('')
  const [skillGapData, setSkillGapData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await getRecommendations()
      console.log("📚 Fetched skill gap jobs:", response.data)
      const jobsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.recommendations || [])
      console.log("✅ Jobs for skill gap analysis:", jobsData)
      setJobs(jobsData)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  const analyzeSkillGap = async (jobId: string) => {
    setLoading(true)
    setSelectedJob(jobId)
    try {
      const response = await getSkillGaps(jobId)
      setSkillGapData(response.data)
    } catch (error) {
      console.error('Failed to analyze skill gap:', error)
      alert('Failed to analyze skill gap. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Skill Gap Analysis</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Compare your skills with job requirements and get personalized learning recommendations
        </p>

        {/* Job Selection */}
        <GlassPanel className="rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Select a Job to Analyze</h2>
          {initialLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-12 bg-slate-200 rounded-lg" />
              <div className="h-12 bg-slate-200 rounded-lg" />
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid gap-3">
              {jobs.map((job) => (
                <button
                  key={job.id || job.job_id}
                  onClick={() => analyzeSkillGap(job.id || job.job_id)}
                  disabled={loading}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedJob === (job.id || job.job_id)
                      ? 'border-purple-500 bg-purple-100'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  } disabled:opacity-50`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{job.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {job.company || 'Company'} • {job.location}
                      </p>
                    </div>
                    {job.match_score && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-300">
                        {Math.round(job.match_score)}% Match
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-300 mb-4">No job recommendations available yet.</p>
              <Link href="/candidate/resume">
                <Button>Complete Your Resume</Button>
              </Link>
            </div>
          )}
        </GlassPanel>

        {/* Loading State */}
        {loading && (
          <GlassPanel className="rounded-2xl p-8 flex items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
            <span className="text-slate-700 dark:text-slate-300">Analyzing your skills...</span>
          </GlassPanel>
        )}

        {/* Skill Gap Results */}
        {skillGapData && !loading && (
          <div className="space-y-6">
            {/* Match Score */}
            <GlassPanel className="rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Overall Match Score
              </h2>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-white/10"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - (skillGapData.match_score || 0) / 100)}`}
                      className="text-purple-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {Math.round(skillGapData.match_score || 0)}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-lg text-slate-700 dark:text-slate-300">
                    {skillGapData.match_score >= 80
                      ? '🎉 Excellent match! You have most of the required skills.'
                      : skillGapData.match_score >= 60
                      ? '👍 Good match! A few skills to improve.'
                      : '📚 Learning opportunity! Focus on the missing skills below.'}
                  </p>
                </div>
              </div>
            </GlassPanel>

            {/* Matching Skills */}
            {skillGapData.matching_skills?.length > 0 && (
              <GlassPanel className="rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Skills You Have
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skillGapData.matching_skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm font-medium border border-emerald-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </GlassPanel>
            )}

            {/* Missing Skills */}
            {skillGapData.missing_skills?.length > 0 && (
              <GlassPanel className="rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Skills to Learn
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skillGapData.missing_skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="bg-purple-100/50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-300 dark:border-purple-700">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    💡 <strong>Tip:</strong> Focus on learning these skills to increase your match score!
                  </p>
                </div>
              </GlassPanel>
            )}

            {/* AI Course Recommendations */}
            {skillGapData.recommendations && skillGapData.recommendations.length > 0 && (
              <GlassPanel className="rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  AI-Recommended Free Courses
                </h2>
                
                {skillGapData.recommendations.map((item: any, skillIdx: number) => (
                  <div key={skillIdx} className="mb-8 last:mb-0">
                    {/* Skill Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold text-lg border border-purple-300">
                        {item.skill}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {item.courses?.length || 0} free resources
                      </span>
                    </div>

                    {/* Courses for this skill */}
                    <div className="grid gap-4">
                      {(item.courses || []).map((course: any, courseIdx: number) => (
                        <Card key={courseIdx} className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                          <div className="flex items-start justify-between gap-6">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-slate-900 mb-2">
                                {course.title}
                              </h3>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                                  📚 {course.provider}
                                </span>
                                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                                  ⏱️ {course.duration}
                                </span>
                                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                                  📊 {course.level}
                                </span>
                              </div>

                              {course.why_relevant && (
                                <p className="text-sm text-slate-600 italic">
                                  💡 {course.why_relevant}
                                </p>
                              )}
                            </div>

                            <a
                              href={course.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all text-sm font-bold whitespace-nowrap"
                            >
                              Start Learning →
                            </a>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="mt-6 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-xl p-5 border border-emerald-300 dark:border-emerald-700">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">🤖 AI-Powered Recommendations</span> - 
                    These courses were specifically selected based on your resume and the job description. 
                    All resources are <span className="font-bold text-emerald-700 dark:text-emerald-400">100% FREE</span>!
                  </p>
                </div>
              </GlassPanel>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link href="/candidate/resume">
                <Button variant="secondary">Update Resume</Button>
              </Link>
              <Link href={`/candidate/job/${selectedJob}`}>
                <Button>View Job Details</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 'use client'

// import { useEffect, useState } from 'react'
// import { getRecommendations, getSkillGaps } from '@/lib/api'
// import Link from 'next/link'

// export default function SkillGapAnalysisPage() {
//   const [jobs, setJobs] = useState<any[]>([])
//   const [selectedJob, setSelectedJob] = useState<string>('')
//   const [skillGapData, setSkillGapData] = useState<any>(null)
//   const [loading, setLoading] = useState(false)
//   const [initialLoading, setInitialLoading] = useState(true)

//   useEffect(() => {
//     fetchJobs()
//   }, [])

//   const fetchJobs = async () => {
//     try {
//       const response = await getRecommendations()
//       // Handle both array and object responses
//       const jobsData = Array.isArray(response.data) 
//         ? response.data 
//         : (response.data?.recommendations || [])
      
//       setJobs(jobsData)
//     } catch (error) {
//       console.error('Failed to fetch jobs:', error)
//     } finally {
//       setInitialLoading(false)
//     }
//   }

//   const analyzeSkillGap = async (jobId: string) => {
//     setLoading(true)
//     setSelectedJob(jobId)
//     try {
//       const response = await getSkillGaps(jobId)
//       setSkillGapData(response.data)
//     } catch (error) {
//       console.error('Failed to analyze skill gap:', error)
//       alert('Failed to analyze skill gap. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="p-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-slate-900 mb-2">Skill Gap Analysis</h1>
//         <p className="text-slate-600 mb-8">
//           Compare your skills with job requirements and get personalized learning recommendations
//         </p>

//         {/* Job Selection */}
//         <div className="glass rounded-2xl p-6 mb-6">
//           <h2 className="text-xl font-semibold text-slate-900 mb-4">Select a Job to Analyze</h2>
//           {initialLoading ? (
//             <div className="animate-pulse">
//               <div className="h-12 bg-slate-200 rounded-lg mb-3" />
//               <div className="h-12 bg-slate-200 rounded-lg" />
//             </div>
//           ) : jobs.length > 0 ? (
//             <div className="grid gap-3">
//               {jobs.map((job) => (
//                 <button
//                   key={job.id || job.job_id}
//                   onClick={() => analyzeSkillGap(job.id || job.job_id)}
//                   disabled={loading}
//                   className={`p-4 rounded-xl border-2 text-left transition-all ${
//                     selectedJob === (job.id || job.job_id)
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-slate-200 hover:border-blue-300 bg-white'
//                   } disabled:opacity-50`}
//                 >
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="font-semibold text-slate-900">{job.title}</h3>
//                       <p className="text-sm text-slate-600">
//                         {job.company || 'Company'} • {job.location}
//                       </p>
//                     </div>
//                     {job.match_score && (
//                       <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
//                         {job.match_score}% Match
//                       </span>
//                     )}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <p className="text-slate-600 mb-4">No job recommendations available yet.</p>
//               <Link
//                 href="/candidate/resume"
//                 className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Complete Your Resume
//               </Link>
//             </div>
//           )}
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="glass rounded-2xl p-8">
//             <div className="flex items-center justify-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
//               <span className="ml-4 text-slate-600">Analyzing your skills...</span>
//             </div>
//           </div>
//         )}

//         {/* Skill Gap Results */}
//         {skillGapData && !loading && (
//           <div className="space-y-6">
//             {/* Match Score */}
//             <div className="glass rounded-2xl p-6">
//               <h2 className="text-xl font-semibold text-slate-900 mb-4">Overall Match Score</h2>
//               <div className="flex items-center gap-6">
//                 <div className="relative w-32 h-32">
//                   <svg className="transform -rotate-90 w-32 h-32">
//                     <circle
//                       cx="64"
//                       cy="64"
//                       r="56"
//                       stroke="currentColor"
//                       strokeWidth="12"
//                       fill="transparent"
//                       className="text-slate-200"
//                     />
//                     <circle
//                       cx="64"
//                       cy="64"
//                       r="56"
//                       stroke="currentColor"
//                       strokeWidth="12"
//                       fill="transparent"
//                       strokeDasharray={`${2 * Math.PI * 56}`}
//                       strokeDashoffset={`${2 * Math.PI * 56 * (1 - (skillGapData.match_score || 0) / 100)}`}
//                       className="text-blue-600 transition-all duration-1000"
//                     />
//                   </svg>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <span className="text-3xl font-bold text-slate-900">
//                       {skillGapData.match_score || 0}%
//                     </span>
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-lg text-slate-700">
//                     {skillGapData.match_score >= 80
//                       ? '🎉 Excellent match! You have most of the required skills.'
//                       : skillGapData.match_score >= 60
//                       ? '👍 Good match! A few skills to improve.'
//                       : '📚 Learning opportunity! Focus on the missing skills below.'}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Matching Skills */}
//             {skillGapData.matching_skills?.length > 0 && (
//               <div className="glass rounded-2xl p-6">
//                 <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
//                   <span className="text-2xl">✅</span>
//                   Skills You Have
//                 </h2>
//                 <div className="flex flex-wrap gap-2">
//                   {skillGapData.matching_skills.map((skill: string, idx: number) => (
//                     <span
//                       key={idx}
//                       className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Missing Skills */}
//             {skillGapData.missing_skills?.length > 0 && (
//               <div className="glass rounded-2xl p-6">
//                 <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
//                   <span className="text-2xl">📖</span>
//                   Skills to Learn
//                 </h2>
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {skillGapData.missing_skills.map((skill: string, idx: number) => (
//                     <span
//                       key={idx}
//                       className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//                 <div className="bg-blue-50 rounded-xl p-4">
//                   <p className="text-sm text-blue-900">
//                     💡 <strong>Tip:</strong> Focus on learning these skills to increase your match score
//                     and improve your chances of getting hired!
//                   </p>
//                 </div>
//               </div>
//             )}
//             {/* AI-Powered Course Recommendations */}
// {skillGapData.recommendations && skillGapData.recommendations.length > 0 && (
//   <div className="glass rounded-2xl p-6">
//     <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
//       <span className="text-2xl">🎓</span>
//       AI-Recommended Free Courses
//     </h2>
    
//     {skillGapData.recommendations.map((item: any, skillIdx: number) => (
//       <div key={skillIdx} className="mb-8 last:mb-0">
//         {/* Skill Header */}
//         <div className="flex items-center gap-2 mb-4">
//           <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold">
//             {item.skill}
//           </span>
//           <span className="text-sm text-slate-600">
//             {item.courses?.length || 0} free resources
//           </span>
//         </div>

//         {/* Courses for this skill */}
//         <div className="grid gap-3">
//           {(item.courses || []).map((course: any, courseIdx: number) => (
//             <div
//               key={courseIdx}
//               className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-purple-200 hover:shadow-md transition-all"
//             >
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex-1">
//                   {/* Course Title */}
//                   <h3 className="font-semibold text-slate-900 mb-1">
//                     {course.title}
//                   </h3>
                  
//                   {/* Provider & Duration */}
//                   <div className="flex flex-wrap gap-2 mb-2">
//                     <span className="px-2 py-1 bg-white text-blue-700 rounded text-xs font-medium">
//                       📚 {course.provider}
//                     </span>
//                     <span className="px-2 py-1 bg-white text-emerald-700 rounded text-xs font-medium">
//                       ⏱️ {course.duration}
//                     </span>
//                     <span className="px-2 py-1 bg-white text-purple-700 rounded text-xs font-medium">
//                       📊 {course.level}
//                     </span>
//                   </div>

//                   {/* Why Relevant */}
//                   {course.why_relevant && (
//                     <p className="text-sm text-slate-600 italic mb-2">
//                       💡 {course.why_relevant}
//                     </p>
//                   )}
//                 </div>

//                 {/* CTA Button */}
//                 <a
//                   href={course.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-semibold whitespace-nowrap shadow-sm hover:shadow-md"
//                 >
//                   Start Learning →
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     ))}

//     {/* Footer Message */}
//     <div className="mt-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 border border-emerald-200">
//       <p className="text-sm text-slate-900">
//         <span className="font-bold">🤖 AI-Powered Recommendations</span> - 
//         These courses were specifically selected based on your resume and the job description. 
//         All resources are <span className="font-semibold text-emerald-700">100% FREE</span>!
//       </p>
//     </div>
//   </div>
// )}
//             {/* Free Course Recommendations */}
//             {skillGapData.recommendations?.length > 0 && (
//               <div className="glass rounded-2xl p-6">
//                 <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
//                   <span className="text-2xl">🎓</span>
//                   Free Courses to Bridge the Gap
//                 </h2>
//                 <div className="grid gap-4">
//                   {skillGapData.recommendations.map((course: any, idx: number) => (
//                     <div
//                       key={idx}
//                       className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200 hover:shadow-lg transition-shadow"
//                     >
//                       <div className="flex items-start justify-between gap-4">
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-slate-900 mb-1">{course.title}</h3>
//                           <p className="text-sm text-slate-600 mb-2">
//                             {course.provider || 'Online Course'}
//                           </p>
//                           <div className="flex flex-wrap gap-2 mb-3">
//                             {course.skills?.map((skill: string, skillIdx: number) => (
//                               <span
//                                 key={skillIdx}
//                                 className="px-2 py-1 bg-white text-purple-700 rounded text-xs font-medium"
//                               >
//                                 {skill}
//                               </span>
//                             ))}
//                           </div>
//                           {course.duration && (
//                             <p className="text-xs text-slate-500">
//                               ⏱️ Duration: {course.duration}
//                             </p>
//                           )}
//                         </div>
//                         <a
//                           href={course.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold whitespace-nowrap"
//                         >
//                           Start Learning →
//                         </a>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-6 bg-emerald-50 rounded-xl p-4">
//                   <p className="text-sm text-emerald-900">
//                     🎯 <strong>All courses are FREE!</strong> Complete these courses to add new skills
//                     to your resume and improve your job match score.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex gap-4">
//               <Link
//                 href="/candidate/resume"
//                 className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
//               >
//                 Update Resume
//               </Link>
//               <Link
//                 href={`/candidate/job/${selectedJob}`}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 View Job Details
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Empty State */}
//         {!skillGapData && !loading && !initialLoading && (
//           <div className="glass rounded-2xl p-12 text-center">
//             <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg
//                 className="w-10 h-10 text-blue-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-slate-900 mb-2">
//               Select a job to start analysis
//             </h3>
//             <p className="text-slate-600">
//               Choose a job posting above to see how your skills match and get personalized course recommendations
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }