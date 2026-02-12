import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found - GENOSYS Middle East FZ-LLC',
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
        {/* 404 Header */}
        <h1 className="text-8xl font-extrabold text-gray-200 dark:text-gray-700 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s help you find what you need.
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
