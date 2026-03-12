'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getRecruiterJobs, createJob } from '@/lib/api'
import JobCard from '@/components/JobCard'

export default function RecruiterDashboard() {
  const [mounted, setMounted] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [userName, setUserName] = useState('Recruiter')
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const email = localStorage.getItem('email')
    if (email) {
      const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
      setUserName(name)
    }
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await getRecruiterJobs()
      setJobs(response.data.jobs)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      await createJob({ title, description, job_type: 'Full-time' })
      setShowModal(false)
      setTitle('')
      setDescription('')
      fetchJobs()
    } catch (error) {
      console.error('Failed to create job:', error)
    } finally {
      setCreating(false)
    }
  }

  if (!mounted) {
    return <div className="h-screen bg-slate-950 animate-pulse" />
  }

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Personalized Greeting */}
        <div className="glass-card-dark rounded-xl px-6 py-4 mb-8 border border-blue-500/20 bg-gradient-to-r from-blue-900/30 to-transparent">
          <p className="text-white text-lg font-semibold">
            Hi {userName} 👋
          </p>
          <p className="text-slate-300 text-sm mt-1">
            Welcome back! Manage your job openings and review qualified candidates.
          </p>
        </div>

        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-900 text-white mb-2">Your Jobs</h1>
              <p className="text-slate-300 text-lg">Manage openings and review applicants</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="glass-button flex items-center gap-2 whitespace-nowrap h-fit"
            >
              <span className="text-xl">+</span>
              <span>Post New Job</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="card-dark p-6 rounded-xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Positions</p>
            <p className="text-4xl font-900 text-white mt-3">{jobs.length}</p>
            <p className="text-xs text-slate-400 mt-2">Open opportunities</p>
          </div>
          <div className="card-dark p-6 rounded-xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Applications</p>
            <p className="text-4xl font-900 text-blue-300 mt-3">{jobs.reduce((acc, job) => acc + (job.applications_count || 0), 0)}</p>
            <p className="text-xs text-slate-400 mt-2">Total received</p>
          </div>
          <div className="card-dark p-6 rounded-xl">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Quality Rate</p>
            <p className="text-4xl font-900 text-emerald-300 mt-3">82%</p>
            <p className="text-xs text-slate-400 mt-2">Match accuracy</p>
          </div>
        </div>

        {/* Jobs Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Job Postings</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl p-6 animate-pulse h-72 bg-white/8 backdrop-blur-md border border-white/10" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-card-dark rounded-2xl p-16 text-center border-2 border-dashed border-white/20">
              <p className="text-slate-300 text-lg mb-6">📋 No jobs posted yet</p>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto">Start recruiting today by posting your first job opening. Use AI-powered matching to find the perfect candidates.</p>
              <button
                onClick={() => setShowModal(true)}
                className="glass-button inline-block"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} variant="recruiter" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card-dark rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-900 text-white">New Job Opening</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest">
                  Position Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-premium w-full"
                  placeholder="e.g., Senior React Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest">
                  Job Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  className="input-premium w-full resize-none"
                  placeholder="Describe the role, responsibilities, and required skills. AI will extract key competencies automatically."
                  required
                />
                <p className="text-xs text-slate-400 mt-2">
                  💡 Tip: Include required skills, experience level, and key responsibilities for better AI matching
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="glass-button-secondary px-6 py-2"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="glass-button px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Publishing...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}