'use client'

import { useState } from 'react'
import { Search, X, Check, XCircle } from 'lucide-react'
import ShortlistMessageModal from './ShortlistMessageModal'

interface CandidateApplication {
  candidate_name?: string
  name?: string
  candidate_email?: string
  email?: string
  skills?: string[]
  experience?: number
  location?: string
  title?: string
  job_title?: string
  status?: string
}

interface AiTalentSearchProps {
  applications?: CandidateApplication[]
  onClose?: () => void
}

export default function AiTalentSearch({ applications = [], onClose }: AiTalentSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<CandidateApplication[]>(applications || [])
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateApplication | null>(null)
  const [rejectedEmails, setRejectedEmails] = useState<Set<string>>(new Set())

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setResults(applications || [])
      return
    }

    const q = query.toLowerCase()
    const filtered = (applications || []).filter(candidate => {
      const name = (candidate.candidate_name || candidate.name || '').toLowerCase()
      const email = (candidate.candidate_email || candidate.email || '').toLowerCase()
      const jobTitle = (candidate.title || candidate.job_title || '').toLowerCase()
      const skills = candidate.skills || []
      const experience = candidate.experience || 0

      const matchName = name.includes(q)
      const matchEmail = email.includes(q)
      const matchTitle = jobTitle.includes(q)
      const matchSkills = skills.some(s => String(s).toLowerCase().includes(q))
      const matchExperience = String(experience).includes(q)

      return matchName || matchEmail || matchTitle || matchSkills || matchExperience
    })

    setResults(filtered)
  }

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search candidates with AI (e.g., 'Python backend developer with ML')"
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Found <strong>{results?.length || 0}</strong> candidate{results?.length === 1 ? '' : 's'} {searchQuery && `matching "${searchQuery}"`}
      </div>

      {/* Results Grid */}
      <div className="grid gap-4">
        {(results?.length || 0) > 0 ? (
          results.map((candidate, idx) => {
            const skillMatches = (candidate.skills || []).filter(s =>
              String(s).toLowerCase().includes(searchQuery.toLowerCase())
            )
            const candidateName = candidate.candidate_name || candidate.name || 'Unknown'
            const candidateEmail = candidate.candidate_email || candidate.email || ''

            return (
              <div
                key={`${candidateEmail}-${idx}`}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 rounded-xl p-5 hover:shadow-lg dark:hover:shadow-purple-900/20 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {candidateName}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {candidateEmail}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
                    {candidate.experience || 0} yrs
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {(candidate.title || candidate.job_title) && (
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">Role:</span> {candidate.title || candidate.job_title}
                    </p>
                  )}
                  {candidate.location && (
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">Location:</span> {candidate.location}
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase">
                    Skills ({(candidate.skills?.length) || 0})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(candidate.skills || []).map((skill, i) => {
                      const isMatched = String(skill).toLowerCase().includes(searchQuery.toLowerCase())
                      return (
                        <span
                          key={i}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                            isMatched
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50'
                              : 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                          }`}
                        >
                          {skill}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {/* Status */}
                {candidate.status && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Status: <span className="font-semibold capitalize">{candidate.status}</span>
                  </div>
                )}

                {/* Action Buttons */}
                {!rejectedEmails.has(candidateEmail) && (
                  <div className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setSelectedCandidate(candidate)}
                      className="flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Check size={16} />
                      Shortlist
                    </button>
                    <button
                      onClick={() => setRejectedEmails(new Set([...rejectedEmails, candidateEmail]))}
                      className="flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                )}

                {rejectedEmails.has(candidateEmail) && (
                  <div className="pt-3 text-sm text-red-600 dark:text-red-400 font-semibold text-center">
                    Rejected ✕
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400">No candidates found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Shortlist Message Modal */}
      {selectedCandidate && (
        <ShortlistMessageModal
          candidateName={selectedCandidate.candidate_name || selectedCandidate.name || 'Candidate'}
          candidateEmail={selectedCandidate.candidate_email || selectedCandidate.email || ''}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  )
}
