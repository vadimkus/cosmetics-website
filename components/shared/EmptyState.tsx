'use client'

// Empty state component for various sections
import Link from 'next/link'

interface EmptyStateProps {
  icon?: React.ReactNode | null
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    href?: string
  }
  className?: string
  hideIcon?: boolean
  buttonClassName?: string
}

export default function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className = '',
  hideIcon = false,
  buttonClassName = 'bg-red-600 text-white hover:bg-red-700'
}: EmptyStateProps) {
  return (
    <div className={`text-center py-8 md:py-12 ${className}`}>
      {!hideIcon && icon && (
        <div className="mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">{description}</p>}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            onClick={action.onClick}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${buttonClassName}`}
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${buttonClassName}`}
          >
            {action.label}
          </button>
        )
      )}
    </div>
  )
}






























