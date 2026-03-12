'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import MessagingSystem from './MessagingSystem'
import { 
  FileText, 
  Sparkles, 
  BarChart3, 
  Briefcase, 
  User, 
  Briefcase as BriefcaseIcon,
  LogOut
} from 'lucide-react'

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
    return <div className="w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-950 animate-pulse" />
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user_id')
    router.push('/login')
  }

  const recruiterLinks = [
    { href: '/recruiter', label: 'Jobs', icon: Briefcase },
    { href: '/recruiter/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/recruiter/profile', label: 'Profile', icon: User },
  ]

  const candidateLinks = [
    { href: '/candidate', label: 'Resume', icon: FileText },
    { href: '/candidate/recommendations', label: 'Recommendations', icon: Sparkles },
    { href: '/candidate/skill-gap', label: 'Skill Gap', icon: BarChart3 },
    { href: '/candidate/applications', label: 'Applications', icon: BriefcaseIcon },
    { href: '/candidate/profile', label: 'Profile', icon: User },
  ]

  const links = role === 'recruiter' ? recruiterLinks : candidateLinks

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <nav
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 
          backdrop-blur-xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-r border-white/10
          transform transition-transform duration-300 ease-in-out
          lg:transform-none overflow-y-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo Section */}
        <div className="flex-shrink-0 border-b border-white/10 p-6 bg-gradient-to-br from-slate-800/50 to-transparent">
          <h2 className="text-2xl font-900 bg-gradient-to-r from-blue-400 to-primary-400 bg-clip-text text-transparent">
            CAREERO<span className="text-primary-400">AI</span>
          </h2>
          <p className="text-xs text-slate-400 mt-2 capitalize font-medium tracking-widest">{role}</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-semibold 
                  transition-all duration-300 ease-out
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/35 to-primary-600/25 text-white border-l-2 border-blue-400 shadow-lg shadow-blue-500/20'
                      : 'text-slate-300 border-l-2 border-transparent hover:text-white hover:bg-blue-500/15 hover:shadow-lg hover:shadow-blue-500/10'
                  }
                `}
              >
                {link.icon && <link.icon className="w-5 h-5 flex-shrink-0 text-slate-400 group-hover:text-blue-300" />}
                <span className="flex-1">{link.label}</span>
                {isActive && (
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Chat & Logout Section */}
        <div className="flex-shrink-0 p-4 space-y-3 bg-gradient-to-t from-slate-950/50 to-transparent">
          {/* Messaging System */}
          <div className="mb-2">
            <MessagingSystem />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold 
              transition-all duration-200
              text-slate-400 hover:text-white hover:bg-rose-500/10 hover:border-rose-500/30
              border border-transparent
            `}
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
