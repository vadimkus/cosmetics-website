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
  serverExternalPackages: ['jsdom', 'isomorphic-dompurify'],
  
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
        search: '',
      },
      {
        pathname: '/Logo/**',
        search: '',
      },
      {
        pathname: '/favicon/**',
        search: '',
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
}

module.exports = withBundleAnalyzer(nextConfig)