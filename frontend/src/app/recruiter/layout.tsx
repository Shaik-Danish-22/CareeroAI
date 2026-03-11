'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatAssistant from '@/components/ChatAssistant'

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || role !== 'recruiter') {
      router.replace('/login')
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 text-lg">Checking authorization...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar role="recruiter" />
      <main className="flex-1 overflow-auto">{children}</main>
      <ChatAssistant />
    </div>
  )
}