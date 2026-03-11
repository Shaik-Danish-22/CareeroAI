'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import MessagingSystem from './MessagingSystem'

interface SidebarProps {
  role: 'recruiter' | 'candidate'
}

export default function Sidebar({ role }: SidebarProps) {
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-64 h-screen bg-slate-900 animate-pulse" />
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user_id')
    router.push('/login')
  }

  const recruiterLinks = [
    { href: '/recruiter', label: 'Jobs', icon: '💼' },
    { href: '/recruiter/analytics', label: 'Analytics', icon: '📊' },
    { href: '/recruiter/profile', label: 'Profile', icon: '👤' },
  ]

  const candidateLinks = [
    { href: '/candidate', label: 'Resume', icon: '📄' },
    { href: '/candidate/recommendations', label: 'Recommendations', icon: '✨' },

    // ✅ Skill Gap Analysis added here
    { href: '/candidate/skill-gap', label: 'Skill Gap Analysis', icon: '📊' },

    { href: '/candidate/applications', label: 'Applications', icon: '📬' },
    { href: '/candidate/profile', label: 'Profile', icon: '👤' },
  ]

  const links = role === 'recruiter' ? recruiterLinks : candidateLinks

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-xl"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform lg:transform-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              CareeroAi
            </h2>
            <p className="text-slate-400 text-sm mt-1 capitalize">{role}</p>
          </div>
          <div className="relative">
            <MessagingSystem />
          </div>
        </div>

        <nav className="px-4 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 p-4">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
