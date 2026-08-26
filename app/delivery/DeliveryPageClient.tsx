'use client'

import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

import Link from 'next/link'
import { ArrowLeft, Clock, Gift, Mail, Phone, RotateCcw, Truck } from 'lucide-react'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useIsMobileWeb } from '@/hooks/useIsMobile'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import AccountAvatar from '@/components/AccountAvatar'

/**
 * /delivery, /ru/delivery and /ar/delivery all render this.
 *
 * Russian and Arabic used to carry their own ~250-line copies, which is how
 * they drifted apart from the English one.
 */
export default function DeliveryPageClient() {
  const { t, locale, dir } = useTranslation()
  const { isPWA, isMobileWeb } = useIsMobileWeb()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const isRTL = dir === 'rtl'
  const fromProfile = searchParams?.get('from') === 'profile'
  const isAppLikeMode = isPWA || isMobileWeb

  const pick = <T,>(en: T, ar: T, ru: T) => (locale === 'ar' ? ar : locale === 'ru' ? ru : en)

  /* The four numbers a customer is actually looking for. Stated once here and
     referenced everywhere else on the page; the old layout repeated all four
     in three separate blocks, so a change had to be made in three places. */
  const facts = [
    { label: pick('In Dubai', 'في دبي', 'В Дубае'), value: pick('1 hour', 'ساعة واحدة', '1 час') },
    { label: pick('Across the UAE', 'في الإمارات', 'По ОАЭ'), value: pick('24–36 hr', '24-36 ساعة', '24–36 ч') },
    { label: pick('Free shipping over', 'شحن مجاني فوق', 'Бесплатно от'), value: 'AED 1,000' },
    { label: pick('Returns window', 'مدة الإرجاع', 'Срок возврата'), value: pick('10 days', '10 أيام', '10 дней') },
  ]

  const returns = [
    { term: pick('Window', 'المدة', 'Период'), detail: pick('10 days from delivery', '10 أيام من الاستلام', '10 дней с момента доставки') },
    { term: pick('Refund', 'الاسترداد', 'Возврат средств'), detail: pick('3–5 days once received', '3-5 أيام بعد الاستلام', '3–5 дней после получения') },
    { term: pick('Condition', 'الحالة', 'Состояние'), detail: pick('Unused, in its original packaging', 'غير مستخدم، بالتغليف الأصلي', 'Не использовано, в оригинальной упаковке') },
    { term: pick('To start', 'للبدء', 'Как начать'), detail: pick('Message us on WhatsApp or email', 'راسلنا على واتساب أو بالبريد', 'Напишите нам в WhatsApp или на почту') },
  ]

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-[100dvh] ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir}>
      {isAppLikeMode && (
        <div
          className={`mweb-float-sticky-top sticky top-0 z-20 flex items-center justify-between border-b border-[var(--cera-line)] bg-[var(--cera-cream)]/95 px-5 py-4 backdrop-blur ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <button
            onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
            className={`flex min-w-[80px] items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-5 w-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-[15px] text-[var(--cera-rose-ink)]">
              {fromProfile ? pick('Account', 'الحساب', 'Аккаунт') : pick('Products', 'المنتجات', 'Продукты')}
            </span>
          </button>
          <span className="cera-serif text-[17px]">{pick('Delivery', 'التوصيل', 'Доставка')}</span>
          <button
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="flex min-w-[80px] justify-end"
            aria-label="Profile"
          >
            <AccountAvatar name={user?.name} signedIn={!!user} />
          </button>
        </div>
      )}

      {!isAppLikeMode && (
        <PageBreadcrumb
          items={[
            { name: t('common.home') || 'Home', href: getLocalizedPath('/', locale) },
            { name: pick('Delivery', 'التوصيل', 'Доставка') },
          ]}
        />
      )}

      <div className="mx-auto max-w-[1120px] px-4 py-6 md:px-8 md:py-16">
        {!isAppLikeMode && (
          <>
            <Link
              href={getLocalizedPath('/', locale)}
              className={`mt-3 inline-flex items-center gap-1.5 text-[13px] text-[var(--cera-rose-ink)] transition-opacity hover:opacity-70 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <ArrowLeft className={`h-3.5 w-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              {t('common.backToHome') || 'Back to home'}
            </Link>
          </>
        )}

        {/* ────────────────────────────── Hero ────────────────────────────── */}
        <header className="mt-8 text-center md:mt-16">
          <p className="cera-eyebrow mb-3">{pick('Shipping and returns', 'الشحن والإرجاع', 'Доставка и возврат')}</p>
          <h1 className="cera-serif text-[32px] leading-[1.05] md:text-[54px] lg:text-[62px]">
            {pick('Getting it to you', 'كيف يصلك طلبك', 'Как заказ доедет')}
          </h1>
          <p className="mx-auto mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-[var(--cera-muted)] md:text-[17px]">
            {pick(
              'Same-day inside Dubai, next day everywhere else in the country, on a tracked courier from our own stock in Dubai.',
              'في اليوم نفسه داخل دبي، وفي اليوم التالي في بقية الدولة، عبر شركة توصيل مع تتبّع ومن مخزوننا في دبي.',
              'В Дубае в тот же день, по остальной стране на следующий, курьером с отслеживанием и с нашего склада в Дубае.',
            )}
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-y-7 md:mt-12 md:flex md:items-start md:justify-center md:gap-0">
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                className={`text-center md:px-8 ${i > 0 ? 'md:border-s md:border-[var(--cera-line)]' : ''}`}
              >
                <dd className="cera-numeral text-[24px] leading-none text-[var(--cera-ink)] md:text-[30px]">
                  {fact.value}
                </dd>
                <dt className="mt-2 text-[11.5px] leading-tight text-[var(--cera-muted)] md:text-[13px]">
                  {fact.label}
                </dt>
              </div>
            ))}
          </dl>
        </header>

        <div className="cera-rule mt-12 md:mt-16" />

        {/* ─────────────────────── Timing and courier ─────────────────────── */}
        <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-2 md:gap-5">
          {[
            {
              icon: Clock,
              title: pick('How long it takes', 'كم يستغرق', 'Сколько идёт'),
              body: pick(
                'One hour inside Dubai and 24 to 36 hours to the rest of the Emirates. Orders placed before the afternoon cut-off go out the same day.',
                'ساعة واحدة داخل دبي و24 إلى 36 ساعة لبقية الإمارات. الطلبات قبل موعد الإغلاق بعد الظهر تخرج في اليوم نفسه.',
                'Час внутри Дубая и 24–36 часов до остальных эмиратов. Заказы до дневного отсечения уходят в тот же день.',
              ),
            },
            {
              icon: Truck,
              title: pick('Who brings it', 'من يوصله', 'Кто везёт'),
              body: pick(
                'Careem and QuipQup carry every order door to door, and you get a tracking link the moment it leaves us.',
                'Careem وQuipQup ينقلان كل طلب من الباب إلى الباب، وتصلك رابط تتبّع فور خروج الطلب.',
                'Careem и QuipQup везут каждый заказ до двери, а ссылка для отслеживания приходит сразу после отправки.',
              ),
            },
          ].map((card) => {
            const Icon = card.icon
            return (
              <section key={card.title} className={`ed-row p-5 md:p-7 ${isRTL ? 'text-right' : ''}`}>
                <span className="ed-mark mb-4 h-11 w-11" aria-hidden="true">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <h2 className="cera-serif text-[19px] leading-tight md:text-[23px]">{card.title}</h2>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--cera-muted)]">{card.body}</p>
              </section>
            )
          })}
        </div>

        {/* ───────────────────────────── Free shipping ────────────────────── */}
        <section className={`ed-panel mt-10 p-6 text-center md:mt-14 md:p-10`}>
          <span className="ed-mark ed-mark--solid ed-mark--round mx-auto mb-4 h-12 w-12" aria-hidden="true">
            <Gift className="h-5 w-5" />
          </span>
          <h2 className="cera-serif text-[24px] leading-tight md:text-[32px]">
            {pick('Free over AED 1,000', 'شحن مجاني فوق 1,000 درهم', 'Бесплатно от 1 000 AED')}
          </h2>
          <p className="mx-auto mt-3 max-w-[48ch] text-[14.5px] leading-relaxed text-[var(--cera-muted)]">
            {pick(
              'Applied at checkout on its own. Below that the courier fee shows before you pay, and there is nothing added afterwards.',
              'يُطبّق تلقائياً عند الدفع. وتحت هذا المبلغ تظهر رسوم التوصيل قبل الدفع، ولا يُضاف شيء بعده.',
              'Применяется на оформлении автоматически. Ниже этой суммы стоимость курьера видна до оплаты, и после ничего не добавляется.',
            )}
          </p>
        </section>

        {/* ─────────────────────────────── Returns ────────────────────────── */}
        <section className="mt-12 md:mt-16">
          <header className={`mb-7 max-w-[62ch] md:mb-9 ${isRTL ? 'text-right' : ''}`}>
            <span className="ed-mark mb-4 h-11 w-11" aria-hidden="true">
              <RotateCcw className="h-[18px] w-[18px]" />
            </span>
            <p className="cera-eyebrow mb-2.5">{pick('If it is not right', 'إن لم يناسبك', 'Если не подошло')}</p>
            <h2 className="cera-serif text-[26px] leading-tight md:text-[36px]">
              {pick('Returns', 'الإرجاع', 'Возврат')}
            </h2>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--cera-muted)] md:text-[16px]">
              {pick(
                'Sealed skincare cannot be resold once it is opened, so returns are for unopened product. Tell us what went wrong either way and we will sort it out.',
                'مستحضرات العناية المختومة لا يمكن إعادة بيعها بعد فتحها، لذا الإرجاع للمنتج غير المفتوح. أخبرنا بما حدث في كل الأحوال وسنجد حلاً.',
                'Запечатанную косметику нельзя перепродать после вскрытия, поэтому возврат — для невскрытого товара. В любом случае напишите нам, и мы разберёмся.',
              )}
            </p>
          </header>

          <dl className="grid gap-3 sm:grid-cols-2">
            {returns.map((item, i) => (
              <div key={item.term} className={`ed-row flex items-start gap-4 p-4 md:p-5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <span className="ed-mark cera-numeral h-9 w-9 text-[14px]" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <dt className="cera-serif text-[16px] leading-tight text-[var(--cera-ink)]">{item.term}</dt>
                  <dd className="mt-1 text-[13.5px] leading-relaxed text-[var(--cera-muted)]">{item.detail}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        <div className="cera-rule mt-12 md:mt-16" />

        {/* ──────────────────────────────── Help ──────────────────────────── */}
        <section className="mt-10 text-center md:mt-14">
          <h2 className="cera-serif text-[24px] leading-tight md:text-[30px]">
            {pick('Something not clear?', 'شيء غير واضح؟', 'Что-то непонятно?')}
          </h2>
          <p className="mx-auto mt-3 max-w-[50ch] text-[14.5px] leading-relaxed text-[var(--cera-muted)]">
            {pick(
              'Ask before you order rather than after. We answer from Dubai, usually within the hour.',
              'اسأل قبل الطلب لا بعده. نردّ من دبي، غالباً خلال ساعة.',
              'Спросите до заказа, а не после. Отвечаем из Дубая, обычно в течение часа.',
            )}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/971585487665"
              target="_blank"
              rel="noopener noreferrer"
              className="ed-cta px-6 py-3 text-[15px]"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
            <a href="mailto:sales@genosys.ae" className="ed-ghost px-6 py-3 text-[15px]">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {pick('Email us', 'راسلنا', 'Написать')}
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
