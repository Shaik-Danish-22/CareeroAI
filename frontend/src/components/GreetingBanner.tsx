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
    <div className="rounded-2xl bg-white/80 backdrop-blur-xl shadow-lg p-6 mb-8 border border-white/40">
      <div className="flex justify-between items-center">
        {/* Left side - Greeting text */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {getGreeting()}, {name} 👋
          </h1>
          <p className="text-gray-500">
            {getSubtitle()}
          </p>
        </div>

        {/* Right side - Sparkle icon button */}
        <button className="rounded-xl bg-purple-100 p-3 hover:bg-purple-200 transition-colors flex-shrink-0">
          ✨
        </button>
      </div>
    </div>
  )
}
