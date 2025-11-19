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
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Configure for Next.js 16 compatibility
    unoptimized: false,
    loader: 'default',
  },
  
  // Enhanced compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Turbopack configuration (Next.js 16)
  turbopack: {},
}

module.exports = withBundleAnalyzer(nextConfig)