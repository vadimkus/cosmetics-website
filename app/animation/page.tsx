import type { Metadata } from 'next'
import AnimationShowcase from './components/AnimationShowcase'

export const metadata: Metadata = {
  title: 'Animation Examples - GENOSYS',
  description: 'Smooth animation examples for the GENOSYS website'
}

export default function AnimationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          GENOSYS Animation Showcase
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Explore smooth, subtle animations designed for both mobile and desktop performance.
          These examples demonstrate how animations can enhance user experience without sacrificing performance.
        </p>
        
        <AnimationShowcase />
      </div>
    </div>
  )
}