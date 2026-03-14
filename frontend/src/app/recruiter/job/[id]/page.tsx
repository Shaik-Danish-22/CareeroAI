'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getJobApplications, getCandidateRecommendations } from '@/lib/api'
import { calculateMatchPercentage, getSkillMatches } from '@/utils/matchUtils'
import { TrendingUp, Search } from 'lucide-react'
import AiTalentSearch from '@/components/AiTalentSearch'

export default function JobDetailPage() {
  const [mounted, setMounted] = useState(false)
  const [job, setJob] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any>(null)
  const [showRecs, setShowRecs] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingRecs, setLoadingRecs] = useState(false)
  const params = useParams()

  useEffect(() => {
    setMounted(true)
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await getJobApplications(params.id as string)
      setJob(response.data.job)
      setApplications(response.data.applications || [])
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecommendations = async () => {
    setLoadingRecs(true)
    try {
      const response = await getCandidateRecommendations(params.id as string, 10)
      setRecommendations(response.data)
      setShowRecs(true)
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoadingRecs(false)
    }
  }

  if (!mounted) {
    return <div className="h-screen bg-slate-50 dark:bg-slate-900 animate-pulse" />
  }

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen">
        <div className="glass rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="p-8 bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen">
        <div className="glass rounded-2xl p-8">
          <p className="text-slate-600 dark:text-slate-400">Job not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gradient-to-br from-purple-50 via-white to-indigo-50 min-h-screen">
      {/* Job Header */}
      <div className="glass rounded-2xl p-8 mb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{job.title || 'Untitled Job'}</h1>
        <div className="flex gap-3 mb-6">
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
            {job.location || 'Remote'}
          </span>
          <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-semibold">
            {job.job_type || 'Full-time'}
          </span>
        </div>
        <p className="text-slate-700 mb-6 whitespace-pre-wrap leading-relaxed">{job.description || 'No description provided'}</p>
        {job.skills && Array.isArray(job.skills) && job.skills.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">Required Skills:</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill: string, idx: number) => (
                <span key={idx} className="px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-xl text-sm font-medium border border-purple-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={fetchRecommendations}
          disabled={loadingRecs || applications.length === 0}
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition-all hover:scale-[1.02]"
        >
          {loadingRecs ? (
            <>
              <span className="inline-block animate-spin mr-2">⚙️</span>
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="inline mr-2 w-5 h-5" />
              Get AI Recommendations
            </>
          )}
        </button>
        {applications.length === 0 && (
          <p className="text-slate-500 py-3">No applications yet to analyze</p>
        )}
      </div>

      {/* Recommendations Modal */}
      {showRecs && recommendations && (
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              🎯 AI-Ranked Candidates
            </h2>
            <button
              onClick={() => setShowRecs(false)}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-lg transition"
            >
              ✕
            </button>
          </div>

          {/* Debug Info */}
          {recommendations.debug && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6 text-sm border border-blue-200">
              <p className="font-semibold mb-3">Analysis Transparency:</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-slate-600 text-xs">Total Applied</p>
                  <p className="font-bold text-lg text-slate-900">{recommendations.debug.total_applied || 0}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-slate-600 text-xs">Location Filtered</p>
                  <p className="font-bold text-lg text-slate-900">{recommendations.debug.location_filtered || 0}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-slate-600 text-xs">No Skills</p>
                  <p className="font-bold text-lg text-slate-900">{recommendations.debug.no_skill_filtered || 0}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-slate-600 text-xs">Passed to AI</p>
                  <p className="font-bold text-lg text-slate-900">{recommendations.debug.passed_to_ai || 0}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-slate-600 text-xs">Returned</p>
                  <p className="font-bold text-lg text-slate-900">{recommendations.debug.final_returned || 0}</p>
                </div>
              </div>
            </div>
          )}

          {!recommendations.candidates || !Array.isArray(recommendations.candidates) || recommendations.candidates.length === 0 ? (
            <p className="text-slate-600">No qualified candidates found matching criteria.</p>
          ) : (
            <div className="space-y-4">
              {recommendations.candidates.map((candidate: any, idx: number) => {
                const skillMatch = getSkillMatches(candidate.skills || [], job.skills || [])
                const matchPercentage = calculateMatchPercentage(candidate.skills || [], job.skills || [])
                
                return (
                  <div key={candidate.candidate_id || idx} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-purple-400 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          #{idx + 1} {candidate.name || 'Candidate'}
                        </h3>
                        <p className="text-sm text-slate-600">{candidate.email || 'No email'}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${matchPercentage >= 70 ? 'text-emerald-600' : matchPercentage >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                          {matchPercentage}%
                        </div>
                        <div className="text-xs text-slate-500">Skill Match</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-sm text-slate-600 mb-2">
                          Experience: <strong>{candidate.total_experience || 0} years</strong>
                        </p>
                        <p className="text-sm text-slate-600">
                          Location: <strong>{candidate.location || 'Not specified'}</strong>
                        </p>
                      </div>
                      {candidate.reasons && Array.isArray(candidate.reasons) && candidate.reasons.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="font-semibold text-sm mb-2 text-blue-900">Why we recommended:</p>
                          <ul className="space-y-1">
                            {candidate.reasons.slice(0, 2).map((reason: string, i: number) => (
                              <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                <span className="text-blue-600 mt-1">✓</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Matched Skills */}
                    {skillMatch.matching.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-emerald-700 mb-2 uppercase tracking-wider">✓ Matching Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {skillMatch.matching.map((skill: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Skills */}
                    {skillMatch.missing.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-red-700 mb-2 uppercase tracking-wider">⚠ Missing Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {skillMatch.missing.map((skill: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold border border-red-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Applications Table */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Applications ({applications.length})
          </h2>
          {!showSearch && (
            <button
              onClick={() => setShowSearch(true)}
              className="px-4 py-2 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              🔍 AI Talent Search
            </button>
          )}
        </div>
        {showSearch && <AiTalentSearch candidates={applications} onClose={() => setShowSearch(false)} />}
        {applications.length === 0 ? (
          <p className="text-slate-600">No applications yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Candidate</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Skills Match</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Skills</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Experience</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Location</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 text-slate-700 font-semibold">Interview</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, appIdx) => {
                  const matchPercentage = calculateMatchPercentage(app.skills || [], job.skills || [])
                  
                  return (
                    <tr key={app.application_id || appIdx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900">{app.candidate_name || 'N/A'}</div>
                        <div className="text-sm text-slate-600">{app.candidate_email || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-block px-4 py-2 rounded-lg font-bold text-sm ${
                          matchPercentage >= 70 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : matchPercentage >= 50 
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {matchPercentage}%
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {app.skills && Array.isArray(app.skills) && app.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {app.skills.slice(0, 3).map((skill: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                            {app.skills.length > 3 && (
                              <span className="text-xs text-slate-500 font-semibold">+{app.skills.length - 3}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">No skills</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-900 font-medium">{app.experience || 0} yrs</td>
                      <td className="py-4 px-4 text-slate-600">{app.location || 'N/A'}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                          {app.status || 'applied'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {app.interview_score && app.interview_score.total_score != null ? (
                          <span className="text-emerald-600 font-semibold">
                            {app.interview_score.total_score}/10
                          </span>
                        ) : (
                          <span className="text-slate-400 text-sm">Not done</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams } from 'next/navigation'
// import { getJobApplications, getCandidateRecommendations } from '@/lib/api'

// export default function JobDetailPage() {
//   const [mounted, setMounted] = useState(false)
//   const [job, setJob] = useState<any>(null)
//   const [applications, setApplications] = useState<any[]>([])
//   const [recommendations, setRecommendations] = useState<any>(null)
//   const [showRecs, setShowRecs] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [loadingRecs, setLoadingRecs] = useState(false)
//   const params = useParams()

//   useEffect(() => {
//     setMounted(true)
//     fetchApplications()
//   }, [])

//   const fetchApplications = async () => {
//     try {
//       const response = await getJobApplications(params.id as string)
//       setJob(response.data.job)
//       setApplications(response.data.applications)
//     } catch (error) {
//       console.error('Failed to fetch applications:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchRecommendations = async () => {
//     setLoadingRecs(true)
//     try {
//       const response = await getCandidateRecommendations(params.id as string, 10)
//       setRecommendations(response.data)
//       setShowRecs(true)
//     } catch (error) {
//       console.error('Failed to fetch recommendations:', error)
//     } finally {
//       setLoadingRecs(false)
//     }
//   }

//   if (!mounted) {
//     return <div className="h-screen bg-slate-50 animate-pulse" />
//   }

//   if (loading) {
//     return (
//       <div className="p-8">
//         <div className="glass rounded-2xl p-8 animate-pulse">
//           <div className="h-8 bg-slate-200 rounded w-1/3 mb-4" />
//           <div className="h-4 bg-slate-200 rounded w-1/2" />
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-8">
//       {/* Job Header */}
//       <div className="glass rounded-2xl p-8 mb-6">
//         <h1 className="text-3xl font-bold text-slate-900 mb-4">{job.title}</h1>
//         <div className="flex gap-3 mb-4">
//           <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
//             {job.location || 'Remote'}
//           </span>
//           <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg">
//             {job.job_type}
//           </span>
//         </div>
//         <p className="text-slate-700 mb-4 whitespace-pre-wrap">{job.description}</p>
//         <div className="flex flex-wrap gap-2">
//           <span className="text-sm font-semibold text-slate-700">Required Skills:</span>
//           {job.skills.map((skill: string, idx: number) => (
//             <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm">
//               {skill}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={fetchRecommendations}
//           disabled={loadingRecs || applications.length === 0}
//           className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
//         >
//           {loadingRecs ? 'Analyzing...' : '🎯 Get AI Recommendations'}
//         </button>
//         {applications.length === 0 && (
//           <p className="text-slate-500 py-3">No applications yet to analyze</p>
//         )}
//       </div>

//       {/* Recommendations Modal */}
//       {showRecs && recommendations && (
//         <div className="glass rounded-2xl p-6 mb-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold text-slate-900">
//               🎯 AI-Ranked Candidates
//             </h2>
//             <button
//               onClick={() => setShowRecs(false)}
//               className="text-slate-500 hover:text-slate-700"
//             >
//               ✕
//             </button>
//           </div>

//           {/* Debug Info */}
//           <div className="bg-blue-50 rounded-xl p-4 mb-4 text-sm">
//             <p className="font-semibold mb-2">Analysis Transparency:</p>
//             <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
//               <div>Total Applied: <strong>{recommendations.debug.total_applied}</strong></div>
//               <div>Location Filtered: <strong>{recommendations.debug.location_filtered}</strong></div>
//               <div>No Skills: <strong>{recommendations.debug.no_skill_filtered}</strong></div>
//               <div>Passed to AI: <strong>{recommendations.debug.passed_to_ai}</strong></div>
//               <div>Returned: <strong>{recommendations.debug.final_returned}</strong></div>
//             </div>
//           </div>

//           {recommendations.candidates.length === 0 ? (
//             <p className="text-slate-600">No qualified candidates found matching criteria.</p>
//           ) : (
//             <div className="space-y-4">
//               {recommendations.candidates.map((candidate: any, idx: number) => (
//                 <div key={candidate.candidate_id} className="bg-white rounded-xl p-6 border border-slate-200">
//                   <div className="flex justify-between items-start mb-3">
//                     <div>
//                       <h3 className="text-lg font-semibold text-slate-900">
//                         #{idx + 1} {candidate.name}
//                       </h3>
//                       <p className="text-sm text-slate-600">{candidate.email}</p>
//                     </div>
//                     <div className="text-right">
//                       <div className="text-2xl font-bold text-emerald-600">
//                         {candidate.match_score != null ? candidate.match_score.toFixed(0) : 'N/A'}%
//                       </div>
//                       <div className="text-xs text-slate-500">Match Score</div>
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-4 mb-3">
//                     <div>
//                       <p className="text-sm text-slate-600">Experience: <strong>{candidate.total_experience} years</strong></p>
//                       <p className="text-sm text-slate-600">Location: <strong>{candidate.location}</strong></p>
//                     </div>
//                     <div className="text-sm">
//                       <p className="font-semibold mb-1">Reasons:</p>
//                       <ul className="list-disc list-inside text-slate-600">
//                         {candidate.reasons && candidate.reasons.length > 0 && (
//                           <ul>
//                           {candidate.reasons.map((reason: string, i: number) => (
//                             <li key={i}>{reason}</li>
//                           ))}
//                           </ul>
//                         )}
                        
//                       </ul>
//                     </div>
//                   </div>

//                   <div className="mb-3">
//                     <p className="text-sm font-semibold mb-1">Matched Skills:</p>
//                     <div className="flex flex-wrap gap-2">
//                       {candidate.matched_skills.map((skill: string, i: number) => (
//                         <span key={i} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">
//                           {skill}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   {candidate.missing_skills.length > 0 && (
//                     <div>
//                       <p className="text-sm font-semibold mb-1">Missing Skills:</p>
//                       <div className="flex flex-wrap gap-2">
//                         {candidate.missing_skills.map((skill: string, i: number) => (
//                           <span key={i} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
//                             {skill}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Applications Table */}
//       <div className="glass rounded-2xl p-6">
//         <h2 className="text-2xl font-bold text-slate-900 mb-4">
//           Applications ({applications.length})
//         </h2>
//         {applications.length === 0 ? (
//           <p className="text-slate-600">No applications yet.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-slate-200">
//                   <th className="text-left py-3 px-4 text-slate-700">Candidate</th>
//                   <th className="text-left py-3 px-4 text-slate-700">Skills</th>
//                   <th className="text-left py-3 px-4 text-slate-700">Experience</th>
//                   <th className="text-left py-3 px-4 text-slate-700">Location</th>
//                   <th className="text-left py-3 px-4 text-slate-700">Status</th>
//                   <th className="text-left py-3 px-4 text-slate-700">Interview</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {applications.map((app) => (
//                   <tr key={app.application_id} className="border-b border-slate-100 hover:bg-slate-50">
//                     <td className="py-3 px-4">
//                       <div className="font-semibold">{app.candidate_name}</div>
//                       <div className="text-sm text-slate-600">{app.candidate_email}</div>
//                     </td>
//                     <td className="py-3 px-4">
//                       <div className="flex flex-wrap gap-1">
//                         {app.skills.slice(0, 3).map((skill: string, i: number) => (
//                           <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
//                             {skill}
//                           </span>
//                         ))}
//                         {app.skills.length > 3 && (
//                           <span className="text-xs text-slate-500">+{app.skills.length - 3}</span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="py-3 px-4">{app.experience} yrs</td>
//                     <td className="py-3 px-4">{app.location}</td>
//                     <td className="py-3 px-4">
//                       <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
//                         {app.status}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4">
//                       {app.interview_score ? (
//                         <span className="text-emerald-600 font-semibold">
//                           {app.interview_score.total_score}/10
//                         </span>
//                       ) : (
//                         <span className="text-slate-400">Not done</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
