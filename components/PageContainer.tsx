import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  background?: 'white' | 'gray' | 'transparent'
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  full: 'max-w-full'
}

const spacingClasses = {
  sm: 'py-4 md:py-8',
  md: 'py-6 md:py-12', 
  lg: 'py-8 md:py-16',
  xl: 'py-12 md:py-24'
}

const backgroundClasses = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  transparent: 'bg-transparent'
}

export default function PageContainer({ 
  children, 
  className,
  maxWidth = '4xl',
  spacing = 'lg',
  background = 'white'
}: PageContainerProps) {
  return (
    <div className={cn(
      'min-h-screen',
      backgroundClasses[background],
      className
    )}>
      <div className={cn(
        'container mx-auto px-4',
        spacingClasses[spacing]
      )}>
        <div className={cn(
          'mx-auto',
          maxWidthClasses[maxWidth]
        )}>
          {children}
        </div>
      </div>
    </div>
  )
}
