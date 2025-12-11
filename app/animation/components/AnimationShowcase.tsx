'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCardDemo from './ProductCardDemo'
import PageTransitionDemo from './PageTransitionDemo'
import MobileOptimizedDemo from './MobileOptimizedDemo'

const tabs = [
  { id: 'products', label: 'Product Cards', component: ProductCardDemo },
  { id: 'transitions', label: 'Page Transitions', component: PageTransitionDemo },
  { id: 'mobile', label: 'Mobile Optimized', component: MobileOptimizedDemo }
]

export default function AnimationShowcase() {
  const [activeTab, setActiveTab] = useState('products')
  
  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ProductCardDemo
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg p-1 shadow-md">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 rounded-md transition-all duration-200 font-medium relative
                ${activeTab === tab.id 
                  ? 'text-white' 
                  : 'text-gray-600 hover:text-gray-800'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-rose-600 rounded-md shadow-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}