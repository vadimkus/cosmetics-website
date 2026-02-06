'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Smartphone, Monitor, Zap, Battery, Wifi } from 'lucide-react'

export default function MobileOptimizedDemo() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('mobile')
  const [performanceMode, setPerformanceMode] = useState<'high' | 'standard' | 'low'>('standard')
  const prefersReducedMotion = useReducedMotion()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: scrollRef })
  
  // Transform values based on scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1])
  
  useEffect(() => {
    const checkDevice = () => {
      setDeviceType(window.innerWidth < 768 ? 'mobile' : 'desktop')
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])
  
  // Performance-based animation configs
  const getAnimationConfig = (baseConfig: Record<string, unknown> & { duration?: number }) => {
    if (prefersReducedMotion) return { duration: 0 }
    
    switch (performanceMode) {
      case 'low':
        return { ...baseConfig, duration: (baseConfig.duration ?? 0) * 0.5 }
      case 'high':
        return { ...baseConfig, type: "spring", stiffness: 150 }
      default:
        return baseConfig
    }
  }
  
  const mobileCards = [
    { 
      title: 'Touch Optimized', 
      description: 'Large touch targets, haptic feedback simulation',
      color: 'bg-blue-500',
      icon: Smartphone 
    },
    { 
      title: 'Battery Efficient', 
      description: 'Minimal animations, GPU acceleration',
      color: 'bg-green-500',
      icon: Battery 
    },
    { 
      title: 'Network Aware', 
      description: 'Reduced animations on slow connections',
      color: 'bg-purple-500',
      icon: Wifi 
    },
    { 
      title: 'Performance First', 
      description: 'Hardware acceleration, 60fps target',
      color: 'bg-orange-500',
      icon: Zap 
    }
  ]
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Mobile Optimized Animations
      </h2>
      
      {/* Device & Performance Controls */}
      <div className="mb-8 space-y-4">
        {/* Device Type Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm font-medium text-gray-600">Device:</span>
          <div className="bg-gray-100 rounded-lg p-1 flex">
            {['mobile', 'desktop'].map((type) => (
              <motion.button
                key={type}
                onClick={() => setDeviceType(type as 'mobile' | 'desktop')}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2
                  ${deviceType === type ? 'bg-white shadow-md text-gray-800' : 'text-gray-600'}
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {type === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Performance Mode */}
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm font-medium text-gray-600">Performance:</span>
          <div className="bg-gray-100 rounded-lg p-1 flex">
            {['low', 'standard', 'high'].map((mode) => (
              <motion.button
                key={mode}
                onClick={() => setPerformanceMode(mode as 'high' | 'standard' | 'low')}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-all
                  ${performanceMode === mode ? 'bg-white shadow-md text-gray-800' : 'text-gray-600'}
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile-Optimized Card Grid */}
      <motion.div 
        className={`
          grid gap-4 mb-8
          ${deviceType === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}
        `}
        layout
        transition={{ duration: 0.3 }}
      >
        {mobileCards.map((card, index) => {
          const IconComponent = card.icon
          
          const animationProps = {
            key: card.title,
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            transition: getAnimationConfig({ 
              delay: index * 0.1, 
              duration: 0.5 
            }),
            whileTap: { 
              scale: 0.98,
              transition: { duration: 0.1 }
            },
            ...(deviceType === 'desktop' ? {
              whileHover: { 
                y: -4,
                transition: getAnimationConfig({ duration: 0.2 })
              }
            } : {})
          }
          
          return (
            <motion.div
              {...animationProps}
              className={`
                ${card.color} text-white p-6 rounded-xl shadow-lg
                ${deviceType === 'mobile' ? 'min-h-[120px]' : 'min-h-[140px]'}
                cursor-pointer transform-gpu will-change-transform
              `}
              style={{
                // Enable hardware acceleration
                backfaceVisibility: 'hidden',
                perspective: 1000,
              }}
            >
              <div className="flex items-start space-x-4">
                <motion.div
                  animate={performanceMode === 'high' ? {
                    rotate: [0, 360],
                    transition: { duration: 8, repeat: Infinity, ease: "linear" }
                  } : {}}
                  className="flex-shrink-0"
                >
                  <IconComponent className="w-8 h-8" />
                </motion.div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                  <p className={`
                    text-sm opacity-90 leading-relaxed
                    ${deviceType === 'mobile' ? 'text-base' : 'text-sm'}
                  `}>
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
      
      {/* Scroll-Based Animation Demo */}
      <div className="bg-white rounded-xl border p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Scroll-Based Animations
        </h3>
        
        <div 
          ref={scrollRef}
          className="h-64 overflow-y-auto bg-gradient-to-b from-blue-50 to-purple-50 rounded-lg p-6 scroll-smooth"
        >
          <motion.div
            style={performanceMode !== 'low' ? { y, scale } : {}}
            className="space-y-8"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0,
                  transition: getAnimationConfig({ duration: 0.6, delay: i * 0.1 })
                }}
                viewport={{ once: true, margin: "-20px" }}
                className={`
                  p-4 bg-white rounded-lg shadow-sm border-l-4 
                  ${i % 2 === 0 ? 'border-l-blue-500' : 'border-l-purple-500'}
                `}
              >
                <h4 className="font-medium text-gray-800">Scroll Item {i + 1}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  This item animates when it comes into view. 
                  Performance mode: <strong>{performanceMode}</strong>
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Performance Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border"
      >
        <h3 className="font-semibold mb-3 text-gray-800 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          Mobile Optimization Features:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <ul className="space-y-2">
            <li>• <strong>Hardware Acceleration:</strong> Uses transform-gpu and will-change</li>
            <li>• <strong>Reduced Motion:</strong> Respects user accessibility preferences</li>
            <li>• <strong>Touch Targets:</strong> Larger interactive areas for mobile</li>
            <li>• <strong>Performance Modes:</strong> Adjustable complexity based on device</li>
          </ul>
          <ul className="space-y-2">
            <li>• <strong>Viewport Optimization:</strong> Animations only when visible</li>
            <li>• <strong>Battery Efficiency:</strong> Minimal CPU usage on low-end devices</li>
            <li>• <strong>Network Awareness:</strong> Reduced animations on slow connections</li>
            <li>• <strong>60fps Target:</strong> Smooth animations that don't block UI</li>
          </ul>
        </div>
        
        {prefersReducedMotion && (
          <div className="mt-4 p-3 bg-blue-100 rounded-md">
            <p className="text-sm text-blue-800">
              ♿ <strong>Accessibility Mode:</strong> Reduced motion detected - animations are minimized for better accessibility.
            </p>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-green-100 rounded-md">
          <p className="text-sm text-green-800">
            📱 <strong>Current Device:</strong> {deviceType} | 
            ⚡ <strong>Performance:</strong> {performanceMode} | 
            🎯 <strong>FPS Target:</strong> {performanceMode === 'low' ? '30fps' : '60fps'}
          </p>
        </div>
      </motion.div>
    </div>
  )
}