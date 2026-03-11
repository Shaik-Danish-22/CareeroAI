'use client'

import { useEffect, useState } from 'react'
import { getResume, saveResume } from '@/lib/api'

export default function ResumePage() {

  const [resume, setResume] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    summary: '',
    skills: [] as string[],
    experience: [] as any[],
    education: [] as any[],
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [skillInput, setSkillInput] = useState('')

  // ------------------------
  // Fetch Resume (UPDATED)
  // ------------------------
  const fetchResume = async () => {
    try {
      const response = await getResume()

      if (response.data && Object.keys(response.data).length > 0) {
        setResume({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          title: response.data.title || '',
          summary: response.data.summary || '',
          skills: response.data.skills || [],
          experience: response.data.experience || [],
          education: response.data.education || [],
        })
      }
    } catch (error) {
      console.error('Failed to fetch resume:', error)
    } finally {
      setLoading(false)
    }
  }

  // ------------------------
  // Load on Mount
  // ------------------------
  useEffect(() => {
    fetchResume()
  }, [])

  // ------------------------
  // Save Resume
  // ------------------------
  const handleSave = async () => {
    setSaving(true)
    try {
      await saveResume(resume)
      alert('Resume saved successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to save resume')
    } finally {
      setSaving(false)
    }
  }

  // ------------------------
  // Skills
  // ------------------------
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

  // ------------------------
  // Loading UI
  // ------------------------
  if (loading) {
    return (
      <div className="p-10">
        <div className="glass p-8 rounded-xl animate-pulse h-40"></div>
      </div>
    )
  }

  // ------------------------
  // UI
  // ------------------------
  return (
    <div className="p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">My Resume</h1>
        <p className="text-slate-600 mb-6">Build your professional resume</p>

        <div className="glass p-8 rounded-xl space-y-6">

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input label="Full Name" value={resume.name}
              onChange={v => setResume({ ...resume, name: v })} />

            <Input label="Email" value={resume.email}
              onChange={v => setResume({ ...resume, email: v })} />

            <Input label="Phone" value={resume.phone}
              onChange={v => setResume({ ...resume, phone: v })} />

            <Input label="Job Title"
              value={resume.title}
              onChange={v => setResume({ ...resume, title: v })} />

          </div>

          {/* SUMMARY */}
          <div>
            <label className="font-medium">Professional Summary</label>
            <textarea
              rows={5}
              className="input"
              value={resume.summary}
              onChange={e =>
                setResume({ ...resume, summary: e.target.value })
              }
            />
          </div>

          {/* SKILLS */}
          <div>
            <label className="font-medium">Skills</label>

            <div className="flex gap-2 mt-2">
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                className="input flex-1"
                placeholder="Add a skill"
                onKeyDown={e => e.key === 'Enter' && addSkill()}
              />
              <button
                onClick={addSkill}
                className="btn-primary">
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {resume.skills.map((skill, i) => (
                <span key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2">
                  {skill}
                  <button onClick={() => removeSkill(skill)}>✕</button>
                </span>
              ))}
            </div>
          </div>

          {/* SAVE */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold">

            {saving ? 'Saving...' : 'Save Resume'}

          </button>

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
  type = 'text'
}: {
  label: string
  value: any
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div>
      <label className="font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input"
      />
    </div>
  )
}
