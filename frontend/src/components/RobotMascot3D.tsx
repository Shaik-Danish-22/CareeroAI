'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function RobotMascot3D() {
  const [mounted, setMounted] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [showGreeting, setShowGreeting] = useState(false)
  const [greetingMessage, setGreetingMessage] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const greetings = [
    "Hi! Welcome to CareeroAI.",
    "I'm here to help guide your career journey.",
    "Ready to discover your next opportunity?"
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  // Cursor tracking for head rotation (subtle)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !mounted) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Subtle rotation limits: ±8 for Y, ±4 for X
      const rotateY = Math.max(-8, Math.min(8, (e.clientX - centerX) / 120))
      const rotateX = Math.max(-4, Math.min(4, (centerY - e.clientY) / 200))

      setCursorPos({ x: rotateY, y: rotateX })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mounted])

  const handleRobotClick = () => {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]
    setGreetingMessage(randomGreeting)
    setShowGreeting(true)
    setTimeout(() => setShowGreeting(false), 4000)
  }

  if (!mounted) return null

  return (
    <div ref={containerRef} className="relative w-full h-full perspective flex items-center justify-center">
      {/* Greeting Bubble */}
      {showGreeting && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="absolute -top-40 left-1/2 -translate-x-1/2 z-50 w-max max-w-xs"
        >
          <div className="bg-white rounded-xl shadow-2xl px-6 py-4 text-slate-700 text-sm text-center border border-slate-100 backdrop-blur-md bg-white/95">
            <p className="font-medium">{greetingMessage}</p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
          </div>
        </motion.div>
      )}

      {/* Floating 3D Robot using SVG */}
      <motion.div
        className="relative cursor-pointer select-none"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          rotateX: cursorPos.y,
          rotateY: cursorPos.x,
          perspective: '1000px',
        }}
        onClick={handleRobotClick}
      >
        {/* Glow Effect Background */}
        <motion.div
          className="absolute -inset-16 rounded-full bg-gradient-to-r from-purple-500/20 via-indigo-500/10 to-purple-500/20 blur-3xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.15, 0.95],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Shadow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-black/8 blur-2xl"
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* 3D Robot SVG with refined styling */}
        <svg
          className="w-80 h-80 relative drop-shadow-xl filter brightness-105"
          viewBox="0 0 240 300"
          fill="none"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8f8f8" />
              <stop offset="50%" stopColor="#efefef" />
              <stop offset="100%" stopColor="#d8d8d8" />
            </linearGradient>

            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>

            <radialGradient id="eyeGlow" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>

            {/* Soft shadow filter */}
            <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Left Antenna */}
          <g filter="url(#softShadow)">
            <line x1="80" y1="30" x2="60" y2="10" stroke="url(#purpleGrad)" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
            <circle cx="60" cy="10" r="6" fill="url(#purpleGrad)" opacity="0.95" />
          </g>

          {/* Right Antenna */}
          <g filter="url(#softShadow)">
            <line x1="160" y1="30" x2="180" y2="10" stroke="url(#purpleGrad)" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
            <circle cx="180" cy="10" r="6" fill="url(#purpleGrad)" opacity="0.95" />
          </g>

          {/* Head - Main */}
          <g filter="url(#softShadow)">
            <circle cx="120" cy="70" r="45" fill="url(#bodyGrad)" opacity="0.95" />
            {/* Head shine/3D effect */}
            <ellipse cx="100" cy="52" rx="24" ry="18" fill="white" opacity="0.25" />
          </g>

          {/* Left Eye - Refined (smaller, softer) */}
          <g filter="url(#softShadow)">
            <motion.g
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
            >
              <circle cx="100" cy="68" r="10" fill="url(#eyeGlow)" opacity="0.85" />
              <circle cx="100" cy="68" r="7" fill="#fef3c7" />
              <circle cx="100" cy="68" r="4" fill="#1f2937" />
              <circle cx="99" cy="66" r="1.5" fill="white" opacity="0.7" />
            </motion.g>
          </g>

          {/* Right Eye - Refined (smaller, softer) */}
          <g filter="url(#softShadow)">
            <motion.g
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.15 }}
            >
              <circle cx="140" cy="68" r="10" fill="url(#eyeGlow)" opacity="0.85" />
              <circle cx="140" cy="68" r="7" fill="#fef3c7" />
              <circle cx="140" cy="68" r="4" fill="#1f2937" />
              <circle cx="139" cy="66" r="1.5" fill="white" opacity="0.7" />
            </motion.g>
          </g>

          {/* Mouth */}
          <path
            d="M 100 88 Q 120 100 140 88"
            stroke="url(#purpleGrad)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Neck connector */}
          <rect x="110" y="112" width="20" height="12" fill="url(#bodyGrad)" opacity="0.9" />

          {/* Body - Main */}
          <g filter="url(#softShadow)">
            <rect x="60" y="130" width="120" height="100" rx="15" fill="url(#bodyGrad)" opacity="0.95" />
            {/* Body shine */}
            <ellipse cx="88" cy="145" rx="32" ry="22" fill="white" opacity="0.2" />
          </g>

          {/* Chest Panel */}
          <rect x="80" y="152" width="80" height="68" rx="8" fill="url(#purpleGrad)" opacity="0.15" />

          {/* Core Light - Chest */}
          <g filter="url(#softShadow)">
            <motion.circle
              cx="120"
              cy="186"
              r="9"
              fill="url(#eyeGlow)"
              animate={{ opacity: [0.6, 1, 0.6], r: [9, 11, 9] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <motion.circle
              cx="120"
              cy="186"
              r="14"
              fill="none"
              stroke="url(#eyeGlow)"
              strokeWidth="0.8"
              opacity="0.25"
              animate={{ r: [14, 18, 14], opacity: [0.25, 0.05, 0.25] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </g>

          {/* Left Arm */}
          <g filter="url(#softShadow)">
            <rect x="20" y="152" width="40" height="24" rx="6" fill="url(#bodyGrad)" opacity="0.9" />
            <circle cx="20" cy="164" r="8" fill="url(#bodyGrad)" opacity="0.85" />
          </g>

          {/* Right Arm - Waving (less frequent) */}
          <g filter="url(#softShadow)">
            <motion.g
              animate={{ rotate: [-15, 40, -15] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 10,
                delay: 2,
                ease: 'easeInOut'
              }}
              style={{ transformOrigin: '180px 164px' }}
            >
              <rect x="180" y="152" width="40" height="24" rx="6" fill="url(#bodyGrad)" opacity="0.9" />
              <circle cx="220" cy="164" r="8" fill="url(#bodyGrad)" opacity="0.85" />
            </motion.g>
          </g>

          {/* Left Leg */}
          <g filter="url(#softShadow)">
            <rect x="80" y="237" width="18" height="43" rx="4" fill="url(#bodyGrad)" opacity="0.9" />
            <circle cx="89" cy="285" r="7" fill="url(#bodyGrad)" opacity="0.85" />
          </g>

          {/* Right Leg */}
          <g filter="url(#softShadow)">
            <rect x="142" y="237" width="18" height="43" rx="4" fill="url(#bodyGrad)" opacity="0.9" />
            <circle cx="151" cy="285" r="7" fill="url(#bodyGrad)" opacity="0.85" />
          </g>

          {/* Overall aura glow */}
          <circle cx="120" cy="150" r="130" fill="url(#purpleGrad)" opacity="0.04" />
        </svg>
      </motion.div>
    </div>
  )
}
