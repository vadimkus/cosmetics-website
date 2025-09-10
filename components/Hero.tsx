'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useAuth } from './AuthProvider'
import LoginModal from './LoginModal'
import { useState } from 'react'

export default function Hero() {
  const { user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  
  return (
    <section className="bg-white pt-8 pb-12 md:pt-12 md:pb-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6">
          Discover Your
          <span className="text-primary-600"> Beauty</span>
        </h1>
        
        {/* Video */}
        <div className="mb-6 md:mb-8">
          <div className="aspect-video w-full max-w-4xl mx-auto rounded-lg overflow-hidden">
            <video 
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src="/videos/start-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        
        <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
          Premium Korean dermacosmetics and products that enhance your natural beauty. Shop our high-quality skincare essentials.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
          {user ? (
            <Link 
              href="/products"
              className="bg-primary-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center text-base md:text-lg"
            >
              Order Now
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Link>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-primary-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center text-base md:text-lg"
            >
              Login
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
            </button>
          )}
          <Link 
            href="/about"
            className="border border-primary-600 text-primary-600 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-base md:text-lg"
          >
            Learn More
          </Link>
        </div>
      </div>
      
      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          isLoginMode={isLoginMode}
          setIsLoginMode={setIsLoginMode}
        />
      )}
    </section>
  )
}
