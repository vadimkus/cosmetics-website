import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/CartProvider'
import AuthProvider from '@/components/AuthProvider'
import FavoritesProvider from '@/components/FavoritesProvider'
import Header from '@/components/Header'
import UserRefreshWrapper from '@/components/UserRefreshWrapper'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import { ServiceWorkerProvider } from '@/components/ServiceWorkerProvider'
import PageViewTracker from '@/components/PageViewTracker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://cosmetics-website-5jzy.vercel.app'),
  title: 'Genosys Middle East FZ-LLC - Premium Beauty Products',
  description: 'Discover our premium collection of cosmetics and beauty products',
  icons: {
    icon: [
      { url: '/favicon.ico?v=3', type: 'image/x-icon' },
      { url: '/favicon/genosys-logo.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico?v=3',
    apple: '/favicon/genosys-logo.png',
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
    siteName: 'Genosys Middle East FZ-LLC',
    title: 'Premium Beauty Products',
    description: 'Discover our premium collection of cosmetics and beauty products',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Genosys Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Genosys Middle East FZ-LLC - Premium Beauty Products',
    description: 'Discover our premium collection of cosmetics and beauty products',
    images: ['/images/genosys-products.jpg'],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <ServiceWorkerProvider>
                <PerformanceMonitor />
                <UserRefreshWrapper />
                {/* <PageViewTracker /> */}
                <Header />
                <main className="min-h-screen">
                  {children}
                </main>
              </ServiceWorkerProvider>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
