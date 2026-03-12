'use client'

import { useEffect, useState } from 'react'
import { getRecommendations } from '@/lib/api'
import Link from 'next/link'
import JobCard from '@/components/JobCard'

export default function CandidateDashboard() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('Candidate')

  useEffect(() => {
    const email = localStorage.getItem('email')
    if (email) {
      const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
      setUserName(name)
    }
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
        {/* Personalized Greeting */}
        <div className="glass-card-dark rounded-xl px-6 py-4 mb-8 border border-emerald-500/20 bg-gradient-to-r from-emerald-900/30 to-transparent">
          <p className="text-white text-lg font-semibold">
            Hi {userName} 👋
          </p>
          <p className="text-slate-300 text-sm mt-1">
            Welcome back! Here are your recommended opportunities based on your profile.
          </p>
        </div>

        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h1 className="text-5xl font-900 text-white mb-2">Recommended Jobs</h1>
            <p className="text-slate-300">Discover curated opportunities matched to your profile</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="card-dark p-6 rounded-xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Found Matches</p>
            <p className="text-4xl font-900 text-white mt-3">{recommendations.length}</p>
            <p className="text-slate-400 text-xs mt-2">Based on your profile</p>
          </div>
          <div className="card-dark p-6 rounded-xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Profile Strength</p>
            <p className="text-4xl font-900 text-blue-300 mt-3">85%</p>
            <p className="text-slate-400 text-xs mt-2">Complete your resume to improve</p>
          </div>
          <div className="card-dark p-6 rounded-xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Avg Match Score</p>
            <p className="text-4xl font-900 text-emerald-300 mt-3">72%</p>
            <p className="text-slate-400 text-xs mt-2">Your average match percentage</p>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl p-6 animate-pulse h-64 bg-white/5 backdrop-blur-md border border-white/10" />
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((job: any) => (
                <JobCard 
                  key={job.job_id} 
                  job={{
                    id: job.job_id,
                    title: job.title,
                    description: job.description,
                    location: job.location || 'Remote',
                    job_type: 'Full-time',
                    skills: job.skills || [],
                    match_percentage: job.match_score,
                  }} 
                  variant="candidate" 
                />
              ))}
            </div>
          ) : (
            <div className="glass-card-dark rounded-2xl p-16 text-center border border-dashed border-white/20">
              <p className="text-white text-2xl font-bold mb-3">📄 No Recommendations Yet</p>
              <p className="text-slate-300 mb-8">Complete your resume and skills to unlock personalized job recommendations powered by AI</p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/candidate/resume"
                  className="glass-button px-6 py-2.5 inline-block"
                >
                  Complete Your Resume
                </Link>
                <Link
                  href="/candidate/profile"
                  className="glass-button-secondary px-6 py-2.5 inline-block"
                >
                  Update Profile
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}