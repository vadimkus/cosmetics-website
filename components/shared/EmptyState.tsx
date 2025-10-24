'use client'

import { Package, ShoppingBag, FileText, Settings, Download } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    href?: string
  }
  className?: string
}

export default function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className = '' 
}: EmptyStateProps) {
  const defaultIcons = {
    orders: <Package className="h-12 w-12 text-gray-300" />,
    products: <ShoppingBag className="h-12 w-12 text-gray-300" />,
    documents: <FileText className="h-12 w-12 text-gray-300" />,
    settings: <Settings className="h-12 w-12 text-gray-300" />,
    downloads: <Download className="h-12 w-12 text-gray-300" />
  }

  const displayIcon = icon || defaultIcons.orders

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="mx-auto mb-4">
        {displayIcon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}




















