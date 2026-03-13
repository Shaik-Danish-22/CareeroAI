'use client'

import { useEffect, useState } from 'react'

interface GreetingBannerProps {
  name?: string
  role?: 'recruiter' | 'candidate'
}

export default function GreetingBanner({ name = 'there', role = 'candidate' }: GreetingBannerProps) {
  const [mounted, setMounted] = useState(false)
  const [hour, setHour] = useState(0)

  useEffect(() => {
    setMounted(true)
    setHour(new Date().getHours())
  }, [])

  if (!mounted) {
    return <div className="h-32 bg-white rounded-2xl animate-pulse border border-slate-200 shadow-lg" />
  }

  const getGreeting = () => {
    if (hour < 12) return '🌅 Good morning'
    if (hour < 18) return '☀️ Good afternoon'
    return '🌙 Good evening'
  }

  const getSubtitle = () => {
    if (role === 'recruiter') {
      return 'Find top talent, build strong teams'
    }
    return 'Your AI career companion is ready to help'
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-lg p-8 mb-8">
      {/* Subtle gradient glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50/40 via-transparent to-indigo-50/40 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              {getGreeting()}, <span className="font-bold">{name}</span> 👋
            </h1>
            <p className="text-lg text-slate-700 font-medium mb-4">
              Welcome back to CareeroAI
            </p>
            <p className="text-slate-600">
              {getSubtitle()}
            </p>
          </div>

          {/* Status indicator */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-300 flex items-center justify-center text-2xl shadow-lg shadow-purple-200/40">
              ✨
            </div>
          </div>
        </div>

        {/* Quick stats or actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-xs text-slate-700 font-medium">
            ✓ AI Assistant Ready
          </div>
          <div className="px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-xs text-slate-700 font-medium">
            🎯 Personalized Insights
          </div>
        </div>
      </div>
    </div>
  )
}
