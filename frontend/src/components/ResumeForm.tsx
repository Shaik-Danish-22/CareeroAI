'use client'

import { useEffect, useState } from 'react'

interface ResumeData {
  name: string
  email: string
  phone: string
  skills: string[]
  total_experience: number
  relevant_experience: number
  current_location: string
  preferred_location: string
  professional_summary: string
  github_username: string
}

interface ResumeFormProps {
  initialData?: ResumeData
  onSave: (data: ResumeData) => Promise<void>
  loading?: boolean
}

export default function ResumeForm({ initialData, onSave, loading = false }: ResumeFormProps) {
  const [mounted, setMounted] = useState(false)
  const [resume, setResume] = useState<ResumeData>({
    name: '',
    email: '',
    phone: '',
    skills: [],
    total_experience: 0,
    relevant_experience: 0,
    current_location: '',
    preferred_location: '',
    professional_summary: '',
    github_username: ''
  })
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
    if (initialData) {
      setResume(initialData)
    }
  }, [initialData])

  if (!mounted) {
    return <div className="glass rounded-2xl p-8 animate-pulse h-96" />
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!resume.name.trim()) newErrors.name = 'Name is required'
    if (!resume.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(resume.email)) newErrors.email = 'Invalid email format'
    if (!resume.phone.trim()) newErrors.phone = 'Phone is required'
    if (!resume.current_location.trim()) newErrors.current_location = 'Current location is required'
    if (!resume.preferred_location.trim()) newErrors.preferred_location = 'Preferred location is required'
    if (!resume.professional_summary.trim()) newErrors.professional_summary = 'Professional summary is required'
    if (resume.skills.length === 0) newErrors.skills = 'At least one skill is required'
    if (resume.total_experience < 0) newErrors.total_experience = 'Experience cannot be negative'
    if (resume.relevant_experience < 0) newErrors.relevant_experience = 'Experience cannot be negative'
    if (resume.relevant_experience > resume.total_experience) {
      newErrors.relevant_experience = 'Relevant experience cannot exceed total experience'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      alert('Please fix the errors in the form')
      return
    }

    setSaving(true)
    try {
      await onSave(resume)
    } catch (error) {
      console.error('Failed to save resume:', error)
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    const trimmedSkill = skillInput.trim()
    if (trimmedSkill && !resume.skills.includes(trimmedSkill)) {
      setResume({ ...resume, skills: [...resume.skills, trimmedSkill] })
      setSkillInput('')
      // Clear skill error if exists
      if (errors.skills) {
        const newErrors = { ...errors }
        delete newErrors.skills
        setErrors(newErrors)
      }
    }
  }

  const removeSkill = (skill: string) => {
    setResume({ ...resume, skills: resume.skills.filter(s => s !== skill) })
  }

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Resume Builder</h2>
        <p className="text-slate-600">Complete your profile for better job matching</p>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Personal Information
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={resume.name}
              onChange={(e) => setResume({ ...resume, name: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={resume.email}
              onChange={(e) => setResume({ ...resume, email: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={resume.phone}
              onChange={(e) => setResume({ ...resume, phone: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* GitHub Username */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              GitHub Username <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              value={resume.github_username}
              onChange={(e) => setResume({ ...resume, github_username: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="johndoe"
            />
            <p className="text-xs text-slate-500 mt-1">We'll fetch your public repos automatically</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Location
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Current Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Current Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={resume.current_location}
              onChange={(e) => setResume({ ...resume, current_location: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.current_location ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="San Francisco, CA"
            />
            {errors.current_location && <p className="text-red-500 text-xs mt-1">{errors.current_location}</p>}
          </div>

          {/* Preferred Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Preferred Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={resume.preferred_location}
              onChange={(e) => setResume({ ...resume, preferred_location: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.preferred_location ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Remote or City Name"
            />
            {errors.preferred_location && <p className="text-red-500 text-xs mt-1">{errors.preferred_location}</p>}
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Experience
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Total Experience */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Total Experience (years) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={resume.total_experience}
              onChange={(e) => setResume({ ...resume, total_experience: parseFloat(e.target.value) || 0 })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.total_experience ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.total_experience && <p className="text-red-500 text-xs mt-1">{errors.total_experience}</p>}
          </div>

          {/* Relevant Experience */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Relevant Experience (years) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={resume.relevant_experience}
              onChange={(e) => setResume({ ...resume, relevant_experience: parseFloat(e.target.value) || 0 })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.relevant_experience ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.relevant_experience && <p className="text-red-500 text-xs mt-1">{errors.relevant_experience}</p>}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Professional Summary
        </h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Summary <span className="text-red-500">*</span>
          </label>
          <textarea
            value={resume.professional_summary}
            onChange={(e) => setResume({ ...resume, professional_summary: e.target.value })}
            rows={5}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.professional_summary ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Write a brief summary of your professional background, key achievements, and career goals..."
          />
          {errors.professional_summary && <p className="text-red-500 text-xs mt-1">{errors.professional_summary}</p>}
          <p className="text-xs text-slate-500 mt-1">
            {resume.professional_summary.length} / 500 characters
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Skills <span className="text-red-500">*</span>
        </h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Add Skills
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.skills ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="e.g., Python, React, Machine Learning"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          {errors.skills && <p className="text-red-500 text-xs mb-2">{errors.skills}</p>}

          {/* Skills Display */}
          {resume.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
              {resume.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2 group hover:bg-blue-200 transition-colors"
                >
                  <span className="font-medium">{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-blue-900 hover:text-red-600 transition-colors"
                    title="Remove skill"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-500 mt-2">
            Press Enter or click Add button to add skills. Click × to remove.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={saving || loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving || loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Resume
            </>
          )}
        </button>
      </div>
    </form>
  )
}