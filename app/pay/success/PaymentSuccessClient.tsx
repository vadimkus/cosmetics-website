'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { errorLog } from '@/lib/logger'
import { useTranslation } from '@/hooks/useTranslation'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams()
  const { t, dir } = useTranslation()
  const isRTL = dir === 'rtl'
  const orderNumber = searchParams.get('orderNumber')
  const [orderDetails, setOrderDetails] = useState<{
    customerName?: string
    customerEmail?: string
    total?: number
    paymentStatus?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderNumber) {
      // Fetch order details
      fetch(`/api/orders?orderNumber=${orderNumber}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.orders?.length > 0) {
            setOrderDetails(data.orders[0])
          }
        })
        .catch(err => errorLog('Failed to fetch order:', err))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [orderNumber])

  const row = (label: string, value: React.ReactNode) => (
    <div className={`flex items-baseline justify-between gap-4 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
      <span className="text-[var(--cera-muted)]">{label}</span>
      <span className="text-end font-medium text-[var(--cera-ink)]">{value}</span>
    </div>
  )

  return (
    <div className={`cera-page genosys-page flex min-h-[100dvh] items-center justify-center p-4`} dir={dir}>
      <div className="w-full max-w-[440px]">
        <div className="rounded-[28px] border border-[var(--cera-line)] bg-white p-7 shadow-[0_24px_60px_-40px_rgba(23,20,15,0.45)] md:p-9">
          {/* Green is kept throughout this page: it reports the payment succeeded. */}
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--cera-ok-line)] bg-[var(--cera-ok-bg)] text-[var(--cera-ok)]">
            <CheckCircle className="h-7 w-7" aria-hidden="true" />
          </span>

          <h1 className="cera-serif mt-6 text-center text-[27px] leading-tight text-[var(--cera-ink)] md:text-[31px]">
            {t('paySuccess.title')}
          </h1>
          <p className="mt-3 text-center text-[15px] leading-relaxed text-[var(--cera-body)]">
            {t('paySuccess.subtitle')}
          </p>

          {loading ? (
            <div className="py-10 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[var(--cera-line)] border-t-[var(--cera-rose)]" />
              <p className="mt-4 text-sm text-[var(--cera-muted)]">{t('paySuccess.loadingDetails')}</p>
            </div>
          ) : orderNumber ? (
            <div className="mt-7 rounded-2xl border border-[var(--cera-line)] bg-[var(--cera-cream-deep)] p-5">
              <p className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Package className="h-4 w-4 text-[var(--cera-muted)]" aria-hidden="true" />
                <span className="cera-eyebrow">{t('paySuccess.orderNumber')}</span>
              </p>
              <p dir="ltr" className="cera-serif cera-numeral mt-2 text-[27px] leading-none text-[var(--cera-ink)]">
                {orderNumber}
              </p>

              {orderDetails && (
                <div className="mt-5 space-y-2.5 border-t border-[var(--cera-line)] pt-4">
                  {row(t('paySuccess.customer'), orderDetails.customerName)}
                  {row(t('paySuccess.email'), <span dir="ltr">{orderDetails.customerEmail}</span>)}
                  {row(
                    t('paySuccess.total'),
                    <span dir="ltr" className="cera-numeral font-semibold">{orderDetails.total} AED</span>
                  )}
                  {row(
                    t('paySuccess.status'),
                    <span className="rounded-full border border-[var(--cera-ok-line)] bg-[var(--cera-ok-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--cera-ok)]">
                      {orderDetails.paymentStatus === 'paid' ? t('paySuccess.paid') : t('paySuccess.processing')}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm leading-relaxed text-amber-900">
                {t('paySuccess.orderNotFound')}
              </p>
            </div>
          )}

          <div className="ed-panel mt-4 p-4">
            <p className="text-sm leading-relaxed text-[var(--cera-body)]">
              {t('paySuccess.confirmationEmail')}
            </p>
          </div>

          <div className="mt-7 space-y-3">
            {/* Deep link back into the installed app, when the checkout was opened from it */}
            <a
              href={`genosysapp://order-success?orderNumber=${orderNumber}`}
              className="ed-cta w-full py-3.5 text-[15px]"
            >
              {t('paySuccess.returnToApp')}
            </a>

            <Link href="/products" className={`ed-ghost w-full py-3.5 text-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}>
              {t('paySuccess.continueShopping')}
              <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Link>

            <Link
              href="/profile"
              className="block w-full py-2 text-center text-sm font-semibold text-[var(--cera-rose-ink)] transition-colors hover:text-[var(--cera-rose)]"
            >
              {t('paySuccess.viewOrderHistory')}
            </Link>
          </div>

          <div className="mt-7 border-t border-[var(--cera-line)] pt-5">
            <p className="text-center text-xs leading-relaxed text-[var(--cera-muted)]">
              {t('paySuccess.needHelp')}{' '}
              <a href="mailto:support@genosys.ae" dir="ltr" className="font-semibold text-[var(--cera-rose-ink)] hover:underline">
                support@genosys.ae
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
