'use client'

import { useEffect, useState } from 'react'
import { getRecommendations } from '@/lib/api'
import Link from 'next/link'

export default function CandidateDashboard() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const response = await getRecommendations()
      setRecommendations(response.data || [])
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600 mb-8">Welcome back! Here are your job recommendations.</p>

        <div className="grid gap-6">
          {loading ? (
            <div className="glass rounded-2xl p-8">
              <div className="animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          ) : recommendations.length > 0 ? (
            recommendations.map((job: any) => (
              <div key={job.job_id} className="glass rounded-2xl p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                    <p className="text-slate-600">{job.company}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    {job.match_score}% Match
                  </span>
                </div>
                <p className="text-slate-700 mb-4">{job.description}</p>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    {job.location}
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm">
                    {job.experience_required} years exp
                  </span>
                </div>
                <Link
                  href={`/candidate/job/${job.job_id}`}
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-slate-600">No job recommendations yet. Complete your resume to get started!</p>
              <Link
                href="/candidate/resume"
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Complete Resume
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}