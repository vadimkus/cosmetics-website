'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export default function PaymentCancelPage() {
  const searchParams = useSearchParams()
  const { t, dir } = useTranslation()
  const isRTL = dir === 'rtl'
  const orderNumber = searchParams.get('orderNumber')
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (navigator.userAgent.includes('GenosysApp')) {
            window.location.href = `genosysapp://checkout`
          } else {
            window.location.href = '/products'
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} flex min-h-[100dvh] items-center justify-center p-4`} dir={dir}>
      <div className="w-full max-w-[440px]">
        <div className="rounded-[28px] border border-[var(--cera-line)] bg-white p-7 shadow-[0_24px_60px_-40px_rgba(23,20,15,0.45)] md:p-9">
          {/* Red is kept on this mark: the payment did not go through. */}
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600">
            <XCircle className="h-7 w-7" aria-hidden="true" />
          </span>

          <h1 className="cera-serif mt-6 text-center text-[27px] leading-tight text-[var(--cera-ink)] md:text-[31px]">
            {t('payCancel.title')}
          </h1>
          <p className="mt-3 text-center text-[15px] leading-relaxed text-[var(--cera-body)]">
            {t('payCancel.subtitle')}
          </p>

          {orderNumber && (
            <div className="mt-7 rounded-2xl border border-[var(--cera-line)] bg-[var(--cera-cream-deep)] p-5">
              <p className="cera-eyebrow">{t('payCancel.orderNumber')}</p>
              <p dir="ltr" className="cera-serif cera-numeral mt-2 text-[24px] leading-none text-[var(--cera-ink)]">
                {orderNumber}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--cera-body)]">
                {t('payCancel.orderSaved')}
              </p>
            </div>
          )}

          <div className="ed-panel mt-4 p-5">
            <p className="cera-eyebrow">{t('payCancel.whatHappened')}</p>
            <ul className="mt-3 space-y-2">
              {[t('payCancel.youCancelled'), t('payCancel.sessionExpired'), t('payCancel.noCharges')].map(line => (
                <li key={line} className={`flex gap-2.5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-[var(--cera-blush-deep)]" aria-hidden="true" />
                  <span className="text-sm leading-relaxed text-[var(--cera-body)]">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <p
            className={`mt-4 flex items-center justify-center gap-2 text-sm text-[var(--cera-muted)] ${isRTL ? 'flex-row-reverse' : ''}`}
            aria-live="polite"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {t('payCancel.redirectingIn')}{' '}
              <span className="cera-numeral font-semibold text-[var(--cera-ink)]">{countdown}</span>{' '}
              {t('payCancel.seconds')}
            </span>
          </p>

          <div className="mt-6 space-y-3">
            <a href={`genosysapp://checkout`} className={`ed-cta w-full py-3.5 text-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {t('payCancel.tryAgain')}
            </a>

            <a href={`genosysapp://cart`} className="ed-ghost w-full py-3.5 text-[15px]">
              {t('payCancel.returnToCart')}
            </a>

            <Link
              href="/products"
              className={`flex w-full items-center justify-center gap-1.5 py-2 text-sm font-semibold text-[var(--cera-rose-ink)] transition-colors hover:text-[var(--cera-rose)] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
              {t('payCancel.continueShopping')}
            </Link>
          </div>

          <div className="mt-7 border-t border-[var(--cera-line)] pt-5">
            <p className="text-center text-sm text-[var(--cera-muted)]">
              {t('payCancel.needHelp')}
            </p>
            <div className={`mt-2 flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* This linked to 971528860018, which appears nowhere else on the site - the
                  other 31 support links all use 971585487665. A dead number on the page a
                  customer reaches when their payment failed. */}
              <a
                href="https://wa.me/971585487665"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[var(--cera-rose-ink)] hover:underline"
              >
                {t('payCancel.whatsappSupport')}
              </a>
              <span className="text-[var(--cera-blush-deep)]" aria-hidden="true">|</span>
              <a
                href="mailto:support@genosys.ae"
                className="text-sm font-semibold text-[var(--cera-rose-ink)] hover:underline"
              >
                {t('payCancel.emailUs')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
