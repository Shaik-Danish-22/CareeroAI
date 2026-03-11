'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
    router.push('/login')
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

        <div className="glass rounded-2xl p-8 space-y-6">

          {/* Account Info */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Account Information
            </h2>

            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-200 space-y-4">

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>

            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>

          </div>

        </div>
      </div>
    </div>
  )
}
