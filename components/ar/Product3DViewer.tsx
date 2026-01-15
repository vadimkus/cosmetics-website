'use client'

/**
 * Product3DViewer - Stage 2 Foundation
 * 
 * This component provides a foundation for 3D product visualization using Three.js.
 * Currently prepared with placeholder implementation - ready for full 3D model integration.
 * 
 * Features planned for Stage 2:
 * - Load and display 3D product models (GLTF/GLB format)
 * - Interactive rotation and zoom
 * - AR placement using WebXR API
 * - Product texture/color variants
 * - Animation support for product demonstrations
 * 
 * Requirements:
 * - 3D models in GLTF/GLB format
 * - Optional: HDR environment maps for realistic lighting
 * - Product metadata for variant switching
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  RotateCcw, ZoomIn, ZoomOut, 
  Move3D, Package, Loader2, AlertCircle,
  Share2, Heart
} from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import { cn } from '@/lib/utils'

// Types for 3D product configuration
interface Product3DConfig {
  modelUrl?: string       // URL to GLTF/GLB model (Stage 2)
  textureUrl?: string     // Product texture/label
  fallbackImage: string   // 2D fallback image
  productName: string
  productId: string
  variants?: ProductVariant[]
}

interface ProductVariant {
  id: string
  name: string
  color?: string
  textureUrl?: string
}

interface Product3DViewerProps {
  config: Product3DConfig
  className?: string
  onClose?: () => void // Reserved for modal usage in Stage 2
  showARButton?: boolean
}

type ViewerState = 'loading' | 'ready' | 'error' | 'ar-mode'

export function Product3DViewer({
  config,
  className,
  // onClose reserved for modal usage in Stage 2
  showARButton = true,
}: Product3DViewerProps) {
  const { locale } = useTranslation()
  const haptic = useHapticFeedback()
  
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [viewerState, setViewerState] = useState<ViewerState>('loading')
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [isARSupported, setIsARSupported] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  // Translations
  const t = {
    loading: locale === 'ar' ? 'جاري تحميل النموذج...' : locale === 'ru' ? 'Загрузка модели...' : 'Loading model...',
    error: locale === 'ar' ? 'فشل تحميل النموذج' : locale === 'ru' ? 'Ошибка загрузки' : 'Failed to load model',
    tryAgain: locale === 'ar' ? 'حاول مرة أخرى' : locale === 'ru' ? 'Попробовать снова' : 'Try Again',
    viewInAR: locale === 'ar' ? 'عرض بالواقع المعزز' : locale === 'ru' ? 'Смотреть в AR' : 'View in AR',
    arNotSupported: locale === 'ar' ? 'AR غير مدعوم' : locale === 'ru' ? 'AR не поддерживается' : 'AR not supported',
    rotate: locale === 'ar' ? 'تدوير' : locale === 'ru' ? 'Вращать' : 'Rotate',
    zoomIn: locale === 'ar' ? 'تكبير' : locale === 'ru' ? 'Увеличить' : 'Zoom In',
    zoomOut: locale === 'ar' ? 'تصغير' : locale === 'ru' ? 'Уменьшить' : 'Zoom Out',
    reset: locale === 'ar' ? 'إعادة تعيين' : locale === 'ru' ? 'Сбросить' : 'Reset',
    share: locale === 'ar' ? 'مشاركة' : locale === 'ru' ? 'Поделиться' : 'Share',
    favorite: locale === 'ar' ? 'المفضلة' : locale === 'ru' ? 'В избранное' : 'Favorite',
    fullscreen: locale === 'ar' ? 'ملء الشاشة' : locale === 'ru' ? 'Полный экран' : 'Fullscreen',
    stage2Notice: locale === 'ar' 
      ? '3D قريباً - الصورة الحالية هي معاينة' 
      : locale === 'ru' 
        ? '3D скоро - текущее изображение превью' 
        : '3D coming soon - current image is preview',
    dragToRotate: locale === 'ar' ? 'اسحب للتدوير' : locale === 'ru' ? 'Перетащите для вращения' : 'Drag to rotate',
    pinchToZoom: locale === 'ar' ? 'اقرص للتكبير' : locale === 'ru' ? 'Щипок для масштаба' : 'Pinch to zoom',
  }

  // Check WebXR AR support
  useEffect(() => {
    checkARSupport()
    initializeViewer()
  }, [])

  const checkARSupport = async () => {
    if ('xr' in navigator) {
      try {
        const xrNav = navigator as unknown as { xr?: { isSessionSupported?: (mode: string) => Promise<boolean> } }
        const isSupported = await xrNav.xr?.isSessionSupported?.('immersive-ar')
        setIsARSupported(!!isSupported)
      } catch {
        setIsARSupported(false)
      }
    }
  }

  const initializeViewer = async () => {
    setViewerState('loading')
    
    try {
      // Stage 2: This is where Three.js scene initialization will happen
      // For now, we simulate loading and show fallback image
      
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate load time
      
      // In Stage 2, this will:
      // 1. Initialize Three.js scene, camera, renderer
      // 2. Load GLTF model from config.modelUrl
      // 3. Set up lighting (ambient + directional)
      // 4. Add OrbitControls for interaction
      // 5. Start render loop
      
      setViewerState('ready')
    } catch {
      // Error initializing 3D viewer - show fallback
      setViewerState('error')
    }
  }

  // Mouse/Touch interaction handlers (prepared for Stage 2)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    haptic.light()
  }, [haptic])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - dragStart.current.x
    const deltaY = e.clientY - dragStart.current.y
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5,
    }))
    
    dragStart.current = { x: e.clientX, y: e.clientY }
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && e.touches[0]) {
      setIsDragging(true)
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!isDragging || e.touches.length !== 1 || !touch) return
    
    const deltaX = touch.clientX - dragStart.current.x
    const deltaY = touch.clientY - dragStart.current.y
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.3,
      y: prev.y + deltaX * 0.3,
    }))
    
    dragStart.current = { x: touch.clientX, y: touch.clientY }
  }, [isDragging])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3))
    haptic.light()
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5))
    haptic.light()
  }

  const handleReset = () => {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
    haptic.medium()
  }

  const handleARView = async () => {
    if (!isARSupported) {
      haptic.error()
      return
    }
    
    haptic.success()
    setViewerState('ar-mode')
    
    // Stage 2: Initialize WebXR AR session
    // This will:
    // 1. Request 'immersive-ar' session
    // 2. Create XR reference space
    // 3. Render 3D model in AR
    // 4. Handle hit-testing for placement
    
    // For now, show coming soon message
    setTimeout(() => setViewerState('ready'), 2000)
  }

  const handleShare = async () => {
    haptic.light()
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: config.productName,
          text: locale === 'ar' 
            ? `شاهد ${config.productName} بتقنية 3D`
            : locale === 'ru'
              ? `Посмотрите ${config.productName} в 3D`
              : `Check out ${config.productName} in 3D`,
          url: window.location.href,
        })
      } catch {
        // User cancelled share action
      }
    }
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden',
        className
      )}
    >
      {/* Main Viewer Area */}
      <div 
        className="relative aspect-square w-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading State */}
        {viewerState === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
            <p className="text-gray-600 text-sm">{t.loading}</p>
          </div>
        )}

        {/* Error State */}
        {viewerState === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10">
            <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
            <p className="text-gray-700 mb-4">{t.error}</p>
            <button
              onClick={initializeViewer}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              {t.tryAgain}
            </button>
          </div>
        )}

        {/* AR Mode Overlay */}
        {viewerState === 'ar-mode' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
            <Move3D className="w-16 h-16 text-white animate-pulse mb-4" />
            <p className="text-white text-lg font-medium mb-2">
              {locale === 'ar' ? 'الواقع المعزز قريباً' : locale === 'ru' ? 'AR скоро' : 'AR Coming Soon'}
            </p>
            <p className="text-white/60 text-sm">Stage 2 Feature</p>
          </div>
        )}

        {/* 3D Canvas (Stage 2) / Fallback Image (Current) */}
        <canvas 
          ref={canvasRef} 
          className="hidden" // Will be shown in Stage 2
        />
        
        {/* Fallback Image with CSS 3D Transform */}
        <div 
          className="w-full h-full flex items-center justify-center p-8"
          style={{
            perspective: '1000px',
          }}
        >
          <div
            className="relative transition-transform duration-100"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
              transformStyle: 'preserve-3d',
            }}
          >
            <Image
              src={config.fallbackImage}
              alt={config.productName}
              width={400}
              height={400}
              className="max-w-full max-h-full object-contain drop-shadow-2xl"
              draggable={false}
            />
            
            {/* 3D Effect Shadow */}
            <div 
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/10 rounded-full blur-xl"
              style={{
                transform: `translateZ(-50px) scale(${zoom})`,
              }}
            />
          </div>
        </div>

        {/* Stage 2 Notice Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-primary-600/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
          <Package className="w-3.5 h-3.5" />
          <span>{t.stage2Notice}</span>
        </div>

        {/* Interaction Hints */}
        {viewerState === 'ready' && !isDragging && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-4 text-gray-500 text-xs">
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              {t.dragToRotate}
            </span>
            <span className="flex items-center gap-1">
              <ZoomIn className="w-3 h-3" />
              {t.pinchToZoom}
            </span>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent">
        <div className="flex items-center justify-between">
          {/* Left Controls: Zoom */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              title={t.zoomOut}
            >
              <ZoomOut className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleZoomIn}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              title={t.zoomIn}
            >
              <ZoomIn className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleReset}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              title={t.reset}
            >
              <RotateCcw className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Center: AR Button */}
          {showARButton && (
            <button
              onClick={handleARView}
              disabled={!isARSupported}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all',
                isARSupported
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              <Move3D className="w-5 h-5" />
              <span>{isARSupported ? t.viewInAR : t.arNotSupported}</span>
            </button>
          )}

          {/* Right Controls: Share, Favorite */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              title={t.share}
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              title={t.favorite}
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Variant Selector (Stage 2) */}
        {config.variants && config.variants.length > 0 && (
          <div className="mt-4 flex items-center gap-2 justify-center">
            {config.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => {
                  setSelectedVariant(variant.id)
                  haptic.light()
                }}
                className={cn(
                  'w-8 h-8 rounded-full border-2 transition-all',
                  selectedVariant === variant.id
                    ? 'border-primary-600 scale-110'
                    : 'border-gray-300 hover:border-gray-400'
                )}
                style={{ backgroundColor: variant.color || '#f3f4f6' }}
                title={variant.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Name */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
        <p className="text-sm font-medium text-gray-900">{config.productName}</p>
      </div>
    </div>
  )
}

export default Product3DViewer

/**
 * Stage 2 Implementation Notes:
 * 
 * 1. Three.js Scene Setup:
 *    - Use THREE.WebGLRenderer with alpha: true
 *    - Add THREE.AmbientLight (0xffffff, 0.6) + THREE.DirectionalLight (0xffffff, 0.8)
 *    - Use THREE.PerspectiveCamera with fov: 50
 * 
 * 2. Model Loading:
 *    - Use GLTFLoader from 'three/examples/jsm/loaders/GLTFLoader'
 *    - Support .glb and .gltf formats
 *    - Center model and auto-scale to fit viewport
 * 
 * 3. Controls:
 *    - Use OrbitControls from 'three/examples/jsm/controls/OrbitControls'
 *    - Enable damping for smooth rotation
 *    - Set min/max distance for zoom limits
 * 
 * 4. WebXR AR:
 *    - Check navigator.xr.isSessionSupported('immersive-ar')
 *    - Request session with requiredFeatures: ['hit-test']
 *    - Use XRHitTestSource for placement
 * 
 * 5. Performance:
 *    - Use draco-compressed models
 *    - Implement LOD (Level of Detail) for complex models
 *    - Dispose of resources on unmount
 */
