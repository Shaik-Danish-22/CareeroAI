'use client'

import { motion } from 'framer-motion'

interface FeatureBubble {
  icon: string
  title: string
  delay: number
  position: { x: string; y: string }
}

export default function FeatureBubbles() {
  const bubbles: FeatureBubble[] = [
    {
      icon: '🎯',
      title: 'Smart Job Matching',
      delay: 0,
      position: { x: '-120px', y: '-80px' }
    },
    {
      icon: '📊',
      title: 'Skill Gap Analysis',
      delay: 0.2,
      position: { x: '120px', y: '-100px' }
    },
    {
      icon: '🎤',
      title: 'AI Interview Coach',
      delay: 0.4,
      position: { x: '140px', y: '40px' }
    },
    {
      icon: '💡',
      title: 'Career Insights',
      delay: 0.6,
      position: { x: '-140px', y: '40px' }
    }
  ]

  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      {/* Central Robot (represented by a circle) */}
      <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-2xl shadow-purple-500/50 flex items-center justify-center text-6xl">
        🤖
      </div>

      {/* Floating Bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.title}
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, parseInt(bubble.position.x) * 0.3, parseInt(bubble.position.x) * 0.5, parseInt(bubble.position.x) * 0.3, 0],
            y: [0, parseInt(bubble.position.y) * 0.3, parseInt(bubble.position.y) * 0.5, parseInt(bubble.position.y) * 0.3, 0]
          }}
          transition={{
            duration: 6,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 border border-white/60 w-40 text-center cursor-pointer hover:shadow-xl hover:shadow-purple-500/20 transition-all"
          >
            <div className="text-3xl mb-2">{bubble.icon}</div>
            <p className="text-sm font-semibold text-slate-900">{bubble.title}</p>
          </motion.div>
        </motion.div>
      ))}

      {/* Background Glow Animation */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 blur-2xl"
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </div>
  )
}
