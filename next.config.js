/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // CDN Configuration
  assetPrefix: process.env.CDN_URL || '',
  
  // Enhanced minification and optimization
  swcMinify: true, // Use SWC minifier (faster than Terser)
  
  // Experimental optimizations
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    optimizePackageImports: [
      'lucide-react', // Tree-shake icon imports
      '@heroicons/react', // Tree-shake heroicons
      'react-icons', // Tree-shake react-icons if used
    ],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
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
          },
        },
        // Enable module concatenation
        concatenateModules: true,
        // Enable side effects optimization
        sideEffects: false,
      }
    }
    
    // Optimize imports for better tree shaking
    config.resolve.alias = {
      ...config.resolve.alias,
      // Optimize icon imports
      '@heroicons/react/24/outline': '@heroicons/react/24/outline/index.js',
      '@heroicons/react/24/solid': '@heroicons/react/24/solid/index.js',
    }
    
    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)
