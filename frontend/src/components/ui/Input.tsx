import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}

import { ReactNode } from 'react'

export default function Input({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`
            w-full
            px-4 py-3
            rounded-xl
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            text-white
            placeholder-slate-400
            transition-all duration-300
            focus:outline-none
            focus:border-white/30
            focus:bg-white/10
            focus:shadow-lg
            focus:shadow-purple-500/20
            ${error ? 'border-red-500/50 focus:shadow-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-400 mt-2">{error}</p>
      )}
    </div>
  )
}
