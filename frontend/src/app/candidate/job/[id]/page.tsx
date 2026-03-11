'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSkillGaps } from '@/lib/api'
import Link from 'next/link'

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [jobDetails, setJobDetails] = useState<any>(null)
  const [skillGaps, setSkillGaps] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobDetails()
  }, [jobId])

  const fetchJobDetails = async () => {
    try {
      const response = await getSkillGaps(jobId)
      setJobDetails(response.data)
      setSkillGaps(response.data)
    } catch (error) {
      console.error('Failed to fetch job details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartInterview = () => {
    router.push(`/candidate/interview/${jobId}`)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="glass rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/2 mb-4" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (!jobDetails) {
    return (
      <div className="p-8">
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-slate-600">Job not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Job Header */}
        <div className="glass rounded-2xl p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {jobDetails.job_title || 'Job Position'}
              </h1>
              <p className="text-slate-600 text-lg">Company Name</p>
            </div>
            {skillGaps?.match_score && (
              <div className="px-6 py-3 bg-emerald-100 text-emerald-700 rounded-xl">
                <span className="text-2xl font-bold">{skillGaps.match_score}%</span>
                <p className="text-sm">Match Score</p>
              </div>
            )}
          </div>

          {/* Job Description */}
          {jobDetails.job_description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Job Description</h2>
              <div className="prose max-w-none text-slate-700 whitespace-pre-line">
                {jobDetails.job_description}
              </div>
            </div>
          )}

          {/* Requirements Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Skills Required */}
            {(skillGaps?.matched_skills?.length > 0 || skillGaps?.missing_skills?.length > 0) && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Required Skills</h3>
                <div className="space-y-2">
                  {skillGaps.matched_skills?.map((skill: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-emerald-600">✓</span>
                      <span className="text-slate-700">{skill}</span>
                      <span className="text-xs text-emerald-600">(You have this)</span>
                    </div>
                  ))}
                  {skillGaps.missing_skills?.map((skill: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-red-600">○</span>
                      <span className="text-slate-700">{skill}</span>
                      <span className="text-xs text-red-600">(Need to learn)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Job Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-slate-500">📍</span>
                  <div>
                    <p className="font-medium text-slate-900">Location</p>
                    <p className="text-slate-600">Remote / Hybrid</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-slate-500">💼</span>
                  <div>
                    <p className="font-medium text-slate-900">Job Type</p>
                    <p className="text-slate-600">Full-time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-slate-500">⏰</span>
                  <div>
                    <p className="font-medium text-slate-900">Experience</p>
                    <p className="text-slate-600">2-5 years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-slate-200">
            <button
              onClick={handleStartInterview}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
            >
              🎤 Start Mock Interview
            </button>
            <Link
              href="/candidate/skill-gap"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              📊 View Skill Gap Analysis
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}