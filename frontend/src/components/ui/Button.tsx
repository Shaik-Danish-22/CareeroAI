import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const baseClass = `
    font-semibold
    rounded-xl
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const sizeClass = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }[size]

  const variantClass = {
    primary: `
      bg-gradient-to-r from-purple-600 to-indigo-600
      text-white
      hover:shadow-lg
      hover:shadow-purple-600/50
      hover:scale-[1.05]
      active:scale-95
    `,
    secondary: `
      bg-white/30
      text-slate-700
      border border-slate-300
      hover:bg-white/50
      hover:shadow-lg
      hover:shadow-purple-500/20
      hover:scale-[1.02]
    `,
    ghost: `
      bg-transparent
      text-slate-700
      hover:bg-white/40
      border border-slate-300
      hover:scale-[1.02]
    `
  }[variant]

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${sizeClass} ${variantClass} ${className}`}
    >
      {children}
    </button>
  )
}
