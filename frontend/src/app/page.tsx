'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-dark-cinematic">
      {/* Animated Spotlight Background */}
      <div className="spotlight" style={{
        '--x': `${mousePosition.x / window.innerWidth * 100}%`,
        '--y': `${mousePosition.y / window.innerHeight * 100}%`,
      } as any} />

      {/* Floating Blur Shapes */}
      <div className="absolute top-10 left-10 w-72 h-72 blur-shape-primary opacity-60" />
      <div className="absolute bottom-20 right-20 w-96 h-96 blur-shape-secondary opacity-40" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 blur-shape-primary opacity-30" />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Hero Title & Description */}
            <div className="space-y-8 animate-fade-in">
              {/* Main Title with Gradient */}
              <div>
                <h1 className="text-6xl md:text-8xl font-900 leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                    CAREERO
                  </span>
                  <span className="bg-gradient-to-r from-blue-400 to-primary-400 bg-clip-text text-transparent">
                    AI
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 mt-6 font-light tracking-wide">
                  AI-powered hiring and career intelligence
                </p>
              </div>

              {/* Description */}
              <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
                Discover the right opportunities or find the perfect talent. CareeroAI uses advanced AI matching, resume intelligence, and skill gap analysis to transform hiring and careers.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/signup">
                  <button className="glass-button w-full sm:w-auto">
                    Get Started →
                  </button>
                </Link>
                <Link href="/login">
                  <button className="glass-button-secondary w-full sm:w-auto">
                    Sign In
                  </button>
                </Link>
              </div>

              {/* Secondary Text */}
              <p className="text-sm text-slate-400 font-medium">
                ✨ Join thousands of professionals and companies transforming their careers
              </p>
            </div>

            {/* Right Side - Premium Dashboard Preview */}
            <div className="relative h-full min-h-[500px] hidden lg:flex items-center justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {/* Floating Glassmorphism Card */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-sm">
                  {/* Card Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-primary-600/20 rounded-3xl blur-3xl" />

                  {/* Glass Card - Dark Theme */}
                  <div className="relative glass-card-dark p-8 space-y-6 border border-blue-500/30">
                    {/* Header with Icon */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/40 to-primary-500/30 flex items-center justify-center">
                        <span className="text-2xl">🚀</span>
                      </div>
                      <div>
                        <div className="h-2 w-32 bg-gradient-to-r from-blue-400 to-primary-400 rounded-full" />
                        <div className="h-2 w-24 bg-slate-500/50 rounded-full mt-2" />
                      </div>
                    </div>

                    {/* AI Insights Feature List */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-lg">🎯</span>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 w-32 bg-slate-400/60 rounded-full" />
                          <div className="h-2 w-24 bg-slate-500/40 rounded-full mt-1.5" />
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-lg">✨</span>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 w-32 bg-slate-400/60 rounded-full" />
                          <div className="h-2 w-20 bg-slate-500/40 rounded-full mt-1.5" />
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-lg">⚡</span>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 w-32 bg-slate-400/60 rounded-full" />
                          <div className="h-2 w-28 bg-slate-500/40 rounded-full mt-1.5" />
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-blue-500/20">
                      <div className="h-2.5 w-40 bg-gradient-to-r from-blue-400/60 to-primary-400/40 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats - Enhanced */}
          <div className="mt-20 pt-20 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-4xl font-900 bg-gradient-to-r from-blue-400 to-primary-400 bg-clip-text text-transparent">10K+</div>
              <div className="text-sm text-slate-400 mt-2 group-hover:text-slate-300 transition-colors">Active Users</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-900 bg-gradient-to-r from-blue-400 to-primary-400 bg-clip-text text-transparent">500+</div>
              <div className="text-sm text-slate-400 mt-2 group-hover:text-slate-300 transition-colors">Companies</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-900 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">98%</div>
              <div className="text-sm text-slate-400 mt-2 group-hover:text-slate-300 transition-colors">Match Rate</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-900 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">24/7</div>
              <div className="text-sm text-slate-400 mt-2 group-hover:text-slate-300 transition-colors">AI Support</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

