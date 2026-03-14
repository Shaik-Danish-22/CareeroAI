// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { getRecommendations } from '@/lib/api'

// export default function RecommendationsPage() {

//   const [mounted, setMounted] = useState(false)
//   const [recommendations, setRecommendations] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   const router = useRouter()

//   // ------------------------------------
//   // LOAD ON MOUNT
//   // ------------------------------------
//   useEffect(() => {
//     setMounted(true)
//     load()
//   }, [])

//   // ------------------------------------
//   // FETCH RECOMMENDATIONS
//   // ------------------------------------
//   const load = async () => {
//     try {
//       const res = await getRecommendations()

//       // Backend may return:
//       // []  OR  { recommendations: [] }
//       const data = Array.isArray(res.data)
//         ? res.data
//         : res.data?.recommendations || []

//       setRecommendations(data)
//     } catch (err) {
//       console.error('Failed to fetch recommendations:', err)
//       setRecommendations([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ------------------------------------
//   // PREVENT HYDRATION ISSUE
//   // ------------------------------------
//   if (!mounted) {
//     return <div className="h-screen bg-slate-50 animate-pulse" />
//   }

//   // ------------------------------------
//   // LOADING STATE
//   // ------------------------------------
//   if (loading) {
//     return <p className="p-10">Loading...</p>
//   }

//   // ------------------------------------
//   // EMPTY STATE
//   // ------------------------------------
//   if (recommendations.length === 0) {
//     return (
//       <div className="p-10 text-center">
//         <p>No recommendations yet.</p>

//         <button
//           onClick={() => router.push('/candidate/resume')}
//           className="bg-blue-600 text-white px-5 py-2 rounded mt-4"
//         >
//           Complete Resume
//         </button>
//       </div>
//     )
//   }

//   // ------------------------------------
//   // LIST
//   // ------------------------------------
//   return (
//     <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//       {recommendations.map((job) => (

//         <div
//           key={job.id || job.job_id}
//           className="glass p-6 rounded-xl hover:shadow-xl transition-all relative"
//         >

//           {/* MATCH BADGE */}
//           <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-bold">
//             {job.match_score || job.match_percentage || 0}% Match
//           </div>

//           {/* TITLE */}
//           <h2 className="text-xl font-bold mb-2 pr-16">
//             {job.title}
//           </h2>

//           {/* LOCATION */}
//           <p className="mb-2">
//             {job.location || 'Remote'}
//           </p>

//           {/* SKILLS */}
//           {job.skills?.length > 0 && (
//             <div className="flex flex-wrap gap-2 mt-3">
//               {job.skills.slice(0, 5).map((skill: string, idx: number) => (
//                 <span
//                   key={idx}
//                   className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs"
//                 >
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* ✅ BUTTON INSTEAD OF POPUP */}
//           <button
//             onClick={() =>
//               router.push(`/candidate/job/${job.id || job.job_id}`)
//             }
//             className="mt-5 bg-emerald-600 text-white px-4 py-2 rounded w-full"
//           >
//             Start AI Interview
//           </button>

//         </div>
//       ))}

//     </div>
//   )
// }
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getRecommendations, applyToJob } from '@/lib/api'
import Button from '@/components/ui/Button'
import GlassPanel from '@/components/ui/GlassPanel'
import Card from '@/components/ui/Card'
import { Zap, FileText } from 'lucide-react'

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const response = await getRecommendations()
      console.log("🎯 Fetched recommendations from API:", response.data)
      const jobsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.recommendations || [])
      console.log("✅ Parsed recommendations for display:", jobsData)
      setRecommendations(jobsData)
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (jobId: string) => {
    if (!confirm('Are you sure you want to apply to this job?')) return
    
    setApplying(jobId)
    try {
      await applyToJob(jobId)
      alert('Application submitted successfully! ✅')
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to submit application'
      alert(message)
    } finally {
      setApplying(null)
    }
  }

  const handleInterview = (jobId: string) => {
    router.push(`/candidate/job/${jobId}`)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Job Recommendations</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-8">Jobs matched to your skills and experience</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-6 bg-white/10 rounded mb-4" />
                <div className="h-4 bg-white/10 rounded mb-2" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Job Recommendations</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">Jobs matched to your skills and experience</p>

        {recommendations.length === 0 ? (
          <GlassPanel className="rounded-2xl p-12 text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              No recommendations yet. Complete your resume to get personalized job matches!
            </p>
            <Button onClick={() => router.push('/candidate/resume')}>
              Complete Resume
            </Button>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((job) => (
              <Card key={job.id || job.job_id} className="relative flex flex-col">
                {/* Match Score Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-bold">
                  {Math.round(job.match_score || job.match_percentage || 0)}% Match
                </div>
                
                {/* Job Title */}
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 pr-20">{job.title}</h3>
                
                {/* Location Badge */}
                <div className="mb-3">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm border border-purple-500/30">
                    {job.location || 'Remote'}
                  </span>
                </div>

                {/* Skills */}
                {(job.skills || job.matched_skills) && (job.skills?.length > 0 || job.matched_skills?.length > 0) && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      {job.matched_skills ? 'Your Matching Skills:' : 'Required Skills:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(job.matched_skills || job.skills || []).slice(0, 5).map((skill: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium border border-purple-500/30">
                          {skill}
                        </span>
                      ))}
                      {(job.matched_skills || job.skills || []).length > 5 && (
                        <span className="px-2 py-1 bg-white/10 text-slate-300 rounded text-xs">
                          +{(job.matched_skills || job.skills).length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-auto pt-4 space-y-2">
                  <Button
                    onClick={() => handleApply(job.id || job.job_id)}
                    disabled={applying === (job.id || job.job_id)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    {applying === (job.id || job.job_id) ? 'Applying...' : 'Apply to Job'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleInterview(job.id || job.job_id)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Start AI Interview
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}