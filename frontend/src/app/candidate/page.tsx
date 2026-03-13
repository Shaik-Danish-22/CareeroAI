'use client'

import { useEffect, useState } from 'react'
import { getRecommendations } from '@/lib/api'
import Link from 'next/link'
import JobCard from '@/components/JobCard'
import GreetingBanner from '@/components/GreetingBanner'
import StatsCard from '@/components/ui/StatsCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { TrendingUp, Target, Zap } from 'lucide-react'

export default function CandidateDashboard() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('there')

  useEffect(() => {
    const email = localStorage.getItem('email')
    if (email) {
      const name =
        email.split('@')[0].charAt(0).toUpperCase() +
        email.split('@')[0].slice(1)
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

        {/* Greeting */}
        <GreetingBanner name={userName} role="candidate" />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <StatsCard
            title="Found Matches"
            value={recommendations.length}
            subtitle="Based on your profile"
            icon={<Target className="w-8 h-8" />}
          />

          <StatsCard
            title="Profile Strength"
            value="85%"
            subtitle="Complete your resume to improve"
            icon={<TrendingUp className="w-8 h-8" />}
          />

          <StatsCard
            title="Avg Match Score"
            value="72%"
            subtitle="Your average match percentage"
            icon={<Zap className="w-8 h-8" />}
          />
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Recommended Jobs
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="h-64 bg-white rounded-2xl border border-slate-200 shadow-lg animate-pulse" />
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

            <Card className="p-16 text-center border-dashed border-2">
              <p className="text-slate-900 text-2xl font-bold mb-3">
                📄 No Recommendations Yet
              </p>

              <p className="text-slate-600 mb-8">
                Complete your resume and skills to unlock personalized job recommendations powered by AI
              </p>

              <div className="flex gap-4 justify-center flex-wrap">

                <Link href="/candidate/resume">
                  <Button variant="primary">
                    Complete Your Resume
                  </Button>
                </Link>

                <Link href="/candidate/profile">
                  <Button variant="secondary">
                    Update Profile
                  </Button>
                </Link>

              </div>
            </Card>

          )}

        </div>
      </div>
    </div>
  )
}