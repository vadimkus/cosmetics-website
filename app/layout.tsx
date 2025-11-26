import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
import LocaleWrapper from '@/components/LocaleWrapper'
import Footer from '@/components/Footer'

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
    languages: {
      'en': 'https://genosys.ae',
      'ar': 'https://genosys.ae/ar',
    },
  },
  icons: {
    icon: [
      { url: '/favicon/genosys-official-favicon.ico', type: 'image/x-icon', sizes: '32x32' },
      { url: '/favicon/genosys-official.ico', type: 'image/x-icon', sizes: '16x16' },
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '32x32' }
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
  // Default to English, will be updated by client-side locale detection
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Set locale and direction IMMEDIATELY - This script MUST run before any React code */}
        {/* Using blocking script tag (not Next.js Script) to ensure it runs synchronously */}
        {/* This script runs synchronously and blocks rendering until it completes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Run IMMEDIATELY - this must execute before React hydrates
                  // Try multiple ways to get the path
                  var path = (window.location && window.location.pathname) || 
                            (document.location && document.location.pathname) || 
                            (typeof location !== 'undefined' && location.pathname) || '';
                  
                  // Check if path starts with /ar
                  var isArabic = path.startsWith('/ar');
                  var lang = isArabic ? 'ar' : 'en';
                  var dir = isArabic ? 'rtl' : 'ltr';
                  
                  // Get HTML element - it should exist immediately
                  var html = document.documentElement;
                  if (!html) return;
                  
                  // Set all possible ways to ensure it sticks - do this synchronously
                  html.setAttribute('lang', lang);
                  html.setAttribute('dir', dir);
                  html.setAttribute('data-locale', lang);
                  html.setAttribute('data-dir', dir);
                  if (html.lang !== undefined) html.lang = lang;
                  if (html.dir !== undefined) html.dir = dir;
                  html.style.setProperty('direction', dir, 'important');
                  
                  // Also set on body if it exists
                  if (document.body) {
                    document.body.setAttribute('dir', dir);
                    document.body.setAttribute('data-dir', dir);
                    document.body.style.setProperty('direction', dir, 'important');
                  }
                  
                  // Watch for body creation if it doesn't exist yet
                  if (!document.body) {
                    var observer = new MutationObserver(function(mutations) {
                      if (document.body) {
                        document.body.setAttribute('dir', dir);
                        document.body.setAttribute('data-dir', dir);
                        document.body.style.setProperty('direction', dir, 'important');
                        observer.disconnect();
                      }
                    });
                    observer.observe(document.documentElement, { childList: true });
                  }
                  
                  // Store in a way that's immediately accessible
                  if (typeof window !== 'undefined') {
                    window.__GENOSYS_DIR__ = dir;
                    window.__GENOSYS_LANG__ = lang;
                  }
                } catch(e) {
                  // Silently fail - don't break the page
                }
              })();
            `,
          }}
        />
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
      <body className={`${inter.className} flex flex-col min-h-screen`} suppressHydrationWarning>
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
                <LocaleWrapper>
                  <Header />
                  <main className="flex-1">
                    <ErrorBoundary>
                      {children}
                    </ErrorBoundary>
                  </main>
                </LocaleWrapper>
                <Footer />
              </ServiceWorkerProvider>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
