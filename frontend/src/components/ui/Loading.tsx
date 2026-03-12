'use client'

import React from 'react'

interface LoadingProps {
  variant?: 'spinner' | 'pulse' | 'dots' | 'skeleton'
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  message?: string
  className?: string
}

export default function Loading({
  variant = 'spinner',
  size = 'md',
  fullScreen = false,
  message,
  className = '',
}: LoadingProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const spinnerSize = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center'

  if (variant === 'spinner') {
    return (
      <div className={containerClass}>
        <div className="flex flex-col items-center gap-4">
          <svg
            className={`animate-spin text-primary-600 ${spinnerSize[size]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {message && <p className="text-slate-600 font-medium">{message}</p>}
        </div>
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={containerClass}>
        <div className="flex flex-col items-center gap-4">
          <div className={`${sizeStyles[size]} bg-primary-200 rounded-full animate-pulse`} />
          {message && <p className="text-slate-600 font-medium">{message}</p>}
        </div>
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={containerClass}>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
            <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
          {message && <p className="text-slate-600 font-medium">{message}</p>}
        </div>
      </div>
    )
  }

  if (variant === 'skeleton') {
    return <div className={`skeleton rounded-lg animate-pulse ${sizeStyles[size]} ${className}`} />
  }

  return null
}
