import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export default function Card({ 
  children, 
  className = '', 
  onClick,
  hoverable = true 
}: CardProps) {
  const baseClass = `
    rounded-2xl
    bg-white
    border border-slate-200
    shadow-lg
    transition-all duration-300 ease-out
  `
  
  const hoverClass = hoverable ? `
    hover:shadow-xl
    hover:border-purple-300
    hover:scale-[1.02]
    hover:-translate-y-1
  ` : ''

  return (
    <div 
      className={`${baseClass} ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
