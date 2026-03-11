'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getRecruiterJobs, createJob } from '@/lib/api'

export default function RecruiterDashboard() {
  const [mounted, setMounted] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
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
    return <div className="h-screen bg-slate-50 animate-pulse" />
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Job Postings</h1>
          <p className="text-slate-600 mt-1">Manage your job listings</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          + Post Job
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-slate-200 rounded mb-4" />
              <div className="h-4 bg-slate-200 rounded mb-2" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-slate-600">No jobs posted yet. Create your first job!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => router.push(`/recruiter/job/${job.id}`)}
              className="glass rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{job.title}</h3>
              <div className="flex gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                  {job.location || 'Remote'}
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm">
                  {job.job_type}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.slice(0, 3).map((skill: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-600">
                📬 {job.applications_count} applications
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-8 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Post New Job</h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Job Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-slate-500 mt-1">
                  Include required skills, qualifications, and responsibilities. AI will extract key skills automatically.
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}