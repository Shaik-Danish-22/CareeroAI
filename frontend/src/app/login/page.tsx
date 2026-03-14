'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/lib/api'
import { Eye, EyeOff } from 'lucide-react'
import DarkModeToggle from '@/components/DarkModeToggle'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await login(email, password)
      const { access_token, role, user_id, email: userEmail } = response.data

      localStorage.setItem('token', access_token)
      localStorage.setItem('role', role)
      localStorage.setItem('user_id', user_id)
      localStorage.setItem('email', userEmail)

      if (role === 'recruiter') {
        router.push('/recruiter')
      } else {
        router.push('/candidate')
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <DarkModeToggle />
      
      {/* Login Card Container */}
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
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Welcome back
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

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-purple-600" 
                />
                <span className="text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <Link href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors">
                Forgot?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 font-semibold disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
            Don't have an account?{' '}
            <Link href="/signup" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-xs text-slate-600 dark:text-slate-400 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
//             className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
//           >
//             {loading ? 'Signing in...' : 'Sign In'}
//           </button>
//         </form>

//         <div className="mt-6 text-center text-sm text-slate-600">
//           Don't have an account?{' '}
//           <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
//             Sign up
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }




// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { login } from '@/lib/api'

// export default function LoginPage() {

//   const router = useRouter()

//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     console.log("Submitting login...")

//     setLoading(true)
//     setError('')

//     try {

//       const response = await login(email, password)

//       console.log("LOGIN RESPONSE:", response.data)

//       const { access_token, role, user_id } = response.data

//       localStorage.setItem('token', access_token)
//       localStorage.setItem('role', role)
//       localStorage.setItem('user_id', user_id)

//       // redirect
//       if (role === "recruiter") {
//         window.location.href = "/recruiter"
//       } else {
//         window.location.href = "/candidate"
//       }

//     } catch (err: any) {

//       console.error("LOGIN ERROR:", err)

//       const message =
//         err?.response?.data?.detail?.[0]?.msg ||
//         err?.response?.data?.detail ||
//         "Login failed"

//       setError(String(message))

//     } finally {

//       setLoading(false)

//     }
//   }

//   return (

//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50">

//       <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

//         <h1 className="text-3xl font-bold text-center mb-2">CareeroAI</h1>
//         <p className="text-center text-gray-500 mb-6">Sign in to your account</p>

//         {error && (
//           <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>

//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e)=>setEmail(e.target.value)}
//             className="w-full border p-3 rounded mb-4"
//             required
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e)=>setPassword(e.target.value)}
//             className="w-full border p-3 rounded mb-4"
//             required
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white p-3 rounded"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>

//         </form>

//         <p className="text-center text-sm mt-4">
//           Don't have an account?{" "}
//           <Link href="/signup" className="text-blue-600">
//             Sign up
//           </Link>
//         </p>

//       </div>

//     </div>

//   )
// }