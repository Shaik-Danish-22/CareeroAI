import { ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glow?: 'purple' | 'blue' | 'indigo'
}

export default function GlowCard({ 
  children, 
  className = '',
  glow = 'purple'
}: GlowCardProps) {
  const glowColor = {
    purple: 'hover:shadow-purple-500/30',
    blue: 'hover:shadow-blue-500/30',
    indigo: 'hover:shadow-indigo-500/30'
  }[glow]

  return (
    <div className={`
      rounded-2xl
      bg-white/5
      backdrop-blur-xl
      border border-white/10
      shadow-lg
      ${glowColor}
      hover:-translate-y-1
      transition-all duration-300
      cursor-pointer
      ${className}
    `}>
      {children}
    </div>
  )
}
