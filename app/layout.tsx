import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Script from 'next/script'
import './globals.css'
import { CartProvider } from '@/components/CartProvider'
import AuthProvider from '@/components/AuthProvider'
import FavoritesProvider from '@/components/FavoritesProvider'
import Header from '@/components/Header'
import UserRefreshWrapper from '@/components/UserRefreshWrapper'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import { ServiceWorkerProvider } from '@/components/ServiceWorkerProvider'
import PageViewTracker from '@/components/PageViewTracker'
import OrganizationSchema from '@/components/OrganizationSchema'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://genosys.ae'),
  title: 'Genosys Dubai - Premium Beauty Products & Cosmetics UAE',
  description: 'Genosys Dubai - Premium beauty products and cosmetics in UAE. Discover our professional skincare, hair care, and beauty treatments.',
  keywords: 'Genosys Dubai, Genosys cosmetics Dubai, beauty products Dubai, cosmetics UAE, skincare Dubai, professional beauty, Genosys Middle East, beauty treatments UAE, premium cosmetics',
  icons: {
    icon: [
      { url: '/favicon/genosys-official-favicon.ico', type: 'image/x-icon', sizes: '32x32' },
      { url: '/favicon/genosys-official.ico', type: 'image/x-icon', sizes: '16x16' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: [
      { url: '/favicon/genosys-official-favicon.ico', type: 'image/x-icon' }
    ],
    apple: [
      { url: '/favicon/genosys-official-favicon.ico', sizes: '32x32' },
      { url: '/favicon/genosys-official.ico', sizes: '16x16' }
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Genosys',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Genosys Dubai',
    title: 'Genosys Dubai - Premium Beauty Products & Cosmetics UAE',
    description: 'Genosys Dubai - Premium beauty products and cosmetics in UAE. Discover our professional skincare, hair care, and beauty treatments.',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Genosys Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_me',
    creator: '@genosys_me',
    title: 'Genosys Middle East FZ-LLC - Premium Beauty Products',
    description: 'Discover our premium collection of cosmetics and beauty products',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#1f2937',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-50SH0F79YG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-50SH0F79YG');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <OrganizationSchema />
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <ServiceWorkerProvider>
                <PerformanceMonitor />
                <UserRefreshWrapper />
                <PageViewTracker />
                <Header />
                <main className="min-h-screen">
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </main>
                <footer role="contentinfo" className="bg-white border-t border-gray-200 py-8">
                  <div className="container mx-auto px-4 text-center text-gray-600">
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <Image
                          src={`/images/Full.avif?v=${Date.now()}`}
                          alt="Genosys Middle East FZ-LLC"
                          width={200}
                          height={60}
                          className="mb-2"
                          priority={false}
                        />
                      </div>
                      <p className="text-sm mt-4">Official Distributor in the UAE</p>
                      <p className="mt-2">&copy; 2025 Genosys Middle East FZ-LLC. All rights reserved.</p>
                    </div>
                  </div>
                </footer>
              </ServiceWorkerProvider>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
