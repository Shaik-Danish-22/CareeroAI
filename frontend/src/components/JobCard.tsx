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
  const [isApplied, setIsApplied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Check if already applied (from localStorage)
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]')
    setIsApplied(appliedJobs.includes(job.id))
  }, [job.id])

  if (!mounted) {
    return (
      <div className="rounded-2xl p-6 animate-pulse h-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 backdrop-blur-xl" />
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
    if (percentage >= 80) return 'from-emerald-100 dark:from-emerald-900/30 to-emerald-50 dark:to-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
    if (percentage >= 60) return 'from-violet-100 dark:from-violet-900/30 to-violet-50 dark:to-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700'
    if (percentage >= 40) return 'from-amber-100 dark:from-amber-900/30 to-amber-50 dark:to-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
    return 'from-rose-100 dark:from-rose-900/30 to-rose-50 dark:to-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700'
  }

  const handleApplyJob = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Mark as applied
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]')
    if (!appliedJobs.includes(job.id)) {
      appliedJobs.push(job.id)
      localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs))
    }
    
    setIsApplied(true)
    router.push(`/candidate/job/${job.id}`)
  }

  const handleStartInterview = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/candidate/interview/${job.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden cursor-pointer h-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg p-6 transition-all duration-300 ease-out hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/10 hover:-translate-y-2 dark:hover:-translate-y-2"
    >
      {/* Animated overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50/0 dark:from-purple-900/10 via-transparent to-transparent group-hover:from-purple-50/30 dark:group-hover:from-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors line-clamp-1 mb-1">
              {job.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
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
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 backdrop-blur hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all">
            📍 {job.location || 'Remote'}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700 backdrop-blur hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all">
            💼 {job.job_type}
          </span>
        </div>

        {/* Matched Skills Section (Candidate View) */}
        {variant === 'candidate' && job.matched_skills && job.matched_skills.length > 0 && (
          <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2 uppercase tracking-widest">✓ Matching</p>
            <div className="flex flex-wrap gap-1.5">
              {job.matched_skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 backdrop-blur hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all"
                >
                  {skill}
                </span>
              ))}
              {job.matched_skills.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  +{job.matched_skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Missing Skills Section (Candidate View) */}
        {variant === 'candidate' && job.missing_skills && job.missing_skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2 uppercase tracking-widest">🎯 Growth Areas</p>
            <div className="flex flex-wrap gap-1.5">
              {job.missing_skills.slice(0, 2).map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 backdrop-blur hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all"
                >
                  {skill}
                </span>
              ))}
              {job.missing_skills.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  +{job.missing_skills.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* All Skills (Recruiter View) */}
        {variant === 'recruiter' && job.skills && job.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-widest">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700 backdrop-blur hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-all"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700">
                  +{job.skills.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons (Candidate View) */}
        {variant === 'candidate' && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleApplyJob}
              disabled={isApplied}
              className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 ${
                isApplied
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              {isApplied ? '✓ Applied' : 'Apply to Job'}
            </button>
            <button
              onClick={handleStartInterview}
              className="flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg active:scale-95"
            >
              AI Interview
            </button>
          </div>
        )}

        {/* Footer Section */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            {/* Applications Count (Recruiter View) */}
            {variant === 'recruiter' && (
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 backdrop-blur">
                👥 {job.applications_count || 0}
              </span>
            )}

            {/* Posted Date */}
            {job.created_at && (
              <span className="text-slate-600 dark:text-slate-400">
                📅 {formatDate(job.created_at)}
              </span>
            )}
          </div>

          {/* View Details Arrow */}
          <div className="text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}