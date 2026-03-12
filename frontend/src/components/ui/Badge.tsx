'use client'

import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
  size?: 'sm' | 'md'
  icon?: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  dismissible = false,
  onDismiss,
  className = '',
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-rose-100 text-rose-800',
    neutral: 'bg-slate-100 text-slate-800',
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="ml-1 inline-flex items-center p-0.5 hover:opacity-70 transition-opacity"
          aria-label="Dismiss badge"
        >
          ×
        </button>
      )}
    </span>
  )
}
