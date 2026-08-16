'use client'

import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

import Link from 'next/link'
import { ArrowLeft, FileText, Globe, Mail, MapPin, Phone } from 'lucide-react'
import { Facebook, IconOfficialDistributor, Instagram } from '@/components/icons/BrandIcons'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PDFLinkButton from '@/components/PDFLinkButton'
import PWAPageWrapper from '@/components/pwa/PWAPageWrapper'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useIsMobileWeb } from '@/hooks/useIsMobile'

export default function ContactClient() {
  const { t, locale, dir } = useTranslation()
  const { isPWA, isMobileWeb } = useIsMobileWeb()
  const isRTL = dir === 'rtl'
  const isAppLikeMode = isPWA || isMobileWeb

  const pick = <T,>(en: T, ar: T, ru: T) => (locale === 'ar' ? ar : locale === 'ru' ? ru : en)

  /** Every way to reach us, in the order we would rather be reached. */
  const channels = [
    {
      id: 'whatsapp',
      icon: Phone,
      name: 'WhatsApp',
      value: '+971 58 548 76 65',
      ltr: true,
      action: pick('Message us', 'أرسل رسالة', 'Написать'),
      href: 'https://wa.me/971585487665',
      external: true,
    },
    {
      id: 'email',
      icon: Mail,
      name: 'Email',
      value: 'sales@genosys.ae',
      ltr: true,
      action: pick('Send an email', 'إرسال بريد', 'Написать письмо'),
      href: 'mailto:sales@genosys.ae',
      external: false,
    },
    {
      id: 'location',
      icon: MapPin,
      name: t('common.locations'),
      value: 'Cordoba Residence, E02, Dubai, UAE',
      ltr: false,
      action: pick('Open in Maps', 'عرض الخريطة', 'Открыть карту'),
      href: 'https://maps.google.com/?q=Cordoba+Residence,+Villa+E02,+Dubai+United+Arab+Emirates',
      external: true,
    },
    {
      id: 'instagram',
      icon: Instagram,
      name: 'Instagram',
      value: '@genosys.uae',
      ltr: true,
      action: pick('Follow', 'متابعة', 'Подписаться'),
      href: 'https://instagram.com/genosys.uae',
      external: true,
    },
    {
      id: 'facebook',
      icon: Facebook,
      name: 'Facebook',
      value: 'genosys.ae',
      ltr: true,
      action: pick('Follow', 'متابعة', 'Подписаться'),
      href: 'https://www.facebook.com/genosys.ae',
      external: true,
    },
    {
      id: 'website',
      icon: Globe,
      name: t('common.website'),
      value: 'genosys.ae',
      ltr: true,
      action: pick('Visit the site', 'زيارة الموقع', 'Открыть сайт'),
      href: 'https://genosys.ae',
      external: true,
    },
  ]

  /** The paperwork a clinic asks for before it opens an account. */
  const documents = [
    { label: pick('Trade licence', 'الرخصة', 'Лицензия'), href: '/documents/Genosys_License.pdf', file: 'Genosys-Commercial-License-5023192.pdf' },
    { label: 'TRN', href: '/documents/genosys-trn-104229886700003.pdf', file: 'GENOSYS-TRN-104229886700003.pdf' },
    { label: 'Montaji', href: '/documents/Genosys_Product_Registration_Montaji.pdf', file: 'Genosys_Product_Registration_Montaji.pdf' },
    { label: 'TDRA', href: '/documents/TDRA_NOC.pdf', file: 'GENOSYS-TDRA-NOC.pdf' },
  ]

  return (
    <PWAPageWrapper title={pick('Contact Us', 'اتصل بنا', 'Контакты')}>
      <div className={`cera-page genosys-page ${ceraSerif.variable} ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir}>
        <BreadcrumbSchema
          items={[
            { name: t('common.home'), url: getLocalizedPath('/', locale) },
            { name: t('navigation.contact'), url: getLocalizedPath('/contact', locale) },
          ]}
        />

        <div className="mx-auto max-w-[1120px] px-4 py-6 md:px-8 md:py-16">
          {!isAppLikeMode && (
            <>
              <nav className={`text-[13px] text-[var(--cera-muted)] ${isRTL ? 'text-right' : ''}`} aria-label="Breadcrumb">
                <Link href={getLocalizedPath('/', locale)} className="transition-colors hover:text-[var(--cera-rose)]">
                  {t('common.home')}
                </Link>
                <span className="px-1.5">/</span>
                <span className="text-[var(--cera-ink)]">{t('navigation.contact')}</span>
              </nav>

              <Link
                href={getLocalizedPath('/', locale)}
                className={`mt-3 inline-flex items-center gap-1.5 text-[13px] text-[var(--cera-rose-ink)] transition-opacity hover:opacity-70 ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <ArrowLeft className={`h-3.5 w-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                {t('common.backToHome')}
              </Link>
            </>
          )}

          {/* ────────────────────────────── Hero ──────────────────────────── */}
          <header className="mt-8 text-center md:mt-16">
            <p className="cera-eyebrow mb-3">{pick('Get in touch', 'تحدث إلينا', 'Свяжитесь с нами')}</p>
            <h1 className="cera-serif text-[34px] leading-[1.05] md:text-[56px] lg:text-[64px]">
              {t('navigation.contact')}
            </h1>
            <p className="mx-auto mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-[var(--cera-muted)] md:text-[17px]">
              {pick(
                'Questions about a product, an order, or which routine suits your skin. A real person in Dubai answers, usually the same day.',
                'أسئلة عن منتج أو طلب أو الروتين المناسب لبشرتك. يردّ عليك شخص حقيقي في دبي، غالباً في اليوم نفسه.',
                'Вопросы о продукте, заказе или подходящем уходе. Отвечает живой человек в Дубае, обычно в тот же день.',
              )}
            </p>
          </header>

          <div className="cera-rule mt-10 md:mt-14" />

          {/* ──────────────────────────── Channels ────────────────────────── */}
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
            {channels.map((channel) => {
              const Icon = channel.icon
              return (
                <li key={channel.id}>
                  <a
                    href={channel.href}
                    {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className={`ed-row ed-row--hover group flex h-full items-start gap-4 p-4 md:p-5 ${
                      isRTL ? 'flex-row-reverse text-right' : ''
                    }`}
                  >
                    <span className="ed-mark h-11 w-11" aria-hidden="true">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="cera-serif block text-[16px] leading-tight text-[var(--cera-ink)]">
                        {channel.name}
                      </span>
                      <span
                        {...(channel.ltr ? { dir: 'ltr' } : {})}
                        className={`mt-1 block cursor-text select-text break-words text-[13.5px] text-[var(--cera-muted)] ${
                          channel.ltr && isRTL ? 'text-right' : ''
                        }`}
                      >
                        {channel.value}
                      </span>
                      <span className="mt-2.5 block text-[12.5px] font-semibold text-[var(--cera-rose-ink)]">
                        {channel.action}
                      </span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>

          {/* ───────────────────────── Official distributor ───────────────── */}
          <section className="ed-panel mt-12 p-6 md:mt-16 md:p-10">
            <div className={`md:flex md:items-start md:gap-10 ${isRTL ? 'md:flex-row-reverse md:text-right' : ''}`}>
              <div className="md:max-w-[34ch] md:flex-none">
                <span className="ed-mark ed-mark--solid mb-4 h-12 w-12" aria-hidden="true">
                  <IconOfficialDistributor className="h-6 w-6" />
                </span>
                <h2 className="cera-serif text-[22px] leading-tight md:text-[28px]">
                  {pick(
                    'Official distributor in the UAE',
                    'الموزع الرسمي في الإمارات',
                    'Официальный дистрибьютор в ОАЭ',
                  )}
                </h2>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--cera-muted)]">
                  {pick(
                    'For DTS MG Co., Ltd of Korea since 2019, with every product registered in the Dubai Municipality Montaji system.',
                    'لشركة DTS MG Co., Ltd الكورية منذ 2019، وكل منتج مسجّل في نظام مونتاجي ببلدية دبي.',
                    'Для DTS MG Co., Ltd (Корея) с 2019 года; каждый продукт зарегистрирован в системе Montaji муниципалитета Дубая.',
                  )}
                </p>
              </div>

              <div
                className={`mt-8 md:mt-0 md:flex-1 ${
                  isRTL ? 'md:border-r md:border-[var(--cera-blush-deep)] md:pr-10' : 'md:border-l md:border-[var(--cera-blush-deep)] md:pl-10'
                }`}
              >
                <p className="cera-eyebrow mb-4">{pick('Official documents', 'الوثائق', 'Документы')}</p>
                <div className={`flex flex-wrap gap-2.5 ${isRTL ? 'justify-end' : ''}`}>
                  {documents.map((doc) => (
                    <PDFLinkButton
                      key={doc.label}
                      href={doc.href}
                      filename={doc.file}
                      download={doc.file}
                      className="ed-ghost touch-manipulation px-4 py-2 text-[13px]"
                    >
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      {doc.label}
                    </PDFLinkButton>
                  ))}
                  <a
                    href="https://dnbuae.com/duns-number/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ed-ghost touch-manipulation px-4 py-2 text-[13px]"
                  >
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    <span dir="ltr">D-U-N-S® 850215607</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PWAPageWrapper>
  )
}
