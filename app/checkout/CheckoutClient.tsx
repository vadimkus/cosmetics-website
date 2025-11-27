'use client'

import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Lock, MapPin, Truck, MessageCircle, Mail, Building } from 'lucide-react'
import Link from 'next/link'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { errorLog } from '@/lib/logger'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

export default function CheckoutClient() {
  const { items, getTotalPrice, getTotalItems, selectedEmirate, setSelectedEmirate } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { t, locale, dir } = useTranslation()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
  const [invoiceEmail, setInvoiceEmail] = useState('')
  const [freeMasks, setFreeMasks] = useState<Array<{ id: string; name: string; price: number; quantity: number; image: string }>>([])

  // Fetch CSRF token on mount
  useEffect(() => {
    fetchCsrfToken().catch(err => {
      errorLog('Failed to fetch CSRF token:', err)
    })
  }, [])
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
    const phoneNumber = '971585487665' // WhatsApp number
    const message = `Hi! I need help with my order ${orderNumber}. Can you assist me?`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // Generate and send invoice function
  const generateAndSendInvoice = async () => {
    if (!invoiceEmail) {
      // Show subtle notification instead of alert
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
      if (emailInput) {
        emailInput.focus()
        emailInput.style.borderColor = '#ef4444'
        setTimeout(() => {
          emailInput.style.borderColor = ''
        }, 3000)
      }
      return
    }

    setIsGeneratingInvoice(true)
    
    try {
      // Get free masks based on subtotal
      const freeMasks = await getFreeMasks(subtotal)

      // Combine regular items with free masks
      const allItems = [
        ...items.map(item => {
          const pricing = calculateDiscountedPrice(item.product, user)
          return {
            id: item.product.id,
            name: item.product.name,
            image: item.product.image,
            price: pricing.discountedPrice,
            quantity: item.quantity,
            total: pricing.discountedPrice * item.quantity
          }
        }),
        ...freeMasks.map(mask => ({
          id: mask.id,
          name: mask.name + ' (FREE)',
          image: mask.image,
          price: 0,
          quantity: mask.quantity,
          total: 0
        }))
      ]

      const invoiceData = {
        orderNumber,
        customerEmail: invoiceEmail,
        customerName: user?.name || 'Customer',
        customerPhone: user?.phone || '',
        customerAddress: user?.address || '',
        emirate: selectedEmirate,
        items: allItems,
        subtotal,
        shippingCost,
        vatAmount,
        total,
        locale
      }

      // Ensure CSRF token is available
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        alert(t('checkout.securityError'))
        setIsGeneratingInvoice(false)
        return
      }

      const response = await fetch('/api/invoice/generate', {
        method: 'POST',
        headers: getCsrfHeaders(),
        body: JSON.stringify(addCsrfToBody(invoiceData)),
      })

      if (response.ok) {
        // Show subtle success notification instead of alert
        const button = document.querySelector('button[type="button"]') as HTMLButtonElement
        if (button) {
          const originalText = button.textContent
          button.textContent = t('checkout.invoiceSent')
          button.style.backgroundColor = '#10b981'
          setTimeout(() => {
            button.textContent = originalText
            button.style.backgroundColor = ''
          }, 2000)
        }
      } else {
        throw new Error('Failed to generate invoice')
      }
    } catch (error) {
      errorLog('Error generating invoice:', error)
      // Show subtle error notification instead of alert
      const button = document.querySelector('button[type="button"]') as HTMLButtonElement
      if (button) {
        const originalText = button.textContent
        button.textContent = t('checkout.failedTryAgain')
        button.style.backgroundColor = '#ef4444'
        setTimeout(() => {
          button.textContent = originalText
          button.style.backgroundColor = ''
        }, 2000)
      }
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
  const subtotal = getTotalPrice(user)
  const shippingCost = subtotal >= 1000 ? 0 : (selectedEmirateData?.shippingCost || 45)
  // Calculate VAT amount from VAT-inclusive prices
  // VAT = (VAT-inclusive amount / 1.05) * 0.05
  const vatAmount = Math.round(((subtotal + shippingCost) / 1.05) * 0.05 * 100) / 100
  const total = subtotal + shippingCost // Total is VAT-inclusive

  // Function to get free masks based on subtotal
  const getFreeMasks = useCallback(async (subtotal: number) => {
    const freeMasks: Array<{ id: string; name: string; price: number; quantity: number; image: string }> = []
    
    try {
      // Fetch mask products
      const [seaAlgaeResponse, collagenResponse] = await Promise.all([
        fetch('/api/products/36'),
        fetch('/api/products/53')
      ])
      
      const seaAlgaeProduct = seaAlgaeResponse.ok ? await seaAlgaeResponse.json() : null
      const collagenProduct = collagenResponse.ok ? await collagenResponse.json() : null
      
      // Add masks based on thresholds
      if (subtotal >= 700 && collagenProduct && seaAlgaeProduct) {
        // 2 free masks (Sea Algae + Collagen)
        freeMasks.push({
          id: seaAlgaeProduct.id,
          name: seaAlgaeProduct.name,
          price: 0, // Free
          quantity: 1,
          image: seaAlgaeProduct.image
        })
        freeMasks.push({
          id: collagenProduct.id,
          name: collagenProduct.name,
          price: 0, // Free
          quantity: 1,
          image: collagenProduct.image
        })
      } else if (subtotal >= 500 && collagenProduct) {
        // 1 free mask (Collagen)
        freeMasks.push({
          id: collagenProduct.id,
          name: collagenProduct.name,
          price: 0, // Free
          quantity: 1,
          image: collagenProduct.image
        })
      }
    } catch (error) {
      errorLog('Error fetching free mask products:', error)
      // Continue without free masks if fetch fails
    }
    
    return freeMasks
  }, [])

  // Fetch free masks when subtotal changes
  useEffect(() => {
    const fetchFreeMasks = async () => {
      const masks = await getFreeMasks(subtotal)
      setFreeMasks(masks)
    }
    if (user) {
      fetchFreeMasks()
    }
  }, [subtotal, user, getFreeMasks])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push(getLocalizedPath('/cart', locale))
    }
  }, [items.length, router, locale])

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push(getLocalizedPath('/login', locale))
    }
  }, [user, router, locale])

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

      // Get free masks based on subtotal
      const freeMasks = await getFreeMasks(subtotal)

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
          // Combine regular items with free masks
          const allItems = [
            ...items.map(item => {
              const pricing = calculateDiscountedPrice(item.product, user)
              // Use selectedSize if available, otherwise fallback to product.size
              const itemSize = (item.selectedSize && item.selectedSize.trim()) || (item.product.size && item.product.size.trim()) || undefined
              const itemColor = (item.selectedColor && item.selectedColor.trim()) || undefined
              return {
                id: item.product.id,
                name: item.product.name,
                price: pricing.discountedPrice,
                quantity: item.quantity,
                total: pricing.discountedPrice * item.quantity,
                image: item.product.image,
                color: itemColor,
                size: itemSize
              }
            }),
            ...freeMasks.map(mask => ({
              id: mask.id,
              name: mask.name + ' (FREE)',
              price: 0,
              quantity: mask.quantity,
              total: 0,
              image: mask.image,
              color: undefined,
              size: undefined
            }))
          ]

        const orderData = {
          orderNumber: supportOrderNumber,
          customerName: user?.name || 'Customer',
          customerEmail: user?.email || '',
          customerPhone: user?.phone || '',
          customerAddress: user?.address || '',
          emirate: selectedEmirate,
          items: allItems,
          subtotal,
          shippingCost,
          vatAmount,
          total,
          locale
        }

          // Ensure CSRF token is available
          const csrfToken = await fetchCsrfToken()
          if (!csrfToken) {
            alert(t('checkout.securityError'))
            setIsProcessing(false)
            return
          }

          // Add timeout to prevent hanging (increased to 15 seconds for database operations)
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

          try {
            const response = await fetch('/api/orders/support-link', {
              method: 'POST',
              headers: getCsrfHeaders(),
              body: JSON.stringify(addCsrfToBody(orderData)),
              signal: controller.signal
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
              const errorText = await response.text()
              errorLog('Failed to send support-link order request:', errorText)
            }
          } catch (fetchError: unknown) {
            clearTimeout(timeoutId)
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
              errorLog('Support-link order request timed out after 15 seconds')
            } else {
              errorLog('Error sending support-link order request:', fetchError)
            }
          }
        } catch (error) {
          errorLog('Error in support-link order processing:', error)
        }
        
        // Always redirect to success page (emails are non-blocking)
        setIsProcessing(false)
        router.push(`/success?payment=support-link&order_id=${supportOrderNumber}`)
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
        // Combine regular items with free masks
        const allItems = [
          ...items.map(item => {
            const pricing = calculateDiscountedPrice(item.product, user)
            // Use selectedSize if available, otherwise fallback to product.size
            const itemSize = (item.selectedSize && item.selectedSize.trim()) || (item.product.size && item.product.size.trim()) || undefined
            const itemColor = (item.selectedColor && item.selectedColor.trim()) || undefined
            return {
              id: item.product.id,
              name: item.product.name,
              price: pricing.discountedPrice,
              quantity: item.quantity,
              total: pricing.discountedPrice * item.quantity,
              image: item.product.image,
              color: itemColor,
              size: itemSize
            }
          }),
          ...freeMasks.map(mask => ({
            id: mask.id,
            name: mask.name + ' (FREE)',
            price: 0,
            quantity: mask.quantity,
            total: 0,
            image: mask.image,
            color: undefined,
            size: undefined
          }))
        ]

        const orderData = {
          orderNumber: codOrderNumber,
          customerName: user?.name || 'Customer',
          customerEmail: user?.email || '',
          customerPhone: user?.phone || '',
          customerAddress: user?.address || '',
          emirate: selectedEmirate,
          items: allItems,
          subtotal,
          shippingCost,
          vatAmount,
          total,
          locale
        }

        // Ensure CSRF token is available
        const csrfToken = await fetchCsrfToken()
        if (!csrfToken) {
          alert('Security error: Could not verify request. Please refresh the page and try again.')
          setIsProcessing(false)
          return
        }

        // Add timeout to prevent hanging (increased to 15 seconds for database operations)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

        try {
          const response = await fetch('/api/orders/cod-confirmation', {
            method: 'POST',
            headers: getCsrfHeaders(),
            body: JSON.stringify(addCsrfToBody(orderData)),
            signal: controller.signal
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            const errorText = await response.text()
            errorLog('Failed to send COD confirmation email:', errorText)
          }
        } catch (fetchError: unknown) {
          clearTimeout(timeoutId)
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            errorLog('COD confirmation request timed out after 10 seconds')
          } else {
            errorLog('Error sending COD confirmation email:', fetchError)
          }
        }
      } catch (error) {
        errorLog('Error in COD order processing:', error)
      }
      
      // Always redirect to success page (emails are non-blocking)
      setIsProcessing(false)
      router.push(`/success?order_id=${codOrderNumber}&payment=cod`)
    } catch (error) {
      errorLog('Order processing failed:', error)
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className={`container mx-auto px-4 py-8 md:py-16 ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="mb-8">
            <CreditCard className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('checkout.yourCartIsEmpty')}</h1>
            <p className="text-gray-600 text-lg mb-8">
              {t('checkout.addItemsBeforeCheckout')}
            </p>
          </div>
          
          <Link
            href={getLocalizedPath('/products', locale)}
            className={`inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-5 w-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            {t('checkout.continueShopping')}
          </Link>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={`container mx-auto px-4 py-8 md:py-16 ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="mb-8">
            <Lock className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('checkout.loginRequired')}</h1>
            <p className="text-gray-600 text-lg mb-8">
              {t('checkout.pleaseLoginToCompleteOrder')}
            </p>
          </div>
          
          <Link
            href={getLocalizedPath('/login', locale)}
            className={`inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <Lock className="h-5 w-5" />
            {t('checkout.login')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`container mx-auto px-3 md:px-4 py-3 md:py-8 lg:py-16 ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
      {/* Navigation Breadcrumb */}
      <div className={`${dir === 'rtl' ? 'flex justify-end' : ''}`}>
        <nav className={`inline-flex items-baseline gap-1.5 md:gap-2 text-xs md:text-base text-gray-600 mb-1.5 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`} aria-label="Breadcrumb">
          <span className="hover:text-primary-600 transition-colors">
            <Link href={getLocalizedPath('/', locale)}>{t('checkout.home')}</Link>
          </span>
          <span>/</span>
          <span className="hover:text-primary-600 transition-colors">
            <Link href={getLocalizedPath('/products', locale)}>{t('checkout.products')}</Link>
          </span>
          <span>/</span>
          <span className="hover:text-primary-600 transition-colors">
            <Link href={getLocalizedPath('/cart', locale)}>{t('checkout.cart')}</Link>
          </span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{t('checkout.checkout')}</span>
        </nav>
      </div>
      
      {/* Back to Cart */}
      <div className={`mb-4 md:mb-8 ${dir === 'rtl' ? 'flex justify-end' : ''}`}>
        <Link 
          href={getLocalizedPath('/cart', locale)} 
          className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          <span>{t('checkout.backToCart')}</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className={`flex flex-col lg:flex-row gap-4 md:gap-8 ${dir === 'rtl' ? 'lg:flex-row-reverse' : ''}`}>
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200">
              <div className="p-3 md:p-6 border-b border-gray-200">
                <h1 className={`text-lg md:text-2xl font-bold text-gray-900 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  {t('checkout.title')}
                </h1>
              </div>
              
              <form onSubmit={handleSubmit} className="p-3 md:p-6 space-y-4 md:space-y-6">

                {/* Shipping Information */}
                <div className="space-y-3 md:space-y-4">
                  <h2 className={`text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                    {t('checkout.shippingInfo')}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <div>
                      <label className={`block text-[10px] md:text-sm font-medium text-gray-700 mb-0.5 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('checkout.firstName')} *
                      </label>
                      <input
                        type="text"
                        required
                        defaultValue={firstName}
                        className={`w-full px-2 py-1.5 md:p-3 text-xs md:text-base border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}
                        placeholder={t('checkout.enterFirstName')}
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-[10px] md:text-sm font-medium text-gray-700 mb-0.5 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('checkout.lastName')} *
                      </label>
                      <input
                        type="text"
                        required
                        defaultValue={lastName}
                        className={`w-full px-2 py-1.5 md:p-3 text-xs md:text-base border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}
                        placeholder={t('checkout.enterLastName')}
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:space-y-4">
                    <div>
                      <label className={`block text-[10px] md:text-sm font-medium text-gray-700 mb-0.5 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('checkout.emailAddress')} *
                      </label>
                      <input
                        type="email"
                        required
                        defaultValue={user?.email || ''}
                        className={`w-full px-2 py-1.5 md:p-3 text-xs md:text-base border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}
                        placeholder={t('checkout.enterEmailAddress')}
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-[10px] md:text-sm font-medium text-gray-700 mb-0.5 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('checkout.phoneNumber')} *
                      </label>
                      <input
                        type="tel"
                        required
                        defaultValue={user?.phone || ''}
                        className={`w-full px-2 py-1.5 md:p-3 text-xs md:text-base border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}
                        placeholder={t('checkout.enterPhoneNumber')}
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-[10px] md:text-sm font-medium text-gray-700 mb-0.5 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('checkout.deliveryAddress')} *
                    </label>
                    <textarea
                      required
                      rows={2}
                      defaultValue={user?.address || ''}
                      className={`w-full px-2 py-1.5 md:p-3 text-xs md:text-base border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}
                      placeholder={t('checkout.enterDeliveryAddress')}
                      style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-[10px] md:text-sm font-medium text-gray-700 mb-0.5 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('checkout.deliveryLocation')} *
                    </label>
                    <select
                      value={selectedEmirate}
                      onChange={(e) => setSelectedEmirate(e.target.value)}
                      className={`w-full px-2 py-1.5 md:p-3 text-xs md:text-base border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}
                      style={{ color: '#111827' }}
                    >
                      {emirates.map((emirate) => (
                        <option key={emirate.name} value={emirate.name} style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                          {emirate.name} - AED {emirate.shippingCost}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-3 md:space-y-4">
                  <h2 className={`text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                    {t('checkout.paymentInformation')}
                  </h2>
                  
                  <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className={`flex items-center gap-2 text-blue-800 mb-1.5 md:mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Building className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="font-semibold text-sm md:text-base">{t('checkout.payment')}</span>
                    </div>
                    <p className={`text-xs md:text-sm text-blue-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('checkout.paymentDescription')}
                    </p>
                  </div>
                  
                  <div className="space-y-2 md:space-y-3">
                    <label className={`flex items-start gap-2.5 md:gap-3 p-2.5 md:p-4 border border-gray-300 rounded-lg cursor-not-allowed opacity-50 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="stripe-checkout"
                        disabled
                        className="text-gray-400 mt-0.5 flex-shrink-0"
                      />
                      <div className={`flex-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        <div className="font-medium text-gray-500 text-xs md:text-base">{t('checkout.stripeCheckout')}</div>
                        <div className="text-[10px] md:text-sm text-gray-400">{t('checkout.comingSoon')}</div>
                      </div>
                    </label>
                    
                    <label className={`flex items-start gap-2.5 md:gap-3 p-2.5 md:p-4 border-2 border-primary-400 rounded-lg cursor-pointer hover:bg-primary-50 bg-primary-50/50 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        defaultChecked
                        className="text-primary-600 focus:ring-primary-500 mt-0.5 flex-shrink-0"
                      />
                      <div className={`flex-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        <div className="font-medium text-gray-900 text-xs md:text-base">{t('checkout.cod')}</div>
                        <div className="text-[10px] md:text-sm text-gray-600">{t('checkout.payWhenDelivered')}</div>
                      </div>
                    </label>

                    <label className={`flex items-start gap-2.5 md:gap-3 p-2.5 md:p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="support-link"
                        className="text-primary-600 focus:ring-primary-500 mt-0.5 flex-shrink-0"
                      />
                      <div className={`flex-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        <div className="font-medium text-gray-900 text-xs md:text-base">{t('checkout.generateLinkForPayment')}</div>
                        <div className="text-[10px] md:text-sm text-gray-600">{t('checkout.supportTeamWillShareLink')}</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <label className={`block text-[10px] md:text-sm font-medium text-gray-700 mb-0.5 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {t('checkout.orderNotes')}
                  </label>
                  <textarea
                    rows={2}
                    className={`w-full px-2 py-1.5 md:p-3 text-xs md:text-base border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}
                    placeholder={t('checkout.orderNotesPlaceholder')}
                    style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full bg-primary-600 text-white py-3 md:py-4 rounded-lg text-sm md:text-base font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                      <span className="text-sm md:text-base">{t('checkout.processingOrder')}</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 md:h-5 md:w-5" />
                      <span>{t('checkout.completeOrder')} - AED {total.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg border border-gray-100 sticky top-4 order-summary-container" style={{ overflow: 'hidden', overflowY: 'hidden', overflowX: 'hidden' }}>
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-3 md:px-6 py-3 md:py-4">
                <div className={`flex justify-between items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                    <div className="text-sm md:text-lg font-mono font-bold text-white">{t('checkout.orderNumber')} {orderNumber}</div>
                  </div>
                </div>
              </div>

              <div className="p-3 md:p-6">
                {/* Items List */}
                <div className="mb-4 md:mb-6">
                  <h3 className={`text-xs md:text-sm font-semibold text-gray-700 mb-3 md:mb-4 uppercase tracking-wide ${dir === 'rtl' ? 'text-right' : ''}`}>{t('checkout.itemsLabel')}</h3>
                  {items.length > 0 || freeMasks.length > 0 ? (
                    <div className="space-y-3 md:space-y-4">
                      {items.map((item) => {
                        const pricing = calculateDiscountedPrice(item.product, user)
                        const quantity = item.quantity || 1
                        const total = pricing.discountedPrice * quantity
                        return (
                          <div key={item.product.id} className={`flex items-start justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-xs md:text-sm font-medium text-gray-900 leading-tight ${dir === 'rtl' ? 'text-right' : ''}`}>
                                {item.product.name}
                              </h4>
                              <div className={`flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                <span className="text-[10px] md:text-xs text-gray-500">{t('checkout.qty')} {quantity}</span>
                                {pricing.hasDiscount && (
                                  <span className="text-[10px] md:text-xs text-green-600 font-medium">({pricing.discountPercentage}% {t('product.off')})</span>
                                )}
                              </div>
                            </div>
                            <div className={dir === 'rtl' ? 'text-left mr-2 md:mr-3' : 'text-right ml-2 md:ml-3'}>
                              <div className="text-xs md:text-sm font-semibold text-gray-900">
                                AED {total.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {freeMasks.map((mask) => (
                        <div key={mask.id} className={`flex items-start justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xs md:text-sm font-medium text-gray-900 leading-tight ${dir === 'rtl' ? 'text-right' : ''}`}>
                              {mask.name} <span className="text-green-600 font-semibold">({t('checkout.free')})</span>
                            </h4>
                            <div className={`flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                              <span className="text-[10px] md:text-xs text-gray-500">{t('checkout.qty')} {mask.quantity}</span>
                            </div>
                          </div>
                          <div className={dir === 'rtl' ? 'text-left mr-2 md:mr-3' : 'text-right ml-2 md:ml-3'}>
                            <div className="text-xs md:text-sm font-semibold text-green-600">
                              {t('checkout.free')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 flex flex-col items-center">
                      <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-2">{t('checkout.yourCartIsEmpty')}</p>
                      <Link href={getLocalizedPath('/products', locale)} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        {t('checkout.continueShopping')}
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <div className={`flex justify-between items-center py-1.5 md:py-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-xs md:text-sm text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('checkout.subtotal')} ({getTotalItems()} {getTotalItems() === 1 ? t('checkout.item') : t('checkout.items')}{freeMasks.length > 0 ? ` + ${freeMasks.length} ${freeMasks.length === 1 ? t('checkout.freeMask') : t('checkout.freeMasks')}` : ''})
                    </span>
                    <span className="text-xs md:text-sm font-medium text-gray-900">AED {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className={`flex justify-between items-center py-1.5 md:py-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-1.5 md:gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Truck className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
                      <span className={`text-xs md:text-sm text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('checkout.shippingTo')} {selectedEmirate}</span>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-900">
                      {shippingCost === 0 ? <span className="text-green-600 font-semibold">{t('checkout.free')}</span> : `AED ${shippingCost}`}
                    </span>
                  </div>
                  
                  <div className={`flex justify-between items-center py-1.5 md:py-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-xs md:text-sm text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('checkout.vat')}</span>
                    <span className="text-xs md:text-sm font-medium text-gray-900">AED {vatAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className={`text-[10px] md:text-xs text-red-600 py-1.5 md:py-2 px-2 bg-gray-50 rounded-lg ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {t('checkout.allPricesIncludeVat')}
                  </div>
                  
                  <div className="border-t-2 border-gray-200 pt-3 md:pt-4">
                    <div className={`flex justify-between items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className={`text-sm md:text-lg font-bold text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('checkout.total')}</span>
                      <span className="text-base md:text-xl font-bold text-primary-600">AED {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>


                {/* Delivery Info */}
                <div className="p-2.5 md:p-4 bg-green-50 border border-green-200 rounded-lg mb-3 md:mb-4">
                  <div className={`flex items-center gap-1.5 md:gap-2 text-green-800 mb-1.5 md:mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Truck className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="font-semibold text-xs md:text-base">{t('checkout.deliveryInformation')}</span>
                  </div>
                  <p className={`text-[10px] md:text-sm text-green-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {selectedEmirate === 'Dubai' 
                      ? t('checkout.deliveryTimeDubai')
                      : `${t('checkout.deliveryTimeOther')} ${selectedEmirate} ${t('checkout.byQuiqup')}.`}
                    {selectedEmirate !== 'Dubai' && (
                      <span className="block mt-1.5 md:mt-2">
                        {t('checkout.trackingNumberWillBeShared')}
                      </span>
                    )}
                  </p>
                </div>

                {/* WhatsApp Support */}
                <div className="p-2.5 md:p-4 bg-blue-50 border border-blue-200 rounded-lg mb-3 md:mb-4">
                  <div className={`flex items-center gap-1.5 md:gap-2 text-blue-800 mb-1.5 md:mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="font-semibold text-xs md:text-base">{t('checkout.needHelp')}</span>
                  </div>
                  <p className={`text-[10px] md:text-sm text-blue-700 mb-2 md:mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {t('checkout.haveQuestions')}
                  </p>
                  <button
                    onClick={contactWhatsApp}
                    className={`w-full flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-xs md:text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                  >
                    <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    {t('checkout.contactSupportViaWhatsApp')}
                  </button>
                </div>

                {/* Generate Invoice */}
                <div className="p-2.5 md:p-4 bg-white border border-red-200 rounded-lg">
                  <div className={`flex items-center gap-1.5 md:gap-2 text-black mb-1.5 md:mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Mail className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="font-semibold text-xs md:text-base">{t('checkout.invoice')}</span>
                  </div>
                  <p className={`text-[10px] md:text-sm text-black mb-2 md:mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {t('checkout.generateInvoiceDescription')}
                  </p>
                  <div className="mb-2 md:mb-3">
                    <label htmlFor="invoice-email" className={`block text-[10px] md:text-sm font-medium text-black mb-0.5 md:mb-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('checkout.emailAddressLabel')}
                    </label>
                    <input
                      type="email"
                      id="invoice-email"
                      value={invoiceEmail}
                      onChange={(e) => setInvoiceEmail(e.target.value)}
                      className={`w-full px-2 py-1.5 border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-xs md:text-sm bg-white text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}
                      placeholder={t('checkout.enterEmailAddressPlaceholder')}
                      required
                      style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    />
                  </div>
                  <button
                    onClick={generateAndSendInvoice}
                    disabled={isGeneratingInvoice || items.length === 0}
                    className={`w-full flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-xs md:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                  >
                    <Mail className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    {isGeneratingInvoice ? t('checkout.generating') : t('checkout.sendByEmail')}
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
