'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register } from '@/lib/api'

export default function SignupPage() {
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-screen bg-dark-cinematic animate-pulse" />
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
    <div className="min-h-screen bg-dark-cinematic flex items-center justify-center px-4">
      {/* Animated Blur Shapes */}
      <div className="absolute top-20 right-20 w-72 h-72 blur-shape-primary" />
      <div className="absolute bottom-40 left-10 w-80 h-80 blur-shape-secondary opacity-40" />

      {/* Signup Card Container */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Card Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-blue-500/10 rounded-3xl blur-2xl -z-10" />

        {/* Glass Card */}
        <div className="glass-card-dark p-8 space-y-6 border border-white/20">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-900 text-white">
              CAREERO<span className="text-primary-400">AI</span>
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Create your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl backdrop-blur">
              <p className="text-sm text-rose-400 font-medium flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 block">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all duration-200 ${
                    role === 'candidate'
                      ? 'glass-card-dark border-primary-400 bg-primary-500/15 shadow-lg shadow-primary-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10 text-slate-300'
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
                      ? 'glass-card-dark border-emerald-400 bg-emerald-500/15 shadow-lg shadow-emerald-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <span className="text-lg block mb-1">💼</span>
                  <span className="text-sm">Recruiter</span>
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-premium"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-premium"
                minLength={6}
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 block">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-premium"
                required
              />
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-xs text-text-secondary mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}