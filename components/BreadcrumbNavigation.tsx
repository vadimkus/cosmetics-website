import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  name: string
  url: string
  current?: boolean
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[]
  className?: string
  separator?: 'slash' | 'chevron' | 'arrow'
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'text-xs md:text-sm',
  md: 'text-sm md:text-base',
  lg: 'text-base md:text-lg'
}

export default function BreadcrumbNavigation({ 
  items, 
  className,
  separator = 'slash',
  size = 'md'
}: BreadcrumbNavigationProps) {
  const renderSeparator = () => {
    switch (separator) {
      case 'chevron':
        return <ChevronRight className="h-4 w-4 text-gray-400" />
      case 'arrow':
        return <span className="text-gray-400">→</span>
      case 'slash':
      default:
        return <span className="text-gray-400">/</span>
    }
  }

  return (
    <nav 
      className={cn(
        'flex items-center gap-2 text-gray-600 mb-8',
        sizeClasses[size],
        className
      )} 
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <div key={item.url}>
          {index > 0 && (
            <span className="flex items-center" aria-hidden="true">
              {renderSeparator()}
            </span>
          )}
          {item.current ? (
            <span 
              className="text-gray-900 font-medium flex items-center"
              aria-current="page"
            >
              {item.name}
            </span>
          ) : (
            <Link 
              href={item.url}
              className="hover:text-primary-600 transition-colors flex items-center"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
