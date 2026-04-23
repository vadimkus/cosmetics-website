import type { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic } from 'next/font/google'
import Script from 'next/script'
import { headers } from 'next/headers'
import './globals.css'
import { getLocaleFromPath } from '@/lib/i18n'
import { loadMessages } from '@/lib/messagesServer'
import { MessagesProvider } from '@/components/i18n/MessagesProvider'

/**
 * Typography System - Font Loading Strategy
 * 
 * Primary: SF Pro Display/Text (Apple devices - loaded via system font stack)
 * Fallback: Inter (loaded as variable font for non-Apple devices)
 * Arabic: Noto Sans Arabic (loaded for Arabic language support)
 * 
 * Inter is loaded with:
 * - Variable font support for optimal file size and flexibility
 * - Multiple axes: weight (100-900)
 * - Subsets: latin, latin-ext, cyrillic (for Russian support)
 * - Display: swap for better loading performance
 * 
 * Noto Sans Arabic is loaded with:
 * - Variable font for Arabic script
 * - Subset: arabic
 * - Display: swap for performance
 */
import { CartProvider } from '@/components/cart/CartProvider'
import AuthProvider from '@/components/auth/AuthProvider'
import { ToastProvider } from '@/components/ToastProvider'
import FavoritesProvider from '@/components/FavoritesProvider'
import Header from '@/components/header/Header'
import UserRefreshWrapper from '@/components/UserRefreshWrapper'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import { ServiceWorkerProvider } from '@/components/pwa/ServiceWorkerProvider'
import PageViewTracker from '@/components/PageViewTracker'
import OrganizationSchema from '@/components/schema/OrganizationSchema'
import LocalBusinessSchema from '@/components/schema/LocalBusinessSchema'
import WebSiteSchema from '@/components/schema/WebSiteSchema'
import ErrorBoundary from '@/components/ErrorBoundary'
import LocaleWrapper from '@/components/LocaleWrapper'
import Footer from '@/components/footer/Footer'
import { PullToRefresh } from '@/components/PullToRefresh'
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt'
import PageTransition from '@/components/PageTransition'
import ServiceWorkerUpdateNotification from '@/components/pwa/ServiceWorkerUpdateNotification'
import StorageQuotaMonitor from '@/components/StorageQuotaMonitor'
import AppleSplashScreens from '@/components/AppleSplashScreens'
import LocaleManifest from '@/components/LocaleManifest'
import MobileFooterNav from '@/components/footer/MobileFooterNav'
import MobileWebFooterNav from '@/components/footer/MobileWebFooterNav'
import PWAHeader from '@/components/pwa/PWAHeader'
import MobileWebHeader from '@/components/header/MobileWebHeader'
import PWASplashScreen from '@/components/pwa/PWASplashScreen'
import { SyncStatusIndicator } from '@/components/SyncStatusIndicator'
import NetworkStatus from '@/components/NetworkStatus'
import SkipToContent from '@/components/SkipToContent'
// Lazy load ChatWidget via client wrapper (uses AI SDK, renders on every page)
import ChatWidgetLazy from '@/components/ChatWidgetLazy'
import { getSiteUrl } from '@/lib/siteConfig'

