// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'

// export default function ApplicationsPage() {
//   const [applications, setApplications] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     // TODO: Implement API call to fetch applications
//     setLoading(false)
//     // Placeholder data
//     setApplications([])
//   }, [])

//   return (
//     <div className="p-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-slate-900 mb-2">My Applications</h1>
//         <p className="text-slate-600 mb-8">Track the status of your job applications</p>

//         {loading ? (
//           <div className="glass rounded-2xl p-8">
//             <div className="animate-pulse">
//               <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
//               <div className="h-4 bg-slate-200 rounded w-2/3" />
//             </div>
//           </div>
//         ) : applications.length > 0 ? (
//           <div className="grid gap-6">
//             {applications.map((app: any) => (
//               <div key={app.id} className="glass rounded-2xl p-6">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-xl font-semibold text-slate-900">{app.job_title}</h3>
//                     <p className="text-slate-600">{app.company}</p>
//                     <p className="text-sm text-slate-500 mt-2">Applied on {app.applied_date}</p>
//                   </div>
//                   <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
//                     app.status === 'interview' ? 'bg-blue-100 text-blue-700' :
//                     app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
//                     'bg-red-100 text-red-700'
//                   }`}>
//                     {app.status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="glass rounded-2xl p-12 text-center">
//             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-slate-900 mb-2">No applications yet</h3>
//             <p className="text-slate-600 mb-6">Start applying to jobs to see them here</p>
//             <Link
//               href="/candidate"
//               className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Browse Jobs
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
// 'use client'

// import { useEffect, useState } from 'react'
// import { getApplications } from '@/lib/api'
// import Link from 'next/link'

// export default function ApplicationsPage() {
//   const [applications, setApplications] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchApplications()
//   }, [])

//   const fetchApplications = async () => {
//     try {
//       const response = await getApplications()
//       setApplications(response.data || [])
//     } catch (error) {
//       console.error('Failed to fetch applications:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="p-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-slate-900 mb-2">My Applications</h1>
//         <p className="text-slate-600 mb-8">Track the status of your job applications</p>

//         {loading ? (
//           <div className="glass rounded-2xl p-8">
//             <div className="animate-pulse">
//               <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
//               <div className="h-4 bg-slate-200 rounded w-2/3" />
//             </div>
//           </div>
//         ) : applications.length > 0 ? (
//           <div className="grid gap-6">
//             {applications.map((app: any) => (
//               <div key={app.id} className="glass rounded-2xl p-6">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-xl font-semibold text-slate-900">{app.job_title || 'Job Application'}</h3>
//                     <p className="text-slate-600">{app.company || 'Company'}</p>
//                     <p className="text-sm text-slate-500 mt-2">
//                       Applied on {new Date(app.created_at).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     app.status === 'applied' ? 'bg-yellow-100 text-yellow-700' :
//                     app.status === 'screening' ? 'bg-blue-100 text-blue-700' :
//                     app.status === 'interview' ? 'bg-purple-100 text-purple-700' :
//                     app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
//                     'bg-red-100 text-red-700'
//                   }`}>
//                     {app.status}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="glass rounded-2xl p-12 text-center">
//             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-slate-900 mb-2">No applications yet</h3>
//             <p className="text-slate-600 mb-6">Start applying to jobs to see them here</p>
//             <Link
//               href="/candidate/recommendations"
//               className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Browse Jobs
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
'use client'

import { useEffect, useState } from 'react'
import { getApplications } from '@/lib/api'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import GlassPanel from '@/components/ui/GlassPanel'
import Card from '@/components/ui/Card'
import { FileText } from 'lucide-react'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await getApplications()
      setApplications(response.data || [])
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      applied: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      screening: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      interview: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      accepted: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      rejected: 'bg-red-500/20 text-red-300 border-red-500/30'
    }
    return colors[status as keyof typeof colors] || 'bg-white/10 text-slate-300 border-white/20'
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Applications</h1>
        <p className="text-slate-600 mb-8">Track the status of your job applications</p>

        {loading ? (
          <GlassPanel className="rounded-2xl p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-white/10 rounded w-1/3" />
              <div className="h-4 bg-white/10 rounded w-2/3" />
            </div>
          </GlassPanel>
        ) : applications.length > 0 ? (
          <div className="grid gap-6">
            {applications.map((app: any) => (
              <Card key={app.id} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-1">{app.job_title}</h3>
                    <p className="text-slate-600 mb-2">{app.company} • {app.location}</p>
                    <p className="text-sm text-slate-500">
                      Applied on {new Date(app.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase border ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <GlassPanel className="rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No applications yet</h3>
            <p className="text-slate-600 mb-6">Start applying to jobs to see them here</p>
            <Link href="/candidate/recommendations">
              <Button>Browse Jobs</Button>
            </Link>
          </GlassPanel>
        )}
      </div>
    </div>
  )
}