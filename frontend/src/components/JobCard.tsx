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
      <div className="rounded-xl p-6 animate-pulse h-64 bg-white/10 backdrop-blur-sm border border-white/20" />
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
    if (percentage >= 80) return 'badge-premium-emerald'
    if (percentage >= 60) return 'badge-premium-blue'
    if (percentage >= 40) return 'badge-premium-amber'
    return 'badge-premium-rose'
  }

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden cursor-pointer rounded-xl backdrop-blur-md bg-blue-950/40 border border-blue-500/20 p-6 transition-all duration-300 ease-out hover:border-blue-400/40 hover:bg-blue-950/60 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/25"
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors line-clamp-1">
            {job.title}
          </h3>
          <p className="text-sm text-slate-300 mt-1.5 line-clamp-2">
            {job.description ? job.description.substring(0, 60) + '...' : 'No description available'}
          </p>
        </div>

        {/* Match Badge (Candidate View) */}
        {variant === 'candidate' && job.match_percentage !== undefined && (
          <div className="flex-shrink-0 ml-2">
            <div className={`${getMatchBadgeColor(job.match_percentage)} px-3 py-1.5`}>
              <span className="font-bold">{job.match_percentage.toFixed(0)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Location & Type Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/25 text-blue-250 border border-blue-400/30 hover:bg-blue-500/35 transition-colors">
          📍 {job.location || 'Remote'}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/25 text-purple-250 border border-purple-400/30 hover:bg-purple-500/35 transition-colors">
          💼 {job.job_type}
        </span>
      </div>

      {/* Matched Skills Section (Candidate View) */}
      {variant === 'candidate' && job.matched_skills && job.matched_skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-emerald-300/90 mb-2 uppercase tracking-widest">✓ Matching Skills</p>
          <div className="flex flex-wrap gap-2">
            {job.matched_skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 hover:bg-emerald-500/40 transition-colors"
              >
                {skill}
              </span>
            ))}
            {job.matched_skills.length > 4 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                +{job.matched_skills.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Missing Skills Section (Candidate View) */}
      {variant === 'candidate' && job.missing_skills && job.missing_skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-amber-300/90 mb-2 uppercase tracking-widest">🎯 Skill Gaps</p>
          <div className="flex flex-wrap gap-2">
            {job.missing_skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/30 text-amber-200 border border-amber-400/40 hover:bg-amber-500/40 transition-colors"
              >
                {skill}
              </span>
            ))}
            {job.missing_skills.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/30 text-amber-200 border border-amber-400/40">
                +{job.missing_skills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* All Skills (Recruiter View) */}
      {variant === 'recruiter' && job.skills && job.skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-slate-300/80 mb-2 uppercase tracking-widest">Required Skills</p>
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 5).map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/40 hover:bg-blue-500/40 transition-colors"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/40">
                +{job.skills.length - 5}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer Section */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm text-slate-400">
        <div className="flex items-center gap-3">
          {/* Applications Count (Recruiter View) */}
          {variant === 'recruiter' && (
            <span className="flex items-center gap-1 font-semibold text-slate-300 text-xs">
              👥 {job.applications_count || 0}
            </span>
          )}

          {/* Posted Date */}
          {job.created_at && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              📅 {formatDate(job.created_at)}
            </span>
          )}
        </div>

        {/* View Details Arrow */}
        <div className="text-primary-400 group-hover:translate-x-1 transition-transform">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Glow overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-blue-500/0 group-hover:from-primary-500/5 group-hover:via-blue-500/5 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  )
}