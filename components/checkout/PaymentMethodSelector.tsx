'use client'

import { CreditCard, Lock, Building } from 'lucide-react'

interface PaymentMethodSelectorProps {
  isPWA: boolean
  isPWAClient: boolean
  isMobileWeb: boolean
  locale: 'en' | 'ar' | 'ru'
  dir: string
  t: (key: string) => string
  selectedPaymentMethod: string
  setSelectedPaymentMethod: (method: string) => void
}

export default function PaymentMethodSelector({
  isPWA, isPWAClient, isMobileWeb,
  locale, dir, t,
  selectedPaymentMethod, setSelectedPaymentMethod
}: PaymentMethodSelectorProps) {
  // PWA & Mobile Web Version
  if ((isPWAClient && isPWA) || isMobileWeb) {
    return (
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
    )
  }

  // Desktop Browser Version
  return (
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
  )
}
