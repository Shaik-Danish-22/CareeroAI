import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  className?: string
}

export default function StatsCard({ 
  title, 
  value, 
  subtitle,
  icon,
  className = ''
}: StatsCardProps) {
  return (
    <div className={`
      rounded-2xl
      bg-white
      border border-slate-200
      shadow-lg
      p-6
      hover:shadow-xl hover:border-purple-300
      transition-all duration-300 ease-out
      hover:-translate-y-1
      ${className}
    `}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-600 text-sm font-semibold mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && (
            <p className="text-slate-500 text-xs mt-2">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-purple-600 opacity-90">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
