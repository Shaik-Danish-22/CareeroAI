'use client'

import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  interactive?: boolean
  elevated?: boolean
  glass?: boolean
  padding?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export default function Card({
  children,
  className = '',
  interactive = false,
  elevated = false,
  glass = false,
  padding = 'md',
  onClick,
}: CardProps) {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const baseStyles = 'rounded-xl transition-all duration-300'
  const borderStyles = 'border'
  const interactiveStyles = interactive ? 'hover:shadow-hover hover:-translate-y-1 cursor-pointer' : ''
  const elevatedStyles = elevated ? 'shadow-lg border-slate-100 bg-white' : 'shadow-md'
  const glassStyles = glass ? 'glass' : 'bg-white border-border-color'

  return (
    <div
      className={`${baseStyles} ${borderStyles} ${interactiveStyles} ${glassStyles} ${elevatedStyles} ${paddingStyles[padding]} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          onClick?.()
        }
      }}
    >
      {children}
    </div>
  )
}
