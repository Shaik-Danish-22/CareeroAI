'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getRecruiterJobs, createJob } from '@/lib/api'
import JobCard from '@/components/JobCard'
import GreetingBanner from '@/components/GreetingBanner'
import Button from '@/components/ui/Button'
import StatsCard from '@/components/ui/StatsCard'
import JobDescriptionGenerator from '@/components/JobDescriptionGenerator'
import { Briefcase, TrendingUp, CheckCircle } from 'lucide-react'

export default function RecruiterDashboard() {
  const [mounted, setMounted] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [userName, setUserName] = useState('there')
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
    return <div className="h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 animate-pulse" />
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Premium Greeting Banner */}
        <GreetingBanner name={userName} role="recruiter" />

        {/* Key Metrics - Premium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatsCard
            title="Total Positions"
            value={jobs.length.toString()}
            subtitle="Open opportunities"
            icon={<Briefcase className="w-5 h-5" />}
          />
          <StatsCard
            title="Applications"
            value={jobs.reduce((acc, job) => acc + (job.applications_count || 0), 0).toString()}
            subtitle="Total received"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatsCard
            title="Quality Rate"
            value="82%"
            subtitle="Match accuracy"
            icon={<CheckCircle className="w-5 h-5" />}
          />
        </div>

        {/* Jobs Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Job Postings</h2>
            {jobs.length > 0 && (
              <div className="flex items-center gap-3">
                <JobDescriptionGenerator />
                <Button 
                  onClick={() => setShowModal(true)}
                >
                  + Post New Job
                </Button>
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl p-6 animate-pulse h-72 bg-white dark:bg-slate-800 backdrop-blur-md border border-slate-200 dark:border-slate-700" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl p-16 text-center border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/50 shadow-lg hover:shadow-xl transition-shadow">
              <p className="text-slate-700 dark:text-slate-300 text-lg font-semibold mb-3">📋 No jobs posted yet</p>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
                Start recruiting today by posting your first job opening. Use AI-powered matching to find the perfect candidates.
              </p>
              <div className="flex items-center justify-center gap-3">
                <JobDescriptionGenerator />
                <Button 
                  onClick={() => setShowModal(true)}
                >
                  Post Your First Job
                </Button>
              </div>
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">New Job Opening</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Position Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Senior React Developer"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Job Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                  placeholder="Describe the role, responsibilities, and required skills. AI will extract key competencies automatically."
                  required
                />
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  💡 Tip: Include required skills, experience level, and key responsibilities for better AI matching
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Discard
                </Button>
                <Button
                  disabled={creating}
                  type="submit"
                >
                  {creating ? 'Publishing...' : 'Post Job'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}