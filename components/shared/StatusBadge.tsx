'use client'

import { getStatusColor } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  icon?: React.ReactNode
  className?: string
}

export default function StatusBadge({ status, icon, className = '' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)} ${className}`}>
      {icon}
      {status.toUpperCase()}
    </span>
  )
}


























