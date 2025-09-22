import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'gray'
  text?: string
  className?: string
  fullScreen?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
}

const colorClasses = {
  primary: 'border-primary-600',
  white: 'border-white',
  gray: 'border-gray-600'
}

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  text,
  className,
  fullScreen = false
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            'animate-spin rounded-full border-2 border-t-transparent',
            sizeClasses[size],
            colorClasses[color]
          )}
        />
        {text && (
          <p className={cn(
            'text-sm font-medium',
            color === 'white' ? 'text-white' : 'text-gray-600'
          )}>
            {text}
          </p>
        )}
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        {spinner}
      </div>
    )
  }

  return spinner
}