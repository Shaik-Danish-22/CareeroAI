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
  LogOut,
  Menu,
  X
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
    return <div className="w-64 h-screen bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl animate-pulse rounded-lg border border-slate-200 dark:border-slate-700" />
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user_id')
    localStorage.removeItem('email')
    router.push('/')
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-700/50 border border-slate-300 dark:border-slate-600 transition-all text-slate-700 dark:text-slate-300"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <nav
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 
          bg-white dark:bg-slate-900
          border-r border-slate-200 dark:border-slate-700
          shadow-sm
          transform transition-transform duration-300 ease-in-out
          lg:transform-none overflow-y-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo Section */}
        <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            CareeroAI
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 capitalize font-medium tracking-widest">{role}</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
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
                      ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 border-l-2 border-purple-600 shadow-lg shadow-purple-500/20'
                      : 'text-slate-700 dark:text-slate-300 border-l-2 border-transparent hover:bg-purple-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{link.label}</span>
                {isActive && <div className="w-2 h-2 bg-purple-600 rounded-full" />}
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-700" />

        {/* Chat & Logout Section */}
        <div className="flex-shrink-0 p-4 space-y-3">
          {/* Messaging System */}
          <div className="mb-2">
            <MessagingSystem />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all text-slate-700 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 border border-transparent hover:border-red-300 dark:hover:border-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
