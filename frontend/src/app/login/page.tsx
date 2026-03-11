'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log("🔐 Logging in...")
      
      const response = await login(email, password)
      const { access_token, role, user_id, email: userEmail } = response.data

      console.log("✅ Login successful - Role:", role)
      
      // Store credentials
      localStorage.setItem("token", access_token)
      localStorage.setItem("role", role)
      localStorage.setItem("user_id", user_id)
      localStorage.setItem("email", userEmail)

      // Redirect based on role
      if (role === "recruiter") {
        console.log("➡️ Redirecting to /recruiter")
        router.push("/recruiter")
      } else {
        console.log("➡️ Redirecting to /candidate")
        router.push("/candidate")
      }
      
    } catch (err: any) {
      console.error("❌ Login failed:", err)
      setError(err.response?.data?.detail || 'Login failed')
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
          <p className="text-slate-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
// 1
// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { login } from '@/lib/api'

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')

//     try {
//       const response = await login(email, password)
//       // const { access_token, role, user_id } = response.data
      

//     const { access_token, role, user_id } = response.data

// localStorage.setItem("token", access_token)
// localStorage.setItem("role", role)
// localStorage.setItem("user_id", user_id)

// if (role === "recruiter") {
//   router.push("/recruiter")
// } else {
//   router.push("/candidate")
// }
//   //     localStorage.setItem('token', access_token)
//   //     localStorage.setItem('role', role)
//   //     localStorage.setItem('user_id', user_id)

//   //     if (role === 'recruiter') {
//   //       router.push('/recruiter')
//   //     } else {
//   //       router.push('/candidate')
//   //     }
//     } catch (err: any) {
//       setError(err.response?.data?.detail || 'Login failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 flex items-center justify-center p-4">
//       <div className="glass rounded-2xl p-8 w-full max-w-md shadow-2xl">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
//             CareeroAi
//           </h1>
//           <p className="text-slate-600">Sign in to your account</p>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
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