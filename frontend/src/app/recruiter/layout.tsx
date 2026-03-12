'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatAssistant from '@/components/ChatAssistant'

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || role !== 'recruiter') {
      router.replace('/login')
    } else {
      setIsAuthorized(true)
    }
    setIsChecking(false)
  }, [router])

  if (isChecking) {
    return (
      <div className="h-screen bg-dark-cinematic flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-flex items-center justify-center w-12 h-12 mb-4">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-primary-400 rounded-full" />
          </div>
          <p className="text-slate-300 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-dark-cinematic flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-flex items-center justify-center w-12 h-12 mb-4">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-primary-400 rounded-full" />
          </div>
          <p className="text-slate-300 font-medium">Verifying access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-dark-cinematic overflow-hidden">
      {/* Sidebar */}
      <div className="flex-shrink-0 border-r border-white/10">
        <Sidebar role="recruiter" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto transition-smooth bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
        {children}
      </main>

      {/* Chat Assistant */}
      <div className="flex-shrink-0 border-l border-white/10">
        <ChatAssistant />
      </div>
    </div>
  )
}