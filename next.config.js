/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // CDN Configuration
  assetPrefix: process.env.CDN_URL || '',
  
  // Disable ESLint during build to avoid configuration conflicts
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Experimental optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react', // Tree-shake icon imports
      '@prisma/client', // Optimize Prisma imports
    ],
    // Enable modern bundling
    esmExternals: true,
    // Optimize CSS - disabled due to critters dependency
    // optimizeCss: true,
  },
  
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
    // Enhanced image optimization
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Enhanced compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: false, // Not using styled-components
  },
  
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
              priority: 5,
            },
            // Separate chunk for large libraries
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 20,
            },
            // Separate chunk for UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](@heroicons|lucide-react)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 15,
            },
            // Separate chunk for product components
            product: {
              test: /[\\/]components[\\/]product[\\/]/,
              name: 'product',
              chunks: 'all',
              priority: 12,
            },
            // Separate chunk for profile components
            profile: {
              test: /[\\/]components[\\/]profile[\\/]/,
              name: 'profile',
              chunks: 'all',
              priority: 12,
            },
            // Separate chunk for shared components
            shared: {
              test: /[\\/]components[\\/]shared[\\/]/,
              name: 'shared',
              chunks: 'all',
              priority: 11,
            },
          },
        },
        // Enable module concatenation
        concatenateModules: true,
        // Enable side effects optimization
        sideEffects: false,
      }
    }
    
    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)