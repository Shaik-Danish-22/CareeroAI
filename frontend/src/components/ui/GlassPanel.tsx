import { ReactNode } from 'react'

interface GlassPanelProps {
  children: ReactNode
  className?: string
}

export default function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return (
    <div className={`
      bg-white/80
      backdrop-blur-xl
      border border-slate-200
      rounded-3xl
      shadow-lg
      shadow-slate-200/30
      ${className}
    `}>
      {children}
    </div>
  )
}
