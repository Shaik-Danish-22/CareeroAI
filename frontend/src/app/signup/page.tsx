'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register } from '@/lib/api'

export default function SignupPage() {
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-screen bg-slate-50 animate-pulse" />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await register(email, password, role)
      const { access_token, user_id } = response.data

      localStorage.setItem('token', access_token)
      localStorage.setItem('role', role)
      localStorage.setItem('user_id', user_id)

      if (role === 'recruiter') {
        router.push('/recruiter')
      } else {
        router.push('/candidate')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            CareeroAi
          </h1>
          <p className="text-slate-600">Create your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  role === 'candidate'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  role === 'recruiter'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                Recruiter
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}