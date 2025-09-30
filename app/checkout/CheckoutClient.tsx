'use client'

import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Lock, MapPin, Truck, MessageCircle, Mail, Building } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutClient() {
  const { items, getTotalPrice, getTotalItems, clearCart, selectedEmirate, setSelectedEmirate } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
  const [invoiceEmail, setInvoiceEmail] = useState('')
  const [orderNumber] = useState(() => {
    // Generate professional order number: GEN + year + month + day + 4 digit sequence
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `GEN${year}${month}${day}${sequence}`
  })

  // WhatsApp support function
  const contactWhatsApp = () => {
    const phoneNumber = '971501234567' // Replace with actual WhatsApp number
    const message = `Hi! I need help with my order ${orderNumber}. Can you assist me?`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // Generate and send invoice function
  const generateAndSendInvoice = async () => {
    if (!invoiceEmail) {
      alert('Please enter an email address')
      return
    }

    setIsGeneratingInvoice(true)
    
    try {
      const invoiceData = {
        orderNumber,
        customerEmail: invoiceEmail,
        customerName: user?.name || 'Customer',
        customerPhone: user?.phone || '',
        customerAddress: user?.address || '',
        emirate: selectedEmirate,
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity
        })),
        subtotal,
        shippingCost,
        total
      }

      const response = await fetch('/api/invoice/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      })

      if (response.ok) {
        alert('Invoice generated and sent to your email successfully!')
      } else {
        throw new Error('Failed to generate invoice')
      }
    } catch (error) {
      console.error('Error generating invoice:', error)
      alert('Failed to generate invoice. Please try again.')
    } finally {
      setIsGeneratingInvoice(false)
    }
  }

  // Helper function to split user name
  const getUserName = () => {
    if (!user?.name) return { firstName: '', lastName: '' }
    const nameParts = user!.name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    return { firstName, lastName }
  }

  const { firstName, lastName } = getUserName()

  // Pre-fill invoice email from user profile
  useEffect(() => {
    if (user?.email) {
      setInvoiceEmail(user.email)
    }
  }, [user?.email])



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
  const subtotal = getTotalPrice()
  const shippingCost = subtotal >= 1000 ? 0 : (selectedEmirateData?.shippingCost || 45)
  const total = subtotal + shippingCost

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router])

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const paymentMethod = formData.get('payment') as string

      // Only allow Cash on Delivery or Support Link
      if (paymentMethod !== 'cod' && paymentMethod !== 'support-link') {
        setIsProcessing(false)
        return
      }

      // Handle different payment methods
      if (paymentMethod === 'support-link') {
                // Generate professional order number for support link request
                const now = new Date()
                const year = now.getFullYear().toString().slice(-2)
                const month = (now.getMonth() + 1).toString().padStart(2, '0')
                const day = now.getDate().toString().padStart(2, '0')
                const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
                const supportOrderNumber = `SUP${year}${month}${day}${sequence}`
        
        // Send support link order request email
        try {
          const orderData = {
            orderNumber: supportOrderNumber,
            customerName: user?.name || 'Customer',
            customerEmail: user?.email || '',
            customerPhone: user?.phone || '',
            customerAddress: user?.address || '',
            emirate: selectedEmirate,
            items: items.map(item => ({
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              total: item.product.price * item.quantity
            })),
            subtotal,
            shippingCost,
            total
          }

          const response = await fetch('/api/orders/support-link', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
          })

          if (response.ok) {
            router.push(`/success?payment=support-link&order_id=${supportOrderNumber}`)
          } else {
            throw new Error('Failed to send order request')
          }
        } catch (error) {
          console.error('Error sending support link order request:', error)
          router.push(`/success?payment=support-link&order_id=${supportOrderNumber}`)
        }
        return
      }

      // For Cash on Delivery, proceed with normal flow
              // Generate professional order number for COD
              const now = new Date()
              const year = now.getFullYear().toString().slice(-2)
              const month = (now.getMonth() + 1).toString().padStart(2, '0')
              const day = now.getDate().toString().padStart(2, '0')
              const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
              const codOrderNumber = `COD${year}${month}${day}${sequence}`
      
      // Send COD order confirmation email
      try {
        const orderData = {
          orderNumber: codOrderNumber,
          customerName: user?.name || 'Customer',
          customerEmail: user?.email || '',
          customerPhone: user?.phone || '',
          customerAddress: user?.address || '',
          emirate: selectedEmirate,
          items: items.map(item => ({
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            total: item.product.price * item.quantity
          })),
          subtotal,
          shippingCost,
          total
        }

        const response = await fetch('/api/orders/cod-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        })

        if (!response.ok) {
          console.error('Failed to send COD confirmation email')
        }
      } catch (error) {
        console.error('Error sending COD confirmation email:', error)
      }
      
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to success page with order number (cart will be cleared there)
      router.push(`/success?order_id=${codOrderNumber}&payment=cod`)
    } catch (error) {
      console.error('Order processing failed:', error)
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="mb-8">
            <CreditCard className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 text-lg mb-8">
              You need to add items to your cart before checking out.
            </p>
          </div>
          
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="mb-8">
            <Lock className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Login Required</h1>
            <p className="text-gray-600 text-lg mb-8">
              Please log in to complete your order.
            </p>
          </div>
          
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <Lock className="h-5 w-5" />
            Login
          </Link>
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
        <Link
          href="/cart"
          className="hover:text-primary-600 transition-colors flex items-center"
        >
          Cart
        </Link>
        <span className="flex items-center">/</span>
        <span className="text-gray-900 font-medium flex items-center">
          Checkout
        </span>
      </nav>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="h-6 w-6" />
                  Secure Checkout
                </h1>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">

                {/* Shipping Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        defaultValue={firstName}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your first name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        defaultValue={lastName}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      defaultValue={user?.email || ''}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      defaultValue={user?.phone || ''}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <textarea
                      required
                      rows={3}
                      defaultValue={user?.address || ''}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your complete delivery address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Location *
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
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </h2>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800 mb-2">
                      <Building className="h-5 w-5" />
                      <span className="font-semibold">Payment</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      As our customer, you can pay via cash on delivery or ask our support team to generate a secure payment link. Our team will contact you once you complete your order.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-not-allowed opacity-50">
                      <input
                        type="radio"
                        name="payment"
                        value="stripe-checkout"
                        disabled
                        className="text-gray-400"
                      />
                      <div>
                        <div className="font-medium text-gray-500">Stripe Checkout</div>
                        <div className="text-sm text-gray-400">Coming soon - We will integrate later</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-4 border border-primary-300 rounded-lg cursor-pointer hover:bg-primary-50 bg-primary-25">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        defaultChecked
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">Pay when your order is delivered</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="support-link"
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Ask Support to Generate Link for Payment</div>
                        <div className="text-sm text-gray-600">Contact our support team to get a secure payment link</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Any special instructions for your order..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Complete Order - AED {total.toFixed(2)}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Order #</div>
                    <div className="text-sm font-mono font-semibold text-primary-600">{orderNumber}</div>
                  </div>
                </div>
                
                {/* Items */}
                <div className="space-y-3 mb-6">
                  {items.length > 0 ? (
                    items.map((item) => {
                      const price = item.product.price || 0
                      const quantity = item.quantity || 1
                      const total = price * quantity
                      return (
                        <div key={item.product.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.product.name} x{quantity}</span>
                          <span className="font-medium">AED {total.toFixed(2)}</span>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <p>No items in cart</p>
                      <Link href="/products" className="text-primary-600 hover:underline text-sm">
                        Continue Shopping
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})</span>
                    <span>AED {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping to {selectedEmirate}</span>
                    <span>{shippingCost === 0 ? 'FREE' : `AED ${shippingCost}`}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>VAT (5%)</span>
                    <span>AED {(subtotal * 0.05).toFixed(2)}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    All prices include 5% VAT
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>AED {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>


                {/* Delivery Info */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <Truck className="h-5 w-5" />
                    <span className="font-semibold">Delivery Information</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your order will be delivered within {selectedEmirate === 'Dubai' ? '1-2 hours' : '24-36 hours'} in {selectedEmirate}.
                  </p>
                </div>

                {/* WhatsApp Support */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-semibold">Need Help?</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    Have questions? Contact our support team via WhatsApp for instant assistance. Please refer the order number.
                  </p>
                  <button
                    onClick={contactWhatsApp}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact Support via WhatsApp
                  </button>
                </div>

                {/* Generate Invoice */}
                <div className="p-4 bg-white border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-black mb-2">
                    <Mail className="h-5 w-5" />
                    <span className="font-semibold">Invoice</span>
                  </div>
                  <p className="text-sm text-black mb-3">
                    Generate and receive a detailed invoice for your order via email.
                  </p>
                  <div className="mb-3">
                    <label htmlFor="invoice-email" className="block text-sm font-medium text-black mb-1">
                      E-mail address
                    </label>
                    <input
                      type="email"
                      id="invoice-email"
                      value={invoiceEmail}
                      onChange={(e) => setInvoiceEmail(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <button
                    onClick={generateAndSendInvoice}
                    disabled={isGeneratingInvoice || items.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Mail className="h-4 w-4" />
                    {isGeneratingInvoice ? 'Generating...' : 'Send by E-mail'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
