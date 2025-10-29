import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TrainingNavigation() {
  return (
    <nav className="flex flex-col gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
      {/* Mobile Breadcrumb */}
      <div className="md:hidden flex items-center gap-2">
        <Link 
          href="/"
          className="hover:text-primary-600 transition-colors flex items-center"
        >
          Home
        </Link>
        <span className="flex items-center">/</span>
        <span className="text-gray-900 font-medium flex items-center">
          Training
        </span>
      </div>
      
      {/* Mobile Back Button */}
      <Link 
        href="/"
        className="md:hidden flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-medium">Back to Home</span>
      </Link>
      
      {/* Desktop Breadcrumb */}
      <div className="hidden md:flex items-center gap-2">
        <Link 
          href="/"
          className="hover:text-primary-600 transition-colors flex items-center"
        >
          Home
        </Link>
        <span className="flex items-center">/</span>
        <span className="text-gray-900 font-medium flex items-center">
          Training
        </span>
      </div>
    </nav>
  )
}
