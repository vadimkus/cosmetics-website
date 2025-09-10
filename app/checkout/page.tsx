'use client'

import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Lock, Percent, Crown, Building, MapPin, Truck } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart()
  const { user } = useAuth()
  const [email, setEmail] = useState(user?.email || '')
  const [fullName, setFullName] = useState(user?.name || '')
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '')
  const [selectedEmirate, setSelectedEmirate] = useState('Dubai')
  const [address, setAddress] = useState(user?.address || '')
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

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

  // Update form fields when user changes
  useEffect(() => {
    if (user) {
      setEmail(user.email || '')
      setFullName(user.name || '')
      setPhoneNumber(user.phone || '')
      setAddress(user.address || '')
    }
  }, [user])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fullName) {
      alert('Please enter your full name')
      return
    }
    
    if (!email) {
      alert('Please enter your email address')
      return
    }
    
    if (!phoneNumber) {
      alert('Please enter your phone number')
      return
    }
    
    if (!address) {
      alert('Please enter your address')
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerEmail: email,
          customerName: fullName,
          customerPhone: phoneNumber,
          customerEmirate: selectedEmirate,
          customerAddress: address,
        }),
      })

      const responseData = await response.json()

      if (responseData.orderId) {
        // Order created successfully - redirect to success page
        router.push(`/success?order_id=${responseData.orderId}`)
      } else {
        throw new Error('No order ID received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('There was an error processing your payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No items to checkout</h1>
          <p className="text-gray-600 mb-8">Your cart is empty. Add some items before proceeding to checkout.</p>
          <Link 
            href="/"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  // Check if user has price access
  if (!user || !user.canSeePrices) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Price Access Required</h1>
          <p className="text-gray-600 mb-8">
            You need price access to proceed with checkout. Please contact support to request access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/cart"
              className="inline-flex items-center bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Cart
            </Link>
            <a
              href="https://wa.me/971585487665"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 md:mb-8">
        <Link 
          href="/cart"
          className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mr-4 mb-2 sm:mb-0 text-sm md:text-base"
        >
          <ArrowLeft className="mr-2 h-4 w-4 md:h-5 md:w-5" />
          Back to Cart
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <div className="order-2 lg:order-1">
          <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center">
              <Truck className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Delivery information
            </h2>
            
            <form onSubmit={handleCheckout} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  placeholder="+971 XX XXX XXXX"
                  required
                />
              </div>

              <div>
                <label htmlFor="emirate" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Select Emirate
                  </div>
                </label>
                <select
                  id="emirate"
                  value={selectedEmirate}
                  onChange={(e) => setSelectedEmirate(e.target.value)}
                  className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                  required
                >
                  {emirates.map((emirate) => (
                    <option key={emirate.name} value={emirate.name}>
                      {emirate.name} - {emirate.shippingCost} AED
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base resize-none"
                  placeholder="Enter your complete address"
                  required
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Lock className="mr-2 h-4 w-4" />
                  By clicking the submit button
                </div>
                <p className="text-xs md:text-sm text-gray-600">
                  You will send your order to our team who will get in touch with you via phone/what's up and update you with payment options: cash/stripe link
                </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 md:py-4 rounded-lg font-semibold transition-colors flex items-center justify-center text-base md:text-lg touch-manipulation ${
                  isProcessing
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Submit order - {finalTotal.toFixed(2)} AED
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="bg-gray-50 rounded-lg p-4 md:p-6 sticky top-4 mb-4 lg:mb-0">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600 truncate flex-1 mr-2">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium flex-shrink-0">
                    {(item.product.price * item.quantity).toFixed(2)} AED
                  </span>
                </div>
              ))}
              
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{subtotal.toFixed(2)} AED</span>
                </div>
                
                {/* Discount Display */}
                {user?.discountType && user?.discountPercentage && (
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
                
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? 'FREE' : `${shipping.toFixed(2)} AED`}
                  </span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">VAT (5%)</span>
                  <span className="font-medium">{vat.toFixed(2)} AED</span>
                </div>
                <div className="flex justify-between text-base md:text-lg font-semibold">
                  <span>Total</span>
                  <span>{finalTotal.toFixed(2)} AED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
