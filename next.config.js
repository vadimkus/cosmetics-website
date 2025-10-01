/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // Disable ESLint during build to avoid configuration conflicts
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Experimental optimizations - simplified
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    localPatterns: [
      {
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**',
      },
      {
        hostname: 'genosys.ae',
        pathname: '/images/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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