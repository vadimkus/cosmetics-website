/** @type {import('next').NextConfig} */
const nextConfig = {
  // CDN Configuration
  assetPrefix: process.env.CDN_URL || '',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Add CDN hostname for images
      ...(process.env.CDN_URL ? [{
        protocol: 'https',
        hostname: new URL(process.env.CDN_URL).hostname,
        port: '',
        pathname: '/**',
      }] : []),
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // CDN optimization
    loader: process.env.CDN_URL ? 'custom' : 'default',
    loaderFile: process.env.CDN_URL ? './lib/cdn-loader.js' : undefined,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    // Explicitly disable all experimental features
    optimizePackageImports: [],
  },
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
