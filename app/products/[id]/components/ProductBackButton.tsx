'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ProductBackButton() {
  return (
    <div className="flex items-center mb-4 md:mb-8">
      <Link 
        href="/products"
        className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mr-4 text-sm md:text-sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4 md:h-5 md:w-5" />
        Back to Products
      </Link>
    </div>
  )
}
