'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, X, User, LogOut, Menu } from 'lucide-react'
import { useCart } from './CartProvider'
import { useCartStore } from '@/lib/cartStore'
import { useAuth } from './AuthProvider'
import { useFavorites } from './FavoritesProvider'
import LoginModal from './LoginModal'
import { useState, useEffect, memo, useCallback } from 'react'

const Header = memo(function Header() {
  const { getTotalItems } = useCartStore()
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex flex-col">
            <span className="hidden md:block text-lg md:text-2xl font-bold text-primary-600">
              Genosys Middle East FZ-LLC
            </span>
            <Link href="/products" className="md:hidden text-lg font-bold text-primary-600">
              Products
            </Link>
            <div className="hidden md:flex text-sm text-gray-600 items-center gap-1 ml-0 md:ml-40">
              United Arab Emirates
              <Heart className="h-3 w-3 text-primary-600 fill-current" />
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link href="/brand" className="text-gray-700 hover:text-primary-600 transition-colors">
              Brand
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors">
              Products
            </Link>
            <Link href="/training" className="text-gray-700 hover:text-primary-600 transition-colors">
              Training
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
              Contact
            </Link>
            <Link href="/delivery" className="text-gray-700 hover:text-primary-600 transition-colors">
              Delivery
            </Link>
          </nav>

          {/* Mobile Icons and Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart Icon */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {isClient && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            
            {/* Mobile Favorites Icon */}
            <Link href="/favorites" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <Heart className="h-6 w-6" />
              {isClient && favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            
            {/* Mobile User/Login Icon */}
            {isClient && user ? (
              <>
                <Link 
                  href="/profile" 
                  className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                  title="My Profile"
                >
                  <User className="h-6 w-6 text-green-600" />
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                title="Login"
              >
                <User className="h-6 w-6" />
              </button>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex flex-col items-end text-right">
              <div className="text-sm text-gray-600">
                Official Distributor in the UAE
              </div>
              <a 
                href="https://wa.me/971585487665" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1"
              >
                +971 58 548 76 65 📱
              </a>
              <a 
                href="mailto:sales@genosys.ae"
                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                sales@genosys.ae
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              {isClient && user ? (
                <>
                  <Link 
                    href="/profile" 
                    className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                    title="My Profile"
                  >
                    <User className="h-6 w-6 text-green-600" />
                  </Link>
                  <button 
                    onClick={logout}
                    className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="p-2 text-gray-700 hover:text-primary-600 transition-colors flex items-center gap-2 touch-manipulation"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium hidden sm:inline">Login</span>
                </button>
              )}
              
              <Link href="/favorites" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
                <Heart className="h-6 w-6" />
                {isClient && favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {isClient && getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100 font-semibold"
                onClick={() => setShowMobileMenu(false)}
              >
                Products
              </Link>
              <Link 
                href="/" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
              <Link 
                href="/brand" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                Brand
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                Products
              </Link>
              <Link 
                href="/training" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                Training
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                Contact
              </Link>
              <Link 
                href="/delivery" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setShowMobileMenu(false)}
              >
                Delivery
              </Link>
              
              {/* Mobile Login/Profile Section */}
              <div className="pt-4 border-t border-gray-200">
                {isClient && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-600">{user.email}</div>
                      </div>
                    </div>
                    <Link 
                      href="/profile" 
                      className="block text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      My Profile
                    </Link>
                    <button 
                      onClick={() => {
                        logout()
                        setShowMobileMenu(false)
                      }}
                      className="block w-full text-left text-gray-700 hover:text-primary-600 transition-colors py-2"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setShowLoginModal(true)
                      setShowMobileMenu(false)
                    }}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 touch-manipulation"
                  >
                    <User className="h-5 w-5" />
                    Login / Register
                  </button>
                )}
              </div>

              {/* Mobile Contact Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">
                  Official Distributor in the UAE
                </div>
                <a 
                  href="https://wa.me/971585487665" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1 mb-2"
                >
                  +971 58 548 76 65 📱
                </a>
                <a 
                  href="mailto:sales@genosys.ae"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  sales@genosys.ae
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          isLoginMode={isLoginMode}
          setIsLoginMode={setIsLoginMode}
        />
      )}
    </header>
  )
})

export default Header
