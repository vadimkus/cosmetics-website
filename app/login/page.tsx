'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import LoginModal from '@/components/LoginModal'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)

  // Redirect logged-in users to profile page
  useEffect(() => {
    if (user) {
      router.push('/profile')
    }
  }, [user, router])

  // Don't render anything if user is logged in (will redirect)
  if (user) {
    return null
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Magical Header */}
          <div className="mb-12">
            <h1 className="text-xl md:text-2xl text-gray-800 mb-6">
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Please log in to access your profile and see product prices.
            </p>
          </div>

          {/* Login Video */}
          <div className="mb-8">
            <div className="aspect-video w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg">
              <video
                src="/videos/login-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Login Button */}
          <div className="mb-12">
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-lg"
            >
              Login
            </button>
          </div>


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
    </div>
  )
}
