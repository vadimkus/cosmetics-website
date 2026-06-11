import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Page Not Found - GENOSYS',
  description: 'The page you are looking for does not exist. Browse our professional Korean dermacosmetics collection, skincare products, and beauty devices.',
  robots: {
    index: false,
    follow: true, // Allow Google to follow links on 404 page
  },
}

/**
 * SEO-Friendly 404 Page
 * 
 * - Keeps users on the site with helpful navigation
 * - Passes link equity to important pages via internal links
 * - Supports all 3 languages via links
 * - Includes popular product categories for discovery
 */
export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Matrix-style "Road End" — the user is at the fork; the two CTAs
            below are the choice (homepage = the way back, products = the
            rabbit hole). The "ERROR · 404" kicker preserves the SEO/a11y
            signal that this is a 404 page without competing with the image. */}
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-3">
          Error · 404
        </p>
        <div className="mb-8">
          <Image
            src="/images/Wrong/roadend.png"
            alt="Road End — the path stops here"
            width={1698}
            height={838}
            className="mx-auto w-full max-w-2xl rounded-xl"
            sizes="(max-width: 672px) 100vw, 672px"
          />
        </div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-snug tracking-tight">
          This is Road End, now you have to make a choice&hellip;
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-10">
          &hellip;what to do next.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Go to Homepage
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </Link>
        </div>

        {/* Popular Pages - Internal links for SEO equity */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link href="/products" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">
              All Products
            </Link>
            <Link href="/blog" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">
              Skincare Blog
            </Link>
            <Link href="/about" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">
              About Us
            </Link>
            <Link href="/training" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">
              Professional Training
            </Link>
            <Link href="/locations" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">
              UAE Locations
            </Link>
            <Link href="/contact" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">
              Contact Us
            </Link>
            <Link href="/faq" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">
              FAQ
            </Link>
            <Link href="/brand" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">
              GENOSYS Brand
            </Link>
            <Link href="/delivery" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline py-2">
              Delivery Info
            </Link>
          </div>
        </div>

        {/* Get the app — App Store + Google Play
            Two-platform block. QR codes only show on >=sm because you can't
            scan a QR with the same phone you're holding; mobile users get
            tappable badges instead. */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-2">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Get the GENOSYS UAE app
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Scan a code to download — or tap a badge if you&apos;re on mobile.
          </p>
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
            {/* App Store */}
            <div className="flex flex-col items-center gap-3">
              <a
                href="https://apps.apple.com/ae/app/genosys-uae/id6756648064"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
                aria-label="Download Genosys UAE on the App Store (QR code)"
              >
                <Image
                  src="/images/qr-appstore.svg"
                  alt="QR code — Genosys UAE on the App Store"
                  width={140}
                  height={140}
                  className="rounded-lg"
                  unoptimized
                />
              </a>
              <a
                href="https://apps.apple.com/ae/app/genosys-uae/id6756648064"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
                aria-label="Download on the App Store"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </a>
            </div>
            {/* Google Play */}
            <div className="flex flex-col items-center gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=ae.genosys.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
                aria-label="Get Genosys UAE on Google Play (QR code)"
              >
                <Image
                  src="/images/qr-playstore.svg"
                  alt="QR code — Genosys UAE on Google Play"
                  width={140}
                  height={140}
                  className="rounded-lg"
                  unoptimized
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=ae.genosys.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
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

        {/* Language options - helps multilingual users who hit 404 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Looking for a different language?
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline">
              English
            </Link>
            <Link href="/ar" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline" dir="rtl">
              العربية
            </Link>
            <Link href="/ru" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline">
              Русский
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
