'use client'

import { motion } from 'framer-motion'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <motion.div 
      className={`flex items-center gap-3 cursor-pointer ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      animate={{ y: [0, -2, 0] }}
      whileHoverAnimation={{ y: [0, -2, 0] }}
    >
      {/* C-Orbit Logo Container */}
      <div className="relative w-12 h-12 flex items-center justify-center group">
        {/* Soft outer glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-600 blur-lg"
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* SVG C-Orbit Icon */}
        <svg 
          className="w-12 h-12 relative z-10 drop-shadow-lg" 
          viewBox="0 0 48 48" 
          fill="none"
        >
          <defs>
            {/* Purple to Indigo gradient for C-ring */}
            <linearGradient id="cRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="1" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="1" />
            </linearGradient>

            {/* Radial gradient for AI core dot (orange/yellow glow) */}
            <radialGradient id="aiCoreDot" cx="45%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
            </radialGradient>
          </defs>
          
          {/* Outer ring accent (subtle) */}
          <circle 
            cx="24" 
            cy="24" 
            r="21" 
            fill="none"
            stroke="url(#cRingGrad)" 
            strokeWidth="0.5"
            opacity="0.3"
          />
          
          {/* Main C-shaped orbit ring (circular arc 75% of circle) */}
          <path
            d="M 24 5 A 19 19 0 0 1 24 43"
            stroke="url(#cRingGrad)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="1"
          />
          
          {/* Center AI core dot - main glow */}
          <motion.circle
            cx="24"
            cy="24"
            r="3"
            fill="url(#aiCoreDot)"
            animate={{ r: [3, 4.5, 3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Outer pulsing ring around core */}
          <motion.circle
            cx="24"
            cy="24"
            r="6"
            fill="none"
            stroke="url(#aiCoreDot)"
            strokeWidth="0.8"
            opacity="0.5"
            animate={{ r: [6, 9, 6], opacity: [0.5, 0.15, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          
          {/* Inner accent circle */}
          <circle 
            cx="24" 
            cy="24" 
            r="14" 
            fill="none"
            stroke="url(#cRingGrad)" 
            strokeWidth="0.5"
            opacity="0.2"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <motion.span 
        className="font-black text-base tracking-tight bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        CareeroAI
      </motion.span>
    </motion.div>
  )
}
