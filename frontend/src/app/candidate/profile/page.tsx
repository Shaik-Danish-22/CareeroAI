'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { LogOut } from 'lucide-react'

export default function ProfilePage() {

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  })

  const [saving, setSaving] = useState(false)

  const router = useRouter()

  // ----------------------------------
  // Load profile from localStorage
  // ----------------------------------
  useEffect(() => {
    const email = localStorage.getItem('email') || ''
    const name = localStorage.getItem('profile_name') || ''
    const phone = localStorage.getItem('profile_phone') || ''
    const location = localStorage.getItem('profile_location') || ''

    setProfile({ email, name, phone, location })
  }, [])

  // ----------------------------------
  // Save Profile
  // ----------------------------------
  const handleSave = async () => {
    setSaving(true)

    try {
      localStorage.setItem('profile_name', profile.name)
      localStorage.setItem('profile_phone', profile.phone)
      localStorage.setItem('profile_location', profile.location)

      alert('Profile saved successfully!')
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  // ----------------------------------
  // Logout
  // ----------------------------------
  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          My Profile
        </h1>

        <p className="text-slate-600 mb-8">
          Manage your account settings
        </p>

        <div className="rounded-2xl bg-white/50 backdrop-blur-xl border border-slate-200 p-8 space-y-6 shadow-lg">

          {/* Account Info */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Account Information
            </h2>

            <div className="space-y-4">

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white/30 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                  placeholder="City, Country"
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                />
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-200 space-y-3 flex flex-col sm:flex-row gap-3">

            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>

            <Button
              variant="secondary"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>

          </div>

        </div>
      </div>
    </div>
  )
}
