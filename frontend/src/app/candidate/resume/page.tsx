'use client'

import { useEffect, useState } from 'react'
import { getResume, saveResume } from '@/lib/api'
import { Github, Linkedin, Globe, Code2, ExternalLink } from 'lucide-react'

export default function ResumePage() {
  const [resume, setResume] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    skills: [] as string[],
    experience: [] as any[],
    education: [] as any[],
    professional_links: {
      github: '',
      linkedin: '',
      portfolio: '',
      hackerrank: '',
      leetcode: '',
      other: ''
    }
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)

  const fetchResume = async () => {
    try {
      const response = await getResume()
      if (response.data && Object.keys(response.data).length > 0) {
        setResume({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          location: response.data.location || '',
          title: response.data.title || '',
          summary: response.data.summary || '',
          skills: response.data.skills || [],
          experience: response.data.experience || [],
          education: response.data.education || [],
          professional_links: response.data.professional_links || {
            github: '',
            linkedin: '',
            portfolio: '',
            hackerrank: '',
            leetcode: '',
            other: ''
          }
        })
      }
    } catch (error) {
      console.error('Failed to fetch resume:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResume()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveResume(resume)
      setIsEditMode(false)
      alert('Resume saved successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to save resume')
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    if (!skillInput.trim()) return
    if (resume.skills.includes(skillInput.trim())) return

    setResume({
      ...resume,
      skills: [...resume.skills, skillInput.trim()]
    })
    setSkillInput('')
  }

  const removeSkill = (skill: string) => {
    setResume({
      ...resume,
      skills: resume.skills.filter(s => s !== skill)
    })
  }

  const updateProfessionalLink = (platform: string, value: string) => {
    setResume({
      ...resume,
      professional_links: {
        ...resume.professional_links,
        [platform]: value
      }
    })
  }

  const openLink = (url: string) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-10 animate-pulse border border-white/30 dark:border-slate-700/30">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 dark:border-slate-700/30 p-10 space-y-10">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              My Resume
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Professional profile & career overview</p>
          </div>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl active:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[inset_0_-2px_6px_rgba(0,0,0,0.15)]"
          >
            {isEditMode ? '✕ Cancel' : '✎ Edit Resume'}
          </button>
        </div>

        <div className="space-y-10">

          {/* PERSONAL INFORMATION */}
          <section className="border-b border-slate-200 dark:border-slate-700 pb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full" />
              Personal Information
            </h2>
            {isEditMode ? (
              <div className="grid grid-cols-2 gap-6">
                <Input label="Full Name" value={resume.name}
                  onChange={v => setResume({ ...resume, name: v })} />
                <Input label="Email" type="email" value={resume.email}
                  onChange={v => setResume({ ...resume, email: v })} />
                <Input label="Phone" value={resume.phone}
                  onChange={v => setResume({ ...resume, phone: v })} />
                <Input label="Location" value={resume.location}
                  onChange={v => setResume({ ...resume, location: v })} />
                <Input label="Job Title" value={resume.title}
                  onChange={v => setResume({ ...resume, title: v })} colSpan={2} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-8">
                <ViewField label="Full Name" value={resume.name} />
                <ViewField label="Email" value={resume.email} />
                <ViewField label="Phone" value={resume.phone} />
                <ViewField label="Location" value={resume.location} />
                <ViewField label="Job Title" value={resume.title} colSpan={2} />
              </div>
            )}
          </section>

          {/* PROFESSIONAL SUMMARY */}
          <section className="border-b border-slate-200 dark:border-slate-700 pb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full" />
              Professional Summary
            </h2>
            {isEditMode ? (
              <textarea
                className="w-full h-36 rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={resume.summary}
                onChange={e => setResume({ ...resume, summary: e.target.value })}
                placeholder="Write a brief professional summary..."
              />
            ) : (
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
                {resume.summary || 'No summary provided yet'}
              </p>
            )}
          </section>

          {/* SKILLS */}
          <section className="border-b border-slate-200 dark:border-slate-700 pb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full" />
              Skills
            </h2>
            {isEditMode && (
              <div className="flex gap-3 mb-6">
                <input
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter a skill"
                  onKeyDown={e => e.key === 'Enter' && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:bg-purple-800 transition-colors font-semibold shadow-lg hover:shadow-xl active:shadow-md shadow-[inset_0_-2px_6px_rgba(0,0,0,0.15)]"
                >
                  Add Skill
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {resume.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium flex items-center gap-2 border border-purple-200 dark:border-purple-700/50 hover:shadow-md dark:hover:shadow-purple-900/50 transition-all"
                >
                  {skill}
                  {isEditMode && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="font-bold hover:text-purple-900 dark:hover:text-purple-200 text-lg leading-none"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </section>

          {/* PROFESSIONAL LINKS */}
          <section className="border-b border-slate-200 dark:border-slate-700 pb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full" />
              Professional Links
            </h2>
            {isEditMode ? (
              <div className="grid grid-cols-2 gap-6">
                <ProfessionalLinkInput
                  label="GitHub"
                  value={resume.professional_links.github}
                  onChange={v => updateProfessionalLink('github', v)}
                  icon={<Github className="w-5 h-5" />}
                />
                <ProfessionalLinkInput
                  label="LinkedIn"
                  value={resume.professional_links.linkedin}
                  onChange={v => updateProfessionalLink('linkedin', v)}
                  icon={<Linkedin className="w-5 h-5" />}
                />
                <ProfessionalLinkInput
                  label="Portfolio Website"
                  value={resume.professional_links.portfolio}
                  onChange={v => updateProfessionalLink('portfolio', v)}
                  icon={<Globe className="w-5 h-5" />}
                />
                <ProfessionalLinkInput
                  label="HackerRank"
                  value={resume.professional_links.hackerrank}
                  onChange={v => updateProfessionalLink('hackerrank', v)}
                  icon={<Code2 className="w-5 h-5" />}
                />
                <ProfessionalLinkInput
                  label="LeetCode"
                  value={resume.professional_links.leetcode}
                  onChange={v => updateProfessionalLink('leetcode', v)}
                  icon={<Code2 className="w-5 h-5" />}
                />
                <ProfessionalLinkInput
                  label="Other Links"
                  value={resume.professional_links.other}
                  onChange={v => updateProfessionalLink('other', v)}
                  icon={<ExternalLink className="w-5 h-5" />}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {resume.professional_links.github && (
                  <ProfessionalLinkView
                    label="GitHub"
                    url={resume.professional_links.github}
                    onClick={() => openLink(resume.professional_links.github)}
                    icon={<Github className="w-5 h-5" />}
                  />
                )}
                {resume.professional_links.linkedin && (
                  <ProfessionalLinkView
                    label="LinkedIn"
                    url={resume.professional_links.linkedin}
                    onClick={() => openLink(resume.professional_links.linkedin)}
                    icon={<Linkedin className="w-5 h-5" />}
                  />
                )}
                {resume.professional_links.portfolio && (
                  <ProfessionalLinkView
                    label="Portfolio"
                    url={resume.professional_links.portfolio}
                    onClick={() => openLink(resume.professional_links.portfolio)}
                    icon={<Globe className="w-5 h-5" />}
                  />
                )}
                {resume.professional_links.hackerrank && (
                  <ProfessionalLinkView
                    label="HackerRank"
                    url={resume.professional_links.hackerrank}
                    onClick={() => openLink(resume.professional_links.hackerrank)}
                    icon={<Code2 className="w-5 h-5" />}
                  />
                )}
                {resume.professional_links.leetcode && (
                  <ProfessionalLinkView
                    label="LeetCode"
                    url={resume.professional_links.leetcode}
                    onClick={() => openLink(resume.professional_links.leetcode)}
                    icon={<Code2 className="w-5 h-5" />}
                  />
                )}
                {resume.professional_links.other && (
                  <ProfessionalLinkView
                    label="Other"
                    url={resume.professional_links.other}
                    onClick={() => openLink(resume.professional_links.other)}
                    icon={<ExternalLink className="w-5 h-5" />}
                  />
                )}
                {!Object.values(resume.professional_links).some(v => v) && (
                  <p className="text-slate-500 col-span-2">No professional links added yet</p>
                )}
              </div>
            )}
          </section>

          {/* SAVE BUTTON */}
          {isEditMode && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl active:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:scale-100 shadow-[inset_0_-2px_6px_rgba(0,0,0,0.15)]"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}

        </div>
      </div>
    </div>
  )
}

/* ----------------------------- */
/* Reusable Input Component */
/* ----------------------------- */

function Input({
  label,
  value,
  onChange,
  type = 'text',
  colSpan = 1
}: {
  label: string
  value: any
  onChange: (v: string) => void
  type?: string
  colSpan?: number
}) {
  return (
    <div className={colSpan > 1 ? `col-span-${colSpan}` : ''}>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${colSpan > 1 ? 'col-span-' + colSpan : ''}`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  )
}

function ViewField({
  label,
  value,
  colSpan = 1
}: {
  label: string
  value: any
  colSpan?: number
}) {
  return (
    <div className={colSpan > 1 ? `col-span-${colSpan}` : ''}>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-lg text-slate-900 dark:text-white font-medium">{value || '—'}</p>
    </div>
  )
}

function ProfessionalLinkInput({
  label,
  value,
  onChange,
  icon
}: {
  label: string
  value: string
  onChange: (v: string) => void
  icon: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <input
        type="url"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        placeholder={`https://...`}
      />
    </div>
  )
}

function ProfessionalLinkView({
  label,
  url,
  onClick,
  icon
}: {
  label: string
  url: string
  onClick: () => void
  icon: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
    >
      <div className="text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-left">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400">{url}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-auto group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
    </button>
  )
}
