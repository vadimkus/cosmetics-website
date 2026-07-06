/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  // Production optimizations
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  
  // React Compiler for automatic optimization (Next.js 16+)
  reactCompiler: true,
  
  // Optimize package imports (Next.js 16)
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // View Transitions API for smooth page navigation
    viewTransition: true,
  },
  
  // Server-side packages that shouldn't be bundled (fixes jsdom version warning)
  // Prisma client must be external in serverless environments to access generated client
  // Avoid bundling heavy server-only dependencies.
  // NOTE: HTML sanitization is kept dependency-free in `lib/sanitizeHtml.ts` to avoid
  // ESM/CJS conflicts that libraries like isomorphic-dompurify introduce on Turbopack SSR.
  serverExternalPackages: ['jsdom', '@prisma/client', 'prisma', '@prisma/adapter-pg', 'pg'],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Next.js 16: Allow query strings for local images
    localPatterns: [
      {
        pathname: '/images/**',
      },
      {
        pathname: '/Logo/**',
      },
      {
        pathname: '/favicon/**',
      },
      {
        pathname: '/blog/**',
      },
      {
        pathname: '/avatar/**',
      },
    ],
    // Advanced image optimization with AVIF and WebP
    formats: ['image/avif', 'image/webp'],
    unoptimized: false,
    loader: 'default',
    
    // Enhanced device sizes for better responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1536, 1920, 2048, 3840],
    
    // Extended image sizes for thumbnails and small images
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384, 512],
    
    // Longer cache TTL for better performance (24 hours)
    minimumCacheTTL: 86400,
    
    // Quality settings optimized for cosmetics product images
    // Higher quality for product photos to showcase details
        qualities: [70, 75, 80, 85, 90, 95],
    
    // SVG support with security
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // Additional optimization settings for Next.js 16
    contentDispositionType: 'inline',
  },
  
  // Enhanced compiler options
  compiler: {
    // Don't remove console.log in production - we need it for build logs
    removeConsole: false,
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Cache headers for static assets (improves Core Web Vitals on repeat visits)
  async headers() {
    return [
      {
        // Apple fetches this extensionless file for iOS Universal Links and
        // requires application/json (it does NOT follow redirects or accept
        // the default octet-stream type for extensionless public files).
        source: '/.well-known/apple-app-site-association',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/Logo/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/videos/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/favicon/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // The service worker MUST always be revalidated — if it ever gets a
        // long cache, users are frozen on an old version and never receive
        // updates. Enforce no-store in code (don't rely on Vercel defaults).
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, must-revalidate' },
        ],
      },
      {
        // Site-wide defensive headers. All additive and non-breaking — they do
        // NOT restrict script/frame sources, so Stripe.js, Google Analytics,
        // Google/Apple sign-in and the service worker keep working.
        // Deliberately NOT setting X-Frame-Options or an enforcing CSP here:
        // those risk breaking legit embedding / third-party scripts and need a
        // dedicated hardening pass (start with CSP report-only).
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          // camera=(self): skin-analysis camera. microphone=(self): voice search.
          // geolocation disabled (not used client-side).
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), geolocation=(), interest-cohort=()' },
        ],
      },
    ]
  },
  
  // www -> apex with a permanent 308 (Vercel's domain-level redirect is a
  // temporary 307, which keeps Google from consolidating signals on the apex)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.genosys.ae' }],
        destination: 'https://genosys.ae/:path*',
        permanent: true,
      },
    ]
  },

  // Turbopack configuration (Next.js 16)
  turbopack: {},
}

// Sentry wraps nextConfig first so its Turbopack/Webpack plugin and
// source-map upload hooks see the unmodified config. Bundle analyzer then
// wraps the result so `ANALYZE=true` still works end-to-end.
const sentryConfig = {
  // Org/project slugs are only needed for source-map upload. When they're
  // omitted (e.g. local builds, forks) Sentry still captures errors — it just
  // reports minified stack traces.
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only log source-map upload noise in CI.
  silent: !process.env.CI,

  // Upload wider set of maps so React Server Component traces resolve.
  widenClientFileUpload: true,

  // Sentry v10 moved these options into the webpack block. Tree-shake
  // debug logging for a smaller prod bundle, and skip Vercel Cron monitor
  // auto-registration (we're not using it yet).
  webpack: {
    treeshake: { removeDebugLogging: true },
    automaticVercelMonitors: false,
  },
}

module.exports = withBundleAnalyzer(withSentryConfig(nextConfig, sentryConfig))