'use client'

import Link from 'next/link'
import { Check, LockKeyhole } from 'lucide-react'
import { getLocalizedPath } from '@/lib/i18n'

type CheckoutStep = 'cart' | 'checkout' | 'confirmed'
type Locale = 'en' | 'ru' | 'ar'

const stepOrder: CheckoutStep[] = ['cart', 'checkout', 'confirmed']

const copy = {
  en: {
    progress: 'Checkout progress',
    secure: 'Secure checkout',
    step: (current: number, total: number) => `Step ${current} of ${total}`,
    completed: 'completed',
    current: 'current step',
    upcoming: 'upcoming',
    labels: {
      cart: 'Cart',
      checkout: 'Details & payment',
      confirmed: 'Confirmation',
    },
  },
  ru: {
    progress: 'Этапы оформления заказа',
    secure: 'Безопасное оформление',
    step: (current: number, total: number) => `Шаг ${current} из ${total}`,
    completed: 'завершено',
    current: 'текущий шаг',
    upcoming: 'далее',
    labels: {
      cart: 'Корзина',
      checkout: 'Данные и оплата',
      confirmed: 'Подтверждение',
    },
  },
  ar: {
    progress: 'مراحل إتمام الطلب',
    secure: 'دفع آمن',
    step: (current: number, total: number) => `الخطوة ${current} من ${total}`,
    completed: 'مكتملة',
    current: 'الخطوة الحالية',
    upcoming: 'قادمة',
    labels: {
      cart: 'السلة',
      checkout: 'البيانات والدفع',
      confirmed: 'التأكيد',
    },
  },
} as const

export default function CheckoutProgress({
  currentStep,
  locale,
  className = '',
}: {
  currentStep: CheckoutStep
  locale: Locale
  className?: string
}) {
  const text = copy[locale]
  const currentIndex = stepOrder.indexOf(currentStep)
  const isRtl = locale === 'ar'

  return (
    <nav
      aria-label={text.progress}
      className={`mx-auto w-full max-w-4xl ${className}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 md:text-xs">
          <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
          {text.secure}
        </span>
        <span className="text-[11px] font-medium text-[var(--cera-muted)] md:text-xs">
          {text.step(currentIndex + 1, stepOrder.length)}
        </span>
      </div>

      <ol className="grid grid-cols-3 gap-2 md:gap-3">
        {stepOrder.map((step, index) => {
          const completed = index < currentIndex
          const current = index === currentIndex
          const canReturnToCart = currentStep === 'checkout' && step === 'cart'
          const status = completed ? text.completed : current ? text.current : text.upcoming
          const label = text.labels[step]

          const content = (
            <>
              <span
                className={`block h-1.5 rounded-full transition-colors ${
                  index <= currentIndex ? 'bg-[var(--cera-rose)]' : 'bg-[var(--cera-line)]'
                }`}
                aria-hidden="true"
              />
              <span
                className={`mt-2 flex min-w-0 items-center gap-1.5 text-[10px] md:gap-2 md:text-sm ${
                  current
                    ? 'font-semibold text-[var(--cera-ink)]'
                    : completed
                      ? 'font-medium text-[var(--cera-rose-ink)]'
                      : 'font-medium text-[var(--cera-muted)]'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] md:h-6 md:w-6 md:text-xs ${
                    index <= currentIndex
                      ? 'bg-[var(--cera-blush)] text-[var(--cera-rose-ink)]'
                      : 'bg-[var(--cera-cream-deep)] text-[var(--cera-muted)]'
                  }`}
                  aria-hidden="true"
                >
                  {completed ? <Check className="h-3 w-3 md:h-3.5 md:w-3.5" /> : index + 1}
                </span>
                <span className="truncate">{label}</span>
                <span className="sr-only">- {status}</span>
              </span>
            </>
          )

          return (
            <li key={step} aria-current={current ? 'step' : undefined}>
              {canReturnToCart ? (
                <Link
                  href={getLocalizedPath('/cart', locale)}
                  className="block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2"
                >
                  {content}
                </Link>
              ) : (
                <div>{content}</div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
