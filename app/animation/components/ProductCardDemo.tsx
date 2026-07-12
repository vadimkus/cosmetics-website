'use client'

import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { useAnimationStore } from '@/lib/animationStore'

const demoProducts = [
  {
    id: 1,
    name: 'MULTI VITA RADIANCE CREAM',
    price: 299,
    originalPrice: 350,
    description: 'Advanced anti-aging cream with vitamins',
    rating: 4.8,
    reviews: 124,
    badge: 'Best Seller',
    image: '/images/EGF.jpg'
  },
  {
    id: 2,
    name: 'EyeCell СИСТЕМА УХОДА',
    price: 450,
    originalPrice: null,
    description: 'Professional eye care system',
    rating: 4.9,
    reviews: 89,
    badge: 'New',
    image: '/images/EC.jpg'
  },
  {
    id: 3,
    name: 'SKIN CARING ПОДУШКА',
    price: 180,
    originalPrice: 220,
    description: 'Skin caring cushion for spot treatment',
    rating: 4.7,
    reviews: 203,
    badge: 'Sale',
    image: '/images/overnight/main.jpeg'
  },
  {
    id: 4,
    name: 'SEA ALGAE SOOTHING MASK',
    price: 125,
    originalPrice: null,
    description: 'Hydrating sea algae face mask',
    rating: 4.6,
    reviews: 156,
    badge: null,
    image: '/images/sea_algae/Main.jpeg'
  },
  {
    id: 5,
    name: 'SNOW WHITE CLEANSER',
    price: 95,
    originalPrice: 110,
    description: 'Gentle brightening foam cleanser',
    rating: 4.5,
    reviews: 78,
    badge: null,
    image: '/images/SNOW.jpg'
  },
  {
    id: 6,
    name: 'HYDRATING BOOSTER',
    price: 320,
    originalPrice: null,
    description: 'Intensive hydration booster serum',
    rating: 4.9,
    reviews: 92,
    badge: 'Professional',
    image: '/images/HYDR.jpg'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.8 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1
  }
}

export default function ProductCardDemo() {
  const [favorites, setFavorites] = useState<number[]>([])
  const { enabled: animationsEnabled } = useAnimationStore()
  
  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    )
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Product Card Animations
      </h2>
      
      <motion.div 
        variants={animationsEnabled ? containerVariants : {}}
        initial={animationsEnabled ? "hidden" : {}}
        animate={animationsEnabled ? "show" : {}}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4"
      >
        {demoProducts.map((product) => {
          const MotionWrapper = animationsEnabled ? motion.div : 'div'
          const animationProps = animationsEnabled ? {
            variants: cardVariants,
            whileHover: { 
              y: -12
            },
            whileTap: { scale: 0.98 }
          } : {}
          
          return (
            <MotionWrapper
              key={product.id}
              {...animationProps}
              className="bg-white rounded-xl shadow-lg overflow-hidden border hover:shadow-2xl transition-shadow duration-300 relative"
            >
            {/* Badge */}
            {product.badge && (
              <motion.div
                initial={animationsEnabled ? { scale: 0, rotate: -12 } : {}}
                animate={animationsEnabled ? { scale: 1, rotate: -12 } : {}}
                transition={animationsEnabled ? { delay: 0.5, duration: 0.3, ease: "easeOut" } : {}}
                className={`
                  absolute top-3 left-3 z-10 px-2 py-1 text-xs font-bold rounded-md text-white
                  ${product.badge === 'Sale' ? 'bg-red-500' : 
                    product.badge === 'New' ? 'bg-green-500' : 
                    product.badge === 'Professional' ? 'bg-purple-600' : 'bg-blue-500'}
                `}
              >
                {product.badge}
              </motion.div>
            )}

            {/* Product Image */}
            <div className="relative overflow-hidden h-48 bg-gradient-to-br from-rose-50 to-rose-100">
              <motion.div
                whileHover={animationsEnabled ? { scale: 1.1 } : {}}
                transition={animationsEnabled ? { duration: 0.4 } : {}}
                className="w-full h-full relative"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Floating elements for visual interest */}
                <motion.div
                  animate={animationsEnabled ? { 
                    y: [-10, 10, -10],
                    rotate: [0, 360],
                  } : {}}
                  transition={animationsEnabled ? { 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : {}}
                  className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full"
                />
              </motion.div>
              
              {/* Favorite Button */}
              <motion.button
                whileHover={animationsEnabled ? { scale: 1.1 } : {}}
                whileTap={animationsEnabled ? { scale: 0.9 } : {}}
                onClick={() => toggleFavorite(product.id)}
                className={`
                  absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors
                  ${favorites.includes(product.id) ? 'bg-rose-500 text-white' : 'bg-white text-gray-400'}
                `}
              >
                <motion.div
                  animate={animationsEnabled && favorites.includes(product.id) ? { scale: [1, 1.3, 1] } : {}}
                  transition={animationsEnabled ? { duration: 0.3 } : {}}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                </motion.div>
              </motion.button>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <motion.h3 
                className="font-semibold text-gray-800 mb-2 text-sm leading-tight"
                layoutId={`product-title-${product.id}`}
              >
                {product.name}
              </motion.h3>
              
              <p className="text-sm text-gray-600 mb-3">
                {product.description}
              </p>
              
              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={animationsEnabled ? { scale: 0, rotate: 180 } : {}}
                      animate={animationsEnabled ? { scale: 1, rotate: 0 } : {}}
                      transition={animationsEnabled ? { delay: 0.7 + i * 0.1, duration: 0.2, ease: "easeOut" } : {}}
                    >
                      <Star 
                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  {product.rating} ({product.reviews})
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <motion.span 
                    className="text-lg font-bold text-rose-600"
                    layoutId={`product-price-${product.id}`}
                  >
                    AED {product.price}
                  </motion.span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      AED {product.originalPrice}
                    </span>
                  )}
                </div>
                
                <motion.button
                  whileHover={animationsEnabled ? { scale: 1.05 } : {}}
                  whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                  className="bg-rose-600 text-white p-2 rounded-lg hover:bg-rose-700 transition-colors shadow-md"
                >
                  <ShoppingCart className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </MotionWrapper>
        )
        })}
      </motion.div>

      {/* Animation Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">🎨 Animation Features:</h3>
          <div className={`
            flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium
            ${animationsEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}
          `}>
            <div className={`w-2 h-2 rounded-full ${animationsEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span>Animations {animationsEnabled ? 'ON' : 'OFF'}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <ul className="space-y-2">
            <li>• <strong>Staggered entrance:</strong> Cards appear with 0.15s delays</li>
            <li>• <strong>Spring animations:</strong> Natural bounce effect on load</li>
            <li>• <strong>Hover lift:</strong> Cards rise 12px with smooth easing</li>
            <li>• <strong>Image zoom:</strong> Product images scale 1.1x on hover</li>
          </ul>
          <ul className="space-y-2">
            <li>• <strong>Touch feedback:</strong> Scale to 0.98 on tap (mobile)</li>
            <li>• <strong>Floating badges:</strong> Animated product badges</li>
            <li>• <strong>Interactive favorites:</strong> Heart animation on toggle</li>
            <li>• <strong>Star ratings:</strong> Staggered star appearance</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}