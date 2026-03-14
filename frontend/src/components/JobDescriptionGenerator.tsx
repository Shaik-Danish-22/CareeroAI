'use client'

import { useState } from 'react'
import { X, Sparkles, Copy, Check } from 'lucide-react'
import { createJob } from '@/lib/api'

interface GeneratedJob {
  summary: string
  responsibilities: string[]
  requiredSkills: string[]
  niceToHaveSkills: string[]
}

export default function JobDescriptionGenerator() {
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState('')
  const [experience, setExperience] = useState('')
  const [techStack, setTechStack] = useState('')
  const [generatedJob, setGeneratedJob] = useState<GeneratedJob | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  const generateDescription = async () => {
    if (!role || !experience || !techStack) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')
    try {
      // Mock AI generation (replace with actual OpenAI API call)
      const mockResponse: GeneratedJob = {
        summary: `We're looking for an experienced ${role} with ${experience} years of experience in modern software development. The ideal candidate will have expertise in ${techStack} and be passionate about building scalable, maintainable solutions.`,
        responsibilities: [
          `Design and implement robust solutions using ${techStack}`,
          'Collaborate with cross-functional teams to deliver high-quality features',
          'Participate in code reviews and architectural discussions',
          'Optimize application performance and ensure scalability',
          'Document code and maintain technical specifications'
        ],
        requiredSkills: techStack.split(',').map(s => s.trim()).filter(s => s),
        niceToHaveSkills: [
          'Experience with CI/CD pipelines',
          'Cloud platform expertise (AWS, GCP, Azure)',
          'Strong understanding of software design patterns',
          'Experience with containerization (Docker, Kubernetes)',
          'Open source contributions'
        ]
      }
      
      setGeneratedJob(mockResponse)
    } catch (err) {
      console.error('Failed to generate job description:', err)
      setError('Failed to generate job description')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    const text = `${generatedJob?.summary}\n\nResponsibilities:\n${generatedJob?.responsibilities.map(r => `• ${r}`).join('\n')}\n\nRequired Skills:\n${generatedJob?.requiredSkills.map(s => `• ${s}`).join('\n')}\n\nNice to Have:\n${generatedJob?.niceToHaveSkills.map(s => `• ${s}`).join('\n')}`
    
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const postJob = async () => {
    if (!generatedJob) return
    
    setPosting(true)
    setError('')
    try {
      const jobData = {
        title: role,
        description: generatedJob.summary,
        job_type: 'Full-time',
        skills: generatedJob.requiredSkills
      }
      
      await createJob(jobData)
      
      // Reset form and close
      setIsOpen(false)
      setRole('')
      setExperience('')
      setTechStack('')
      setGeneratedJob(null)
      setCopied(false)
    } catch (err: any) {
      console.error('Failed to post job:', err)
      setError(err.response?.data?.detail || 'Failed to post job')
    } finally {
      setPosting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center gap-2"
      >
        <Sparkles size={18} />
        Generate Job Description
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-amber-500" size={24} />
            AI Job Description Generator
          </h2>
          <button
            onClick={() => {
              setIsOpen(false)
              setGeneratedJob(null)
              setError('')
            }}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg mb-6">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {!generatedJob ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Job Role/Title
              </label>
              <input
                type="text"
                placeholder="e.g., Senior React Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Required Experience (years)
              </label>
              <input
                type="text"
                placeholder="e.g., 5-7 years"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g., React, TypeScript, Node.js, PostgreSQL"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              onClick={generateDescription}
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Description
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Summary</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {generatedJob.summary}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Responsibilities</h3>
              <ul className="space-y-2">
                {generatedJob.responsibilities.map((resp, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-amber-500 font-bold mt-1">•</span>
                    <span className="text-slate-700 dark:text-slate-300">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedJob.requiredSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Nice to Have</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedJob.niceToHaveSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy Text
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setGeneratedJob(null)
                  setRole('')
                  setExperience('')
                  setTechStack('')
                }}
                className="flex-1 px-4 py-3 bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors"
              >
                Generate Again
              </button>
            </div>

            <button
              onClick={postJob}
              disabled={posting}
              className="w-full px-4 py-3 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {posting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Posting Job...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Post Job
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
