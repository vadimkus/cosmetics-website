/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

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
    ]
  },
  
  // Turbopack configuration (Next.js 16)
  turbopack: {},
}

module.exports = withBundleAnalyzer(nextConfig)