const inter = Inter({ 
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  // Preload specific weights for better performance
  // Variable fonts include all weights, but we hint the most common ones
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-arabic',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
  fallback: [
    'Tahoma',
    'Arial',
    'sans-serif',
  ],
})

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
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
  // Search engine verification codes (replace with actual codes from each platform)
  // Get these from: Google Search Console, Bing Webmaster, Yandex Webmaster
  verification: {
    // google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    // yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
    other: {
      // 'msvalidate.01': 'YOUR_BING_VERIFICATION_CODE',
    },
  },
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
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '16x16 32x32' },
      { url: '/favicon/genosys-official-favicon.ico', type: 'image/x-icon', sizes: '16x16 32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512x512.png', type: 'image/png', sizes: '512x512' }
    ],
    shortcut: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon/genosys-official-favicon.ico', type: 'image/x-icon' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
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
    email: false,
    address: false,
  },
  // Geo-targeting meta tags for UAE/Dubai market
  // Search console verification placeholders (replace with actual values)
  other: {
    'geo.region': 'AE-DU',
    'geo.placename': 'Dubai',
    'geo.position': '25.2048;55.2708',
    'ICBM': '25.2048, 55.2708',
    // Google Search Console verification (replace YOUR_CODE with actual verification code)
    // 'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE',
    // Bing Webmaster Tools verification (replace YOUR_CODE with actual verification code)
    // 'msvalidate.01': 'YOUR_BING_VERIFICATION_CODE',
    // Yandex Webmaster verification (replace YOUR_CODE with actual verification code)
    // 'yandex-verification': 'YOUR_YANDEX_VERIFICATION_CODE',
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
    { media: '(prefers-color-scheme: dark)', color: '#1c1c1e' }
  ],
  colorScheme: 'light dark',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Detect locale on the server from the x-pathname header set by proxy.ts.
  // This lets us load only ONE locale's messages into the client payload
  // instead of shipping all three. Falls back to English when the header is
  // missing (static generation or first request before middleware runs).
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? '/'
  const locale = getLocaleFromPath(pathname)
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const messages = loadMessages(locale)

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Preload hero video poster for instant LCP on homepage */}
        <link rel="preload" href="/images/genosys-video-poster.jpg" as="image" fetchPriority="high" />
        {/* Logo is preloaded automatically by Next.js <Image priority> in Logo.tsx */}
        
        {/* iOS Splash Screens for PWA */}
        <AppleSplashScreens />
        {/* Set locale and direction IMMEDIATELY - minimal blocking script for LCP */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname,a=p.startsWith('/ar'),r=p.startsWith('/ru'),l=a?'ar':r?'ru':'en',d=a?'rtl':'ltr',h=document.documentElement;h.lang=l;h.dir=d;h.setAttribute('data-locale',l);h.setAttribute('data-dir',d);h.style.setProperty('direction',d,'important');window.__GENOSYS_DIR__=d;window.__GENOSYS_LANG__=l;if(document.body){document.body.dir=d;document.body.setAttribute('data-dir',d);document.body.style.setProperty('direction',d,'important')}else{new MutationObserver(function(m,o){if(document.body){document.body.dir=d;document.body.setAttribute('data-dir',d);document.body.style.setProperty('direction',d,'important');o.disconnect()}}).observe(h,{childList:true})}}catch(e){}})()`,
          }}
        />
        {/* Theme initialization - prevents flash of wrong theme (minified for LCP) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('genosys-theme'),d=window.matchMedia('(prefers-color-scheme:dark)').matches,t=s==='dark'?'dark':s==='light'?'light':d?'dark':'light';document.documentElement.setAttribute('data-theme',t);document.documentElement.classList.add(t)}catch(e){}})()`,
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
      <body className={`${inter.className} ${inter.variable} ${notoSansArabic.variable} flex flex-col min-h-screen antialiased`} suppressHydrationWarning>
        {/* Skip to content link for keyboard/screen reader users */}
        <SkipToContent />
        <LocaleManifest />
        <WebSiteSchema />
        <OrganizationSchema />
        <LocalBusinessSchema />
        <MessagesProvider messages={messages} locale={locale}>
          <ToastProvider>
            <AuthProvider>
              <PWASplashScreen>
                <FavoritesProvider>
                  <CartProvider>
                    <ServiceWorkerProvider>
                      <PerformanceMonitor />
                      <UserRefreshWrapper />
                      <PageViewTracker />
                      <LocaleWrapper>
                        <PWAHeader />
                        <MobileWebHeader />
                        <Header />
                        <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
                          <ErrorBoundary>
                            <PullToRefresh>
                              <PageTransition>
                                {children}
                              </PageTransition>
                            </PullToRefresh>
                          </ErrorBoundary>
                        </main>
                      </LocaleWrapper>
                      <Footer />
                      <MobileFooterNav />
                      <MobileWebFooterNav />
                      <PWAInstallPrompt variant="banner" showDelay={60} />
                      <ServiceWorkerUpdateNotification />
                      <StorageQuotaMonitor />
                      <SyncStatusIndicator />
                      <NetworkStatus />
                      <ChatWidgetLazy />
                    </ServiceWorkerProvider>
                  </CartProvider>
                </FavoritesProvider>
              </PWASplashScreen>
            </AuthProvider>
          </ToastProvider>
        </MessagesProvider>
      </body>
    </html>
  )
}
