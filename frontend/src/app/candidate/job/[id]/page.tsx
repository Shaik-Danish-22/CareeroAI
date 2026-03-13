'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSkillGaps } from '@/lib/api'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import GlassPanel from '@/components/ui/GlassPanel'
import Card from '@/components/ui/Card'
import { ChevronLeft, Target, MapPin, Briefcase, Clock } from 'lucide-react'

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
        <GlassPanel className="rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/2 mb-4" />
          <div className="h-4 bg-white/10 rounded w-3/4" />
        </GlassPanel>
      </div>
    )
  }

  if (!jobDetails) {
    return (
      <div className="p-8">
        <GlassPanel className="rounded-2xl p-8 text-center">
          <p className="text-slate-400">Job not found</p>
        </GlassPanel>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-purple-400 hover:text-purple-300 flex items-center gap-2 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        {/* Job Header */}
        <GlassPanel className="rounded-2xl p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {jobDetails.job_title || 'Job Position'}
              </h1>
              <p className="text-slate-600 text-lg">Company Name</p>
            </div>
            {skillGaps?.match_score && (
              <div className="px-6 py-3 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-xl shadow-lg shadow-purple-500/20">
                <span className="text-2xl font-bold">{skillGaps.match_score}%</span>
                <p className="text-sm">Match Score</p>
              </div>
            )}
          </div>

          {/* Job Description */}
          {jobDetails.job_description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Job Description</h2>
              <div className="prose prose-invert max-w-none text-slate-600 whitespace-pre-line">
                {jobDetails.job_description}
              </div>
            </div>
          )}

          {/* Requirements Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Skills Required */}
            {(skillGaps?.matched_skills?.length > 0 || skillGaps?.missing_skills?.length > 0) && (
              <Card className="bg-white/5">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Required Skills</h3>
                <div className="space-y-2">
                  {skillGaps.matched_skills?.map((skill: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span className="text-slate-700">{skill}</span>
                      <span className="text-xs text-emerald-400">(You have this)</span>
                    </div>
                  ))}
                  {skillGaps.missing_skills?.map((skill: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-red-400">○</span>
                      <span className="text-slate-700">{skill}</span>
                      <span className="text-xs text-red-400">(Need to learn)</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Other Requirements */}
            <Card className="bg-white/5">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Job Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Location</p>
                    <p className="text-slate-600">Remote / Hybrid</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Job Type</p>
                    <p className="text-slate-600">Full-time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Experience</p>
                    <p className="text-slate-600">2-5 years</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-white/10">
            <Button onClick={handleStartInterview} className="flex items-center justify-center gap-2">
              <span>🎤</span>
              Start Mock Interview
            </Button>
            <Link href="/candidate/skill-gap">
              <Button variant="secondary" className="flex items-center justify-center gap-2">
                <Target className="w-4 h-4" />
                View Skill Gap Analysis
              </Button>
            </Link>
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}