'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X } from 'lucide-react'

export default function AnimatedAssistant() {
  const [showPanel, setShowPanel] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    { icon: '🎯', title: 'Smart Job Matching', description: 'AI-powered job recommendations' },
    { icon: '📊', title: 'Skill Gap Analysis', description: 'Identify growth opportunities' },
    { icon: '🎤', title: 'AI Interview Practice', description: 'Prepare with AI feedback' },
  ]

  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Floating Assistant Card */}
      <div className="group relative cursor-pointer">
        {/* Animated Floating Card */}
        <div className="animate-[float_6s_ease-in-out_infinite] relative">
          {/* Glow background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Card */}
          <button
            onClick={() => setShowPanel(!showPanel)}
            className="relative w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 p-6 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] text-left group/card"
          >
            {/* AI Avatar Section */}
            <div className="flex items-start gap-4 mb-4">
              {/* Animated AI Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover/card:shadow-purple-500/50 transition-all">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                </div>
                {/* Pulse animation */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 opacity-20 group-hover/card:opacity-40 animate-pulse" />
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">CareeroAI</h3>
                <p className="text-xs text-slate-600">AI Career Assistant</p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-600">Online</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 mb-4">
              Get AI-powered career guidance and job recommendations tailored to you.
            </p>

            {/* Quick Features */}
            <div className="space-y-2 mb-4">
              {features.slice(0, 2).map((feature) => (
                <div key={feature.title} className="flex items-start gap-2">
                  <span className="text-base mt-0.5">{feature.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{feature.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/30 transition-all text-center">
              Chat Now →
            </div>
          </button>
        </div>
      </div>

      {/* Expanded Modal */}
      {showPanel && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => setShowPanel(false)}
              className="absolute top-4 right-4 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* AI Avatar in Modal */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">CareeroAI</h2>
                <p className="text-slate-600">Your AI Career Intelligence Partner</p>
              </div>
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed">
              I'm your personal AI career advisor. Using advanced AI analysis, I help you discover ideal career paths, identify skill gaps, and prepare for success.
            </p>

            <div className="space-y-4 mb-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              Start Conversation
            </button>
          </div>
        </div>
      )}
    </>
  )
}
