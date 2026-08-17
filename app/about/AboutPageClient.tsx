'use client'

import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Sparkles, Target, Building2, Phone as PhoneIcon,
  ShieldCheck, MapPin, Calendar, Globe2, Mail,
} from 'lucide-react'
import { IconOfficialDistributor, Instagram } from '@/components/icons/BrandIcons'
import Logo from '@/components/Logo'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PDFLinkButton from '@/components/PDFLinkButton'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import PWAPageWrapper from '@/components/pwa/PWAPageWrapper'
import { usePWAMode } from '@/hooks/usePWAMode'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'

export default function AboutPageClient() {
  const { t, locale, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  
  useEffect(() => {
    if (isClient) {
      setIsMobileWeb(window.innerWidth < 768 && !isPWA)
    }
  }, [isClient, isPWA])
  
  const isAppLikeMode = (isClient && isPWA) || isMobileWeb
  
  return (
    <PWAPageWrapper 
      title={locale === 'ar' ? 'حول جينوسيس' : locale === 'ru' ? 'О Genosys' : 'About Genosys'}
      defaultBackPath="/products"
    >
      <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir}>
        <BreadcrumbSchema 
        items={[
          { name: t('common.home'), url: getLocalizedPath('/', locale) },
          { name: t('common.about'), url: getLocalizedPath('/about', locale) }
        ]}
      />

      {/* ── Mobile web + PWA: denser app-like layout ─────────────────────── */}
      {isAppLikeMode ? (
        <div className="px-4 py-4">
          {/* Compact hero — the sticky header already says "About Genosys"
              so we don't need a repeat h1. Keep the logo + a single-line
              legal name as a subtle caption for brand reinforcement. */}
          <div className="flex flex-col items-center text-center mb-4">
            <Logo size="md" className="justify-center scale-75" />
            <p className="text-[11px] text-[var(--cera-muted)] mt-1 tracking-wide">
              Genosys Middle East FZ-LLC
            </p>
          </div>

          {/* About + Mission — single divided card (was two cards). */}
          <div className="bg-white rounded-2xl border border-[var(--cera-line)] shadow-sm overflow-hidden mb-4">
            <div className="p-4">
              <h2 className={`cera-serif text-sm text-[var(--cera-ink)] mb-1.5 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('about.aboutUs')}</h2>
              <p className={`text-sm text-[var(--cera-body)] leading-relaxed mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('about.aboutUsDescription')}</p>
              <p className={`text-sm text-[var(--cera-body)] leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('about.productsCertifiedDescription')}{' '}
                <a href="https://www.dm.gov.ae/" target="_blank" rel="noopener noreferrer" className="text-[var(--cera-rose)] underline underline-offset-2">
                  {t('about.dubaiMunicipality')}
                </a>.
              </p>
            </div>
            <div className="border-t border-[var(--cera-line)] p-4">
              <h2 className={`cera-serif text-sm text-[var(--cera-ink)] mb-1.5 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('about.ourMission')}</h2>
              <p className={`text-sm text-[var(--cera-body)] leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>{t('about.missionDescription')}</p>
            </div>
          </div>

          {/* Section label for legal/contact details (small caps, tight) */}
          <div className={`px-1 mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
            <h2 className="cera-serif text-xs text-[var(--cera-muted)] uppercase tracking-wide">
              {t('about.legalInformationContact')}
            </h2>
          </div>

          {/* All 3 legal/contact blocks collapsed into ONE divided card.
              Uses a compact definition-list style: muted label → value. */}
          <div className="bg-white rounded-2xl border border-[var(--cera-line)] shadow-sm overflow-hidden mb-4">
            {/* Company Details */}
            <div className="p-4">
              <h3 className={`cera-serif text-xs text-[var(--cera-muted)] uppercase tracking-wide mb-2.5 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('about.companyDetails')}</h3>
              <dl className="divide-y divide-gray-100">
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Компания' : locale === 'ar' ? 'الشركة' : 'Company'}</dt>
                  <dd className={`text-[var(--cera-ink)] font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('about.companyNameValue')}</dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Год' : locale === 'ar' ? 'السنة' : 'Year'}</dt>
                  <dd className="text-[var(--cera-ink)] font-medium">2019</dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Лицензия' : locale === 'ar' ? 'الترخيص' : 'License'}</dt>
                  <dd><PDFLinkButton href="/documents/Genosys_License.pdf" filename="Genosys-Commercial-License-5023192.pdf" download="Genosys-Commercial-License-5023192.pdf" className="text-[var(--cera-rose)] underline underline-offset-2 font-medium">5023192</PDFLinkButton></dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">TRN</dt>
                  <dd><PDFLinkButton href="/documents/genosys-trn-104229886700003.pdf" filename="GENOSYS-TRN-104229886700003.pdf" download="GENOSYS-TRN-104229886700003.pdf" className="text-[var(--cera-rose)] underline underline-offset-2 font-medium">104229886700003</PDFLinkButton></dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Главный офис' : locale === 'ar' ? 'المكتب الرئيسي' : 'Main Office'}</dt>
                  <dd className={`text-[var(--cera-ink)] font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>Compass Bldg, Al Hulaila, RAK</dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Офис в Дубае' : locale === 'ar' ? 'مكتب دبي' : 'Dubai Office'}</dt>
                  <dd className={`text-[var(--cera-ink)] font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>Cordoba Residence, E02, Knowledge Village</dd>
                </div>
              </dl>
            </div>

            {/* Contact */}
            <div className="border-t border-[var(--cera-line)] p-4">
              <h3 className={`cera-serif text-xs text-[var(--cera-muted)] uppercase tracking-wide mb-2.5 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('about.contactInformation')}</h3>
              <dl className="divide-y divide-gray-100">
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">{t('contact.phoneWhatsapp')}</dt>
                  <dd><a href="tel:+971585487665" className="text-[var(--cera-rose)] font-medium" dir="ltr">+971 58 548 76 65</a></dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">{t('about.email')}</dt>
                  <dd><a href="mailto:sales@genosys.ae" className="text-[var(--cera-rose)] font-medium" dir="ltr">sales@genosys.ae</a></dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">{t('about.website')}</dt>
                  <dd><a href="https://genosys.ae" target="_blank" rel="noopener noreferrer" className="text-[var(--cera-rose)] font-medium" dir="ltr">genosys.ae</a></dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">{t('about.instagram')}</dt>
                  <dd><a href="https://www.instagram.com/genosys.uae/" target="_blank" rel="noopener noreferrer" className="text-[var(--cera-rose)] font-medium" dir="ltr">@genosys.uae</a></dd>
                </div>
              </dl>
            </div>

            {/* Business */}
            <div className="border-t border-[var(--cera-line)] p-4">
              <h3 className={`cera-serif text-xs text-[var(--cera-muted)] uppercase tracking-wide mb-2.5 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('about.businessInformation')}</h3>
              <dl className="divide-y divide-gray-100">
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Дистрибьютор' : locale === 'ar' ? 'الموزع' : 'Distributor'}</dt>
                  <dd className={`text-[var(--cera-ink)] font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>DTSMG Co., Ltd, Korea</dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">{t('about.certification')}</dt>
                  <dd className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                    <span className="text-[var(--cera-ink)]">{t('about.dubaiMunicipality')} </span>
                    <span className="text-[var(--cera-muted)]">·</span>{' '}
                    <PDFLinkButton href="/documents/Genosys_Product_Registration_Montaji.pdf" filename="Genosys_Product_Registration_Montaji.pdf" download="Genosys_Product_Registration_Montaji.pdf" className="text-[var(--cera-rose)] underline underline-offset-2 font-medium">Montaji</PDFLinkButton>
                  </dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">{t('about.certification')}</dt>
                  <dd><PDFLinkButton href="/documents/TDRA_NOC.pdf" filename="GENOSYS-TDRA-NOC.pdf" download="GENOSYS-TDRA-NOC.pdf" className="text-[var(--cera-rose)] underline underline-offset-2 font-medium">TDRA</PDFLinkButton></dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">{t('about.products')}</dt>
                  <dd className={`text-[var(--cera-ink)] font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('about.premiumKoreanDermacosmetics')}</dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Регион' : locale === 'ar' ? 'المنطقة' : 'Area'}</dt>
                  <dd className={`text-[var(--cera-ink)] font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('about.unitedArabEmirates')}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* CTA — full-width stacked buttons feel native on mobile. */}
          <div className="bg-white rounded-2xl border border-[var(--cera-line)] shadow-sm p-5 text-center">
            <h2 className="cera-serif text-base text-[var(--cera-ink)] mb-1.5">{t('about.getInTouch')}</h2>
            <p className="text-xs text-[var(--cera-muted)] mb-4 leading-relaxed">{t('about.getInTouchDescription')}</p>
            <div className={`flex flex-col gap-2 ${dir === 'rtl' ? 'items-stretch' : 'items-stretch'}`}>
              <Link
                href={getLocalizedPath('/products', locale)}
                className="bg-[var(--cera-rose)] text-white w-full py-3 rounded-xl text-sm font-semibold active:bg-red-700 transition-colors"
              >
                {t('common.products')}
              </Link>
              <Link
                href={getLocalizedPath('/contact', locale)}
                className="border border-red-600 text-[var(--cera-rose)] w-full py-3 rounded-xl text-sm font-semibold active:bg-red-50 transition-colors"
              >
                {t('common.contact')}
              </Link>
            </div>
          </div>

          <div className="text-center mt-4 text-[11px] text-[var(--cera-muted)]">
            <p>&copy; 2026 GENOSYS Middle East FZ-LLC</p>
          </div>
        </div>
      ) : (
        /* ── Desktop: editorial rework ──────────────────────────────────── */
        <>
        <PageBreadcrumb
          items={[
            { name: t('common.home'), href: getLocalizedPath('/', locale) },
            { name: t('common.about') },
          ]}
        />
        <div className="container mx-auto px-4 py-4 md:py-12">
        <div className="max-w-6xl mx-auto">
          <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-[var(--cera-muted)] hover:text-gray-900 mb-6 md:mb-10 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span>{t('common.backToHome')}</span>
          </Link>

          {/* ── Editorial hero ───────────────────────────────────────────── */}
          <header className="mb-12 md:mb-16">
            <p className="cera-eyebrow">
              {locale === 'ar'
                ? 'من نحن · الإمارات · منذ 2019'
                : locale === 'ru'
                  ? 'О НАС · ОАЭ · С 2019'
                  : 'WHO WE ARE · UAE · SINCE 2019'}
            </p>
            <h1 className={`cera-serif mt-3 max-w-4xl text-3xl md:text-5xl lg:text-[3.4rem] leading-[1.05] text-[var(--cera-ink)] ${dir === 'rtl' ? 'text-right' : ''}`}>
              {locale === 'ar'
                ? 'مستحضرات تجميل علاجية كورية، يقدّمها فريق يستخدمها بنفسه.'
                : locale === 'ru'
                  ? 'Корейская дерматокосметика, от людей, которые ею пользуются.'
                  : 'Korean dermacosmetics, served by people who actually use them.'}
            </h1>
            <p className={`mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-[var(--cera-muted)] ${dir === 'rtl' ? 'text-right' : ''}`}>
              {locale === 'ar'
                ? 'الموزع الرسمي لـ GENOSYS في الإمارات منذ 2019. مقرّنا الرئيسي في رأس الخيمة ومكتب في دبي. معتمدون من بلدية دبي ومنتجي وهيئة تنظيم الاتصالات.'
                : locale === 'ru'
                  ? 'Официальный дистрибьютор GENOSYS в ОАЭ с 2019 года. Главный офис в Рас-эль-Хайме, представительство в Дубае. Сертифицировано муниципалитетом Дубая, Montaji и TDRA.'
                  : 'Official UAE distributor of GENOSYS since 2019. Headquartered in Ras Al Khaimah, with a Dubai office. Certified by Dubai Municipality, Montaji and TDRA.'}
            </p>

            {/* Stats strip */}
            <dl className="mt-8 hidden md:grid md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-[var(--cera-line)] bg-gray-200">
              <div className="bg-white px-6 py-5">
                <dt className="flex items-center gap-2 cera-eyebrow">
                  <Calendar className="h-3.5 w-3.5 text-[var(--cera-rose)]" />
                  {locale === 'ar' ? 'سنوات في السوق' : locale === 'ru' ? 'лет на рынке' : 'years in market'}
                </dt>
                <dd className="mt-2 flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-[var(--cera-ink)]">
                  <span>{new Date().getFullYear() - 2019}</span>
                  <span className="text-sm font-medium text-[var(--cera-muted)]">{locale === 'ar' ? 'منذ 2019' : locale === 'ru' ? 'с 2019' : 'since 2019'}</span>
                </dd>
              </div>
              <div className="bg-white px-6 py-5">
                <dt className="flex items-center gap-2 cera-eyebrow">
                  <MapPin className="h-3.5 w-3.5 text-[var(--cera-rose)]" />
                  {locale === 'ar' ? 'الموقع' : locale === 'ru' ? 'присутствие' : 'presence'}
                </dt>
                <dd className="mt-2 flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-[var(--cera-ink)]">
                  <span>2</span>
                  <span className="text-sm font-medium text-[var(--cera-muted)]">RAK · Dubai</span>
                </dd>
              </div>
              <div className="bg-white px-6 py-5">
                <dt className="flex items-center gap-2 cera-eyebrow">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--cera-rose)]" />
                  {locale === 'ar' ? 'الاعتمادات' : locale === 'ru' ? 'сертификаций' : 'certifications'}
                </dt>
                <dd className="mt-2 flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-[var(--cera-ink)]">
                  <span>3</span>
                  <span className="text-sm font-medium text-[var(--cera-muted)]">DM · Montaji · TDRA</span>
                </dd>
              </div>
              <div className="bg-white px-6 py-5">
                <dt className="flex items-center gap-2 cera-eyebrow">
                  <Globe2 className="h-3.5 w-3.5 text-[var(--cera-rose)]" />
                  {locale === 'ar' ? 'المنشأ' : locale === 'ru' ? 'происхождение' : 'origin'}
                </dt>
                <dd className="mt-2 flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-[var(--cera-ink)]">
                  <span className="text-2xl">🇰🇷</span>
                  <span className="text-sm font-medium text-[var(--cera-muted)]">{locale === 'ar' ? 'سيول، كوريا' : locale === 'ru' ? 'Сеул, Корея' : 'Seoul, Korea'}</span>
                </dd>
              </div>
            </dl>
          </header>

          {/* ── Story + Mission (asymmetric 7/5 split) ──────────────────── */}
          <section className="mb-12 md:mb-16 grid gap-6 md:grid-cols-12 md:gap-10">
            <article className={`md:col-span-7 ${dir === 'rtl' ? 'text-right' : ''}`}>
              <p className="cera-eyebrow">01</p>
              <h2 className={`cera-serif mt-2 flex items-center gap-3 text-2xl md:text-3xl text-[var(--cera-ink)] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Sparkles className="h-6 w-6 text-[var(--cera-rose)]" aria-hidden="true" />
                {t('about.aboutUs')}
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--cera-body)]">
                <p>{t('about.aboutUsDescription')}</p>
                <p>
                  {t('about.productsCertifiedDescription')}{' '}
                  <a href="https://www.dm.gov.ae/" target="_blank" rel="noopener noreferrer" className="text-[var(--cera-rose)] underline underline-offset-4 decoration-red-300 hover:decoration-red-600 transition-colors">
                    {t('about.dubaiMunicipality')}
                  </a>.
                </p>
              </div>
            </article>

            <aside className={`md:col-span-5 ${dir === 'rtl' ? 'text-right' : ''}`}>
              <div className="relative h-full rounded-2xl border border-[var(--cera-line)] bg-[var(--cera-cream)] p-7 md:p-8">
                <span aria-hidden className={`absolute top-7 ${dir === 'rtl' ? 'right-0' : 'left-0'} h-12 w-1 bg-[var(--cera-rose)]`} />
                <p className="cera-eyebrow">02</p>
                <h2 className={`cera-serif mt-2 flex items-center gap-3 text-xl md:text-2xl text-[var(--cera-ink)] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Target className="h-5 w-5 text-[var(--cera-rose)]" aria-hidden="true" />
                  {t('about.ourMission')}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[var(--cera-body)]">
                  {t('about.missionDescription')}
                </p>
              </div>
            </aside>
          </section>

          {/* ── Trust & Compliance — single editorial panel ─────────────── */}
          <section className="mb-12 md:mb-16">
            <div className={`mb-6 flex items-end justify-between gap-4 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
              <div className={dir === 'rtl' ? 'text-right' : ''}>
                <p className="cera-eyebrow">03</p>
                <h2 className="cera-serif mt-2 text-2xl md:text-3xl text-[var(--cera-ink)]">
                  {t('about.legalInformationContact')}
                </h2>
              </div>
              <span className="hidden md:inline text-xs cera-eyebrow text-[var(--cera-muted)]">
                {locale === 'ar' ? 'الشفافية والامتثال' : locale === 'ru' ? 'прозрачность и комплаенс' : 'transparency & compliance'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--cera-line)] bg-gray-200 md:grid-cols-3">
              {/* Company Details */}
              <div className={`bg-white p-6 md:p-7 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2.5 mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Building2 className="h-4 w-4 text-[var(--cera-rose)]" aria-hidden="true" />
                  <h3 className="cera-serif text-xs cera-eyebrow text-[var(--cera-muted)]">
                    {t('about.companyDetails')}
                  </h3>
                </div>
                <dl className="space-y-3 text-sm">
                  <div className={`flex items-baseline justify-between gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Компания' : locale === 'ar' ? 'الشركة' : 'Company'}</dt>
                    <dd className={`text-[var(--cera-ink)] font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('about.companyNameValue')}</dd>
                  </div>
                  <div className={`flex items-baseline justify-between gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Год' : locale === 'ar' ? 'السنة' : 'Year'}</dt>
                    <dd className="text-[var(--cera-ink)] font-medium">2019</dd>
                  </div>
                  <div className={`flex items-baseline justify-between gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Лицензия' : locale === 'ar' ? 'الترخيص' : 'License'}</dt>
                    <dd className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                      <PDFLinkButton href="/documents/Genosys_License.pdf" filename="Genosys-Commercial-License-5023192.pdf" download="Genosys-Commercial-License-5023192.pdf" className="text-[var(--cera-rose)] underline underline-offset-2 decoration-red-300 hover:decoration-red-600 font-medium transition-colors">5023192</PDFLinkButton>
                    </dd>
                  </div>
                  <div className={`flex items-baseline justify-between gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <dt className="text-[var(--cera-muted)] flex-shrink-0">TRN</dt>
                    <dd className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                      <PDFLinkButton href="/documents/genosys-trn-104229886700003.pdf" filename="GENOSYS-TRN-104229886700003.pdf" download="GENOSYS-TRN-104229886700003.pdf" className="text-[var(--cera-rose)] underline underline-offset-2 decoration-red-300 hover:decoration-red-600 font-medium transition-colors">104229886700003</PDFLinkButton>
                    </dd>
                  </div>
                  <div className={`flex items-baseline justify-between gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Главный офис' : locale === 'ar' ? 'المكتب الرئيسي' : 'HQ'}</dt>
                    <dd className={`text-[var(--cera-ink)] font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>Compass Bldg, Al Hulaila, RAK</dd>
                  </div>
                  <div className={`flex items-baseline justify-between gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Дубай' : locale === 'ar' ? 'دبي' : 'Dubai'}</dt>
                    <dd className={`text-[var(--cera-ink)] font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>Cordoba Residence, E02</dd>
                  </div>
                </dl>
              </div>

              {/* Contact */}
              <div className={`bg-white p-6 md:p-7 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2.5 mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <PhoneIcon className="h-4 w-4 text-[var(--cera-rose)]" aria-hidden="true" />
                  <h3 className="cera-serif text-xs cera-eyebrow text-[var(--cera-muted)]">
                    {t('about.contactInformation')}
                  </h3>
                </div>
                <dl className="space-y-3 text-sm">
                  <div className={`flex items-baseline justify-between gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <dt className="text-[var(--cera-muted)] flex-shrink-0">{t('contact.phoneWhatsapp')}</dt>
                    <dd className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                      <a href="tel:+971585487665" className="text-[var(--cera-ink)] hover:text-red-600 font-medium transition-colors" dir="ltr">+971 58 548 76 65</a>
                    </dd>
                  </div>
                  <div className={`flex items-baseline justify-between gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <dt className="text-[var(--cera-muted)] flex-shrink-0 inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{t('about.email')}</dt>
                    <dd className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                      <a href="mailto:sales@genosys.ae" className="text-[var(--cera-ink)] hover:text-red-600 font-medium transition-colors" dir="ltr">sales@genosys.ae</a>
                    </dd>
                  </div>
                  <div className={`flex items-baseline justify-between gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <dt className="text-[var(--cera-muted)] flex-shrink-0 inline-flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5" />{t('about.website')}</dt>
                    <dd className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                      <a href="https://genosys.ae" target="_blank" rel="noopener noreferrer" className="text-[var(--cera-ink)] hover:text-red-600 font-medium transition-colors" dir="ltr">genosys.ae</a>
                    </dd>
                  </div>
                  <div className={`flex items-baseline justify-between gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <dt className="text-[var(--cera-muted)] flex-shrink-0 inline-flex items-center gap-1.5"><Instagram className="h-3.5 w-3.5" />{t('about.instagram')}</dt>
                    <dd className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                      <a href="https://www.instagram.com/genosys.uae/" target="_blank" rel="noopener noreferrer" className="text-[var(--cera-ink)] hover:text-red-600 font-medium transition-colors" dir="ltr">@genosys.uae</a>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Business / Compliance */}
              <div className={`bg-white p-6 md:p-7 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2.5 mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <IconOfficialDistributor className="h-4 w-4 text-[var(--cera-rose)]" />
                  <h3 className="cera-serif text-xs cera-eyebrow text-[var(--cera-muted)]">
                    {t('about.businessInformation')}
                  </h3>
                </div>
                <dl className="space-y-3 text-sm">
                  <div className={`flex items-baseline justify-between gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Дистрибьютор' : locale === 'ar' ? 'الموزع' : 'Distributor'}</dt>
                    <dd className={`text-[var(--cera-ink)] font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>DTSMG Co., Ltd, Korea</dd>
                  </div>
                  <div className={`flex items-baseline justify-between gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Сертификат' : locale === 'ar' ? 'الاعتماد' : 'Certified'}</dt>
                    <dd className={`flex flex-wrap gap-1.5 ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
                      <span className="inline-flex items-center rounded-full bg-[var(--cera-cream-deep)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--cera-body)]">
                        {t('about.dubaiMunicipality')}
                      </span>
                      <PDFLinkButton href="/documents/Genosys_Product_Registration_Montaji.pdf" filename="Genosys_Product_Registration_Montaji.pdf" download="Genosys_Product_Registration_Montaji.pdf" className="inline-flex items-center rounded-full bg-[var(--cera-blush)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--cera-rose-ink)] hover:bg-red-100 transition-colors">
                        Montaji
                      </PDFLinkButton>
                      <PDFLinkButton href="/documents/TDRA_NOC.pdf" filename="GENOSYS-TDRA-NOC.pdf" download="GENOSYS-TDRA-NOC.pdf" className="inline-flex items-center rounded-full bg-[var(--cera-blush)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--cera-rose-ink)] hover:bg-red-100 transition-colors">
                        TDRA
                      </PDFLinkButton>
                    </dd>
                  </div>
                  <div className={`flex items-baseline justify-between gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <dt className="text-[var(--cera-muted)] flex-shrink-0">{t('about.products')}</dt>
                    <dd className={`text-[var(--cera-ink)] font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('about.premiumKoreanDermacosmetics')}</dd>
                  </div>
                  <div className={`flex items-baseline justify-between gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <dt className="text-[var(--cera-muted)] flex-shrink-0">{locale === 'ru' ? 'Регион' : locale === 'ar' ? 'المنطقة' : 'Area'}</dt>
                    <dd className={`text-[var(--cera-ink)] font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('about.unitedArabEmirates')}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          {/* ── Closing CTA — dark editorial panel ──────────────────────── */}
          <section className="relative overflow-hidden rounded-xl md:rounded-3xl bg-[var(--cera-ink)] text-white">
            <span aria-hidden className="pointer-events-none absolute -top-32 -left-20 h-72 w-72 rounded-full bg-[var(--cera-rose)]/25 blur-3xl" />
            <span aria-hidden className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-[var(--cera-rose)]/15 blur-3xl" />

            <div className="relative grid gap-8 p-6 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-12 md:p-10">
              <div className={dir === 'rtl' ? 'text-right' : ''}>
                <p className="text-[11px] cera-eyebrow text-[var(--cera-blush)]/90">
                  {locale === 'ar' ? 'جاهز؟' : locale === 'ru' ? 'ГОТОВЫ?' : 'READY?'}
                </p>
                <h2 className="cera-serif mt-3 text-2xl md:text-3xl lg:text-4xl leading-[1.1]">
                  {locale === 'ar'
                    ? 'تصفّح الكتالوج. أو فقط ألقِ التحية.'
                    : locale === 'ru'
                      ? 'Откройте каталог. Или просто напишите.'
                      : 'Browse the catalogue. Or just say hi.'}
                </h2>
                <p className="mt-3 max-w-md text-sm md:text-base leading-relaxed text-gray-300">
                  {t('about.getInTouchDescription')}
                </p>
              </div>

              <div className={`flex flex-col gap-3 sm:flex-row md:flex-col ${dir === 'rtl' ? 'md:items-end' : 'md:items-stretch'}`}>
                <Link
                  href={getLocalizedPath('/products', locale)}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--cera-ink)] transition-all hover:bg-red-500 hover:text-white"
                >
                  {t('common.products')}
                  <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-0.5 group-hover:translate-x-0' : ''}`} />
                </Link>
                <Link
                  href={getLocalizedPath('/contact', locale)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
                >
                  {t('common.contact')}
                </Link>
              </div>
            </div>
          </section>
        </div>
        </div>
        </>
      )}
    </div>
    </PWAPageWrapper>
  )
}

