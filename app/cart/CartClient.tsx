'use client'

import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import CartItem from '@/components/CartItem'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft, Lock, MessageCircle } from 'lucide-react'


export default function CartClient() {
  const { items, getTotalPrice, getTotalItems, selectedEmirate, setSelectedEmirate } = useCart()
  const { user } = useAuth()

  // Emirates list with shipping costs
  const emirates = [
    { name: 'Dubai', shippingCost: 45 },
    { name: 'Abu Dhabi', shippingCost: 70 },
    { name: 'Sharjah', shippingCost: 70 },
    { name: 'Ajman', shippingCost: 70 },
    { name: 'Ras Al Khaimah', shippingCost: 70 },
    { name: 'Fujairah', shippingCost: 70 },
    { name: 'Umm Al Quwain', shippingCost: 70 }
  ]

  const selectedEmirateData = emirates.find(e => e.name === selectedEmirate)
  const subtotal = getTotalPrice(user)
  const shippingCost = subtotal >= 1000 ? 0 : (selectedEmirateData?.shippingCost || 45)
  const total = subtotal + shippingCost

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
          <Link
            href="/"
            className="hover:text-primary-600 transition-colors flex items-center"
          >
            Home
          </Link>
          <span className="flex items-center">/</span>
          <Link
            href="/products"
            className="hover:text-primary-600 transition-colors flex items-center"
          >
            Products
          </Link>
          <span className="flex items-center">/</span>
          <span className="text-gray-900 font-medium flex items-center">
            Cart
          </span>
        </nav>

        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="mb-8">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 text-lg mb-8">
              Looks like you haven&apos;t added any products to your cart yet.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {/* Navigation Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
        <Link
          href="/"
          className="hover:text-primary-600 transition-colors flex items-center"
        >
          Home
        </Link>
        <span className="flex items-center">/</span>
        <Link
          href="/products"
          className="hover:text-primary-600 transition-colors flex items-center"
        >
          Products
        </Link>
        <span className="flex items-center">/</span>
        <span className="text-gray-900 font-medium flex items-center">
          Cart
        </span>
      </nav>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                  Shopping Cart: {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </h1>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <CartItem key={`${item.product.id}-${item.quantity}`} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* User Status */}
                {!user && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800 mb-2">
                      <Lock className="h-5 w-5" />
                      <span className="font-semibold">Login Required</span>
                    </div>
                    <p className="text-sm text-yellow-700 mb-3">
                      Please log in to see prices and complete your order.
                    </p>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      <Lock className="h-4 w-4" />
                      Login
                    </Link>
                  </div>
                )}

                {/* Shipping Location */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Location
                  </label>
                  <select
                    value={selectedEmirate}
                    onChange={(e) => setSelectedEmirate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {emirates.map((emirate) => (
                      <option key={emirate.name} value={emirate.name}>
                        {emirate.name} - AED {emirate.shippingCost}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Shipping costs vary by emirate
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})</span>
                    <span>{user ? `AED ${subtotal.toFixed(2)}` : 'Login to see price'}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping to {selectedEmirate}</span>
                    <span>{user ? (shippingCost === 0 ? 'FREE' : `AED ${shippingCost}`) : 'Login to see price'}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>VAT (5%)</span>
                    <span>{user ? `AED ${((subtotal + shippingCost) / 1.05 * 0.05).toFixed(2)}` : 'Login to see price'}</span>
                  </div>
                  
                  <div className="text-xs text-red-600 text-left">
                    All prices include 5% VAT
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>{user ? `AED ${total.toFixed(2)}` : 'Login to see price'}</span>
                    </div>
                  </div>
                </div>


                {/* Checkout Button */}
                {user ? (
                  <Link
                    href="/checkout"
                    className="w-full bg-primary-600 text-white py-3 md:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block text-sm md:text-base touch-manipulation"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="w-full bg-primary-600 text-white py-3 md:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block text-sm md:text-base touch-manipulation"
                    >
                      Login to Checkout
                    </Link>
                    
                    <a
                      href="https://wa.me/971585487665?text=Hi, I'm interested in your professional Korean dermacosmetics products. Can you help me with pricing and ordering?"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 text-white py-3 md:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block text-sm md:text-base touch-manipulation flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Contact Support
                    </a>
                  </div>
                )}

                {/* Continue Shopping */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    href="/products"
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                  </Link>
                </div>

                {/* Contact Info */}
                {!user && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">
                        Need help? Contact our professional support team:
                      </p>
                      <div className="space-y-2">
                        <a
                          href="https://wa.me/971585487665?text=Hi, I'm interested in your professional Korean dermacosmetics products. Can you help me with pricing and ordering?"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-green-600 text-white py-3 md:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block text-sm md:text-base touch-manipulation flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Contact Support
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
