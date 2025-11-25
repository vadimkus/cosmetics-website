/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Optimize package imports (Next.js 16)
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Server-side packages that shouldn't be bundled (fixes jsdom version warning)
  // Prisma client must be external in serverless environments to access generated client
  serverExternalPackages: ['jsdom', 'isomorphic-dompurify', '@prisma/client', 'prisma'],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
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
    ],
    // Optimize images with modern formats - AVIF first (better compression), then WebP fallback
    formats: ['image/avif', 'image/webp'],
    // Enable image optimization
    unoptimized: false,
    loader: 'default',
    // Image optimization settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimum quality for AVIF (better compression than WebP)
    minimumCacheTTL: 60,
    // Image quality options
    qualities: [75, 85, 90],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Enhanced compiler options
  compiler: {
    // Don't remove console.log in production - we need it for build logs
    removeConsole: false,
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Turbopack configuration (Next.js 16)
  turbopack: {},
}

module.exports = withBundleAnalyzer(nextConfig)