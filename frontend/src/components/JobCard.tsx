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
    return <div className="glass rounded-2xl p-6 animate-pulse h-48" />
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

  return (
    <div
      onClick={handleClick}
      className="glass rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer relative group"
    >
      {/* Match Percentage Badge (Candidate View) */}
      {variant === 'candidate' && job.match_percentage !== undefined && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full text-sm font-bold shadow-lg">
          {job.match_percentage.toFixed(0)}% Match
        </div>
      )}

      {/* Job Title */}
      <h3 className={`text-xl font-semibold text-slate-900 mb-3 ${variant === 'candidate' ? 'pr-24' : ''}`}>
        {job.title}
      </h3>

      {/* Location and Job Type Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location || 'Remote'}
        </span>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {job.job_type}
        </span>
      </div>

      {/* Skills - Matched (Candidate View) */}
      {variant === 'candidate' && job.matched_skills && job.matched_skills.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-emerald-700 mb-1">✓ Your Matching Skills:</p>
          <div className="flex flex-wrap gap-2">
            {job.matched_skills.slice(0, 4).map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
                {skill}
              </span>
            ))}
            {job.matched_skills.length > 4 && (
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs">
                +{job.matched_skills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Skills - Missing (Candidate View) */}
      {variant === 'candidate' && job.missing_skills && job.missing_skills.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-orange-700 mb-1">⚠ Skills to Learn:</p>
          <div className="flex flex-wrap gap-2">
            {job.missing_skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium">
                {skill}
              </span>
            ))}
            {job.missing_skills.length > 3 && (
              <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs">
                +{job.missing_skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* All Skills (Recruiter View) */}
      {variant === 'recruiter' && job.skills && job.skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-700 mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-slate-200">
        {/* Applications Count (Recruiter View) */}
        {variant === 'recruiter' && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-semibold">{job.applications_count || 0}</span>
            <span>applications</span>
          </div>
        )}

        {/* Posted Date */}
        {job.created_at && (
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Posted {formatDate(job.created_at)}
          </div>
        )}

        {/* View Details Arrow */}
        <div className="ml-auto text-blue-600 group-hover:translate-x-1 transition-transform">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-emerald-600/0 group-hover:from-blue-600/5 group-hover:to-emerald-600/5 rounded-2xl transition-all pointer-events-none" />
    </div>
  )
}