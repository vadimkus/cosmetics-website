'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight, ArrowLeft, Home, ShoppingBag, Info, Mail } from 'lucide-react'

const pages = [
  { 
    id: 'home', 
    title: 'Home Page', 
    color: 'from-rose-500 to-pink-600', 
    content: 'Welcome to GENOSYS',
    description: 'Discover premium Korean dermacosmetics',
    icon: Home
  },
  { 
    id: 'products', 
    title: 'Products Page', 
    color: 'from-blue-500 to-indigo-600', 
    content: 'Our Product Collection',
    description: 'Professional skincare solutions',
    icon: ShoppingBag
  },
  { 
    id: 'about', 
    title: 'About Page', 
    color: 'from-green-500 to-emerald-600', 
    content: 'About Our Brand',
    description: 'Korean beauty innovation since 2010',
    icon: Info
  },
  { 
    id: 'contact', 
    title: 'Contact Page', 
    color: 'from-purple-500 to-violet-600', 
    content: 'Get In Touch',
    description: 'Dubai | Abu Dhabi | UAE',
    icon: Mail
  }
]

const pageVariants = {
  slideLeft: {
    initial: { opacity: 0, x: 300, scale: 0.9 },
    enter: { 
      opacity: 1, 
      x: 0, 
      scale: 1
    },
    exit: { 
      opacity: 0, 
      x: -300, 
      scale: 0.9
    }
  },
  fade: {
    initial: { opacity: 0, scale: 0.95 },
    enter: { 
      opacity: 1, 
      scale: 1
    },
    exit: { 
      opacity: 0, 
      scale: 1.05
    }
  },
  flip: {
    initial: { opacity: 0, rotateY: -90, scale: 0.8 },
    enter: { 
      opacity: 1, 
      rotateY: 0, 
      scale: 1
    },
    exit: { 
      opacity: 0, 
      rotateY: 90, 
      scale: 0.8
    }
  }
}

export default function PageTransitionDemo() {
  const [currentPage, setCurrentPage] = useState(0)
  const [transitionType, setTransitionType] = useState<'slideLeft' | 'fade' | 'flip'>('slideLeft')
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length)
  }
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length)
  }
  
  const currentPageData = pages[currentPage]
  
  if (!currentPageData) {
    return null
  }
  
  const IconComponent = currentPageData.icon
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Page Transition Effects
      </h2>
      
      {/* Transition Type Selector */}
      <div className="mb-6 flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1 flex space-x-1">
          {Object.keys(pageVariants).map((type) => (
            <motion.button
              key={type}
              onClick={() => setTransitionType(type as any)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-all
                ${transitionType === type ? 'bg-white shadow-md text-gray-800' : 'text-gray-600 hover:text-gray-800'}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Demo Area */}
      <div className="relative h-80 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPageData.id}-${transitionType}`}
            variants={pageVariants[transitionType]}
            initial="initial"
            animate="enter"
            exit="exit"
            className={`
              absolute inset-0 bg-gradient-to-br ${currentPageData.color}
              flex items-center justify-center text-white text-center
            `}
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mb-4"
              >
                <IconComponent className="w-12 h-12 mx-auto mb-4" />
              </motion.div>
              
              <motion.h3 
                className="text-3xl font-bold mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                {currentPageData.title}
              </motion.h3>
              
              <motion.p 
                className="text-lg opacity-90 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {currentPageData.content}
              </motion.p>
              
              <motion.p 
                className="text-sm opacity-75"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                {currentPageData.description}
              </motion.p>
            </div>
            
            {/* Floating decoration */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-8 right-8 w-16 h-16 border-2 border-white border-opacity-20 rounded-full"
            />
            <motion.div
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-8 left-8 w-12 h-12 bg-white bg-opacity-10 rounded-full"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-center items-center mt-6 space-x-6">
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevPage}
          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg hover:shadow-md transition-all border"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </motion.button>
        
        <div className="flex space-x-2">
          {pages.map((page, index) => (
            <motion.button
              key={page.id}
              onClick={() => setCurrentPage(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-200
                ${index === currentPage ? 'bg-rose-600 w-8' : 'bg-gray-300 hover:bg-gray-400'}
              `}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextPage}
          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg hover:shadow-md transition-all border"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border"
      >
        <h3 className="font-semibold mb-3 text-gray-800">🔄 Transition Features:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <ul className="space-y-2">
            <li>• <strong>Slide Left:</strong> Pages slide horizontally with scale effect</li>
            <li>• <strong>Fade:</strong> Simple opacity transition with subtle scale</li>
            <li>• <strong>Flip:</strong> 3D rotation effect for dramatic transitions</li>
          </ul>
          <ul className="space-y-2">
            <li>• <strong>Wait mode:</strong> Previous page exits before new one enters</li>
            <li>• <strong>Custom easing:</strong> Professional cubic-bezier timing</li>
            <li>• <strong>Content animation:</strong> Staggered text and icon entrance</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}