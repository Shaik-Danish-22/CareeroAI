'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface JobCardProps {
  job: {
    id: string
    title: string
    description?: string
    location: string
    job_type: string
    skills: string[]
    applications_count?: number
    match_percentage?: number
    matched_skills?: string[]
    missing_skills?: string[]
    created_at?: string
  }
  variant?: 'recruiter' | 'candidate'
}

export default function JobCard({ job, variant = 'recruiter' }: JobCardProps) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="rounded-2xl p-6 animate-pulse h-64 bg-white/50 border border-slate-200 backdrop-blur-xl" />
    )
  }

  const handleClick = () => {
    if (variant === 'recruiter') {
      router.push(`/recruiter/job/${job.id}`)
    } else {
      router.push(`/candidate/job/${job.id}`)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const getMatchBadgeColor = (percentage: number) => {
    if (percentage >= 80) return 'from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-300'
    if (percentage >= 60) return 'from-violet-100 to-violet-50 text-violet-700 border-violet-300'
    if (percentage >= 40) return 'from-amber-100 to-amber-50 text-amber-700 border-amber-300'
    return 'from-rose-100 to-rose-50 text-rose-700 border-rose-300'
  }

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden cursor-pointer h-full rounded-2xl bg-white border border-slate-200 shadow-lg p-6 transition-all duration-300 ease-out hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-2"
    >
      {/* Animated overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50/0 via-transparent to-transparent group-hover:from-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1 mb-1">
              {job.title}
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {job.description ? job.description.substring(0, 60) + '...' : 'No description available'}
            </p>
          </div>

          {/* Match Badge (Candidate View) */}
          {variant === 'candidate' && job.match_percentage !== undefined && (
            <div className="flex-shrink-0 ml-3">
              <div className={`bg-gradient-to-r ${getMatchBadgeColor(job.match_percentage)} px-3 py-2 rounded-xl border backdrop-blur`}>
                <span className="font-bold text-sm">{job.match_percentage.toFixed(0)}%</span>
                <p className="text-xs opacity-90">Match</p>
              </div>
            </div>
          )}
        </div>

        {/* Location & Type Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-300 backdrop-blur hover:bg-blue-200 transition-all">
            📍 {job.location || 'Remote'}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-300 backdrop-blur hover:bg-purple-200 transition-all">
            💼 {job.job_type}
          </span>
        </div>

        {/* Matched Skills Section (Candidate View) */}
        {variant === 'candidate' && job.matched_skills && job.matched_skills.length > 0 && (
          <div className="mb-4 pb-3 border-b border-slate-200">
            <p className="text-xs font-bold text-emerald-700 mb-2 uppercase tracking-widest">✓ Matching</p>
            <div className="flex flex-wrap gap-1.5">
              {job.matched_skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300 backdrop-blur hover:bg-emerald-200 transition-all"
                >
                  {skill}
                </span>
              ))}
              {job.matched_skills.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
                  +{job.matched_skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Missing Skills Section (Candidate View) */}
        {variant === 'candidate' && job.missing_skills && job.missing_skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-widest">🎯 Growth Areas</p>
            <div className="flex flex-wrap gap-1.5">
              {job.missing_skills.slice(0, 2).map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300 backdrop-blur hover:bg-amber-200 transition-all"
                >
                  {skill}
                </span>
              ))}
              {job.missing_skills.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300">
                  +{job.missing_skills.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* All Skills (Recruiter View) */}
        {variant === 'recruiter' && job.skills && job.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-widest">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-violet-100 text-violet-700 border border-violet-300 backdrop-blur hover:bg-violet-200 transition-all"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-violet-100 text-violet-700 border border-violet-300">
                  +{job.skills.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer Section */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            {/* Applications Count (Recruiter View) */}
            {variant === 'recruiter' && (
              <span className="flex items-center gap-1 font-semibold text-slate-700 px-2 py-1 rounded-lg bg-slate-100 backdrop-blur">
                👥 {job.applications_count || 0}
              </span>
            )}

            {/* Posted Date */}
            {job.created_at && (
              <span className="text-slate-600">
                📅 {formatDate(job.created_at)}
              </span>
            )}
          </div>

          {/* View Details Arrow */}
          <div className="text-purple-600 group-hover:translate-x-1 transition-transform">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}