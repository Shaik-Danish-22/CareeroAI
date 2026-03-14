'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import RobotMascot3D from '@/components/RobotMascot3D'
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (token && role) {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <>
      <Navbar />
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Floating Blobs Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Purple blob - top left */}
          <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400 to-purple-200 opacity-30 blur-3xl animate-[float_8s_ease-in-out_infinite]" />

          {/* Indigo blob - top right */}
          <div className="absolute -top-20 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-200 opacity-30 blur-3xl animate-[float_10s_ease-in-out_infinite_2s]" />

          {/* Purple blob - bottom center */}
          <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-300 to-indigo-300 opacity-20 blur-3xl animate-[float_12s_ease-in-out_infinite_4s]" />
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className="space-y-8">
              {/* Large CareeroAI Branding */}
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-widest text-purple-600">
                  Next generation careers
                </p>
                <h1 className="text-6xl lg:text-7xl font-bold">
                  <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    CareeroAI
                  </span>
                </h1>
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-600">AI-Powered Career Intelligence</span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                  Your AI Career Intelligence Platform
                </h2>

                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                  Discover the perfect career match powered by advanced AI. Get personalized recommendations, master in-demand skills, and accelerate your growth.
                </p>
              </div>

              {/* CTA Buttons */}
              {isLoggedIn ? (
                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={() => {
                      const role = localStorage.getItem('role')
                      router.push(role === 'recruiter' ? '/recruiter' : '/candidate')
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-xl hover:shadow-purple-500/50 hover:scale-[1.05] transition-all duration-300 font-semibold group"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-xl hover:shadow-purple-500/50 hover:scale-[1.05] transition-all duration-300 font-semibold group"
                  >
                    Start Free Today
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/80 text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-300 font-semibold backdrop-blur-xl"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Features List */}
              <div className="space-y-3 pt-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">AI analyzes your skills and experience</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Get personalized job recommendations</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Learn skills to advance your career</span>
                </div>
              </div>
            </div>

            {/* Right Side - Animated Robot Mascot */}
            <div className="relative hidden lg:flex justify-center items-start pt-8">
              <div className="w-full h-96">
                <RobotMascot3D />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose CareeroAI?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powered by advanced AI to help you find the perfect career match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Smart Matching',
                description: 'AI analyzes your skills and finds jobs that align with your goals',
                icon: '🎯',
              },
              {
                title: 'Skill Gap Analysis',
                description: 'Get insights into skills you need to learn and free courses to master them',
                icon: '📊',
              },
              {
                title: 'AI Interviews',
                description: 'Practice mock interviews with AI and get real-time feedback',
                icon: '🎤',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>


      </div>
    </>
  )
}