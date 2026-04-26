'use client'

import { useCart } from '@/components/cart/CartProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Lock, MapPin, Truck, MessageCircle, ChevronDown, ShoppingBag, Pencil } from 'lucide-react'
import Link from 'next/link'
import CheckoutHeader from '@/components/checkout/CheckoutHeader'
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { getCartLinePayloadPricing, getCartLinePricing } from '@/lib/cartPricing'
import { calculateMobileShipping, calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import { errorLog, debugLog } from '@/lib/logger'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useIsMobileWeb } from '@/hooks/useIsMobile'
import dynamic from 'next/dynamic'

// Lazy load heavy checkout components (Stripe SDK + BottomSheet only needed conditionally)
const BottomSheet = dynamic(() => import('@/components/ui/BottomSheet'), { ssr: false })
const StripeProvider = dynamic(() => import('@/components/stripe/StripeProvider'), { ssr: false })
const PaymentForm = dynamic(() => import('@/components/stripe/PaymentForm'), { ssr: false })

export default function CheckoutClient() {
  const { items, getTotalPrice, getTotalItems, selectedEmirate, _hasHydrated } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { t, locale, dir } = useTranslation()
  const { isPWA, isClient: isPWAClient } = usePWAMode()
  const [isProcessing, setIsProcessing] = useState(false)
  // Use ref for synchronous double-submission prevention (state updates are async)
  const isSubmittingRef = useRef(false)
  const { isMobileWeb } = useIsMobileWeb()
  const [freeMasks, setFreeMasks] = useState<Array<{ id: string; name: string; price: number; quantity: number; image: string }>>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('stripe')
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(false) // Collapsed by default for PWA
  
  // Payment sheet state for embedded Stripe checkout
  const [isPaymentSheetOpen, setIsPaymentSheetOpen] = useState(false)
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null)
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null)
  const [paymentTotal, setPaymentTotal] = useState<number>(0)

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

  const subtotal = getTotalPrice(user)
  // Shipping & VAT — single source of truth from mobileCheckoutConfig (matches backend)
  const shippingCost = calculateMobileShipping(subtotal, selectedEmirate)
  const total = subtotal + shippingCost // Total is VAT-inclusive
  const vatAmount = Math.round(calculateVatIncluded(total) * 100) / 100

  // Waterfall discount breakdown: compute retail total, VIP discount, and bundle discount
  const { retailTotal, userDiscountTotal, bundleDiscountTotal, afterVipSubtotal, userDiscountPct, bundleDiscountPct } = (() => {
    let _retailTotal = 0
    let _userDiscountTotal = 0
    let _bundleDiscountTotal = 0
    let _userDiscountPct = 0
    let _bundleDiscountPct = 0
    
    items.forEach(item => {
      const quantity = item.quantity || 1
      const originalPrice = item.product.price
      _retailTotal += originalPrice * quantity
      
      const isBundleItem = item.fromBundle && item.bundleDiscountPercent && item.bundleDiscountPercent > 0
      
      if (isBundleItem) {
        // Bundle items: ONLY bundle discount on retail price (no VIP)
        const bundleDiscount = (originalPrice * item.bundleDiscountPercent!) / 100
        _bundleDiscountTotal += bundleDiscount * quantity
        if (item.bundleDiscountPercent! > 0) _bundleDiscountPct = item.bundleDiscountPercent!
      } else {
        // Non-bundle items: apply user/VIP discount
        const pricing = calculateDiscountedPrice(item.product, user)
        if (pricing.hasDiscount && !pricing.isBeautyBox) {
          _userDiscountTotal += pricing.discountAmount * quantity
          if (pricing.discountPercentage > 0) _userDiscountPct = pricing.discountPercentage
        }
      }
    })
    
    return {
      retailTotal: Math.round(_retailTotal * 100) / 100,
      userDiscountTotal: Math.round(_userDiscountTotal * 100) / 100,
      bundleDiscountTotal: Math.round(_bundleDiscountTotal * 100) / 100,
      afterVipSubtotal: Math.round((_retailTotal - _userDiscountTotal) * 100) / 100,
      userDiscountPct: _userDiscountPct,
      bundleDiscountPct: _bundleDiscountPct
    }
  })()
  const hasUserDiscount = userDiscountTotal > 0
  const hasBundleDiscount = bundleDiscountTotal > 0
  const hasAnyDiscount = hasUserDiscount || hasBundleDiscount
  const totalSaved = Math.round((userDiscountTotal + bundleDiscountTotal) * 100) / 100

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

  // Redirect if cart is empty - but only after hydration is complete
  // This prevents false redirects during the initial SSR->client hydration
  useEffect(() => {
    if (_hasHydrated && items.length === 0) {
      router.push(getLocalizedPath('/cart', locale))
    }
  }, [items.length, router, locale, _hasHydrated])

  // Redirect if user is not logged in - wait for auth to finish loading first
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(getLocalizedPath('/login', locale))
    }
  }, [user, authLoading, router, locale])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Synchronous double-submission prevention (ref check is instant, unlike state)
    if (isSubmittingRef.current) {
      debugLog('⚠️ Duplicate submission blocked - already processing')
      return
    }
    isSubmittingRef.current = true
    setIsProcessing(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const paymentMethod = formData.get('payment') as string
      const customerAddress = (formData.get('address') as string) || user?.address || ''
      const customerEmail = (formData.get('email') as string) || user?.email || ''
      const customerPhone = (formData.get('phone') as string) || user?.phone || ''

      if (!['cod', 'stripe'].includes(paymentMethod)) {
        isSubmittingRef.current = false
        setIsProcessing(false)
        return
      }

      // Validate variant selection for all cart items
      const itemsMissingColor = items.filter(item => {
        const colorVariants = (item.product.variants || []).filter(v => v.color && v.available !== false)
        const uniqueColors = new Set(colorVariants.map(v => v.color))
        return uniqueColors.size > 1 && !item.selectedColor?.trim()
      })
      const itemsMissingSize = items.filter(item => {
        const sizeVariants = (item.product.variants || []).filter(v => v.size && v.size !== 'default' && v.available !== false)
        const uniqueSizes = new Set(sizeVariants.map(v => v.size))
        return uniqueSizes.size > 1 && !item.selectedSize?.trim()
      })
      if (itemsMissingColor.length > 0 || itemsMissingSize.length > 0) {
        const names = [...itemsMissingColor, ...itemsMissingSize]
          .reduce((acc, item) => {
            if (!acc.includes(item.product.name)) acc.push(item.product.name)
            return acc
          }, [] as string[])
        alert(t('checkout.variantRequiredMessage').replace('{products}', names.join(', ')) || `Please select color/size for: ${names.join(', ')}. Go back to your cart to choose.`)
        isSubmittingRef.current = false
        setIsProcessing(false)
        return
      }

      // Get free masks based on subtotal
      const freeMasks = await getFreeMasks(subtotal)

      // Handle Stripe payment - open embedded payment sheet
      if (paymentMethod === 'stripe') {
        try {
          debugLog('💳 Processing Stripe payment with embedded checkout')
          
          // Prepare items for Stripe payment intent
          const itemsWithFreeMasks = [
            ...items.map(item => {
              const itemSize = (item.selectedSize && item.selectedSize.trim()) || (item.product.size && item.product.size.trim()) || undefined
              const itemColor = (item.selectedColor && item.selectedColor.trim()) || undefined
              const payloadPricing = getCartLinePayloadPricing(item, user)
              
              return {
                product: {
                  ...item.product,
                  price: payloadPricing.price
                },
                quantity: item.quantity,
                selectedColor: itemColor,
                selectedSize: itemSize,
                // Pass bundle flags so backend can properly reverse-calculate discount amounts
                ...(payloadPricing.bundleDiscount ? { fromBundle: true } : {}),
                ...(payloadPricing.bundleDiscount ? { bundleDiscountPercent: payloadPricing.bundleDiscount } : {})
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
            isSubmittingRef.current = false
            setIsProcessing(false)
            return
          }

          debugLog('🔄 Creating Stripe payment intent...')
          
          const response = await fetch('/api/stripe/create-payment-intent', {
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
              errorLog('❌ Payment intent creation failed:', {
                status: response.status,
                statusText: response.statusText,
                errorData: errorData
              })
            } catch (parseError) {
              const responseText = await response.text().catch(() => 'Unable to read response')
              errorLog('❌ Payment intent creation failed (parse error):', {
                status: response.status,
                statusText: response.statusText,
                responseText: responseText,
                parseError: parseError instanceof Error ? parseError.message : 'Parse error'
              })
              errorDetails = `${errorDetails} - Response: ${responseText}`
            }
            throw new Error(errorDetails)
          }

          const { clientSecret, orderId, total } = await response.json()
          
          if (!clientSecret) {
            throw new Error('No client secret received from Stripe')
          }

          debugLog('✅ Payment intent created, opening payment sheet:', { orderId, total })
          
          // Set payment sheet state and open it
          setPaymentClientSecret(clientSecret)
          setPaymentOrderId(orderId)
          setPaymentTotal(total)
          setIsPaymentSheetOpen(true)
          
          // Reset processing state - user will complete payment in the sheet
          isSubmittingRef.current = false
          setIsProcessing(false)
          return

        } catch (error) {
          errorLog('❌ Stripe payment error:', error)
          alert(error instanceof Error ? error.message : t('errors.paymentFailed'))
          isSubmittingRef.current = false
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
            // Use selectedSize if available, otherwise fallback to product.size
            const itemSize = (item.selectedSize && item.selectedSize.trim()) || (item.product.size && item.product.size.trim()) || undefined
            const itemColor = (item.selectedColor && item.selectedColor.trim()) || undefined
            const payloadPricing = getCartLinePayloadPricing(item, user)

            return {
              id: item.product.id,
              name: item.product.name,
              price: payloadPricing.price,
              quantity: item.quantity,
              total: payloadPricing.total,
              image: item.product.image,
              color: itemColor,
              size: itemSize,
              ...(payloadPricing.bundleDiscount ? { bundleDiscount: payloadPricing.bundleDiscount } : {})
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
          locale,
          // Bundle discount data for proper waterfall display
          ...(bundleDiscountPct > 0 ? { bundleDiscountPercentage: bundleDiscountPct } : {}),
          ...(bundleDiscountTotal > 0 ? { bundleDiscountAmount: bundleDiscountTotal } : {})
        }

        // Ensure CSRF token is available
        const csrfToken = await fetchCsrfToken()
        if (!csrfToken) {
          alert(t('errors.securityError'))
          isSubmittingRef.current = false
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
      isSubmittingRef.current = false
      setIsProcessing(false)
      router.push(`${getLocalizedPath('/success', locale)}?order_id=${codOrderNumber}&payment=cod`)
    } catch (error) {
      errorLog('Order processing failed:', error)
      isSubmittingRef.current = false
      setIsProcessing(false)
    }
  }

  // Show loading state while cart is hydrating from localStorage
  if (!_hasHydrated) {
    return (
      <div className={`container mx-auto px-4 py-8 md:py-16 ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="animate-pulse">
            <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
          </div>
        </div>
      </div>
    )
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

  const isAppLikeMode = (isPWAClient && isPWA) || isMobileWeb

  return (
    <div className={`container mx-auto px-4 py-2 md:py-8 lg:py-16 ${isAppLikeMode ? 'pb-[calc(96px+env(safe-area-inset-bottom))]' : ''}`} dir={dir}>
      <CheckoutHeader
        isPWA={isPWA}
        isPWAClient={isPWAClient}
        isMobileWeb={isMobileWeb}
        locale={locale}
        dir={dir}
        t={t}
        user={user}
      />

      <div className="max-w-6xl mx-auto">
        {/* Order Number & Summary - PWA and Mobile Web (Above Form) */}
        {((isPWAClient && isPWA) || isMobileWeb) && (
          <div className="mb-3">
            {/* Order Header Button */}
            <button
              type="button"
              onClick={() => setOrderSummaryExpanded(!orderSummaryExpanded)}
              className={`w-full bg-white border border-gray-200 px-4 py-3 cursor-pointer shadow-sm text-left transition-colors hover:bg-gray-50 active:bg-gray-100 ${orderSummaryExpanded ? 'rounded-t-xl border-b-0' : 'rounded-xl'}`}
              aria-expanded={orderSummaryExpanded}
              aria-controls="checkout-order-summary"
            >
              <div className={`flex justify-between items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 min-w-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <span className="h-9 w-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <ShoppingBag className="h-5 w-5" />
                  </span>
                  <div className={`min-w-0 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className="text-[11px] md:text-xs text-gray-500 font-medium uppercase tracking-wide truncate">
                      {t('checkout.orderNumber') || 'Order #'} {orderNumber}
                    </div>
                    <div className="text-base md:text-lg font-bold text-gray-900">
                      AED {total.toFixed(2)}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${orderSummaryExpanded ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </div>
            </button>
            
            {/* Expandable Order Summary Content - Full Details */}
            {orderSummaryExpanded && (
              <div id="checkout-order-summary" className="bg-white border border-t-0 border-gray-200 rounded-b-xl p-4 shadow-sm">
                {/* Items with discount info */}
                <div className="space-y-3 mb-4">
                  <h4 className={`text-xs font-semibold text-gray-500 uppercase tracking-wide ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {locale === 'ar' ? 'المنتجات' : locale === 'ru' ? 'Товары' : 'ITEMS'}:
                  </h4>
                  {items.map((item) => {
                    const quantity = item.quantity || 1
                    const linePricing = getCartLinePricing(item, user)
                    
                    // Handle bundle items - only bundle discount on retail price (no VIP)
                    if (item.fromBundle && item.bundleDiscountPercent && item.bundleDiscountPercent > 0) {
                      const discountText = `${linePricing.discountPercentage}%`
                      
                      return (
                        <div key={`${item.product.id}-bundle`} className={`flex justify-between items-start ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                            <div className={`flex items-center gap-2 mt-0.5 flex-wrap ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                              <span className="text-xs text-gray-500">{locale === 'ar' ? 'الكمية' : locale === 'ru' ? 'Кол-во' : 'Qty'}: {quantity}</span>
                              <span className="text-xs text-purple-600 font-medium">
                                ✨ {discountText} {locale === 'ar' ? 'خصم المجموعة' : locale === 'ru' ? 'Скидка набора' : 'Bundle Discount'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-purple-700">AED {linePricing.lineTotal.toFixed(2)}</span>
                            <div className="text-xs text-gray-400 line-through">AED {linePricing.retailLineTotal.toFixed(2)}</div>
                          </div>
                        </div>
                      )
                    }
                    
                    // Standard pricing for non-bundle items
                    const hasDiscount = linePricing.discountAmount > 0
                    const isBeautyBox = linePricing.discountType === 'beauty_box'
                    return (
                      <div key={item.product.id} className={`flex justify-between items-start ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                          <div className={`flex items-center gap-2 mt-0.5 flex-wrap ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                            <span className="text-xs text-gray-500">{locale === 'ar' ? 'الكمية' : locale === 'ru' ? 'Кол-во' : 'Qty'}: {quantity}</span>
                            {hasDiscount && (
                              <span className="text-xs text-green-600 font-medium">
                                ({linePricing.discountPercentage}% {locale === 'ar' ? 'خصم' : locale === 'ru' ? 'скидка' : 'OFF'}{isBeautyBox ? ` - ${locale === 'ar' ? 'خصم الطقم' : locale === 'ru' ? 'Скидка набора' : 'Bundle Discount'}` : ''})
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0">
                          {hasDiscount ? (
                            <div className="text-right">
                              <div className="text-xs text-gray-400 line-through">AED {linePricing.retailLineTotal.toFixed(2)}</div>
                              <div className="text-sm font-semibold text-green-600">AED {linePricing.lineTotal.toFixed(2)}</div>
                            </div>
                          ) : (
                            <span className="text-sm font-semibold text-gray-900">AED {linePricing.lineTotal.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {/* Free masks */}
                  {freeMasks.map((mask) => (
                    <div key={mask.id} className={`flex justify-between items-start ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="text-sm font-medium text-gray-900">{mask.name}</div>
                        <span className="text-xs text-gray-500">{locale === 'ar' ? 'الكمية' : locale === 'ru' ? 'Кол-во' : 'Qty'}: {mask.quantity}</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">{locale === 'ar' ? 'مجاني' : locale === 'ru' ? 'Бесплатно' : 'FREE'}</span>
                    </div>
                  ))}
                </div>
                
                {/* Totals - Waterfall Discount Breakdown */}
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  {/* Retail Price or Subtotal */}
                  {hasAnyDiscount ? (
                    <div className={`flex justify-between text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-gray-600">
                        {locale === 'ar' ? 'سعر التجزئة' : locale === 'ru' ? 'Розничная цена' : 'Retail Price'}: ({getTotalItems()} {getTotalItems() === 1 ? (locale === 'ar' ? 'منتج' : locale === 'ru' ? 'товар' : 'item') : (locale === 'ar' ? 'منتجات' : locale === 'ru' ? 'товаров' : 'items')})
                        {freeMasks.length > 0 && <span className="block text-xs">+ {freeMasks.length} {locale === 'ar' ? 'هدايا مجانية' : locale === 'ru' ? 'бесплатных масок' : 'free masks'}</span>}
                      </span>
                      <span className="text-gray-400 line-through">AED {retailTotal.toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className={`flex justify-between text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-gray-600">
                        {locale === 'ar' ? 'المجموع الفرعي' : locale === 'ru' ? 'Подытог' : 'Subtotal'}: ({getTotalItems()} {getTotalItems() === 1 ? (locale === 'ar' ? 'منتج' : locale === 'ru' ? 'товар' : 'item') : (locale === 'ar' ? 'منتجات' : locale === 'ru' ? 'товаров' : 'items')})
                        {freeMasks.length > 0 && <span className="block text-xs">+ {freeMasks.length} {locale === 'ar' ? 'هدايا مجانية' : locale === 'ru' ? 'бесплатных масок' : 'free masks'}</span>}
                      </span>
                      <span className="text-gray-900 font-medium">AED {subtotal.toFixed(2)}</span>
                    </div>
                  )}
                  {/* VIP Discount */}
                  {hasUserDiscount && (
                    <div className={`flex justify-between text-sm text-purple-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="font-medium">🏷️ {locale === 'ar' ? 'خصمك' : locale === 'ru' ? 'Ваша скидка' : 'Your Discount'}{userDiscountPct > 0 ? ` (${userDiscountPct}%)` : ''}</span>
                      <span className="font-medium">-AED {userDiscountTotal.toFixed(2)}</span>
                    </div>
                  )}
                  {/* Intermediate Subtotal */}
                  {hasUserDiscount && hasBundleDiscount && (
                    <div className={`flex justify-between text-xs text-gray-400 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span>{locale === 'ar' ? 'المجموع الفرعي' : locale === 'ru' ? 'Подытог' : 'Subtotal'}</span>
                      <span>AED {afterVipSubtotal.toFixed(2)}</span>
                    </div>
                  )}
                  {/* Bundle Discount */}
                  {hasBundleDiscount && (
                    <div className={`flex justify-between text-sm text-green-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="font-medium">📦 {locale === 'ar' ? 'خصم الباقة' : locale === 'ru' ? 'Скидка набора' : 'Bundle Discount'}{bundleDiscountPct > 0 ? ` (${bundleDiscountPct}%)` : ''}</span>
                      <span className="font-medium">-AED {bundleDiscountTotal.toFixed(2)}</span>
                    </div>
                  )}
                  {/* Net Subtotal */}
                  {hasAnyDiscount && (
                    <>
                      <div className="h-px bg-gray-200" />
                      <div className={`flex justify-between text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-gray-900 font-semibold">{locale === 'ar' ? 'المجموع الفرعي الصافي' : locale === 'ru' ? 'Подытог' : 'Net Subtotal'}</span>
                        <span className="text-gray-900 font-semibold">AED {subtotal.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className={`flex justify-between text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-600 flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-green-600" />
                      {locale === 'ar' ? 'الشحن إلى' : locale === 'ru' ? 'Доставка в' : 'Shipping to'} {selectedEmirate ? getEmirateDisplayName(selectedEmirate) : ''}
                    </span>
                    <span className={shippingCost === 0 ? 'text-green-600 font-semibold' : 'text-gray-900'}>
                      {shippingCost === 0 ? (locale === 'ar' ? 'مجاني' : locale === 'ru' ? 'Бесплатно' : 'FREE') : `AED ${shippingCost}`}
                    </span>
                  </div>
                  <div className={`flex justify-between text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-600">{locale === 'ar' ? 'ضريبة القيمة المضافة (5%)' : locale === 'ru' ? 'НДС (5%)' : 'VAT (5%)'}</span>
                    <span className="text-gray-900">AED {vatAmount.toFixed(2)}</span>
                  </div>
                  <div className={`text-xs text-red-600 py-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {locale === 'ar' ? 'جميع الأسعار شاملة 5% ضريبة القيمة المضافة' : locale === 'ru' ? 'Все цены включают 5% НДС' : 'All prices include 5% VAT'}
                  </div>
                  <div className={`flex justify-between text-base font-bold pt-2 border-t border-gray-200 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-900">{locale === 'ar' ? 'الإجمالي' : locale === 'ru' ? 'Итого' : 'Total'}:</span>
                    <span className="text-primary-600">AED {total.toFixed(2)}</span>
                  </div>
                  {/* You Saved */}
                  {hasAnyDiscount && (
                    <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-center">
                      <span className="text-xs text-green-700 font-semibold">
                        💰 {locale === 'ar' ? 'وفرت' : locale === 'ru' ? 'Вы сэкономили' : 'You saved'}: AED {totalSaved.toFixed(2)}
                      </span>
                    </div>
                  )}
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
              
              <form id="checkout-form" onSubmit={handleSubmit} className="p-3 md:p-6 space-y-4 md:space-y-6">

                {/* Shipping Information */}
                <div className="space-y-3 md:space-y-4">
                  <h2 className={`text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                    {t('checkout.shippingInfo')}
                  </h2>

                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label htmlFor="checkout-firstname" className={`block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('checkout.firstName')} *
                      </label>
                      <input
                        id="checkout-firstname"
                        name="firstName"
                        type="text"
                        required
                        autoComplete="given-name"
                        defaultValue={firstName}
                        className={`w-full px-3 py-2.5 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 min-h-[44px] ${dir === 'rtl' ? 'text-right' : ''}`}
                        placeholder={t('checkout.enterFirstName')}
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>

                    <div>
                      <label htmlFor="checkout-lastname" className={`block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('checkout.lastName')} *
                      </label>
                      <input
                        id="checkout-lastname"
                        name="lastName"
                        type="text"
                        required
                        autoComplete="family-name"
                        defaultValue={lastName}
                        className={`w-full px-3 py-2.5 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 min-h-[44px] ${dir === 'rtl' ? 'text-right' : ''}`}
                        placeholder={t('checkout.enterLastName')}
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label htmlFor="checkout-email" className={`block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('checkout.emailAddress')} *
                      </label>
                      <input
                        id="checkout-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        defaultValue={checkoutEmail}
                        className={`w-full px-3 py-2.5 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 min-h-[44px] ${dir === 'rtl' ? 'text-right' : ''}`}
                        placeholder={t('checkout.enterEmailAddress')}
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>

                    <div>
                      <label htmlFor="checkout-phone" className={`block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('checkout.phoneNumber')} *
                      </label>
                      <input
                        id="checkout-phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        defaultValue={user?.phone || ''}
                        className={`w-full px-3 py-2.5 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 min-h-[44px] ${dir === 'rtl' ? 'text-right' : ''}`}
                        placeholder={t('checkout.enterPhoneNumber')}
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="checkout-address" className={`block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('checkout.deliveryAddress')} *
                    </label>
                    <textarea
                      id="checkout-address"
                      name="address"
                      required
                      rows={2}
                      autoComplete="street-address"
                      defaultValue={user?.address || ''}
                      className={`w-full px-3 py-2.5 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}
                      placeholder={t('checkout.enterDeliveryAddress')}
                      style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    />
                  </div>

                  {/* Delivery Location - Display only (change on cart/bag page) */}
                  <div>
                    <label className={`block text-xs md:text-sm font-medium text-gray-700 mb-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('checkout.deliveryLocation')} *
                    </label>
                    <button
                      type="button"
                      onClick={() => router.push(getLocalizedPath('/cart', locale))}
                      className={`w-full flex items-center justify-between px-3 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg bg-white text-gray-900 min-h-[44px] hover:bg-gray-50 active:bg-gray-100 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                      aria-label={`${t('checkout.deliveryLocation')}: ${selectedEmirate ? getEmirateDisplayName(selectedEmirate) : 'Dubai'} — ${t('common.change') || 'Change'}`}
                    >
                      <span className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <MapPin className="h-4 w-4 text-red-600 flex-shrink-0" aria-hidden="true" />
                        <span className="font-medium">
                          {selectedEmirate ? getEmirateDisplayName(selectedEmirate) : 'Dubai'}
                        </span>
                      </span>
                      <span className={`flex items-center gap-1 text-xs text-red-600 font-medium ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        {t('common.change') || 'Change'}
                      </span>
                    </button>
                  </div>
                </div>

                <PaymentMethodSelector
                  isPWA={isPWA}
                  isPWAClient={isPWAClient}
                  isMobileWeb={isMobileWeb}
                  locale={locale}
                  dir={dir}
                  t={t}
                  selectedPaymentMethod={selectedPaymentMethod}
                  setSelectedPaymentMethod={setSelectedPaymentMethod}
                />

                {/* Order Notes */}
                <div>
                  <label htmlFor="checkout-notes" className={`block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {t('checkout.orderNotes')}
                  </label>
                  <textarea
                    id="checkout-notes"
                    name="notes"
                    rows={2}
                    maxLength={500}
                    className={`w-full px-3 py-2.5 md:p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}
                    placeholder={t('checkout.orderNotesPlaceholder')}
                    style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  />
                </div>

                {/* Submit Button — hidden on mobile/PWA (replaced by sticky bottom CTA below) */}
                {!isAppLikeMode && (
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
                )}

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

          {/* Order Summary - Hidden on Mobile Web and PWA (already shown in chevron above) */}
          <div className={`lg:w-1/3 ${(isMobileWeb || (isPWAClient && isPWA)) ? 'hidden' : ''}`}>
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
                        const quantity = item.quantity || 1
                        const linePricing = getCartLinePricing(item, user)
                        
                        // Handle bundle items - only bundle discount on retail price (no VIP)
                        if (item.fromBundle && item.bundleDiscountPercent && item.bundleDiscountPercent > 0) {
                          const discountText = `${linePricing.discountPercentage}%`
                          
                          return (
                            <div key={`${item.product.id}-bundle`} className={`flex items-start justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-xs md:text-sm font-medium text-gray-900 leading-tight ${dir === 'rtl' ? 'text-right' : ''}`}>
                                  {item.product.name}
                                </h4>
                                <div className={`flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1 flex-wrap ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                  <span className="text-[9px] md:text-xs text-gray-500">{t('checkout.qty')} {quantity}</span>
                                  {item.selectedColor && item.selectedColor.trim() && (item.product.id === '41' || item.product.productNumber === '41' || item.product.id === '63' || item.product.productNumber === '63') && (
                                    <span className="text-[9px] md:text-xs text-purple-600 font-medium bg-purple-50 border border-purple-200 rounded px-1.5 py-0.5">
                                      {t('product.color')}: {item.selectedColor}
                                    </span>
                                  )}
                                  <span className="text-[10px] md:text-xs text-purple-600 font-medium">
                                    ✨ {discountText} {t('products.bundleDiscount')}
                                  </span>
                                </div>
                              </div>
                              <div className={dir === 'rtl' ? 'text-left mr-2 md:mr-3' : 'text-right ml-2 md:ml-3'}>
                                <div className="text-xs md:text-sm font-semibold text-purple-700">
                                  AED {linePricing.lineTotal.toFixed(2)}
                                </div>
                                <div className="text-[9px] md:text-xs text-gray-400 line-through">
                                  AED {linePricing.retailLineTotal.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          )
                        }
                        
                        // Standard pricing for non-bundle items
                        const hasDiscount = linePricing.discountAmount > 0
                        const isBeautyBox = linePricing.discountType === 'beauty_box'
                        return (
                          <div key={item.product.id} className={`flex items-start justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-xs md:text-sm font-medium text-gray-900 leading-tight ${dir === 'rtl' ? 'text-right' : ''}`}>
                                {item.product.name}
                              </h4>
                              <div className={`flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1 flex-wrap ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                <span className="text-[9px] md:text-xs text-gray-500">{t('checkout.qty')} {quantity}</span>
                                {item.selectedColor && item.selectedColor.trim() && (item.product.id === '41' || item.product.productNumber === '41' || item.product.id === '63' || item.product.productNumber === '63') && (
                                  <span className="text-[9px] md:text-xs text-purple-600 font-medium bg-purple-50 border border-purple-200 rounded px-1.5 py-0.5">
                                    {t('product.color')}: {item.selectedColor}
                                  </span>
                                )}
                                {hasDiscount && (
                                  <span className="text-[10px] md:text-xs text-green-600 font-medium">
                                    ({linePricing.discountPercentage}% {t('product.off')}{isBeautyBox ? ` - ${t('products.bundleDiscount')}` : ''})
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className={dir === 'rtl' ? 'text-left mr-2 md:mr-3' : 'text-right ml-2 md:ml-3'}>
                              {hasDiscount ? (
                                <div>
                                  <div className="text-[10px] md:text-xs text-gray-400 line-through">
                                    AED {linePricing.retailLineTotal.toFixed(2)}
                                  </div>
                                  <div className="text-xs md:text-sm font-semibold text-green-600">
                                    AED {linePricing.lineTotal.toFixed(2)}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs md:text-sm font-semibold text-gray-900">
                                  AED {linePricing.lineTotal.toFixed(2)}
                                </div>
                              )}
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
                
                {/* Price Breakdown - Waterfall Discount */}
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  {/* Retail Price or Subtotal */}
                  {hasAnyDiscount ? (
                    <div className={`flex justify-between items-start py-1.5 md:py-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex flex-col ${dir === 'rtl' ? 'text-right' : ''}`}>
                        <span className={`text-[10px] md:text-sm text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
                          {locale === 'ar' ? 'سعر التجزئة' : locale === 'ru' ? 'Розничная цена' : 'Retail Price'}: ({getTotalItems()} {getTotalItems() === 1 ? t('checkout.item') : t('checkout.items')})
                        </span>
                        {freeMasks.length > 0 && (
                          <span className={`text-[10px] md:text-sm text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
                            + {freeMasks.length} {freeMasks.length === 1 ? t('checkout.freeMask') : t('checkout.freeMasks')}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] md:text-sm font-medium text-gray-400 line-through">AED {retailTotal.toFixed(2)}</span>
                    </div>
                  ) : (
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
                  )}
                  {/* VIP Discount */}
                  {hasUserDiscount && (
                    <div className={`flex justify-between items-center py-1 md:py-1.5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[10px] md:text-sm text-purple-600 font-medium">🏷️ {locale === 'ar' ? 'خصمك' : locale === 'ru' ? 'Ваша скидка' : 'Your Discount'}{userDiscountPct > 0 ? ` (${userDiscountPct}%)` : ''}</span>
                      <span className="text-[10px] md:text-sm text-purple-600 font-medium">-AED {userDiscountTotal.toFixed(2)}</span>
                    </div>
                  )}
                  {/* Intermediate Subtotal */}
                  {hasUserDiscount && hasBundleDiscount && (
                    <div className={`flex justify-between items-center py-0.5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[9px] md:text-xs text-gray-400">{locale === 'ar' ? 'المجموع الفرعي' : locale === 'ru' ? 'Подытог' : 'Subtotal'}</span>
                      <span className="text-[9px] md:text-xs text-gray-400">AED {afterVipSubtotal.toFixed(2)}</span>
                    </div>
                  )}
                  {/* Bundle Discount */}
                  {hasBundleDiscount && (
                    <div className={`flex justify-between items-center py-1 md:py-1.5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[10px] md:text-sm text-green-600 font-medium">📦 {locale === 'ar' ? 'خصم الباقة' : locale === 'ru' ? 'Скидка набора' : 'Bundle Discount'}{bundleDiscountPct > 0 ? ` (${bundleDiscountPct}%)` : ''}</span>
                      <span className="text-[10px] md:text-sm text-green-600 font-medium">-AED {bundleDiscountTotal.toFixed(2)}</span>
                    </div>
                  )}
                  {/* Net Subtotal */}
                  {hasAnyDiscount && (
                    <>
                      <div className="h-px bg-gray-200" />
                      <div className={`flex justify-between items-center py-1 md:py-1.5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-[10px] md:text-sm font-semibold text-gray-900">{locale === 'ar' ? 'المجموع الفرعي الصافي' : locale === 'ru' ? 'Подытог' : 'Net Subtotal'}</span>
                        <span className="text-[10px] md:text-sm font-semibold text-gray-900">AED {subtotal.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  
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
                  {/* You Saved */}
                  {hasAnyDiscount && (
                    <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-center mt-1">
                      <span className="text-[10px] md:text-xs text-green-700 font-semibold">
                        💰 {locale === 'ar' ? 'وفرت' : locale === 'ru' ? 'Вы сэкономили' : 'You saved'}: AED {totalSaved.toFixed(2)}
                      </span>
                    </div>
                  )}
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

      {/* Sticky Bottom CTA — mobile + PWA */}
      {isAppLikeMode && !isPaymentSheetOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-gray-200"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="px-4 py-3">
            <button
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className={`w-full bg-primary-600 text-white py-3.5 rounded-xl text-base font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg touch-manipulation min-h-[48px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              aria-label={`${t('checkout.completeOrder')} - AED ${total.toFixed(2)}`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" aria-hidden="true" />
                  <span>{t('checkout.processingOrder')}</span>
                </>
              ) : (
                <>
                  {selectedPaymentMethod === 'stripe' ? (
                    <Lock className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <CreditCard className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>{t('checkout.completeOrder')} · AED {total.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Payment Bottom Sheet */}
      <BottomSheet
        isOpen={isPaymentSheetOpen}
        onClose={() => {
          setIsPaymentSheetOpen(false)
          setPaymentClientSecret(null)
          setPaymentOrderId(null)
          setPaymentTotal(0)
        }}
        title={locale === 'ar' ? 'الدفع الآمن' : 'Secure Payment'}
        height="large"
      >
        {paymentClientSecret && paymentOrderId && (
          <StripeProvider clientSecret={paymentClientSecret} locale={locale}>
            <PaymentForm
              total={paymentTotal}
              orderId={paymentOrderId}
              locale={locale}
              onSuccess={(paymentIntentId) => {
                debugLog('✅ Payment successful:', { paymentIntentId, orderId: paymentOrderId })
                setIsPaymentSheetOpen(false)
                // Redirect to main success page (unified enhanced layout)
                router.push(`${getLocalizedPath('/success', locale)}?payment=card&order_id=${paymentOrderId}`)
              }}
              onError={(error) => {
                errorLog('❌ Payment failed:', error)
                // Error is shown in the form, sheet stays open
              }}
            />
          </StripeProvider>
        )}
      </BottomSheet>
    </div>
  )
}
