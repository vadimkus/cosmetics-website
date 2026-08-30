'use client'

import { useState } from 'react'
import { Check, Mail, ArrowRight } from 'lucide-react'
import type { Locale } from '@/lib/i18n'

/**
 * Compact newsletter signup card. Posts to the same /api/newsletter/subscribe
 * endpoint as the homepage hero form (honeypot + rate-limit protected).
 *
 * Used where the rich homepage dark-band form isn't shown - primarily the
 * /products page on mobile/PWA, where mobile visitors land (the homepage
 * redirects them here and the content footer is hidden on mobile).
 */
export default function NewsletterSignup({
  locale,
  isRtl = false,
  source = 'products',
  className = '',
}: {
  locale: Locale
  isRtl?: boolean
  source?: string
  className?: string
}) {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const t = {
    heading:
      locale === 'ar' ? 'انضم إلى عائلة GENOSYS'
      : locale === 'ru' ? 'Вступайте в сообщество GENOSYS'
      : 'Join the GENOSYS insiders',
    body:
      locale === 'ar' ? 'بريد إلكتروني واحد شهرياً: نصائح العناية بالبشرة، إطلاقات جديدة وعروض حصرية.'
      : locale === 'ru' ? 'Одно письмо в месяц: советы по уходу, новинки и эксклюзивные предложения.'
      : 'One email a month - skincare tips, new launches and subscriber-only offers.',
    placeholder:
      locale === 'ar' ? 'أدخل بريدك الإلكتروني'
      : locale === 'ru' ? 'Введите email'
      : 'Enter your email',
    subscribe:
      locale === 'ar' ? 'اشترك' : locale === 'ru' ? 'Подписаться' : 'Subscribe',
    subscribing:
      locale === 'ar' ? 'جارٍ الإرسال…' : locale === 'ru' ? 'Отправляем…' : 'Subscribing…',
    success:
      locale === 'ar' ? 'شكراً لك! تحقق من بريدك الإلكتروني للتأكيد.'
      : locale === 'ru' ? 'Спасибо! Проверьте почту - мы отправили подтверждение.'
      : 'Thanks - check your inbox for a welcome email.',
    already:
      locale === 'ar' ? 'أنت مشترك بالفعل. تحقق من البريد غير المرغوب أو العروض الترويجية.'
      : locale === 'ru' ? 'Вы уже подписаны. Проверьте папки «Спам» и «Промоакции».'
      : 'You’re already on the list. Check Spam or Promotions if you missed the welcome email.',
    generic:
      locale === 'ar' ? 'تعذّر الاشتراك الآن. حاول مرة أخرى لاحقاً.'
      : locale === 'ru' ? 'Не удалось подписаться. Попробуйте позже.'
      : 'Could not subscribe right now. Please try again later.',
    invalid:
      locale === 'ar' ? 'يرجى إدخال بريد إلكتروني صالح.'
      : locale === 'ru' ? 'Введите действительный email.'
      : 'Please enter a valid email address.',
    rate:
      locale === 'ar' ? 'محاولات كثيرة. حاول بعد قليل.'
      : locale === 'ru' ? 'Слишком много попыток. Попробуйте позже.'
      : 'Too many attempts. Please try again in a few minutes.',
    privacy:
      locale === 'ar' ? 'إلغاء الاشتراك بنقرة واحدة. نحن نحترم خصوصيتك.'
      : locale === 'ru' ? 'Отписка в один клик. Мы уважаем вашу приватность.'
      : 'Unsubscribe in one click. We respect your privacy.',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    const trimmed = email.trim()
    if (!trimmed) return

    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, locale, source, website }),
      })
      const data = await res.json().catch(() => null)

      if (res.ok) {
        setStatus(data?.alreadySubscribed === true ? 'already' : 'success')
        setEmail('')
        return
      }
      if (res.status === 429) {
        setStatus('error')
        setErrorMsg(t.rate)
        return
      }
      setStatus('error')
      setErrorMsg(res.status === 400 ? (typeof data?.error === 'string' ? data.error : t.invalid) : t.generic)
    } catch {
      setStatus('error')
      setErrorMsg(t.generic)
    }
  }

  return (
    <section
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`rounded-2xl border border-gray-200 bg-gray-50 p-6 ${isRtl ? 'text-right' : ''} ${className}`}
    >
      <div className={`flex items-center gap-2.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 flex-shrink-0">
          <Mail className="h-4 w-4 text-primary-600" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-bold text-gray-900 font-display tracking-tight">{t.heading}</h2>
      </div>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{t.body}</p>

      {status === 'success' || status === 'already' ? (
        <div className={`mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--cera-ok-bg)] border border-[var(--cera-ok-line)] text-[var(--cera-ok)] px-4 py-2.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <Check className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold">{status === 'already' ? t.already : t.success}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-4">
          <label htmlFor="products-newsletter-email" className="sr-only">
            {locale === 'ar' ? 'البريد الإلكتروني' : locale === 'ru' ? 'Email' : 'Email address'}
          </label>
          <div className={`form-enhanced flex items-center gap-1 p-1 rounded-full bg-white border border-gray-300 transition-colors focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <input
              id="products-newsletter-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.placeholder}
              className={`flex-1 min-w-0 bg-transparent border-0 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-60 ${isRtl ? 'text-right' : ''}`}
              autoComplete="email"
              disabled={status === 'loading'}
              aria-invalid={status === 'error'}
              aria-describedby={status === 'error' ? 'products-newsletter-error' : undefined}
            />
            {/* Honeypot - hidden from a11y tree; only bots fill it */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gray-900 text-white px-5 py-2 font-semibold text-sm hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === 'loading' ? t.subscribing : t.subscribe}
              {status !== 'loading' && (
                <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
              )}
            </button>
          </div>
        </form>
      )}

      {status === 'error' && (
        <p id="products-newsletter-error" className="mt-3 text-sm text-red-600" role="alert">
          {errorMsg || t.generic}
        </p>
      )}

      <p className={`mt-3 text-xs text-gray-500 flex items-center gap-1.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <Check className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" aria-hidden="true" />
        {t.privacy}
      </p>
    </section>
  )
}
