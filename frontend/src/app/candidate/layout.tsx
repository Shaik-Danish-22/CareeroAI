'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatAssistant from '@/components/ChatAssistant'

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    
    if (!token || role !== 'candidate') {
      router.replace('/login')
    } else {
      setIsAuthorized(true)
    }
    setIsChecking(false)
  }, [router])

  if (isChecking) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-flex items-center justify-center w-12 h-12 mb-4">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full" />
          </div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-flex items-center justify-center w-12 h-12 mb-4">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full" />
          </div>
          <p className="text-slate-600 font-medium">Verifying access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-100 via-white to-indigo-100 overflow-hidden">
      {/* Sidebar */}
      <div className="flex-shrink-0 border-r border-slate-200">
        <Sidebar role="candidate" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto transition-smooth bg-gradient-to-br from-purple-100 via-white to-indigo-100">
        {children}
      </main>

      {/* Chat Assistant */}
      <div className="flex-shrink-0 border-l border-white/10">
        <ChatAssistant />
      </div>
    </div>
  )
}