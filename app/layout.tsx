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
import LocalBusinessSchema from '@/components/LocalBusinessSchema'
import AggregateRatingSchema from '@/components/AggregateRatingSchema'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://genosys.ae'),
  title: 'GENOSYS Middle East FZ-LLC - Professional Korean Dermacosmetics & Microneedling Devices UAE',
  description: 'Official distributor of GENOSYS Korean dermacosmetics in UAE. Professional microneedling devices, skincare products, and beauty treatments. Free shipping over 1000 AED. Licensed practitioners only.',
  keywords: [
    'Korean dermacosmetics UAE',
    'GENOSYS Dubai',
    'microneedling devices UAE', 
    'professional skincare Dubai',
    'Korean beauty UAE',
    'dermacosmetics training UAE',
    'GENOSYS Middle East',
    'professional beauty Dubai',
    'Korean skincare UAE',
    'microneedling Dubai',
    'dermacosmetics products UAE',
    'professional beauty training UAE'
  ],
  authors: [{ name: 'GENOSYS Middle East FZ-LLC' }],
  creator: 'GENOSYS Middle East FZ-LLC',
  publisher: 'GENOSYS Middle East FZ-LLC',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://genosys.ae',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '32x32' },
      { url: '/favicon/genosys-official-favicon.ico', type: 'image/x-icon', sizes: '32x32' },
      { url: '/favicon/genosys-official.ico', type: 'image/x-icon', sizes: '16x16' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: [
      { url: '/favicon.ico', type: 'image/x-icon' }
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
    siteName: 'GENOSYS Middle East FZ-LLC',
    title: 'GENOSYS Middle East FZ-LLC - Professional Korean Dermacosmetics & Microneedling Devices UAE',
    description: 'Official distributor of GENOSYS Korean dermacosmetics in UAE. Professional microneedling devices, skincare products, and beauty treatments. Free shipping over 1000 AED.',
    url: 'https://genosys.ae',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-logo.png',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Middle East FZ-LLC - Professional Korean Dermacosmetics',
      },
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Professional Korean Dermacosmetics Products',
      },
    ],
    locale: 'en_AE',
    countryName: 'United Arab Emirates',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'GENOSYS Middle East FZ-LLC - Professional Korean Dermacosmetics UAE',
    description: 'Official distributor of GENOSYS Korean dermacosmetics in UAE. Professional microneedling devices and skincare products.',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-logo.png',
        alt: 'GENOSYS Middle East FZ-LLC - Professional Korean Dermacosmetics',
      }
    ],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' }
  ],
  colorScheme: 'light dark',
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
        <LocalBusinessSchema />
        <AggregateRatingSchema />
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
                <footer role="contentinfo" className="bg-white border-t border-gray-200 py-8" style={{ backgroundColor: 'white' }}>
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
                      <p className="text-sm mt-2">&copy; 2025 Genosys Middle East FZ-LLC. All rights reserved.</p>
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
