'use client'

import { useState, useRef, useCallback } from 'react'
import { CartItem as CartItemType } from '@/types'
import { useCart } from './CartProvider'
import { useAuth } from './AuthProvider'
import { Minus, Plus, Trash2, Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion'
import { useAnimationStore } from '@/lib/animationStore'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'
import { useTranslation } from '@/hooks/useTranslation'
import { getProductColorOptions } from '@/utils/productPricing'
import { translateCategory } from '@/utils/categoryTranslations'
import { translateSize } from '@/utils/sizeTranslations'
import { 
  springPresets, 
  calculateSwipeAction
} from '@/lib/appleAnimations'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, updateColor } = useCart()
  const { user } = useAuth()
  const { t, dir, locale } = useTranslation()
  const { product, quantity, selectedColor, selectedSize } = item
  const { enabled: animationsEnabled } = useAnimationStore()
  
  // Swipe-to-delete state
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteHint, setShowDeleteHint] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  
  // Transform x position to delete background opacity and scale
  const deleteOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0])
  const deleteScale = useTransform(x, [-150, -50, 0], [1, 0.8, 0.5])
  const deleteIconRotate = useTransform(x, [-150, 0], [0, 45])
  
  // Check if this is CHARMING LOOK BEAUTY BOX (productNumber '57')
  const isCharmingLookBeautyBox = product.productNumber === '57' || product.id === '57'
  
  // Check if this is the cushion product (ID 41)
  const isCushionProduct = product.id === '41' || product.productNumber === '41'
  
  // Get cushion color options (product 41 has colors: Beige, Ivory, Camel)
  const cushionColorOptions = (isCharmingLookBeautyBox || isCushionProduct) ? getProductColorOptions('41') : []
  
  // Use selectedSize/selectedColor if available, otherwise fallback to product size
  const displaySize = (selectedSize && selectedSize.trim()) || (product.size && product.size.trim()) || null
  const displayColor = (selectedColor && selectedColor.trim()) || null
  const currentCushionColor = displayColor || (cushionColorOptions.length > 0 && cushionColorOptions[0] ? cushionColorOptions[0].value : null)
  
  // Show color selector if: beauty box OR cushion product (always show for both)
  const showColorSelector = (isCharmingLookBeautyBox || isCushionProduct) && cushionColorOptions.length > 0
  
  // Swipe gesture handlers
  const handleDragStart = useCallback(() => {
    setShowDeleteHint(true)
  }, [])
  
  const handleDrag = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Show delete hint when swiping left
    if (info.offset.x < -30) {
      setShowDeleteHint(true)
    }
  }, [])
  
  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const containerWidth = containerRef.current?.offsetWidth || 300
    const action = calculateSwipeAction(info.offset.x, info.velocity.x, containerWidth)
    
    if (action === 'delete' && info.offset.x < 0) {
      // Trigger delete animation
      setIsDeleting(true)
      setTimeout(() => {
        removeItem(product.id, selectedColor, selectedSize)
      }, 300)
    } else {
      // Snap back
      setShowDeleteHint(false)
    }
  }, [product.id, selectedColor, selectedSize, removeItem])

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity, selectedColor, selectedSize)
  }

  const handleRemove = () => {
    setIsDeleting(true)
    setTimeout(() => {
      removeItem(product.id, selectedColor, selectedSize)
    }, 300)
  }
  
  const handleCushionColorChange = (newColor: string) => {
    updateColor(product.id, newColor, selectedColor, selectedSize)
  }
  
  // Get drag constraints based on RTL
  const isRTL = dir === 'rtl'
  const containerWidth = containerRef.current?.offsetWidth || 300
  const dragConstraints = isRTL 
    ? { left: 0, right: containerWidth * 0.5 }
    : { left: -containerWidth * 0.5, right: 0 }

  return (
    <motion.div 
      ref={containerRef}
      layout
      initial={animationsEnabled ? { opacity: 0, y: 20, scale: 0.95 } : false}
      animate={{ 
        opacity: isDeleting ? 0 : 1, 
        y: 0, 
        scale: isDeleting ? 0.9 : 1,
        x: isDeleting ? (isRTL ? 200 : -200) : 0,
      }}
      exit={{ 
        opacity: 0, 
        y: -10, 
        x: isRTL ? 100 : -100, 
        scale: 0.9,
      }}
      transition={animationsEnabled ? { 
        ...springPresets.default,
        layout: { ...springPresets.snappy }
      } : { duration: 0 }}
      className="relative overflow-hidden rounded-lg shadow-sm border bg-white"
      style={{ 
        viewTransitionName: `cart-item-${product.id}`,
      }}
    >
      {/* Swipe Delete Background */}
      <AnimatePresence>
        {showDeleteHint && animationsEnabled && (
          <motion.div 
            className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} w-24 bg-gradient-to-l from-red-500 to-red-600 flex items-center justify-center`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={springPresets.snappy}
            style={{
              opacity: deleteOpacity,
              scale: deleteScale,
            }}
          >
            <motion.div
              style={{ rotate: deleteIconRotate }}
              className="text-white"
            >
              <Trash2 className="h-6 w-6" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Swipeable Content */}
      <motion.div
        drag={animationsEnabled ? "x" : false}
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ x }}
        whileTap={animationsEnabled ? { cursor: 'grabbing' } : {}}
        className="relative bg-white p-3 md:p-4 z-10"
      >
      <div className={`flex items-start gap-3 md:gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        {/* Left: Product Image + Size */}
        <div className="flex flex-col flex-shrink-0">
          <Link href={`/products/${product.id}`} className="relative w-20 h-20 md:w-24 md:h-24 hover:opacity-80 transition-opacity">
            <Image
              src={product.image}
              alt={`${product.name} - GENOSYS Korean ${product.category || 'dermacosmetics'} product in cart`}
              fill
              className="object-cover rounded-lg cursor-pointer"
              sizes="(max-width: 640px) 80px, 96px"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </Link>
          {/* Size below image */}
          {displaySize && (
            <span className="mt-2 text-center text-[10px] md:text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded px-1 py-0.5">
              {t('product.size')}: {translateSize(displaySize, locale, product.category)}
            </span>
          )}
        </div>
        
        {/* Middle: Product Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-xs md:text-base font-bold text-gray-900 break-words hover:text-primary-600 transition-colors cursor-pointer leading-tight mb-1">{product.name}</h3>
          </Link>
          <p className="text-xs md:text-sm text-red-600 mb-2">{translateCategory(product.category, locale)}</p>
          
          {/* Cushion Color Selector for CHARMING LOOK BEAUTY BOX or Cushion Product */}
          {showColorSelector && (
            <div className="mb-3 md:mb-4">
              <label className={`block text-[10px] md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 whitespace-nowrap ${dir === 'rtl' ? 'text-right' : ''}`}>
                {isCharmingLookBeautyBox ? t('cart.selectCushionColor') : `${t('product.color')}:`}
              </label>
              <div className={`flex flex-nowrap gap-1 md:gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {cushionColorOptions.map((color) => {
                  const isSelected = (currentCushionColor || '') === color.value
                  return (
                    <button
                      key={color.value}
                      onClick={() => handleCushionColorChange(color.value)}
                      className={`px-2 md:px-4 py-1 md:py-2 rounded border transition-all touch-manipulation min-h-[32px] md:min-h-[44px] text-[10px] md:text-sm font-medium flex-shrink-0 ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm'
                          : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-label={`${t('product.color')}: ${color.label}`}
                      aria-pressed={isSelected}
                    >
                      {color.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          
          {/* Color badge for other products (not beauty box or cushion) - Size is shown below image */}
          {!isCharmingLookBeautyBox && !isCushionProduct && displayColor && (
            <div className="flex items-center gap-1.5 md:gap-2 mb-2 flex-nowrap overflow-x-auto">
              <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs lg:text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap flex-shrink-0">
                {t('product.color')}: {displayColor}
              </span>
            </div>
          )}
          
          {/* Price - Prominently displayed */}
          {canUserSeePrices(user) ? (
            <div className="mt-2">
              {(() => {
                const pricing = calculateDiscountedPrice(product, user)
                const totalPrice = pricing.discountedPrice * quantity
                const originalTotalPrice = pricing.originalPrice * quantity
                
                return (
                  <div>
                    {pricing.hasDiscount ? (
                      <div>
                        <div className={`flex items-baseline gap-1.5 flex-nowrap ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <p className="text-sm md:text-lg font-bold text-red-600 md:text-gray-900 whitespace-nowrap">
                            {totalPrice.toFixed(2)} AED
                          </p>
                          <p className="text-xs md:text-sm text-gray-500 line-through whitespace-nowrap">
                            {originalTotalPrice.toFixed(2)} AED
                          </p>
                        </div>
                        <div className={`flex items-center mt-0.5 flex-nowrap ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[10px] md:text-xs whitespace-nowrap">
                            <span className="font-medium text-green-600">{pricing.discountPercentage}% {t('product.off')}</span>
                            <span className="text-red-600"> {t('product.vatIncluded')}</span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-base md:text-lg font-bold text-red-600 md:text-gray-900">
                          {totalPrice.toFixed(2)} AED
                        </p>
                        <p className="text-xs text-red-600 mt-1">{t('product.vatIncluded')}</p>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          ) : (
            <div className={`flex items-center text-gray-500 mt-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Lock className={`h-4 w-4 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
              <span className="text-sm">{t('profile.priceAccessRequired')}</span>
            </div>
          )}
        </div>
        
        {/* Right: Quantity Controls + Delete */}
        <div className="flex flex-col items-center gap-1 md:gap-2 flex-shrink-0">
          <div className="flex items-center border rounded-lg">
            <motion.button
              onClick={() => handleQuantityChange(quantity - 1)}
              whileTap={animationsEnabled ? { scale: 0.9 } : {}}
              whileHover={animationsEnabled && quantity > 1 ? { scale: 1.05, backgroundColor: '#f3f4f6' } : {}}
              transition={animationsEnabled ? springPresets.snappy : {}}
              className="p-2 md:p-2.5 hover:bg-gray-100 transition-colors touch-manipulation flex items-center justify-center text-gray-700 hover:text-gray-900"
              disabled={quantity <= 1}
              aria-label={t('cart.decreaseQuantity')}
            >
              <Minus className="h-4 w-4 md:h-5 md:w-5" />
            </motion.button>
            <motion.span 
              key={quantity}
              initial={animationsEnabled ? { scale: 1.3, color: '#059669' } : {}}
              animate={animationsEnabled ? { scale: 1, color: '#000000' } : {}}
              transition={animationsEnabled ? springPresets.bouncy : {}}
              className="px-3 md:px-4 py-2 md:py-2.5 font-medium text-sm md:text-base text-black text-center min-w-[36px] md:min-w-[40px]"
            >
              {quantity}
            </motion.span>
            <motion.button
              onClick={() => handleQuantityChange(quantity + 1)}
              whileTap={animationsEnabled ? { scale: 0.9 } : {}}
              whileHover={animationsEnabled ? { scale: 1.05, backgroundColor: '#f3f4f6' } : {}}
              transition={animationsEnabled ? springPresets.snappy : {}}
              className="p-2 md:p-2.5 hover:bg-gray-100 transition-colors touch-manipulation flex items-center justify-center text-gray-700 hover:text-gray-900"
              aria-label={t('cart.increaseQuantity')}
            >
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
            </motion.button>
          </div>
          
          <motion.button
            onClick={handleRemove}
            whileTap={animationsEnabled ? { scale: 0.9 } : {}}
            whileHover={animationsEnabled ? { 
              scale: 1.1, 
              backgroundColor: '#fef2f2', 
              color: '#dc2626' 
            } : {}}
            transition={animationsEnabled ? springPresets.snappy : {}}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation ml-3 md:ml-0 -mt-1 md:mt-0"
            aria-label={t('cart.removeItem')}
          >
            <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
          </motion.button>
        </div>
      </div>
      </motion.div>
      
      {/* Swipe hint for mobile */}
      {animationsEnabled && (
        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-l from-red-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none md:hidden" />
      )}
    </motion.div>
  )
}
