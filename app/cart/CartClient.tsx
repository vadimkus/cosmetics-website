'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import CartItem from '@/components/CartItem'
import FreeMaskPromotion from '@/components/FreeMaskPromotion'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft, Lock, MessageCircle, Truck, Gift } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { isBlackFridaySaleActive } from '@/lib/blackFridayUtils'
import { calculateDiscountedPrice } from '@/lib/discountUtils'


export default function CartClient() {
  const { items, getTotalPrice, getTotalItems, selectedEmirate, setSelectedEmirate } = useCart()
  const { user } = useAuth()
  const { t, locale, dir } = useTranslation()
  
  // Black Friday countdown state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)
  const [saleProgress, setSaleProgress] = useState(0)
  const [isSaleActive, setIsSaleActive] = useState(false)

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
  
  // Check if Black Friday sale is active
  const blackFridayActive = isBlackFridaySaleActive()
  
  // Calculate original subtotal (before Black Friday discount) for display
  const originalSubtotal = blackFridayActive && items.length > 0
    ? items.reduce((sum, item) => {
        const pricing = calculateDiscountedPrice(item.product, user)
        return sum + (pricing.originalPrice * item.quantity)
      }, 0)
    : subtotal

  // Black Friday countdown timer
  useEffect(() => {
    const saleStartDate = new Date('2025-11-25T20:00:00Z').getTime() // Nov 26th, 2025 at 00:00:00 UAE time
    const saleEndDate = new Date('2025-11-28T19:59:59Z').getTime() // Nov 28th, 2025 at 23:59:59 UAE time
    const totalDuration = saleEndDate - saleStartDate

    const calculateTime = () => {
      const now = new Date().getTime()

      if (now >= saleEndDate) {
        setIsSaleActive(false)
        setTimeLeft(null)
        setSaleProgress(100)
        return
      }

      if (now >= saleStartDate) {
        // Sale is active - countdown to end
        setIsSaleActive(true)
        const difference = saleEndDate - now
        const elapsed = totalDuration - difference
        const progress = Math.min(100, (elapsed / totalDuration) * 100)
        setSaleProgress(progress)

        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        // Sale hasn't started - countdown to start
        setIsSaleActive(false)
        const difference = saleStartDate - now
        setSaleProgress(0)

        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-2 md:py-8 lg:py-16" dir={dir}>
        {/* Navigation Breadcrumb */}
        <nav className={`inline-flex items-baseline gap-1.5 md:gap-2 text-xs md:text-base text-gray-700 mb-4 md:mb-6 lg:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`} aria-label="Breadcrumb">
          <span className="hover:text-primary-600 transition-colors">
            <Link href={getLocalizedPath('/', locale)}>{t('common.home')}</Link>
          </span>
          <span className="text-gray-400">/</span>
          <span className="hover:text-primary-600 transition-colors">
            <Link href={getLocalizedPath('/products', locale)}>{t('common.products')}</Link>
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">{t('common.cart')}</span>
        </nav>

        <div className={`max-w-4xl mx-auto text-center py-16 ${dir === 'rtl' ? 'text-right' : ''}`}>
          <div className="flex flex-col items-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mb-4" />
            <h1 className={`text-3xl font-bold text-gray-900 mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('cart.empty')}</h1>
            <p className={`text-gray-600 text-lg mb-8 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t('cart.emptyMessage')}
            </p>
            <Link
              href={getLocalizedPath('/products', locale)}
              className={`inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-5 w-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-2 md:py-8 lg:py-16" dir={dir}>
      {/* Navigation Breadcrumb */}
      <nav className={`inline-flex items-baseline gap-1.5 md:gap-2 text-xs md:text-base text-gray-700 mb-4 md:mb-6 lg:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`} aria-label="Breadcrumb">
        <span className="hover:text-primary-600 transition-colors">
          <Link href={getLocalizedPath('/', locale)}>{t('common.home')}</Link>
        </span>
        <span className="text-gray-400">/</span>
        <span className="hover:text-primary-600 transition-colors">
          <Link href={getLocalizedPath('/products', locale)}>{t('common.products')}</Link>
        </span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-semibold">{t('common.cart')}</span>
      </nav>

      <div className="max-w-6xl mx-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className={`flex flex-col lg:flex-row gap-8 ${dir === 'rtl' ? 'lg:flex-row-reverse' : ''}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cart-container" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="p-3 md:p-6 border-b border-gray-200">
                <h1 className={`text-lg md:text-2xl font-bold text-gray-900 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                  <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                  <span className="text-sm md:text-base lg:text-lg">{t('cart.shoppingCart')}</span> <span className="text-sm md:text-base lg:text-lg">{getTotalItems()} {getTotalItems() === 1 ? t('cart.item') : t('cart.items')}</span>
                </h1>
              </div>
              
              <div className="divide-y divide-gray-200" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {items.map((item) => (
                  <CartItem key={`${item.product.id}-${item.quantity}`} item={item} />
                ))}
              </div>

              {/* Black Friday Discount Block */}
              {user && (
                <div className="px-6 pt-6 pb-4">
                  <div className={`p-4 ${blackFridayActive 
                    ? 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-500' 
                    : 'bg-gray-50 border-2 border-gray-300 opacity-75'
                  } rounded-lg shadow-sm ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`mb-3 text-center md:text-left ${dir === 'rtl' ? 'md:text-right' : ''}`}>
                      <h3 className={`text-lg md:text-xl font-bold ${blackFridayActive ? 'text-red-700' : 'text-gray-600'}`}>
                        {locale === 'ar' ? 'عرض الجمعة السوداء' : 'Black Friday Sale'}
                      </h3>
                      <p className={`text-sm font-semibold ${blackFridayActive ? 'text-red-600' : 'text-gray-500'}`}>
                        {locale === 'ar' ? 'خصم 20% على جميع المنتجات' : '20% OFF on All Products'}
                      </p>
                    </div>
                    
                    {/* Countdown Timer */}
                    {timeLeft && (
                      <div className={`mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        <div className={`flex items-center gap-2 mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <span className={`text-xs font-medium ${blackFridayActive ? 'text-red-600' : 'text-gray-500'}`}>
                            {isSaleActive 
                              ? (locale === 'ar' ? 'الوقت المتبقي:' : 'Time remaining:')
                              : (locale === 'ar' ? 'يبدأ بعد:' : 'Starts in:')}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          {/* Days */}
                          <div className={`flex flex-col items-center bg-white rounded-md px-2 py-1.5 border ${blackFridayActive ? 'border-red-300' : 'border-gray-300'} min-w-[50px]`}>
                            <div className={`text-lg font-bold tabular-nums ${blackFridayActive ? 'text-red-600' : 'text-gray-600'}`}>
                              {timeLeft.days.toString().padStart(2, '0')}
                            </div>
                            <div className={`text-[10px] ${blackFridayActive ? 'text-red-500' : 'text-gray-500'}`}>
                              {locale === 'ar' ? 'ي' : 'D'}
                            </div>
                          </div>
                          <span className={`text-lg font-bold ${blackFridayActive ? 'text-red-500' : 'text-gray-400'}`}>:</span>
                          {/* Hours */}
                          <div className={`flex flex-col items-center bg-white rounded-md px-2 py-1.5 border ${blackFridayActive ? 'border-red-300' : 'border-gray-300'} min-w-[50px]`}>
                            <div className={`text-lg font-bold tabular-nums ${blackFridayActive ? 'text-red-600' : 'text-gray-600'}`}>
                              {timeLeft.hours.toString().padStart(2, '0')}
                            </div>
                            <div className={`text-[10px] ${blackFridayActive ? 'text-red-500' : 'text-gray-500'}`}>
                              {locale === 'ar' ? 'س' : 'H'}
                            </div>
                          </div>
                          <span className={`text-lg font-bold ${blackFridayActive ? 'text-red-500' : 'text-gray-400'}`}>:</span>
                          {/* Minutes */}
                          <div className={`flex flex-col items-center bg-white rounded-md px-2 py-1.5 border ${blackFridayActive ? 'border-red-300' : 'border-gray-300'} min-w-[50px]`}>
                            <div className={`text-lg font-bold tabular-nums ${blackFridayActive ? 'text-red-600' : 'text-gray-600'}`}>
                              {timeLeft.minutes.toString().padStart(2, '0')}
                            </div>
                            <div className={`text-[10px] ${blackFridayActive ? 'text-red-500' : 'text-gray-500'}`}>
                              {locale === 'ar' ? 'د' : 'M'}
                            </div>
                          </div>
                          <span className={`text-lg font-bold ${blackFridayActive ? 'text-red-500' : 'text-gray-400'}`}>:</span>
                          {/* Seconds */}
                          <div className={`flex flex-col items-center bg-white rounded-md px-2 py-1.5 border ${blackFridayActive ? 'border-red-300' : 'border-gray-300'} min-w-[50px]`}>
                            <div className={`text-lg font-bold tabular-nums ${blackFridayActive ? 'text-red-600' : 'text-gray-600'}`}>
                              {timeLeft.seconds.toString().padStart(2, '0')}
                            </div>
                            <div className={`text-[10px] ${blackFridayActive ? 'text-red-500' : 'text-gray-500'}`}>
                              {locale === 'ar' ? 'ث' : 'S'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Progress Bar */}
                    {timeLeft && (
                      <div className="mb-3">
                        <div className={`flex items-center justify-between mb-1.5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <span className={`text-xs font-medium ${blackFridayActive ? 'text-red-600' : 'text-gray-500'}`}>
                            {isSaleActive 
                              ? (locale === 'ar' ? 'تقدم العرض' : 'Sale Progress')
                              : (locale === 'ar' ? 'قريباً' : 'Starting Soon')}
                          </span>
                          {isSaleActive && (
                            <span className={`text-xs font-semibold ${blackFridayActive ? 'text-red-600' : 'text-gray-500'}`}>
                              {Math.round(saleProgress)}%
                            </span>
                          )}
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${blackFridayActive ? 'bg-red-100' : 'bg-gray-200'}`}>
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${
                              blackFridayActive 
                                ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                                : 'bg-gray-400'
                            }`}
                            style={{ width: `${isSaleActive ? saleProgress : 0}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className={`text-xs ${blackFridayActive ? 'text-gray-700' : 'text-gray-500'} mt-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      <span className="font-medium">
                        {locale === 'ar' ? 'الفترة: 26-28 نوفمبر' : 'Period: 26-28/11'}
                      </span>
                    </div>
                    {blackFridayActive && originalSubtotal > subtotal && (
                      <div className={`mt-3 pt-3 border-t border-red-200 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        <p className={`text-sm font-semibold text-green-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                          {locale === 'ar' 
                            ? `✅ وفرت ${(originalSubtotal - subtotal).toFixed(2)} درهم`
                            : `✅ You saved AED ${(originalSubtotal - subtotal).toFixed(2)}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Free Mask Promotion */}
              {user && (
                <div className={`px-6 ${blackFridayActive ? 'pb-6' : 'pt-6 pb-6'}`}>
                  <FreeMaskPromotion subtotal={subtotal} />
                  
                  {/* Free Delivery Notice */}
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div className={`p-4 border border-gray-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-2 mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <Truck className={`h-5 w-5 ${subtotal >= 1000 ? 'text-green-600' : 'text-primary-600'}`} />
                        <span className="text-sm font-medium text-gray-900">
                          {t('cart.freeDelivery')}
                        </span>
                        {subtotal >= 1000 ? (
                          <span className="text-xs font-semibold text-green-600">
                            {t('cart.unlocked')}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">
                            {subtotal < 1000 ? `AED ${(1000 - subtotal).toFixed(2)} ${t('cart.more')}` : ''}
                          </span>
                        )}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            subtotal >= 1000 ? 'bg-green-600' : 'bg-gray-400'
                          }`}
                          style={{ width: `${Math.min(100, (subtotal / 1000) * 100)}%` }}
                        />
                      </div>
                      
                      <p className={`text-xs text-gray-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {subtotal >= 1000 ? (
                          <span className="font-medium text-green-600">
                            {t('cart.qualifyForFreeDelivery')}
                          </span>
                        ) : (
                          <span>{t('cart.spendForFreeDelivery')}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4 order-summary-container" style={{ overflow: 'hidden', overflowY: 'hidden', overflowX: 'hidden' }}>
              <div className={`p-4 md:p-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <h2 className={`text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('cart.orderSummary')}</h2>
                
                {/* User Status */}
                {!user && (
                  <div className={`mb-4 md:mb-6 p-3 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 text-yellow-800 mb-1.5 md:mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Lock className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="font-semibold text-sm md:text-base">{t('cart.loginRequired')}</span>
                    </div>
                    <p className={`text-xs md:text-sm text-yellow-700 mb-2 md:mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('cart.loginRequiredMessage')}
                    </p>
                    <Link
                      href={getLocalizedPath('/login', locale)}
                      className={`inline-flex items-center gap-1.5 md:gap-2 bg-primary-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                    >
                      <Lock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      {t('common.login')}
                    </Link>
                  </div>
                )}

                {/* Shipping Location */}
                <div className="mb-4 md:mb-6">
                  <label className={`block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {t('cart.deliveryLocation')}
                  </label>
                  <select
                    value={selectedEmirate}
                    onChange={(e) => setSelectedEmirate(e.target.value)}
                    className={`w-full p-2.5 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 text-sm md:text-base ${dir === 'rtl' ? 'text-right' : ''}`}
                    style={{ color: '#111827' }}
                    dir={dir}
                  >
                    {emirates.map((emirate) => (
                      <option key={emirate.name} value={emirate.name} style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                        {emirate.name} - AED {emirate.shippingCost}
                      </option>
                    ))}
                  </select>
                  <p className={`text-[10px] md:text-xs text-gray-500 mt-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {t('cart.shippingCostsVary')}
                  </p>
                </div>

                {/* Black Friday Notice */}
                {blackFridayActive && (
                  <div className={`mb-3 md:mb-4 p-3 md:p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className="text-center">
                      <div className="text-sm md:text-base font-bold text-red-600 mb-1">
                        {locale === 'ar' ? 'الجمعة السوداء' : 'Black Friday'} 
                        <span className="ml-1 bg-red-600 text-white px-2 py-0.5 rounded text-xs md:text-sm">-20%</span>
                      </div>
                      {originalSubtotal > subtotal && (
                        <div className="text-xs md:text-sm text-green-700 font-medium">
                          {locale === 'ar' 
                            ? `✓ وفرت ${(originalSubtotal - subtotal).toFixed(2)} درهم`
                            : `✓ You saved AED ${(originalSubtotal - subtotal).toFixed(2)}`}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className={`space-y-2 md:space-y-3 mb-4 md:mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <div className={`flex justify-between text-xs md:text-base text-gray-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>{t('cart.subtotal')} ({getTotalItems()})</span>
                    {blackFridayActive && originalSubtotal > subtotal ? (
                      <div className={`flex items-center gap-1 md:gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-gray-900 font-semibold">{user ? `${subtotal.toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                        <span className="text-[10px] md:text-sm text-gray-500 line-through">{user ? `${originalSubtotal.toFixed(2)}` : ''}</span>
                      </div>
                    ) : (
                      <span>{user ? `AED ${subtotal.toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                    )}
                  </div>
                  
                  <div className={`flex justify-between text-xs md:text-base text-gray-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>{t('cart.shippingTo')} {selectedEmirate}</span>
                    <span>{user ? (shippingCost === 0 ? <span className="text-green-600 font-semibold">{t('cart.freeDelivery')}</span> : `AED ${shippingCost}`) : t('cart.loginToSeePrice')}</span>
                  </div>
                  
                  <div className={`flex justify-between text-xs md:text-base text-gray-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>{t('cart.vat')}</span>
                    <span>{user ? `AED ${((subtotal + shippingCost) / 1.05 * 0.05).toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                  </div>
                  
                  <div className={`text-[10px] md:text-xs text-red-600 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {t('cart.allPricesIncludeVat')}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2 md:pt-3">
                    <div className={`flex justify-between text-base md:text-lg font-bold text-gray-900 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span>{t('cart.total')}</span>
                      <span>{user ? `AED ${total.toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                    </div>
                  </div>
                </div>

                {/* Free Masks Notice */}
                {user && subtotal >= 700 && (
                  <div className={`mb-4 md:mb-6 p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Gift className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
                      <span className="text-xs md:text-sm font-semibold text-green-800">
                        {t('cart.twoFreeMasksAdded')}
                      </span>
                    </div>
                    <p className={`text-[10px] md:text-xs text-green-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('cart.seaAlgaeCollagenMasks')}
                    </p>
                  </div>
                )}
                {user && subtotal >= 500 && subtotal < 700 && (
                  <div className={`mb-4 md:mb-6 p-2.5 md:p-3 bg-green-50 border border-green-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Gift className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
                      <span className="text-xs md:text-sm font-semibold text-green-800">
                        {t('cart.oneFreeMaskAdded')}
                      </span>
                    </div>
                    <p className={`text-[10px] md:text-xs text-green-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('cart.collagenMaskAdded')}
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                {user ? (
                  <Link
                    href={getLocalizedPath('/checkout', locale)}
                    className="w-full bg-primary-600 text-white py-2.5 md:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block text-sm md:text-base touch-manipulation min-h-[40px] md:min-h-[44px]"
                  >
                    {t('cart.checkout')}
                  </Link>
                ) : (
                  <div className="space-y-2 md:space-y-3">
                    <Link
                      href={getLocalizedPath('/login', locale)}
                      className="w-full bg-primary-600 text-white py-2.5 md:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block text-sm md:text-base touch-manipulation min-h-[40px] md:min-h-[44px]"
                    >
                      {t('cart.loginToCheckout')}
                    </Link>
                    
                    <a
                      href={`https://wa.me/971585487665?text=${locale === 'ar' ? 'مرحباً، أنا مهتم بمنتجات مستحضرات التجميل الكورية المهنية. هل يمكنك مساعدتي في الأسعار والطلب؟' : 'Hi, I\'m interested in your professional Korean dermacosmetics products. Can you help me with pricing and ordering?'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full bg-green-600 text-white py-2.5 md:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block text-sm md:text-base touch-manipulation flex items-center justify-center gap-1.5 md:gap-2 min-h-[40px] md:min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                    >
                      <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      {t('cart.contactSupport')}
                    </a>
                  </div>
                )}

                {/* Continue Shopping */}
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                  <Link
                    href={getLocalizedPath('/products', locale)}
                    className={`flex items-center gap-1.5 md:gap-2 text-primary-600 hover:text-primary-700 transition-colors text-xs md:text-sm font-medium ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                  >
                    <ArrowLeft className={`h-3.5 w-3.5 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    {t('cart.continueShopping')}
                  </Link>
                </div>

                {/* Contact Info */}
                {!user && (
                  <div className={`mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className="text-center">
                      <p className={`text-xs md:text-sm text-gray-600 mb-2 md:mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('cart.needHelp')}
                      </p>
                      <div className="space-y-2">
                        <a
                          href={`https://wa.me/971585487665?text=${locale === 'ar' ? 'مرحباً، أنا مهتم بمنتجات مستحضرات التجميل الكورية المهنية. هل يمكنك مساعدتي في الأسعار والطلب؟' : 'Hi, I\'m interested in your professional Korean dermacosmetics products. Can you help me with pricing and ordering?'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full bg-green-600 text-white py-2.5 md:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block text-sm md:text-base touch-manipulation flex items-center justify-center gap-1.5 md:gap-2 min-h-[40px] md:min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                        >
                          <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                          {t('cart.contactSupport')}
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
