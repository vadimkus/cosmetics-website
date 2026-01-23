'use client'

import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Lock, MapPin, Truck, MessageCircle, Building, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { errorLog, debugLog } from '@/lib/logger'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'

export default function CheckoutClient() {
  const { items, getTotalPrice, getTotalItems, selectedEmirate } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { t, locale, dir } = useTranslation()
  const { isPWA, isClient: isPWAClient } = usePWAMode()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  
  // Detect mobile web (non-PWA mobile)
  useEffect(() => {
    const checkMobileWeb = () => {
      const isMobile = window.innerWidth < 768
      setIsMobileWeb(isMobile && !isPWA)
    }
    checkMobileWeb()
    window.addEventListener('resize', checkMobileWeb)
    return () => window.removeEventListener('resize', checkMobileWeb)
  }, [isPWA])
  const [freeMasks, setFreeMasks] = useState<Array<{ id: string; name: string; price: number; quantity: number; image: string }>>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cod')
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(false) // Collapsed by default for PWA

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

  // Helper function to split user name
  const getUserName = () => {
    if (!user?.name) return { firstName: '', lastName: '' }
    const nameParts = user!.name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    return { firstName, lastName }
  }

  const { firstName, lastName } = getUserName()

  // Get the correct email for checkout
  // For Apple Sign In users: use contactEmail if set, otherwise leave empty (mandatory)
  // For regular users: use contactEmail or fall back to auth email
  const getCheckoutEmail = () => {
    if (!user) return ''
    const authEmail = (user.email || '').trim()
    const contactEmail = (user.contactEmail || '').trim()
    const isAppleRelay = authEmail.includes('@privaterelay.appleid.com') || authEmail.includes('@genosys.local')
    
    if (contactEmail) {
      // User has set a contact email - always use it
      return contactEmail
    } else if (isAppleRelay) {
      // Apple user without contact email - leave empty (mandatory to fill)
      return ''
    } else {
      // Regular user - use auth email
      return authEmail
    }
  }

  const checkoutEmail = getCheckoutEmail()

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

  // Function to translate emirate names based on locale
  const getEmirateDisplayName = (emirateName: string): string => {
    if (locale === 'ru') {
      const translations: Record<string, string> = {
        'Dubai': 'Дубай',
        'Abu Dhabi': 'Абу-Даби',
        'Sharjah': 'Шарджа',
        'Ajman': 'Аджман',
        'Ras Al Khaimah': 'Рас-эль-Хайма',
        'Fujairah': 'Фуджейра',
        'Umm Al Quwain': 'Умм-эль-Кайвайн'
      }
      return translations[emirateName] || emirateName
    }
    return emirateName
  }

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

  // Redirect if user is not logged in - wait for auth to finish loading first
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(getLocalizedPath('/login', locale))
    }
  }, [user, authLoading, router, locale])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const paymentMethod = formData.get('payment') as string
      const customerAddress = (formData.get('address') as string) || user?.address || ''
      const customerEmail = (formData.get('email') as string) || user?.email || ''
      const customerPhone = (formData.get('phone') as string) || user?.phone || ''

      // Allow COD, Stripe, and Support Link
      if (!['cod', 'stripe', 'support-link'].includes(paymentMethod)) {
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
          customerEmail: customerEmail,
          customerPhone: customerPhone,
          customerAddress: customerAddress,
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
        router.push(`${getLocalizedPath('/success', locale)}?payment=support-link&order_id=${supportOrderNumber}`)
        return
      }

      // Handle Stripe payment
      if (paymentMethod === 'stripe') {
        try {
          debugLog('💳 Processing Stripe payment')
          
          // Prepare items for Stripe checkout
          const itemsWithFreeMasks = [
            ...items.map(item => {
              const pricing = calculateDiscountedPrice(item.product, user)
              const itemSize = (item.selectedSize && item.selectedSize.trim()) || (item.product.size && item.product.size.trim()) || undefined
              const itemColor = (item.selectedColor && item.selectedColor.trim()) || undefined
              return {
                product: {
                  ...item.product,
                  price: pricing.discountedPrice // Use discounted price for Stripe
                },
                quantity: item.quantity,
                selectedColor: itemColor,
                selectedSize: itemSize
              }
            }),
            ...freeMasks.map(mask => ({
              product: {
                id: mask.id,
                name: mask.name + ' (FREE)',
                price: 0,
                description: 'Free gift with your order',
                image: mask.image,
                category: 'free-gift'
              },
              quantity: mask.quantity,
              selectedColor: undefined,
              selectedSize: undefined
            }))
          ]

          // Ensure CSRF token is available
          const csrfToken = await fetchCsrfToken()
          if (!csrfToken) {
            alert(t('checkout.securityError'))
            setIsProcessing(false)
            return
          }

          debugLog('🔄 Creating Stripe checkout session...')
          
          const response = await fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: getCsrfHeaders(),
            body: JSON.stringify(addCsrfToBody({
              items: itemsWithFreeMasks,
              customerEmail: customerEmail,
              customerName: user?.name || 'Customer',
              customerPhone: customerPhone,
              customerEmirate: selectedEmirate,
              customerAddress: customerAddress,
              locale: locale
            }))
          })

          if (!response.ok) {
            let errorDetails = `HTTP ${response.status} ${response.statusText}`
            try {
              const errorData = await response.json()
              errorDetails = errorData.error || errorData.message || errorDetails
              errorLog('❌ Stripe session creation failed:', {
                status: response.status,
                statusText: response.statusText,
                errorData: errorData
              })
            } catch (parseError) {
              const responseText = await response.text().catch(() => 'Unable to read response')
              errorLog('❌ Stripe session creation failed (parse error):', {
                status: response.status,
                statusText: response.statusText,
                responseText: responseText,
                parseError: parseError instanceof Error ? parseError.message : 'Parse error'
              })
              errorDetails = `${errorDetails} - Response: ${responseText}`
            }
            throw new Error(errorDetails)
          }

          const { url } = await response.json()
          
          if (!url) {
            throw new Error('No checkout URL received from Stripe')
          }

          debugLog('✅ Stripe session created, redirecting to:', url)
          
          // Redirect to Stripe Checkout
          window.location.href = url
          return

        } catch (error) {
          errorLog('❌ Stripe payment error:', error)
          alert(error instanceof Error ? error.message : 'Payment processing failed. Please try again.')
          setIsProcessing(false)
          return
        }
      }

      // For Cash on Delivery, proceed with normal flow
              // Generate canonical order number for website COD: CODW + YYMMDD + 4-digit sequence
              const now = new Date()
              const year = now.getFullYear().toString().slice(-2)
              const month = (now.getMonth() + 1).toString().padStart(2, '0')
              const day = now.getDate().toString().padStart(2, '0')
              const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
              const codOrderNumber = `CODW${year}${month}${day}${sequence}`
      
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
          customerEmail: customerEmail,
          customerPhone: customerPhone,
          customerAddress: customerAddress,
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
          debugLog('📧 Sending COD order confirmation request:', {
            orderNumber: codOrderNumber,
            customerEmail: user?.email,
            itemCount: allItems.length
          })
          
          const response = await fetch('/api/orders/cod-confirmation', {
            method: 'POST',
            headers: getCsrfHeaders(),
            body: JSON.stringify(addCsrfToBody(orderData)),
            signal: controller.signal
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            const errorText = await response.text()
            errorLog('❌ COD confirmation API returned error:', response.status, errorText)
          } else {
            const responseData = await response.json().catch(() => ({}))
            debugLog('✅ COD confirmation API response:', responseData)
          }
        } catch (fetchError: unknown) {
          clearTimeout(timeoutId)
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            errorLog('❌ COD confirmation request timed out after 15 seconds')
          } else {
            errorLog('❌ Error sending COD confirmation request:', fetchError)
          }
        }
      } catch (error) {
        errorLog('Error in COD order processing:', error)
      }
      
      // Always redirect to success page (emails are non-blocking)
      setIsProcessing(false)
      router.push(`${getLocalizedPath('/success', locale)}?order_id=${codOrderNumber}&payment=cod`)
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
    <div className="container mx-auto px-4 py-2 md:py-8 lg:py-16" dir={dir}>
      {/* PWA / Mobile Web Light Header */}
      {(isPWAClient && isPWA) || isMobileWeb ? (
        <div className={`flex items-center justify-between px-1 py-4 mb-4 border-b border-gray-100 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          {/* Back to Bag */}
          <Link 
            href={getLocalizedPath('/cart', locale)}
            className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-5 h-5 text-red-600 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span className="text-base text-red-600">{t('common.bag') || 'Bag'}</span>
          </Link>
          
          {/* Page Title */}
          <h1 className="text-lg font-semibold text-gray-900">
            {t('checkout.checkout')}
          </h1>
          
          {/* Profile Icon - green dot only when logged in */}
          <button 
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[44px] flex justify-end"
          >
            <div className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user ? 'bg-red-600' : 'bg-gray-400'}`}>
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                </span>
              </div>
              {/* Green online dot - only when logged in */}
              {user && (
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-[1.5px] border-white" />
              )}
            </div>
          </button>
        </div>
      ) : null}

      {/* Navigation Breadcrumb - Hide in PWA mode and mobile web */}
      {!(isPWAClient && isPWA) && !isMobileWeb && (
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
      )}
      
      {/* Back to Cart - Hide in PWA mode and mobile web */}
      {!(isPWAClient && isPWA) && !isMobileWeb && (
        <div className={`mb-4 md:mb-8 ${dir === 'rtl' ? 'flex justify-end' : ''}`}>
          <Link 
            href={getLocalizedPath('/cart', locale)} 
            className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span>{t('checkout.backToCart')}</span>
          </Link>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Order Number & Summary - PWA and Mobile Web (Above Form) */}
        {((isPWAClient && isPWA) || isMobileWeb) && (
          <div className="mb-3">
            {/* Order Header Button */}
            <button
              type="button"
              onClick={() => setOrderSummaryExpanded(!orderSummaryExpanded)}
              className={`w-full bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 cursor-pointer shadow-md ${orderSummaryExpanded ? 'rounded-t-xl' : 'rounded-xl'}`}
            >
              <div className={`flex justify-between items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-mono font-bold text-white">
                    {t('checkout.orderNumber') || 'Order #'} {orderNumber}
                  </div>
                  <div className="text-sm font-bold text-white/90">
                    • AED {total.toFixed(2)}
                  </div>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-white transition-transform duration-200 ${orderSummaryExpanded ? 'rotate-180' : ''}`} 
                />
              </div>
            </button>
            
            {/* Expandable Order Summary Content */}
            {orderSummaryExpanded && (
              <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl p-4 shadow-md">
                {/* Items Preview */}
                <div className="space-y-2 mb-3">
                  {items.slice(0, 3).map((item) => {
                    const pricing = calculateDiscountedPrice(item.product, user)
                    return (
                      <div key={item.product.id} className={`flex justify-between text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-gray-700 truncate flex-1 mr-2">{item.product.name} × {item.quantity}</span>
                        <span className="text-gray-900 font-medium">AED {(pricing.discountedPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    )
                  })}
                  {items.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{items.length - 3} {locale === 'ar' ? 'منتجات أخرى' : locale === 'ru' ? 'ещё товаров' : 'more items'}
                    </div>
                  )}
                </div>
                
                {/* Totals */}
                <div className="border-t border-gray-100 pt-3 space-y-1.5">
                  <div className={`flex justify-between text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-600">{locale === 'ar' ? 'المجموع الفرعي' : locale === 'ru' ? 'Подытог' : 'Subtotal'}</span>
                    <span className="text-gray-900">AED {subtotal.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-600">{locale === 'ar' ? 'الشحن' : locale === 'ru' ? 'Доставка' : 'Shipping'}</span>
                    <span className={shippingCost === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}>
                      {shippingCost === 0 ? (locale === 'ar' ? 'مجاني' : locale === 'ru' ? 'Бесплатно' : 'FREE') : `AED ${shippingCost}`}
                    </span>
                  </div>
                  <div className={`flex justify-between text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-600">{locale === 'ar' ? 'ضريبة القيمة المضافة (5%)' : locale === 'ru' ? 'НДС (5%)' : 'VAT (5%)'}</span>
                    <span className="text-gray-900">AED {vatAmount.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between text-base font-bold pt-2 border-t border-gray-200 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-900">{locale === 'ar' ? 'الإجمالي' : locale === 'ru' ? 'Итого' : 'Total'}</span>
                    <span className="text-primary-600">AED {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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
                        name="email"
                        type="email"
                        required
                        defaultValue={checkoutEmail}
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
                        name="phone"
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
                      name="address"
                      required
                      rows={2}
                      defaultValue={user?.address || ''}
                      className={`w-full px-2 py-1.5 md:p-3 text-xs md:text-base border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}
                      placeholder={t('checkout.enterDeliveryAddress')}
                      style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    />
                  </div>
                  
                  {/* Delivery Location - Display only (change on cart/bag page) */}
                  <div>
                    <label className={`block text-[10px] md:text-sm font-medium text-gray-700 mb-0.5 md:mb-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('checkout.deliveryLocation')} *
                    </label>
                    <div className={`flex items-center justify-between w-full px-2 py-1.5 md:px-3 md:py-2.5 text-xs md:text-base border border-gray-200 rounded-md md:rounded-lg bg-gray-50 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-600" />
                        <span className="font-medium text-gray-900">
                          {selectedEmirate ? getEmirateDisplayName(selectedEmirate) : 'Dubai'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push(getLocalizedPath('/cart', locale))}
                        className="text-[10px] md:text-xs text-red-600 hover:text-red-700 font-medium underline"
                      >
                        {t('common.change') || 'Change'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payment Information - PWA & Mobile Web Version */}
                {(isPWAClient && isPWA) || isMobileWeb ? (
                  <div className="space-y-4">
                    <h2 className={`text-base font-semibold text-gray-900 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <CreditCard className="h-5 w-5 text-red-600" />
                      {t('checkout.paymentInformation') || 'Payment Method'}
                    </h2>
                    
                    {/* Payment Toggle Buttons - 3 Horizontal Buttons */}
                    <div className="bg-gray-100 p-1.5 rounded-2xl">
                      <div className={`flex gap-1.5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        {/* Cash on Delivery */}
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('cod')}
                          className={`flex-1 py-3.5 px-2 rounded-xl font-semibold text-xs transition-all touch-manipulation ${
                            selectedPaymentMethod === 'cod'
                              ? 'bg-red-600 text-white shadow-lg'
                              : 'bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1.5">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{locale === 'ar' ? 'عند الاستلام' : locale === 'ru' ? 'Наличные' : 'Cash'}</span>
                          </div>
                        </button>
                        <input type="hidden" name="payment" value={selectedPaymentMethod} />

                        {/* Online Payment */}
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('stripe')}
                          className={`flex-1 py-3.5 px-2 rounded-xl font-semibold text-xs transition-all touch-manipulation ${
                            selectedPaymentMethod === 'stripe'
                              ? 'bg-red-600 text-white shadow-lg'
                              : 'bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1.5">
                            <CreditCard className="w-6 h-6" />
                            <span>{locale === 'ar' ? 'أونلاين' : locale === 'ru' ? 'Онлайн' : 'Online'}</span>
                          </div>
                        </button>

                        {/* Payment Link */}
                        <button
                          type="button"
                          onClick={() => setSelectedPaymentMethod('support-link')}
                          className={`flex-1 py-3.5 px-2 rounded-xl font-semibold text-xs transition-all touch-manipulation ${
                            selectedPaymentMethod === 'support-link'
                              ? 'bg-red-600 text-white shadow-lg'
                              : 'bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1.5">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <span>{locale === 'ar' ? 'رابط دفع' : locale === 'ru' ? 'Ссылка' : 'Link'}</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Payment method description */}
                    <div className="text-center text-xs text-gray-500 min-h-[32px]">
                      {selectedPaymentMethod === 'cod' && (
                        <span>{locale === 'ar' ? 'ادفع نقداً عند استلام طلبك' : locale === 'ru' ? 'Оплата наличными при получении' : 'Pay cash when your order arrives'}</span>
                      )}
                      {selectedPaymentMethod === 'stripe' && (
                        <span>Visa, Mastercard, Apple Pay, Google Pay</span>
                      )}
                      {selectedPaymentMethod === 'support-link' && (
                        <span>{locale === 'ar' ? 'سنرسل لك رابط دفع آمن' : locale === 'ru' ? 'Мы отправим вам ссылку для оплаты' : 'We\'ll send you a secure payment link'}</span>
                      )}
                    </div>

                    {/* Security Note - Only show for online/link payments, not cash */}
                    {selectedPaymentMethod !== 'cod' && (
                      <div className={`flex items-center justify-center gap-2 text-xs text-gray-400 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <Lock className="w-3.5 h-3.5" />
                        <span>{locale === 'ar' ? 'دفع آمن ومشفر' : locale === 'ru' ? 'Безопасная оплата' : 'Secure & encrypted'}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Payment Information - Desktop Browser Version */
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
                      <label className={`flex items-start gap-2.5 md:gap-3 p-2.5 md:p-4 rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'stripe' ? 'border-2 border-primary-400 hover:bg-primary-50 bg-primary-50/50' : 'border border-gray-300 hover:bg-gray-50'} ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="stripe"
                          checked={selectedPaymentMethod === 'stripe'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="focus:ring-primary-500 mt-0.5 flex-shrink-0 w-4 h-4"
                        />
                        <div className={`flex-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                          <div className="font-medium text-gray-900 text-[10px] md:text-base flex items-center">
                            <CreditCard className="w-3 h-3 md:w-4 md:h-4 mr-1.5 text-primary-600" />
                            {t('checkout.stripeCheckout')}
                          </div>
                          <div className="text-[9px] md:text-sm text-gray-600">{t('checkout.secureCardPayment')}</div>
                          <div className="text-[8px] md:text-xs text-gray-500 mt-1">
                            {t('checkout.payOnlineWith') || 'Pay online with'}: Visa, Mastercard, Apple Pay, Google Pay.
                          </div>
                        </div>
                      </label>
                      
                      <label className={`flex items-start gap-2.5 md:gap-3 p-2.5 md:p-4 rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'cod' ? 'border-2 border-primary-400 hover:bg-primary-50 bg-primary-50/50' : 'border border-gray-300 hover:bg-gray-50'} ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={selectedPaymentMethod === 'cod'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="focus:ring-primary-500 mt-0.5 flex-shrink-0 w-4 h-4"
                        />
                        <div className={`flex-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                          <div className="font-medium text-gray-900 text-[10px] md:text-base">{t('checkout.cod')}</div>
                          <div className="text-[9px] md:text-sm text-gray-600">{t('checkout.payWhenDelivered')}</div>
                        </div>
                      </label>

                      <label className={`flex items-start gap-2.5 md:gap-3 p-2.5 md:p-4 rounded-lg cursor-pointer transition-colors ${selectedPaymentMethod === 'support-link' ? 'border-2 border-primary-400 hover:bg-primary-50 bg-primary-50/50' : 'border border-gray-300 hover:bg-gray-50'} ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="support-link"
                          checked={selectedPaymentMethod === 'support-link'}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="focus:ring-primary-500 mt-0.5 flex-shrink-0 w-4 h-4"
                        />
                        <div className={`flex-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                          <div className="font-medium text-gray-900 text-[10px] md:text-base">{t('checkout.generateLinkForPayment')}</div>
                          <div className="text-[9px] md:text-sm text-gray-600">{t('checkout.supportTeamWillShareLink')}</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Order Notes */}
                <div>
                  <label className={`block text-[10px] md:text-sm font-medium text-gray-700 mb-0.5 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {t('checkout.orderNotes')}
                  </label>
                  <textarea
                    rows={2}
                    className={`w-full px-2 py-1.5 md:p-3 text-[0.675rem] md:text-[0.9rem] border border-gray-300 rounded-md md:rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}
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

                {/* PWA Delivery Info - Below Complete Order button */}
                {isPWAClient && isPWA && (
                  <>
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <div className={`flex items-center gap-2 text-green-800 mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <Truck className="h-5 w-5" />
                        <span className="font-semibold text-sm">{t('checkout.deliveryInformation') || 'Delivery Information'}</span>
                      </div>
                      <p className={`text-xs text-green-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {selectedEmirate === 'Dubai' 
                          ? (t('checkout.deliveryTimeDubai') || 'Your order will be delivered by Careem within 1-2 hours.')
                          : `${t('checkout.deliveryTimeOther') || 'Delivery within 2-3 business days to'} ${selectedEmirate ? getEmirateDisplayName(selectedEmirate) : ''} ${t('checkout.byQuiqup') || 'via Quiqup'}.`}
                        {selectedEmirate !== 'Dubai' && (
                          <span className="block mt-1.5">
                            {t('checkout.trackingNumberWillBeShared') || 'Tracking number will be shared via WhatsApp/Email.'}
                          </span>
                        )}
                      </p>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Order Summary - Hidden on Mobile Web (already shown in chevron above) */}
          <div className={`lg:w-1/3 ${isMobileWeb ? 'hidden' : ''}`}>
            <div className="bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg border border-gray-100 sticky top-4 order-summary-container" style={{ overflow: 'hidden', overflowY: 'hidden', overflowX: 'hidden' }}>
              {/* Header - Hidden in PWA (moved to top of page), shown on desktop */}
              {!(isPWAClient && isPWA) && (
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-3 md:px-6 py-3 md:py-4">
                  <div className={`flex justify-between items-center ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                      <div className="text-sm md:text-lg font-mono font-bold text-white">{t('checkout.orderNumber')} {orderNumber}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Content - Collapsible in PWA */}
              <div className={`p-3 md:p-6 ${isPWAClient && isPWA && !orderSummaryExpanded ? 'hidden' : ''}`}>
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
                              <div className={`flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1 flex-wrap ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                <span className="text-[9px] md:text-xs text-gray-500">{t('checkout.qty')} {quantity}</span>
                                {item.selectedColor && item.selectedColor.trim() && (item.product.id === '41' || item.product.productNumber === '41') && (
                                  <span className="text-[9px] md:text-xs text-purple-600 font-medium bg-purple-50 border border-purple-200 rounded px-1.5 py-0.5">
                                    {t('product.color')}: {item.selectedColor}
                                  </span>
                                )}
                                {pricing.hasDiscount && (
                                  <span className="text-[10px] md:text-xs text-green-600 font-medium">
                                    ({pricing.discountPercentage}% {t('product.off')}{pricing.isBeautyBox ? ` - ${t('products.bundleDiscount')}` : ''})
                                  </span>
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
                              {mask.name}
                            </h4>
                            <div className={`flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                              <span className="text-[9px] md:text-xs text-gray-500">{t('checkout.qty')} {mask.quantity}</span>
                            </div>
                          </div>
                          <div className={dir === 'rtl' ? 'text-left mr-2 md:mr-3' : 'text-right ml-2 md:ml-3'}>
                            <div className="text-[9px] md:text-xs font-semibold text-green-600">
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
                  <div className={`flex justify-between items-start py-1.5 md:py-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex flex-col ${dir === 'rtl' ? 'text-right' : ''}`}>
                      <span className={`text-[10px] md:text-sm text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('checkout.subtotal')}: ({getTotalItems()} {getTotalItems() === 1 ? t('checkout.item') : t('checkout.items')})
                      </span>
                      {freeMasks.length > 0 && (
                        <span className={`text-[10px] md:text-sm text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
                          + {freeMasks.length} {freeMasks.length === 1 ? t('checkout.freeMask') : t('checkout.freeMasks')}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] md:text-sm font-medium text-gray-900">AED {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className={`flex justify-between items-center py-1.5 md:py-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-1.5 md:gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Truck className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
                      <span className={`text-[10px] md:text-sm text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('checkout.shippingTo')} {selectedEmirate ? getEmirateDisplayName(selectedEmirate) : ''}</span>
                    </div>
                    <span className="text-[10px] md:text-sm font-medium text-gray-900">
                      {shippingCost === 0 ? <span className="text-[9px] md:text-xs text-green-600 font-semibold">{t('checkout.free')}</span> : `AED ${shippingCost}`}
                    </span>
                  </div>
                  
                  <div className={`flex justify-between items-center py-1.5 md:py-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-[10px] md:text-sm text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('checkout.vat')}</span>
                    <span className="text-[10px] md:text-sm font-medium text-gray-900">AED {vatAmount.toFixed(2)}</span>
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


                {/* Delivery Info - Hidden in PWA (shown below Complete Order button instead) */}
                {!(isPWAClient && isPWA) && (
                  <div className="p-2.5 md:p-4 bg-green-50 border border-green-200 rounded-lg mb-3 md:mb-4">
                    <div className={`flex items-center gap-1.5 md:gap-2 text-green-800 mb-1.5 md:mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Truck className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="font-semibold text-xs md:text-base">{t('checkout.deliveryInformation')}</span>
                    </div>
                    <p className={`text-[10px] md:text-sm text-green-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {selectedEmirate === 'Dubai' 
                        ? t('checkout.deliveryTimeDubai')
                        : `${t('checkout.deliveryTimeOther')} ${selectedEmirate ? getEmirateDisplayName(selectedEmirate) : ''} ${t('checkout.byQuiqup')}.`}
                      {selectedEmirate !== 'Dubai' && (
                        <span className="block mt-1.5 md:mt-2">
                          {t('checkout.trackingNumberWillBeShared')}
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* WhatsApp Support - Hidden in PWA (shown below Delivery Info instead) */}
                {!(isPWAClient && isPWA) && (
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
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
