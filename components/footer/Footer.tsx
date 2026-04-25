'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Instagram,
  Facebook,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import {
  IconAuthentic,
  IconShipping,
  IconSecureCheckout,
  IconCertified,
} from '@/components/icons/BrandIcons'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useTranslation } from '@/hooks/useTranslation'

export default function Footer() {
  const { isPWA, isClient: isPWAClient } = usePWAMode()
  const { isMobile, isClient: isMobileClient } = useIsMobile()
  const isClient = isPWAClient && isMobileClient

  const { t, locale } = useTranslation()

  // Check if we're on the contact page - check synchronously to avoid hydration mismatch
  // Hide footer on mobile (sticky footer nav handles it) and in PWA mode
  if (isClient && (isPWA || isMobile)) {
    return null
  }

  // Reusable class for column link items — consistent hit area and focus ring.
  const colLinkClass =
    'text-sm text-gray-600 hover:text-primary-700 transition-colors py-1 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded'

  // Copy helpers for micro-strings we want localized without adding new keys
  // to the messages bundles (keeping this change surgical).
  const shopHeading = locale === 'ar' ? 'تسوق' : locale === 'ru' ? 'Покупки' : 'Shop'
  const helpHeading = locale === 'ar' ? 'المساعدة' : locale === 'ru' ? 'Помощь' : 'Customer care'
  const companyHeading = locale === 'ar' ? 'الشركة' : locale === 'ru' ? 'Компания' : 'Company'
  const legalHeading = locale === 'ar' ? 'الوثائق' : locale === 'ru' ? 'Документы' : 'Legal'

  return (
    <footer role="contentinfo" className="bg-white border-t border-gray-200 pt-10" suppressHydrationWarning>
      <div className="container mx-auto px-4">
        {/* ── Trust badges strip ───────────────────────────────────────
            Custom GENOSYS pictograms — see components/icons/BrandIcons. */}
        <div className="hidden md:block border-b border-gray-100 pb-8 mb-10">
          <div className="grid grid-cols-4 gap-x-8 lg:gap-x-12 gap-y-6 max-w-6xl mx-auto">
            <div className="flex items-start gap-3 min-w-0">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <IconAuthentic className="h-5 w-5 text-emerald-600" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {locale === 'ar' ? 'منتجات أصلية' : locale === 'ru' ? 'Оригинал' : 'Authentic'}
                </p>
                <p className="text-xs text-gray-500 leading-snug mt-1">
                  {locale === 'ar' ? 'موزع رسمي GENOSYS' : locale === 'ru' ? 'Официальный дистрибьютор' : 'Official GENOSYS distributor'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 min-w-0">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50">
                <IconShipping className="h-5 w-5 text-primary-600" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {locale === 'ar' ? 'شحن مجاني' : locale === 'ru' ? 'Бесплатная доставка' : 'Free shipping'}
                </p>
                <p className="text-xs text-gray-500 leading-snug mt-1">
                  {locale === 'ar' ? 'للطلبات فوق 1000 درهم' : locale === 'ru' ? 'При заказе от 1000 AED' : 'On orders over 1000 AED'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 min-w-0">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <IconSecureCheckout className="h-5 w-5 text-blue-600" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {locale === 'ar' ? 'دفع آمن' : locale === 'ru' ? 'Безопасная оплата' : 'Secure checkout'}
                </p>
                <p className="text-xs text-gray-500 leading-snug mt-1">
                  {locale === 'ar' ? 'Stripe · جميع البطاقات الرئيسية' : locale === 'ru' ? 'Stripe · все основные карты' : 'Stripe · all major cards'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 min-w-0">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50">
                <IconCertified className="h-5 w-5 text-amber-600" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {locale === 'ar' ? 'معتمد من بلدية دبي' : locale === 'ru' ? 'Сертифицировано Муниципалитетом Дубая' : 'Dubai Municipality Certified'}
                </p>
                <p className="text-xs text-gray-500 leading-snug mt-1">
                  {locale === 'ar' ? 'ضمان ضريبة القيمة المضافة 5%' : locale === 'ru' ? 'Включая 5% НДС' : '5% VAT included'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mega footer grid ───────────────────────────────────────── */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-8 pb-8">
          {/* Brand block (4 cols) */}
          <div className="md:col-span-4">
            <Link
              href={getLocalizedPath('/products', locale)}
              className="inline-block mb-4 hover:opacity-80 transition-opacity"
              aria-label={t('navigation.goToProducts')}
            >
              <Image
                src="/Logo/upLOGO.png"
                alt="GENOSYS Middle East FZ-LLC"
                width={180}
                height={54}
                className="w-[160px] h-auto"
                loading="lazy"
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed mb-5 max-w-xs">
              {locale === 'ar'
                ? 'الموزع الرسمي لـ GENOSYS في الإمارات — منذ 2019.'
                : locale === 'ru'
                ? 'Официальный дистрибьютор GENOSYS в ОАЭ — с 2019 года.'
                : 'Official UAE distributor of GENOSYS — since 2019.'}
            </p>

            {/* Contact block */}
            <ul className="space-y-2 mb-5">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
                <a href="tel:+971585487665" className="hover:text-primary-700 transition-colors">
                  +971 58 548 7665
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
                <a href="mailto:sales@genosys.ae" className="hover:text-primary-700 transition-colors">
                  sales@genosys.ae
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Dubai, United Arab Emirates</span>
              </li>
            </ul>

            {/* Social */}
            <div className="flex items-center gap-2" aria-label="Social media">
              <a
                href="https://www.instagram.com/genosys.uae/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-pink-600 hover:border-pink-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
                aria-label="Follow GENOSYS on Instagram"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.facebook.com/genosys.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
                aria-label="Follow GENOSYS on Facebook"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Shop column */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-gray-500 uppercase mb-4">
              {shopHeading}
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href={getLocalizedPath('/products', locale)} className={colLinkClass}>
                  {locale === 'ar' ? 'جميع المنتجات' : locale === 'ru' ? 'Все продукты' : 'All products'}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/products/category/serum', locale)} className={colLinkClass}>
                  {locale === 'ar' ? 'السيرومات' : locale === 'ru' ? 'Сыворотки' : 'Serums'}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/products/category/cream', locale)} className={colLinkClass}>
                  {locale === 'ar' ? 'الكريمات' : locale === 'ru' ? 'Кремы' : 'Creams'}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/products/category/microneedling', locale)} className={colLinkClass}>
                  {locale === 'ar' ? 'الوخز الدقيق' : locale === 'ru' ? 'Микронидлинг' : 'Microneedling'}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/skin-recommendation', locale)} className={colLinkClass}>
                  {locale === 'ar' ? 'تحليل البشرة' : locale === 'ru' ? 'Анализ кожи' : 'Skin analysis'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Help column */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-gray-500 uppercase mb-4">
              {helpHeading}
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href={getLocalizedPath('/faq', locale)} className={colLinkClass}>
                  {t('navigation.faq')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/contact', locale)} className={colLinkClass}>
                  {locale === 'ar' ? 'تواصل معنا' : locale === 'ru' ? 'Контакты' : 'Contact us'}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/delivery', locale)} className={colLinkClass}>
                  {locale === 'ar' ? 'الشحن والتوصيل' : locale === 'ru' ? 'Доставка' : 'Shipping & delivery'}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/orders', locale)} className={colLinkClass}>
                  {locale === 'ar' ? 'طلباتي' : locale === 'ru' ? 'Мои заказы' : 'Track my order'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-gray-500 uppercase mb-4">
              {companyHeading}
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href={getLocalizedPath('/about', locale)} className={colLinkClass}>
                  {locale === 'ar' ? 'من نحن' : locale === 'ru' ? 'О нас' : 'About GENOSYS'}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/training', locale)} className={colLinkClass}>
                  {locale === 'ar' ? 'التدريب' : locale === 'ru' ? 'Обучение' : 'Pro training'}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/locations', locale)} className={colLinkClass}>
                  {t('common.locations')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/partners', locale)} className={colLinkClass}>
                  {t('navigation.partners')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/blog', locale)} className={colLinkClass}>
                  {t('navigation.blog')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-gray-500 uppercase mb-4">
              {legalHeading}
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href={getLocalizedPath('/privacy-policy', locale)} className={colLinkClass}>
                  {t('navigation.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath('/terms', locale)} className={colLinkClass}>
                  {locale === 'ar' ? 'الشروط والأحكام' : locale === 'ru' ? 'Условия' : 'Terms of service'}
                </Link>
              </li>
              <li>
                <a
                  href="/documents/Genosys_UAE_Montaji_Registration.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={colLinkClass}
                >
                  {locale === 'ar' ? 'شهادة منتجي' : locale === 'ru' ? 'Сертификат Montaji' : 'Montaji Certificate'}
                </a>
              </li>
            </ul>

            {/* App download pair — condensed */}
            <div className="mt-6">
              <p className="text-[11px] tracking-[0.14em] font-semibold text-gray-500 uppercase mb-2">
                {locale === 'ar' ? 'حمّل التطبيق' : locale === 'ru' ? 'Приложение' : 'Get the app'}
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://apps.apple.com/ae/app/genosys-uae/id6756648064"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
                  aria-label="Download on the App Store"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=ae.genosys.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
                  aria-label="Get it on Google Play"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.808 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                  </svg>
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom strip: payments + copyright ─────────────────────── */}
        <div className="hidden md:flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100 pb-8">
          {/* Payment methods — accepted cards + wallets. Checkout is powered
              by Stripe; we surface the Stripe trust mark on the right. */}
          <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2" aria-label="Accepted payment methods">
              <span className="text-[11px] text-gray-500 uppercase tracking-wider mr-1">
                {locale === 'ar' ? 'طرق الدفع' : locale === 'ru' ? 'Оплата' : 'We accept'}
              </span>
              {/* Payment-method chips. Shared base class for symmetry; each
                  chip lifts + shadows on hover (desktop only, the whole
                  bottom strip is `hidden md:flex`). Honors prefers-reduced
                  motion — animation collapses to a no-op for users who set
                  the OS-level setting. */}
              {/* Visa */}
              <span
                className="group/pay inline-flex items-center justify-center h-7 w-11 rounded-md border border-gray-200 bg-white px-1.5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md hover:shadow-gray-200/70 hover:border-gray-300 hover:bg-blue-50/40 motion-reduce:transition-none motion-reduce:hover:transform-none"
                aria-label="Visa"
                title="Visa"
              >
                <svg viewBox="0 0 48 16" className="h-3.5 w-auto transition-transform duration-300 group-hover/pay:scale-110 motion-reduce:group-hover/pay:scale-100" aria-hidden="true">
                  <text x="0" y="12" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="900" fontSize="13" fontStyle="italic" fill="#1A1F71" letterSpacing="0.5">VISA</text>
                </svg>
              </span>
              {/* Mastercard */}
              <span
                className="group/pay inline-flex items-center justify-center h-7 w-11 rounded-md border border-gray-200 bg-white px-1.5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md hover:shadow-gray-200/70 hover:border-gray-300 hover:bg-gradient-to-br hover:from-red-50/60 hover:to-orange-50/60 motion-reduce:transition-none motion-reduce:hover:transform-none"
                aria-label="Mastercard"
                title="Mastercard"
              >
                <svg viewBox="0 0 32 20" className="h-5 w-auto transition-transform duration-300 group-hover/pay:scale-110 motion-reduce:group-hover/pay:scale-100" aria-hidden="true">
                  <circle cx="12" cy="10" r="7" fill="#EB001B" />
                  <circle cx="20" cy="10" r="7" fill="#F79E1B" />
                  <path d="M16 4.4A7 7 0 0 0 13 10a7 7 0 0 0 3 5.6A7 7 0 0 0 19 10a7 7 0 0 0-3-5.6z" fill="#FF5F00" />
                </svg>
              </span>
              {/* Apple Pay */}
              <span
                className="group/pay inline-flex items-center justify-center h-7 w-11 rounded-md border border-gray-200 bg-white px-1.5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md hover:shadow-gray-200/70 hover:border-gray-300 hover:bg-gray-50 motion-reduce:transition-none motion-reduce:hover:transform-none"
                aria-label="Apple Pay"
                title="Apple Pay"
              >
                <svg viewBox="0 0 40 16" className="h-4 w-auto transition-transform duration-300 group-hover/pay:scale-110 motion-reduce:group-hover/pay:scale-100" aria-hidden="true" fill="#000">
                  <path d="M6.7 3.2c-.4.5-1.1.9-1.7.8-.1-.7.2-1.4.6-1.8.4-.5 1.2-.8 1.8-.9.1.7-.2 1.4-.7 1.9zm.7.9c-1 0-1.8.6-2.3.6s-1.2-.5-2-.5c-1 0-2 .6-2.5 1.6-1.1 1.9-.3 4.6.8 6.1.5.7 1.2 1.5 2 1.5s1.1-.5 2-.5 1.2.5 2 .5 1.4-.7 1.9-1.5c.6-.8.8-1.6.8-1.7 0 0-1.6-.6-1.6-2.5 0-1.6 1.3-2.3 1.3-2.3-.7-1.1-1.9-1.2-2.4-1.3z"/>
                  <text x="14" y="12" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="600" fontSize="10">Pay</text>
                </svg>
              </span>
              {/* Google Pay */}
              <span
                className="group/pay inline-flex items-center justify-center h-7 w-11 rounded-md border border-gray-200 bg-white px-1.5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md hover:shadow-gray-200/70 hover:border-gray-300 hover:bg-blue-50/40 motion-reduce:transition-none motion-reduce:hover:transform-none"
                aria-label="Google Pay"
                title="Google Pay"
              >
                <svg viewBox="0 0 48 16" className="h-4 w-auto transition-transform duration-300 group-hover/pay:scale-110 motion-reduce:group-hover/pay:scale-100" aria-hidden="true">
                  <path fill="#4285F4" d="M5.5 8.2v2.6H4.4V4.5h2.2c.6 0 1 .2 1.4.5.4.4.6.8.6 1.4s-.2 1-.6 1.4c-.3.3-.8.5-1.4.5H5.5zm0-2.6v1.6h1.2c.3 0 .6-.1.8-.3.2-.2.3-.4.3-.7s-.1-.5-.3-.7c-.2-.2-.4-.3-.8-.3H5.5z"/>
                  <path fill="#34A853" d="M9.9 6.3c.5 0 1 .1 1.3.4.3.3.5.6.5 1v2.1h-.8V10c-.3.5-.8.8-1.4.8-.5 0-.9-.1-1.2-.4-.3-.3-.5-.6-.5-1 0-.5.2-.8.5-1.1.3-.3.8-.4 1.3-.4.4 0 .8.1 1.1.2v-.2c0-.2-.1-.4-.3-.6-.2-.2-.4-.2-.7-.2-.4 0-.7.2-.9.5l-.7-.4c.3-.5.8-.8 1.6-.8z"/>
                  <text x="14" y="12" fontFamily="'Helvetica Neue', Arial, sans-serif" fontWeight="600" fontSize="10" fill="#5F6368">Pay</text>
                </svg>
              </span>
            </div>

            {/* Stripe secure-checkout badge.
                On hover: shield "pulses" (scale + tint), text darkens, and a
                hairline underline grows in from the start side. Uses a
                named group so it doesn't conflict with the per-chip
                `group/pay` above. */}
            <span className="group/stripe inline-flex items-center gap-1.5 text-[11px] text-gray-500 border-l border-gray-200 pl-3 ml-1 transition-colors duration-300 hover:text-gray-700 cursor-default">
              <ShieldCheck
                className="h-3.5 w-3.5 text-emerald-600 transition-transform duration-300 ease-out group-hover/stripe:scale-125 group-hover/stripe:text-emerald-500 motion-reduce:group-hover/stripe:scale-100"
                aria-hidden="true"
              />
              <span className="relative">
                {locale === 'ar'
                  ? 'الدفع الآمن بواسطة Stripe'
                  : locale === 'ru'
                  ? 'Безопасная оплата через Stripe'
                  : 'Secure checkout by Stripe'}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-0 bg-emerald-500 transition-[width] duration-300 ease-out group-hover/stripe:w-full motion-reduce:transition-none motion-reduce:group-hover/stripe:w-0"
                />
              </span>
            </span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-500" suppressHydrationWarning>
            {t('footer.copyright')}
          </p>
        </div>

        {/* Mobile fallback (in case mobile detection hasn't resolved yet).
            This keeps pre-existing behavior for crawlers and SSR. */}
        <div className="md:hidden text-center py-4">
          <p className="text-[10px] text-gray-400" suppressHydrationWarning>
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
