'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, FileText, Target, Zap, Briefcase, BookOpen, X } from 'lucide-react'

type Command = {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  action: () => void
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const [userRole, setUserRole] = useState<'candidate' | 'recruiter'>('candidate')

  useEffect(() => {
    const role = localStorage.getItem('role') as 'candidate' | 'recruiter' | null
    if (role) setUserRole(role)

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K or Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(!isOpen)
        setSearch('')
      }
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const candidateCommands: Command[] = [
    {
      id: 'resume',
      label: 'Open Resume',
      description: 'Go to your resume page',
      icon: <FileText className="w-5 h-5" />,
      action: () => {
        router.push('/candidate/resume')
        setIsOpen(false)
      }
    },
    {
      id: 'recommendations',
      label: 'View Recommendations',
      description: 'See recommended job matches',
      icon: <Target className="w-5 h-5" />,
      action: () => {
        router.push('/candidate')
        setIsOpen(false)
      }
    },
    {
      id: 'applications',
      label: 'My Applications',
      description: 'Track your applications',
      icon: <Briefcase className="w-5 h-5" />,
      action: () => {
        router.push('/candidate/applications')
        setIsOpen(false)
      }
    },
    {
      id: 'interview',
      label: 'Start AI Interview',
      description: 'Begin practice interview',
      icon: <Zap className="w-5 h-5" />,
      action: () => {
        router.push('/candidate/interview')
        setIsOpen(false)
      }
    }
  ]

  const recruiterCommands: Command[] = [
    {
      id: 'search-candidates',
      label: 'Search Candidates',
      description: 'Find candidates with AI search',
      icon: <Search className="w-5 h-5" />,
      action: () => {
        // This command will activate the search in recruiter dashboard
        setIsOpen(false)
        // Emit event or set global state
        window.dispatchEvent(new Event('open-talent-search'))
      }
    },
    {
      id: 'generate-job',
      label: 'Generate Job Description',
      description: 'Create job description with AI',
      icon: <BookOpen className="w-5 h-5" />,
      action: () => {
        window.dispatchEvent(new Event('open-job-generator'))
        setIsOpen(false)
      }
    },
    {
      id: 'post-job',
      label: 'Post New Job',
      description: 'Create a new job posting',
      icon: <Briefcase className="w-5 h-5" />,
      action: () => {
        router.push('/recruiter')
        setIsOpen(false)
        window.dispatchEvent(new Event('open-post-job-modal'))
      }
    },
    {
      id: 'view-jobs',
      label: 'View All Jobs',
      description: 'See all your job postings',
      icon: <Zap className="w-5 h-5" />,
      action: () => {
        router.push('/recruiter')
        setIsOpen(false)
      }
    }
  ]

  const commands = userRole === 'recruiter' ? recruiterCommands : candidateCommands
  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Palette Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Input */}
          <div className="border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search commands..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 outline-none text-lg"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filtered.length > 0 ? (
              <div className="space-y-1 p-2">
                {filtered.map(cmd => (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-start gap-3 group"
                  >
                    <div className="text-slate-600 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 mt-0.5">
                      {cmd.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{cmd.label}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{cmd.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-500 dark:text-slate-400">No commands found</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-2 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-600 dark:text-slate-400">
            <div>Press <kbd className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-slate-900 dark:text-white font-semibold">ESC</kbd> to close</div>
            <div>v1.0</div>
          </div>
        </div>
      </div>
    </>
  )
}
