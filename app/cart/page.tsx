'use client'

import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import CartItem from '@/components/CartItem'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft, Lock, Percent, Crown, Building, MessageCircle, MapPin } from 'lucide-react'
import { useState } from 'react'

export default function CartPage() {
  const { items, getTotalPrice, getTotalItems } = useCart()
  const { user } = useAuth()
  const [selectedEmirate, setSelectedEmirate] = useState('Dubai')

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

  // Calculate discount
  const calculateDiscount = () => {
    if (!user?.discountType || !user?.discountPercentage) return 0
    const subtotal = getTotalPrice()
    return (subtotal * user.discountPercentage) / 100
  }

  const discountAmount = calculateDiscount()
  const subtotal = getTotalPrice()
  const selectedEmirateData = emirates.find(e => e.name === selectedEmirate)
  const baseShippingCost = selectedEmirateData?.shippingCost || 45
  // Free shipping for orders above 1,000 AED
  const shipping = subtotal >= 1000 ? 0 : baseShippingCost
  const totalBeforeVAT = subtotal - discountAmount + shipping
  const vat = totalBeforeVAT * 0.05
  const finalTotal = totalBeforeVAT + vat

  // Show login prompt if user is not logged in
  if (!user) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Lock className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h1>
            <p className="text-gray-600 mb-8">You need to be logged in to view your cart and see prices.</p>
            <Link 
              href="/"
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link 
              href="/"
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex items-center mb-4 md:mb-8">
          <Link 
            href="/products"
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mr-4 text-sm md:text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Continue Shopping
          </Link>
        </div>

        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Selected Products</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          <div className="lg:col-span-2 order-1">
            <div className="space-y-3 md:space-y-4">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 order-2">
            <div className="bg-gray-50 rounded-lg p-4 md:p-6 lg:sticky lg:top-4 mb-4 lg:mb-0">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-center">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Items ({getTotalItems()})</span>
                  {user && user.canSeePrices ? (
                    <span className="font-medium">{subtotal.toFixed(2)} AED</span>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <Lock className="h-4 w-4 mr-1" />
                      <span className="text-xs">Price access required</span>
                    </div>
                  )}
                </div>
                
                {/* Discount Display */}
                {user?.discountType && user?.discountPercentage && user.canSeePrices && (
                  <div className="flex justify-between text-sm md:text-base">
                    <div className="flex items-center text-green-600">
                      {user.discountType === 'CLINIC' ? (
                        <Building className="h-4 w-4 mr-1" />
                      ) : (
                        <Crown className="h-4 w-4 mr-1" />
                      )}
                      <span>{user.discountType} Discount ({user.discountPercentage}%)</span>
                    </div>
                    <span className="font-medium text-green-600">-{discountAmount.toFixed(2)} AED</span>
                  </div>
                )}
                
                {/* Emirate Selection */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Delivery Location</span>
                  </div>
                  <select
                    value={selectedEmirate}
                    onChange={(e) => setSelectedEmirate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm"
                  >
                    {emirates.map((emirate) => (
                      <option key={emirate.name} value={emirate.name}>
                        {emirate.name} - {emirate.shippingCost} AED
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Shipping</span>
                  {user && user.canSeePrices ? (
                    <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                      {shipping === 0 ? 'FREE' : `${shipping.toFixed(2)} AED`}
                    </span>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <Lock className="h-4 w-4 mr-1" />
                      <span className="text-xs">Price access required</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">VAT (5%)</span>
                  {user && user.canSeePrices ? (
                    <span className="font-medium">{vat.toFixed(2)} AED</span>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <Lock className="h-4 w-4 mr-1" />
                      <span className="text-xs">Price access required</span>
                    </div>
                  )}
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-base md:text-lg font-semibold">
                    <span>Total</span>
                    {user && user.canSeePrices ? (
                      <span>{finalTotal.toFixed(2)} AED</span>
                    ) : (
                      <div className="flex items-center text-gray-500">
                        <Lock className="h-4 w-4 mr-1" />
                        <span className="text-sm">Price access required</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {user && user.canSeePrices ? (
                <Link
                  href="/checkout"
                  className="w-full bg-primary-600 text-white py-3 md:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block text-sm md:text-base touch-manipulation"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Lock className="h-5 w-5 text-red-600" />
                      <h3 className="text-sm font-semibold text-red-800">Price Access</h3>
                    </div>
                    <div className="space-y-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <Lock className="h-3 w-3 mr-1" />
                        Restricted
                      </span>
                      <p className="text-red-700 text-sm">
                        Price access required. Contact support via WhatsApp +971 58 548 76 65 to request price access
                      </p>
                    </div>
                  </div>
                  
                  <a
                    href="https://wa.me/971585487665"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 text-white py-3 md:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block text-sm md:text-base touch-manipulation flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact Support
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
