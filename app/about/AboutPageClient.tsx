'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Target, Building2, Phone as PhoneIcon } from 'lucide-react'
import { IconOfficialDistributor } from '@/components/icons/BrandIcons'
import Logo from '@/components/Logo'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PDFLinkButton from '@/components/PDFLinkButton'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import PWAPageWrapper from '@/components/pwa/PWAPageWrapper'
import { usePWAMode } from '@/hooks/usePWAMode'

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
      <div className={`${isAppLikeMode ? 'bg-gray-50' : 'bg-white'} min-h-screen ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir}>
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
            <p className="text-[11px] text-gray-500 mt-1 tracking-wide">
              Genosys Middle East FZ-LLC
            </p>
          </div>

          {/* About + Mission — single divided card (was two cards). */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
            <div className="p-4">
              <h2 className={`text-sm font-bold text-gray-900 mb-1.5 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('about.aboutUs')}</h2>
              <p className={`text-sm text-gray-700 leading-relaxed mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('about.aboutUsDescription')}</p>
              <p className={`text-sm text-gray-700 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('about.productsCertifiedDescription')}{' '}
                <a href="https://www.dm.gov.ae/" target="_blank" rel="noopener noreferrer" className="text-red-600 underline underline-offset-2">
                  {t('about.dubaiMunicipality')}
                </a>.
              </p>
            </div>
            <div className="border-t border-gray-100 p-4">
              <h2 className={`text-sm font-bold text-gray-900 mb-1.5 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('about.ourMission')}</h2>
              <p className={`text-sm text-gray-700 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>{t('about.missionDescription')}</p>
            </div>
          </div>

          {/* Section label for legal/contact details (small caps, tight) */}
          <div className={`px-1 mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('about.legalInformationContact')}
            </h2>
          </div>

          {/* All 3 legal/contact blocks collapsed into ONE divided card.
              Uses a compact definition-list style: muted label → value. */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
            {/* Company Details */}
            <div className="p-4">
              <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('about.companyDetails')}</h3>
              <dl className="divide-y divide-gray-100">
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">{locale === 'ru' ? 'Компания' : locale === 'ar' ? 'الشركة' : 'Company'}</dt>
                  <dd className={`text-gray-900 font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('about.companyNameValue')}</dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">{locale === 'ru' ? 'Год' : locale === 'ar' ? 'السنة' : 'Year'}</dt>
                  <dd className="text-gray-900 font-medium">2019</dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">{locale === 'ru' ? 'Лицензия' : locale === 'ar' ? 'الترخيص' : 'License'}</dt>
                  <dd><PDFLinkButton href="/documents/commercial-license.pdf" filename="Genosys-Commercial-License-5023192.pdf" download="Genosys-Commercial-License-5023192.pdf" className="text-red-600 underline underline-offset-2 font-medium">5023192</PDFLinkButton></dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">TRN</dt>
                  <dd><PDFLinkButton href="/documents/genosys-trn-104229886700003.pdf" filename="GENOSYS-TRN-104229886700003.pdf" download="GENOSYS-TRN-104229886700003.pdf" className="text-red-600 underline underline-offset-2 font-medium">104229886700003</PDFLinkButton></dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">{locale === 'ru' ? 'Главный офис' : locale === 'ar' ? 'المكتب الرئيسي' : 'Main Office'}</dt>
                  <dd className={`text-gray-900 font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>Compass Bldg, GF, RAK</dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">{locale === 'ru' ? 'Офис в Дубае' : locale === 'ar' ? 'مكتب دبي' : 'Dubai Office'}</dt>
                  <dd className={`text-gray-900 font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>Cordoba Residence, E02, Knowledge Village</dd>
                </div>
              </dl>
            </div>

            {/* Contact */}
            <div className="border-t border-gray-100 p-4">
              <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('about.contactInformation')}</h3>
              <dl className="divide-y divide-gray-100">
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">{t('contact.phoneWhatsapp')}</dt>
                  <dd><a href="tel:+971585487665" className="text-red-600 font-medium" dir="ltr">+971 58 548 76 65</a></dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">{t('about.email')}</dt>
                  <dd><a href="mailto:sales@genosys.ae" className="text-red-600 font-medium" dir="ltr">sales@genosys.ae</a></dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">{t('about.website')}</dt>
                  <dd><a href="https://genosys.ae" target="_blank" rel="noopener noreferrer" className="text-red-600 font-medium" dir="ltr">genosys.ae</a></dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">{t('about.instagram')}</dt>
                  <dd><a href="https://www.instagram.com/genosys.uae/" target="_blank" rel="noopener noreferrer" className="text-red-600 font-medium" dir="ltr">@genosys.uae</a></dd>
                </div>
              </dl>
            </div>

            {/* Business */}
            <div className="border-t border-gray-100 p-4">
              <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('about.businessInformation')}</h3>
              <dl className="divide-y divide-gray-100">
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">{locale === 'ru' ? 'Дистрибьютор' : locale === 'ar' ? 'الموزع' : 'Distributor'}</dt>
                  <dd className={`text-gray-900 font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>DTSMG Co., Ltd, Korea</dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">{t('about.certification')}</dt>
                  <dd className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                    <span className="text-gray-900">{t('about.dubaiMunicipality')} </span>
                    <span className="text-gray-400">·</span>{' '}
                    <PDFLinkButton href="/documents/Genosys_UAE_Montaji_Registration.pdf" filename="Genosys_UAE_Montaji_Registration.pdf" download="Genosys_UAE_Montaji_Registration.pdf" className="text-red-600 underline underline-offset-2 font-medium">Montaji</PDFLinkButton>
                  </dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">{t('about.certification')}</dt>
                  <dd><PDFLinkButton href="/documents/TDRA_NOC.pdf" filename="GENOSYS-TDRA-NOC.pdf" download="GENOSYS-TDRA-NOC.pdf" className="text-red-600 underline underline-offset-2 font-medium">TDRA</PDFLinkButton></dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">{t('about.products')}</dt>
                  <dd className={`text-gray-900 font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('about.premiumKoreanDermacosmetics')}</dd>
                </div>
                <div className={`flex items-baseline justify-between gap-3 py-1.5 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <dt className="text-gray-500 flex-shrink-0">{locale === 'ru' ? 'Регион' : locale === 'ar' ? 'المنطقة' : 'Area'}</dt>
                  <dd className={`text-gray-900 font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('about.unitedArabEmirates')}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* CTA — full-width stacked buttons feel native on mobile. */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
            <h2 className="text-base font-bold text-gray-900 mb-1.5">{t('about.getInTouch')}</h2>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">{t('about.getInTouchDescription')}</p>
            <div className={`flex flex-col gap-2 ${dir === 'rtl' ? 'items-stretch' : 'items-stretch'}`}>
              <Link
                href={getLocalizedPath('/products', locale)}
                className="bg-red-600 text-white w-full py-3 rounded-xl text-sm font-semibold active:bg-red-700 transition-colors"
              >
                {t('common.products')}
              </Link>
              <Link
                href={getLocalizedPath('/contact', locale)}
                className="border border-red-600 text-red-600 w-full py-3 rounded-xl text-sm font-semibold active:bg-red-50 transition-colors"
              >
                {t('common.contact')}
              </Link>
            </div>
          </div>

          <div className="text-center mt-4 text-[11px] text-gray-400">
            <p>&copy; 2026 GENOSYS Middle East FZ-LLC</p>
          </div>
        </div>
      ) : (
        /* ── Desktop: original layout preserved ──────────────────────────── */
        <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-4xl lg:max-w-6xl mx-auto">
          <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
            <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">{t('common.about')}</span>
          </nav>
          <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span>{t('common.backToHome')}</span>
          </Link>

          <div className="text-center mb-6 md:mb-14">
            <div className="flex justify-center mb-3 md:mb-5">
              <Logo size="lg" className="justify-center scale-50 md:scale-100" />
            </div>
            <p className="hidden md:block text-xs font-semibold tracking-[0.2em] text-primary-600 uppercase mb-3">
              {locale === 'ar' ? 'من نحن' : locale === 'ru' ? 'О нас' : 'About us'}
            </p>
            <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-4 tracking-tight">
              Genosys Middle East FZ-LLC
            </h1>
            <p className="hidden md:block text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === 'ar' ? 'موزع رسمي لمستحضرات التجميل العلاجية الكورية GENOSYS في الإمارات منذ 2019.' : locale === 'ru' ? 'Официальный дистрибьютор корейской дермакосметики GENOSYS в ОАЭ с 2019 года.' : 'Official UAE distributor of GENOSYS Korean dermacosmetics — since 2019.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-14">
            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm md:shadow-md border border-gray-100 p-3 md:p-8">
              <div className={`flex items-center gap-3 md:gap-4 mb-3 md:mb-5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div className="hidden md:flex h-11 w-11 rounded-xl bg-primary-50 items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-primary-600" aria-hidden="true" />
                </div>
                <h2 className="text-base md:text-xl font-semibold text-gray-900">{t('about.aboutUs')}</h2>
              </div>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed mb-2 md:mb-4">{t('about.aboutUsDescription')}</p>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                {t('about.productsCertifiedDescription')}
                <a href="https://www.dm.gov.ae/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline underline-offset-2 ml-1">
                  {t('about.dubaiMunicipality')}
                </a>.
              </p>
            </div>
            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm md:shadow-md border border-gray-100 p-3 md:p-8">
              <div className={`flex items-center gap-3 md:gap-4 mb-3 md:mb-5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div className="hidden md:flex h-11 w-11 rounded-xl bg-primary-50 items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-primary-600" aria-hidden="true" />
                </div>
                <h2 className="text-base md:text-xl font-semibold text-gray-900">{t('about.ourMission')}</h2>
              </div>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed">{t('about.missionDescription')}</p>
            </div>
          </div>

          <div className="text-center mb-3 md:mb-8">
            <p className="hidden md:block text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase mb-2">
              {locale === 'ar' ? 'الشركة' : locale === 'ru' ? 'Компания' : 'Company'}
            </p>
            <h2 className="text-lg md:text-3xl font-bold text-gray-900 tracking-tight">{t('about.legalInformationContact')}</h2>
          </div>

          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 mb-4 md:mb-14">
            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm md:shadow-md border border-gray-100 p-3 md:p-7">
              <div className="flex items-center gap-3 mb-3 md:mb-5">
                <div className="hidden md:flex h-10 w-10 rounded-xl bg-primary-50 items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-primary-600" aria-hidden="true" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-gray-900 pb-1 md:pb-0 md:border-0 border-b border-gray-200 flex-1">{t('about.companyDetails')}</h3>
              </div>
              <dl className="md:divide-y md:divide-gray-100 space-y-0.5 md:space-y-0 text-gray-600 text-xs md:text-sm">
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">{locale === 'ru' ? 'Компания:' : locale === 'ar' ? 'الشركة:' : 'Company'}</dt> <dd className="md:text-right md:text-gray-900 md:font-medium inline md:block">{t('about.companyNameValue')}</dd></div>
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">{locale === 'ru' ? 'Год:' : locale === 'ar' ? 'السنة:' : 'Year'}</dt> <dd className="md:text-right md:text-gray-900 md:font-medium inline md:block">2019</dd></div>
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">{locale === 'ru' ? 'Лицензия:' : locale === 'ar' ? 'الترخيص:' : 'License'}</dt> <dd className="md:text-right inline md:block"><PDFLinkButton href="/documents/commercial-license.pdf" filename="Genosys-Commercial-License-5023192.pdf" download="Genosys-Commercial-License-5023192.pdf" className="text-primary-600 hover:text-primary-700 underline underline-offset-2 font-medium">5023192</PDFLinkButton></dd></div>
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">TRN</dt> <dd className="md:text-right inline md:block"><PDFLinkButton href="/documents/genosys-trn-104229886700003.pdf" filename="GENOSYS-TRN-104229886700003.pdf" download="GENOSYS-TRN-104229886700003.pdf" className="text-primary-600 hover:text-primary-700 underline underline-offset-2 font-medium">104229886700003</PDFLinkButton></dd></div>
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">{locale === 'ru' ? 'Главный офис:' : locale === 'ar' ? 'المكتب الرئيسي:' : 'Main office'}</dt> <dd className="md:text-right md:text-gray-900 md:font-medium inline md:block">Compass Building, GF, RAK</dd></div>
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">{locale === 'ru' ? 'Офис в Дубае:' : locale === 'ar' ? 'مكتب دبي:' : 'Dubai office'}</dt> <dd className="md:text-right md:text-gray-900 md:font-medium inline md:block">Cordoba Residence, E02</dd></div>
              </dl>
            </div>

            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm md:shadow-md border border-gray-100 p-3 md:p-7">
              <div className="flex items-center gap-3 mb-3 md:mb-5">
                <div className="hidden md:flex h-10 w-10 rounded-xl bg-primary-50 items-center justify-center flex-shrink-0">
                  <PhoneIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-gray-900 pb-1 md:pb-0 md:border-0 border-b border-gray-200 flex-1">{t('about.contactInformation')}</h3>
              </div>
              <dl className="md:divide-y md:divide-gray-100 space-y-0.5 md:space-y-0 text-xs md:text-sm">
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">{t('contact.phoneWhatsapp')}</dt> <dd className="md:text-right inline md:block"><a href="tel:+971585487665" className="text-primary-600 hover:text-primary-700 font-medium" dir="ltr">+971 58 548 76 65</a></dd></div>
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">{t('about.email')}</dt> <dd className="md:text-right inline md:block"><a href="mailto:sales@genosys.ae" className="text-primary-600 hover:text-primary-700 font-medium" dir="ltr">sales@genosys.ae</a></dd></div>
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">{t('about.website')}</dt> <dd className="md:text-right inline md:block"><a href="https://genosys.ae" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium" dir="ltr">genosys.ae</a></dd></div>
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">{t('about.instagram')}</dt> <dd className="md:text-right inline md:block"><a href="https://www.instagram.com/genosys.uae/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-medium" dir="ltr">@genosys.uae</a></dd></div>
              </dl>
            </div>

            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm md:shadow-md border border-gray-100 p-3 md:p-7">
              <div className="flex items-center gap-3 mb-3 md:mb-5">
                <div className="hidden md:flex h-10 w-10 rounded-xl bg-primary-50 items-center justify-center flex-shrink-0">
                  <IconOfficialDistributor className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-gray-900 pb-1 md:pb-0 md:border-0 border-b border-gray-200 flex-1">{t('about.businessInformation')}</h3>
              </div>
              <dl className="md:divide-y md:divide-gray-100 space-y-0.5 md:space-y-0 text-gray-600 text-xs md:text-sm">
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">{locale === 'ru' ? 'Дистрибьютор:' : locale === 'ar' ? 'الموزع:' : 'Distributor'}</dt> <dd className="md:text-right md:text-gray-900 md:font-medium inline md:block">DTSMG Co., Ltd, Korea</dd></div>
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">{t('about.certification')}</dt> <dd className="md:text-right inline md:block">{t('about.dubaiMunicipality')} (<PDFLinkButton href="/documents/Genosys_UAE_Montaji_Registration.pdf" filename="Genosys_UAE_Montaji_Registration.pdf" download="Genosys_UAE_Montaji_Registration.pdf" className="text-primary-600 hover:text-primary-700 underline underline-offset-2 font-medium">Montaji</PDFLinkButton>)</dd></div>
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">{t('about.certification')}</dt> <dd className="md:text-right inline md:block"><PDFLinkButton href="/documents/TDRA_NOC.pdf" filename="GENOSYS-TDRA-NOC.pdf" download="GENOSYS-TDRA-NOC.pdf" className="text-primary-600 hover:text-primary-700 underline underline-offset-2 font-medium">TDRA</PDFLinkButton></dd></div>
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">{t('about.products')}</dt> <dd className="md:text-right md:text-gray-900 md:font-medium inline md:block">{t('about.premiumKoreanDermacosmetics')}</dd></div>
                <div className="md:flex md:items-baseline md:justify-between md:gap-3 md:py-2"><dt className="font-semibold text-gray-800 md:font-medium md:text-gray-500 inline md:block">{locale === 'ru' ? 'Регион:' : locale === 'ar' ? 'المنطقة:' : 'Area'}</dt> <dd className="md:text-right md:text-gray-900 md:font-medium inline md:block">{t('about.unitedArabEmirates')}</dd></div>
              </dl>
            </div>
          </div>

          <div className="bg-white md:bg-gray-50 rounded-lg md:rounded-2xl p-4 md:p-10 text-center border border-gray-100">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-3 tracking-tight">{t('about.getInTouch')}</h2>
            <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-7 max-w-xl mx-auto">{t('about.getInTouchDescription')}</p>
            <div className={`flex flex-row gap-2 md:gap-3 justify-center ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Link href={getLocalizedPath('/products', locale)} className="bg-primary-600 text-white px-3 md:px-7 py-1.5 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-base font-semibold hover:bg-primary-700 transition-colors shadow-sm">
                {t('common.products')}
              </Link>
              <Link href={getLocalizedPath('/contact', locale)} className="border border-primary-600 text-primary-600 px-3 md:px-7 py-1.5 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-base font-semibold hover:bg-primary-50 transition-colors">
                {t('common.contact')}
              </Link>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
    </PWAPageWrapper>
  )
}

