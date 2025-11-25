'use client'

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

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-2 md:py-8 lg:py-16" dir={dir}>
        {/* Navigation Breadcrumb */}
        <nav className={`flex items-baseline flex-nowrap gap-2 text-sm md:text-base text-gray-700 mb-4 md:mb-6 lg:mb-8 overflow-x-auto leading-none ${dir === 'rtl' ? 'flex-row-reverse' : ''}`} aria-label="Breadcrumb">
          <Link
            href={getLocalizedPath('/', locale)}
            className="hover:text-primary-600 transition-colors text-gray-700 font-normal whitespace-nowrap flex-shrink-0 leading-none"
          >
            {t('common.home')}
          </Link>
          <span className="text-gray-400 flex-shrink-0 leading-none">/</span>
          <Link
            href={getLocalizedPath('/products', locale)}
            className="hover:text-primary-600 transition-colors text-gray-700 font-normal whitespace-nowrap flex-shrink-0 leading-none"
          >
            {t('common.products')}
          </Link>
          <span className="text-gray-400 flex-shrink-0 leading-none">/</span>
          <span className={`text-gray-900 font-bold whitespace-nowrap flex-shrink-0 leading-none ${dir === 'rtl' ? 'text-right' : ''}`}>
            {t('common.cart')}
          </span>
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
      <nav className={`flex items-baseline flex-nowrap gap-2 text-sm md:text-base text-gray-700 mb-4 md:mb-6 lg:mb-8 overflow-x-auto leading-none ${dir === 'rtl' ? 'flex-row-reverse' : ''}`} aria-label="Breadcrumb">
        <Link
          href={getLocalizedPath('/', locale)}
          className="hover:text-primary-600 transition-colors text-gray-700 font-normal whitespace-nowrap flex-shrink-0 leading-none"
        >
          {t('common.home')}
        </Link>
        <span className="text-gray-400 flex-shrink-0 leading-none">/</span>
        <Link
          href={getLocalizedPath('/products', locale)}
          className="hover:text-primary-600 transition-colors text-gray-700 font-normal whitespace-nowrap flex-shrink-0 leading-none"
        >
          {t('common.products')}
        </Link>
        <span className="text-gray-400 flex-shrink-0 leading-none">/</span>
        <span className={`text-gray-900 font-bold whitespace-nowrap flex-shrink-0 leading-none ${dir === 'rtl' ? 'text-right' : ''}`}>
          {t('common.cart')}
        </span>
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

              {/* Free Mask Promotion */}
              {user && (
                <div className="px-6 pb-6">
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
              <div className={`p-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <h2 className={`text-xl font-bold text-gray-900 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('cart.orderSummary')}</h2>
                
                {/* User Status */}
                {!user && (
                  <div className={`mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 text-yellow-800 mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Lock className="h-5 w-5" />
                      <span className="font-semibold">{t('cart.loginRequired')}</span>
                    </div>
                    <p className={`text-sm text-yellow-700 mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('cart.loginRequiredMessage')}
                    </p>
                    <Link
                      href={getLocalizedPath('/login', locale)}
                      className={`inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                    >
                      <Lock className="h-4 w-4" />
                      {t('common.login')}
                    </Link>
                  </div>
                )}

                {/* Shipping Location */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {t('cart.deliveryLocation')}
                  </label>
                  <select
                    value={selectedEmirate}
                    onChange={(e) => setSelectedEmirate(e.target.value)}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}
                    style={{ color: '#111827' }}
                    dir={dir}
                  >
                    {emirates.map((emirate) => (
                      <option key={emirate.name} value={emirate.name} style={{ backgroundColor: '#ffffff', color: '#111827' }}>
                        {emirate.name} - AED {emirate.shippingCost}
                      </option>
                    ))}
                  </select>
                  <p className={`text-xs text-gray-500 mt-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    {t('cart.shippingCostsVary')}
                  </p>
                </div>

                {/* Black Friday Notice */}
                {blackFridayActive && (
                  <div className={`mb-4 p-3 bg-red-50 border-2 border-red-500 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm md:text-base font-bold text-red-600">
                        🎉 {locale === 'ar' ? 'عرض الجمعة السوداء - خصم 20%' : 'Black Friday - 20% OFF'}
                      </span>
                    </div>
                    {originalSubtotal > subtotal && (
                      <div className={`text-xs text-gray-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {locale === 'ar' 
                          ? `وفرت ${(originalSubtotal - subtotal).toFixed(2)} درهم`
                          : `You saved AED ${(originalSubtotal - subtotal).toFixed(2)}`}
                      </div>
                    )}
                  </div>
                )}

                {/* Price Breakdown */}
                <div className={`space-y-3 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <div className={`flex justify-between text-gray-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>{t('cart.subtotal')} ({getTotalItems()} {getTotalItems() === 1 ? t('cart.item') : t('cart.items')})</span>
                    {blackFridayActive && originalSubtotal > subtotal ? (
                      <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-gray-900 font-semibold">{user ? `AED ${subtotal.toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                        <span className="text-sm text-gray-500 line-through">{user ? `AED ${originalSubtotal.toFixed(2)}` : ''}</span>
                        <span className="text-xs font-medium text-green-600">20% OFF</span>
                      </div>
                    ) : (
                      <span>{user ? `AED ${subtotal.toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                    )}
                  </div>
                  
                  <div className={`flex justify-between text-gray-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>{t('cart.shippingTo')} {selectedEmirate}</span>
                    <span>{user ? (shippingCost === 0 ? <span className="text-green-600 font-semibold">{t('cart.freeDelivery')}</span> : `AED ${shippingCost}`) : t('cart.loginToSeePrice')}</span>
                  </div>
                  
                  <div className={`flex justify-between text-gray-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <span>{t('cart.vat')}</span>
                    <span>{user ? `AED ${((subtotal + shippingCost) / 1.05 * 0.05).toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                  </div>
                  
                  <div className={`text-xs text-red-600 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {t('cart.allPricesIncludeVat')}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className={`flex justify-between text-lg font-bold text-gray-900 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span>{t('cart.total')}</span>
                      <span>{user ? `AED ${total.toFixed(2)}` : t('cart.loginToSeePrice')}</span>
                    </div>
                  </div>
                </div>

                {/* Free Masks Notice */}
                {user && subtotal >= 700 && (
                  <div className={`mb-6 p-3 bg-green-50 border border-green-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Gift className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">
                        {t('cart.twoFreeMasksAdded')}
                      </span>
                    </div>
                    <p className={`text-xs text-green-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('cart.seaAlgaeCollagenMasks')}
                    </p>
                  </div>
                )}
                {user && subtotal >= 500 && subtotal < 700 && (
                  <div className={`mb-6 p-3 bg-green-50 border border-green-200 rounded-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <Gift className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">
                        {t('cart.oneFreeMaskAdded')}
                      </span>
                    </div>
                    <p className={`text-xs text-green-700 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('cart.collagenMaskAdded')}
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                {user ? (
                  <Link
                    href={getLocalizedPath('/checkout', locale)}
                    className="w-full bg-primary-600 text-white py-3 md:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block text-sm md:text-base touch-manipulation min-h-[44px]"
                  >
                    {t('cart.checkout')}
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href={getLocalizedPath('/login', locale)}
                      className="w-full bg-primary-600 text-white py-3 md:py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block text-sm md:text-base touch-manipulation min-h-[44px]"
                    >
                      {t('cart.loginToCheckout')}
                    </Link>
                    
                    <a
                      href={`https://wa.me/971585487665?text=${locale === 'ar' ? 'مرحباً، أنا مهتم بمنتجات مستحضرات التجميل الكورية المهنية. هل يمكنك مساعدتي في الأسعار والطلب؟' : 'Hi, I\'m interested in your professional Korean dermacosmetics products. Can you help me with pricing and ordering?'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full bg-green-600 text-white py-3 md:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block text-sm md:text-base touch-manipulation flex items-center justify-center gap-2 min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      {t('cart.contactSupport')}
                    </a>
                  </div>
                )}

                {/* Continue Shopping */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    href={getLocalizedPath('/products', locale)}
                    className={`flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                  >
                    <ArrowLeft className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    {t('cart.continueShopping')}
                  </Link>
                </div>

                {/* Contact Info */}
                {!user && (
                  <div className={`mt-6 pt-6 border-t border-gray-200 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className="text-center">
                      <p className={`text-sm text-gray-600 mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        {t('cart.needHelp')}
                      </p>
                      <div className="space-y-2">
                        <a
                          href={`https://wa.me/971585487665?text=${locale === 'ar' ? 'مرحباً، أنا مهتم بمنتجات مستحضرات التجميل الكورية المهنية. هل يمكنك مساعدتي في الأسعار والطلب؟' : 'Hi, I\'m interested in your professional Korean dermacosmetics products. Can you help me with pricing and ordering?'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full bg-green-600 text-white py-3 md:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block text-sm md:text-base touch-manipulation flex items-center justify-center gap-2 min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                        >
                          <MessageCircle className="h-4 w-4" />
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
