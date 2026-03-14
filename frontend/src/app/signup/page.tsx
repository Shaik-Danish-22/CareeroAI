'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register } from '@/lib/api'
import { Eye, EyeOff } from 'lucide-react'
import DarkModeToggle from '@/components/DarkModeToggle'

export default function SignupPage() {
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-100 dark:from-slate-900 via-white dark:via-slate-800 to-indigo-100 dark:to-slate-900 animate-pulse" />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <DarkModeToggle />
      
      {/* Signup Card Container */}
      <div className="w-full max-w-md">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200/40 dark:from-purple-900/20 via-white/0 dark:via-transparent to-indigo-200/40 dark:to-indigo-900/20 rounded-3xl blur-3xl -z-10" />

        {/* Glass Panel */}
        <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 dark:border-slate-700/40 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              CareeroAI
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
              Create your career account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all duration-200 ${
                    role === 'candidate'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 shadow-lg shadow-purple-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-lg block mb-1">👩‍💼</span>
                  <span className="text-sm">Candidate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all duration-200 ${
                    role === 'recruiter'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 shadow-lg shadow-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-lg block mb-1">💼</span>
                  <span className="text-sm">Recruiter</span>
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                required
              />
            </div>

            {/* Password Input with Visibility Toggle */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 pr-12"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Input with Visibility Toggle */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 font-semibold disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}