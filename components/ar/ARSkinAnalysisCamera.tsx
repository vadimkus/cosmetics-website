'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { 
  Camera, X, Sparkles, AlertCircle, Loader2, Sun, 
  Droplets, Target, Flame, Zap, Pause, Play,
  ChevronDown, ChevronUp
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import { cn } from '@/lib/utils'
import type { SkinAnalysisResult } from '@/components/SkinAnalysisCamera'

interface ARSkinAnalysisCameraProps {
  onAnalysisComplete: (result: SkinAnalysisResult) => void
  onClose: () => void
  className?: string
}

type ARState = 'initializing' | 'loading-model' | 'ready' | 'analyzing' | 'paused' | 'error'

interface LiveMetrics {
  oiliness: number
  hydration: number
  redness: number
  skinType: string
  confidence: number
  faceDetected: boolean
  lightingQuality: 'poor' | 'fair' | 'good' | 'excellent'
}

interface FaceZone {
  name: string
  x: number
  y: number
  width: number
  height: number
  metrics: {
    oiliness: number
    hydration: number
    redness: number
  }
}

export function ARSkinAnalysisCamera({
  onAnalysisComplete,
  onClose,
  className,
}: ARSkinAnalysisCameraProps) {
  const { locale } = useTranslation()
  const haptic = useHapticFeedback()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const _faceMeshRef = useRef<unknown>(null) // Reserved for Stage 2 MediaPipe integration
  void _faceMeshRef // Prevent unused warning

  const [arState, setARState] = useState<ARState>('initializing')
  const [error, setError] = useState<string | null>(null)
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    oiliness: 0,
    hydration: 0,
    redness: 0,
    skinType: 'analyzing',
    confidence: 0,
    faceDetected: false,
    lightingQuality: 'fair',
  })
  const [faceZones, setFaceZones] = useState<FaceZone[]>([])
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false)
  const [analysisHistory, setAnalysisHistory] = useState<LiveMetrics[]>([])
  void analysisHistory // Reserved for Stage 2 history tracking
  const [isStabilized, setIsStabilized] = useState(false)

  // Translations
  const t = {
    title: locale === 'ar' ? 'تحليل البشرة المباشر' : locale === 'ru' ? 'Живой анализ кожи' : 'Live Skin Analysis',
    subtitle: locale === 'ar' ? 'تحليل فوري بالواقع المعزز' : locale === 'ru' ? 'AR-анализ в реальном времени' : 'Real-time AR Analysis',
    loadingModel: locale === 'ar' ? 'جاري تحميل نموذج الذكاء الاصطناعي...' : locale === 'ru' ? 'Загрузка AI модели...' : 'Loading AI model...',
    positionFace: locale === 'ar' ? 'ضع وجهك في الإطار' : locale === 'ru' ? 'Расположите лицо в рамке' : 'Position your face in frame',
    analyzing: locale === 'ar' ? 'جاري التحليل...' : locale === 'ru' ? 'Анализ...' : 'Analyzing...',
    faceNotDetected: locale === 'ar' ? 'لم يتم اكتشاف الوجه' : locale === 'ru' ? 'Лицо не обнаружено' : 'Face not detected',
    holdStill: locale === 'ar' ? 'ابق ثابتاً للحصول على نتائج أفضل' : locale === 'ru' ? 'Не двигайтесь для лучших результатов' : 'Hold still for better results',
    resultsStable: locale === 'ar' ? 'النتائج مستقرة' : locale === 'ru' ? 'Результаты стабильны' : 'Results stabilized',
    captureResults: locale === 'ar' ? 'حفظ النتائج' : locale === 'ru' ? 'Сохранить результаты' : 'Capture Results',
    cameraError: locale === 'ar' ? 'لا يمكن الوصول للكاميرا' : locale === 'ru' ? 'Нет доступа к камере' : 'Cannot access camera',
    tryAgain: locale === 'ar' ? 'حاول مرة أخرى' : locale === 'ru' ? 'Попробовать снова' : 'Try Again',
    oiliness: locale === 'ar' ? 'الدهنية' : locale === 'ru' ? 'Жирность' : 'Oiliness',
    hydration: locale === 'ar' ? 'الترطيب' : locale === 'ru' ? 'Увлажнение' : 'Hydration',
    redness: locale === 'ar' ? 'الاحمرار' : locale === 'ru' ? 'Покраснение' : 'Redness',
    skinType: locale === 'ar' ? 'نوع البشرة' : locale === 'ru' ? 'Тип кожи' : 'Skin Type',
    forehead: locale === 'ar' ? 'الجبهة' : locale === 'ru' ? 'Лоб' : 'Forehead',
    nose: locale === 'ar' ? 'الأنف' : locale === 'ru' ? 'Нос' : 'Nose',
    leftCheek: locale === 'ar' ? 'الخد الأيسر' : locale === 'ru' ? 'Левая щека' : 'Left Cheek',
    rightCheek: locale === 'ar' ? 'الخد الأيمن' : locale === 'ru' ? 'Правая щека' : 'Right Cheek',
    chin: locale === 'ar' ? 'الذقن' : locale === 'ru' ? 'Подбородок' : 'Chin',
    showDetails: locale === 'ar' ? 'عرض التفاصيل' : locale === 'ru' ? 'Показать детали' : 'Show Details',
    hideDetails: locale === 'ar' ? 'إخفاء التفاصيل' : locale === 'ru' ? 'Скрыть детали' : 'Hide Details',
    pause: locale === 'ar' ? 'إيقاف' : locale === 'ru' ? 'Пауза' : 'Pause',
    resume: locale === 'ar' ? 'استئناف' : locale === 'ru' ? 'Продолжить' : 'Resume',
    lightingPoor: locale === 'ar' ? 'إضاءة ضعيفة' : locale === 'ru' ? 'Плохое освещение' : 'Poor lighting',
    lightingFair: locale === 'ar' ? 'إضاءة مقبولة' : locale === 'ru' ? 'Приемлемое освещение' : 'Fair lighting',
    lightingGood: locale === 'ar' ? 'إضاءة جيدة' : locale === 'ru' ? 'Хорошее освещение' : 'Good lighting',
    lightingExcellent: locale === 'ar' ? 'إضاءة ممتازة' : locale === 'ru' ? 'Отличное освещение' : 'Excellent lighting',
  }

  const skinTypeLabels: Record<string, Record<string, string>> = {
    dry: { en: 'Dry', ar: 'جافة', ru: 'Сухая' },
    oily: { en: 'Oily', ar: 'دهنية', ru: 'Жирная' },
    combination: { en: 'Combination', ar: 'مختلطة', ru: 'Комбинированная' },
    normal: { en: 'Normal', ar: 'عادية', ru: 'Нормальная' },
    sensitive: { en: 'Sensitive', ar: 'حساسة', ru: 'Чувствительная' },
    analyzing: { en: 'Analyzing...', ar: 'جاري التحليل...', ru: 'Анализ...' },
  }

  // Initialize camera and load face mesh model
  useEffect(() => {
    initARCamera()
    return () => {
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cleanup = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  const initARCamera = async () => {
    setARState('initializing')
    setError(null)

    try {
      // First, get camera access
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      // Load face detection model
      setARState('loading-model')
      await loadFaceMeshModel()
      
      setARState('ready')
      
      // Start real-time analysis loop
      startAnalysisLoop()
      
    } catch {
      // Camera initialization failed
      setError(t.cameraError)
      setARState('error')
    }
  }

  const loadFaceMeshModel = async () => {
    try {
      // Dynamically import TensorFlow.js and face detection
      const tf = await import('@tensorflow/tfjs')
      await tf.ready()
      
      // TensorFlow.js ready - using pixel-based analysis for now
      // Full face mesh detection will be added in Stage 2
      
    } catch {
      // Continue without face mesh - use basic detection
      // Full MediaPipe integration will be added in Stage 2
    }
  }

  const startAnalysisLoop = () => {
    const analyzeFrame = () => {
      if (arState === 'paused' || arState === 'error') {
        animationFrameRef.current = requestAnimationFrame(analyzeFrame)
        return
      }

      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d', { willReadFrequently: true })

        if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          
          // Mirror the image for selfie camera
          ctx.translate(canvas.width, 0)
          ctx.scale(-1, 1)
          ctx.drawImage(video, 0, 0)
          ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset transform

          // Perform real-time skin analysis
          const metrics = analyzeFramePixels(ctx, canvas.width, canvas.height)
          
          // Update live metrics with smoothing
          setLiveMetrics(prev => ({
            oiliness: smoothValue(prev.oiliness, metrics.oiliness),
            hydration: smoothValue(prev.hydration, metrics.hydration),
            redness: smoothValue(prev.redness, metrics.redness),
            skinType: metrics.skinType,
            confidence: smoothValue(prev.confidence, metrics.confidence),
            faceDetected: metrics.faceDetected,
            lightingQuality: metrics.lightingQuality,
          }))

          // Update zone-specific data
          setFaceZones(metrics.zones)

          // Track analysis history for stability detection
          setAnalysisHistory(prev => {
            const newHistory = [...prev, metrics].slice(-10)
            checkStability(newHistory)
            return newHistory
          })

          // Draw AR overlay
          drawAROverlay(ctx, canvas.width, canvas.height, metrics)
        }
      }

      animationFrameRef.current = requestAnimationFrame(analyzeFrame)
    }

    animationFrameRef.current = requestAnimationFrame(analyzeFrame)
  }

  const smoothValue = (prev: number, next: number, factor: number = 0.3): number => {
    return Math.round(prev + (next - prev) * factor)
  }

  const checkStability = (history: LiveMetrics[]) => {
    if (history.length < 5) {
      setIsStabilized(false)
      return
    }

    // Check if last 5 readings are within 5% variance
    const recent = history.slice(-5)
    const avgOiliness = recent.reduce((sum, m) => sum + m.oiliness, 0) / 5
    const avgHydration = recent.reduce((sum, m) => sum + m.hydration, 0) / 5
    
    const isStable = recent.every(m => 
      Math.abs(m.oiliness - avgOiliness) < 5 &&
      Math.abs(m.hydration - avgHydration) < 5
    )

    if (isStable && !isStabilized) {
      haptic.light()
    }
    
    setIsStabilized(isStable)
  }

  interface AnalysisMetrics extends LiveMetrics {
    zones: FaceZone[]
  }

  const analyzeFramePixels = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number
  ): AnalysisMetrics => {
    // Define face zones (approximate)
    const zones = [
      { name: 'forehead', x: width * 0.35, y: height * 0.15, width: width * 0.3, height: height * 0.12 },
      { name: 'nose', x: width * 0.42, y: height * 0.32, width: width * 0.16, height: height * 0.2 },
      { name: 'leftCheek', x: width * 0.2, y: height * 0.32, width: width * 0.18, height: height * 0.18 },
      { name: 'rightCheek', x: width * 0.62, y: height * 0.32, width: width * 0.18, height: height * 0.18 },
      { name: 'chin', x: width * 0.38, y: height * 0.55, width: width * 0.24, height: height * 0.12 },
    ]

    const zoneResults: FaceZone[] = []
    let totalOiliness = 0
    let totalHydration = 0
    let totalRedness = 0
    let totalBrightness = 0
    let validZones = 0

    for (const zone of zones) {
      const imageData = ctx.getImageData(
        Math.floor(zone.x), 
        Math.floor(zone.y), 
        Math.floor(zone.width), 
        Math.floor(zone.height)
      )
      
      const metrics = analyzeZonePixels(imageData)
      
      zoneResults.push({
        name: zone.name,
        x: zone.x,
        y: zone.y,
        width: zone.width,
        height: zone.height,
        metrics,
      })

      totalOiliness += metrics.oiliness
      totalHydration += metrics.hydration
      totalRedness += metrics.redness
      totalBrightness += metrics.brightness || 0
      validZones++
    }

    const avgOiliness = Math.round(totalOiliness / validZones)
    const avgHydration = Math.round(totalHydration / validZones)
    const avgRedness = Math.round(totalRedness / validZones)
    const avgBrightness = totalBrightness / validZones

    // Determine skin type
    let skinType = 'normal'
    const tZoneOiliness = ((zoneResults[0]?.metrics.oiliness ?? 0) + (zoneResults[1]?.metrics.oiliness ?? 0)) / 2
    const cheekHydration = ((zoneResults[2]?.metrics.hydration ?? 0) + (zoneResults[3]?.metrics.hydration ?? 0)) / 2

    if (Math.abs(tZoneOiliness - cheekHydration) > 20) {
      skinType = 'combination'
    } else if (avgRedness > 35) {
      skinType = 'sensitive'
    } else if (avgOiliness > 60) {
      skinType = 'oily'
    } else if (avgHydration < 40) {
      skinType = 'dry'
    }

    // Calculate confidence based on lighting and face position
    let confidence = 70
    if (avgBrightness > 100 && avgBrightness < 200) confidence += 15
    if (avgRedness < 50 && avgOiliness > 20) confidence += 10
    confidence = Math.min(95, confidence)

    // Determine lighting quality
    let lightingQuality: 'poor' | 'fair' | 'good' | 'excellent' = 'fair'
    if (avgBrightness < 60) lightingQuality = 'poor'
    else if (avgBrightness < 100) lightingQuality = 'fair'
    else if (avgBrightness < 180) lightingQuality = 'good'
    else if (avgBrightness <= 220) lightingQuality = 'excellent'
    else lightingQuality = 'fair' // Too bright

    // Simple face detection based on skin-like pixels
    const faceDetected = avgBrightness > 50 && validZones === 5

    return {
      oiliness: avgOiliness,
      hydration: avgHydration,
      redness: avgRedness,
      skinType,
      confidence,
      faceDetected,
      lightingQuality,
      zones: zoneResults,
    }
  }

  const analyzeZonePixels = (imageData: ImageData): { oiliness: number; hydration: number; redness: number; brightness: number } => {
    const pixels = imageData.data
    let totalR = 0, totalG = 0, totalB = 0
    let count = 0
    const brightnesses: number[] = []

    for (let i = 0; i < pixels.length; i += 16) { // Sample every 4th pixel for performance
      const r = pixels[i] || 0
      const g = pixels[i + 1] || 0
      const b = pixels[i + 2] || 0

      totalR += r
      totalG += g
      totalB += b
      brightnesses.push((r + g + b) / 3)
      count++
    }

    if (count === 0) count = 1

    const avgR = totalR / count
    const avgG = totalG / count
    const avgB = totalB / count
    const avgBrightness = brightnesses.reduce((a, b) => a + b, 0) / count

    // Calculate variance for texture/oiliness
    let brightnessVariance = 0
    for (const b of brightnesses) {
      brightnessVariance += (b - avgBrightness) ** 2
    }
    brightnessVariance = brightnessVariance / count

    // Oiliness: smooth/shiny skin has low variance and higher brightness
    const oiliness = Math.min(100, Math.max(0,
      (avgBrightness / 255 * 50) + 
      (brightnessVariance < 300 ? 30 : 0) + 
      (brightnessVariance < 150 ? 20 : 0) - 20
    ))

    // Hydration: based on color balance
    const colorBalance = 100 - Math.min(100, Math.abs(avgR - avgG) * 0.8 + Math.abs(avgG - avgB) * 0.5)
    const hydration = Math.min(100, Math.max(0,
      colorBalance * 0.5 + 
      (avgBrightness > 100 && avgBrightness < 180 ? 35 : 15) +
      (brightnessVariance < 500 ? 15 : 0)
    ))

    // Redness: red channel dominance
    const redness = Math.min(100, Math.max(0,
      (avgR - avgG) * 1.5 + (avgR - avgB) * 0.5 + 15
    ))

    return {
      oiliness: Math.round(oiliness),
      hydration: Math.round(hydration),
      redness: Math.round(redness),
      brightness: Math.round(avgBrightness),
    }
  }

  const drawAROverlay = (
    _ctx: CanvasRenderingContext2D, // Reserved for advanced drawing in Stage 2
    width: number,
    height: number,
    metrics: AnalysisMetrics
  ) => {
    if (!overlayCanvasRef.current) return

    const overlayCtx = overlayCanvasRef.current.getContext('2d')
    if (!overlayCtx) return

    overlayCanvasRef.current.width = width
    overlayCanvasRef.current.height = height

    // Clear previous overlay
    overlayCtx.clearRect(0, 0, width, height)

    if (!metrics.faceDetected) return

    // Draw zone overlays with color-coded metrics
    for (const zone of metrics.zones) {
      // Determine zone color based on metrics
      const hue = getMetricHue(zone.metrics.oiliness, zone.metrics.hydration, zone.metrics.redness)
      
      // Draw semi-transparent zone overlay
      overlayCtx.fillStyle = `hsla(${hue}, 70%, 50%, 0.2)`
      overlayCtx.strokeStyle = `hsla(${hue}, 70%, 50%, 0.6)`
      overlayCtx.lineWidth = 2
      
      // Draw rounded rectangle for zone
      const radius = 10
      overlayCtx.beginPath()
      overlayCtx.roundRect(zone.x, zone.y, zone.width, zone.height, radius)
      overlayCtx.fill()
      overlayCtx.stroke()

      // Draw zone label
      overlayCtx.fillStyle = 'white'
      overlayCtx.font = 'bold 12px system-ui'
      overlayCtx.textAlign = 'center'
      overlayCtx.fillText(
        `${zone.metrics.oiliness}%`,
        zone.x + zone.width / 2,
        zone.y + zone.height / 2 + 4
      )
    }

    // Draw face oval guide
    overlayCtx.strokeStyle = metrics.faceDetected ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
    overlayCtx.lineWidth = 3
    overlayCtx.beginPath()
    overlayCtx.ellipse(
      width / 2,
      height * 0.4,
      width * 0.22,
      height * 0.32,
      0,
      0,
      2 * Math.PI
    )
    overlayCtx.stroke()
  }

  const getMetricHue = (oiliness: number, hydration: number, redness: number): number => {
    // Return hue value: 0 = red (problem), 120 = green (good), 60 = yellow (moderate)
    if (redness > 40) return 0 // Red for high redness
    if (oiliness > 70 || hydration < 30) return 30 // Orange for issues
    if (oiliness > 50 || hydration < 50) return 60 // Yellow for moderate
    return 120 // Green for balanced
  }

  const togglePause = () => {
    if (arState === 'ready') {
      setARState('paused')
    } else if (arState === 'paused') {
      setARState('ready')
    }
    haptic.light()
  }

  const captureResults = () => {
    haptic.success()
    
    // Generate full analysis result from live metrics
    const result: SkinAnalysisResult = {
      skinType: liveMetrics.skinType as SkinAnalysisResult['skinType'],
      confidence: liveMetrics.confidence,
      concerns: generateConcerns(liveMetrics),
      recommendations: [],
      ageGroup: 'adult',
      oilinessLevel: liveMetrics.oiliness,
      hydrationLevel: liveMetrics.hydration,
      rednessLevel: liveMetrics.redness,
      skinTone: 'medium',
      undertone: 'neutral',
      textureScore: 100 - liveMetrics.oiliness * 0.3,
      poreVisibility: liveMetrics.oiliness > 60 ? 'visible' : liveMetrics.oiliness > 40 ? 'moderate' : 'minimal',
      evenness: 100 - liveMetrics.redness * 0.5,
      tZoneOiliness: faceZones[0]?.metrics.oiliness ?? liveMetrics.oiliness,
      cheekHydration: ((faceZones[2]?.metrics.hydration ?? 0) + (faceZones[3]?.metrics.hydration ?? 0)) / 2 || liveMetrics.hydration,
      estimatedSkinAge: 30,
      lightingQuality: liveMetrics.lightingQuality,
    }

    onAnalysisComplete(result)
  }

  const generateConcerns = (metrics: LiveMetrics): string[] => {
    const concerns: string[] = []
    if (metrics.oiliness > 55) concerns.push('pore-care')
    if (metrics.hydration < 50) concerns.push('hydration')
    if (metrics.redness > 30) concerns.push('sensitivity')
    if (concerns.length === 0) concerns.push('hydration')
    return concerns
  }

  // Portal mounting
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    document.body.classList.add('fullscreen-modal-open')
    return () => {
      setMounted(false)
      document.body.classList.remove('fullscreen-modal-open')
    }
  }, [])

  const getLightingLabel = (quality: string) => {
    switch (quality) {
      case 'poor': return t.lightingPoor
      case 'fair': return t.lightingFair
      case 'good': return t.lightingGood
      case 'excellent': return t.lightingExcellent
      default: return t.lightingFair
    }
  }

  const getLightingColor = (quality: string) => {
    switch (quality) {
      case 'poor': return 'text-red-400'
      case 'fair': return 'text-yellow-400'
      case 'good': return 'text-green-400'
      case 'excellent': return 'text-emerald-400'
      default: return 'text-yellow-400'
    }
  }

  const cameraContent = (
    <div className={cn(
      'fixed inset-0 z-[9999] bg-black flex flex-col',
      className
    )}
    style={{ 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0,
      position: 'fixed',
    }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/90 to-transparent relative z-10 flex-shrink-0"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top, 12px))' }}
      >
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="text-center flex-1 px-4">
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-primary-400" />
            <h2 className="text-white font-semibold text-lg">{t.title}</h2>
          </div>
          <p className="text-white/60 text-xs">{t.subtitle}</p>
        </div>
        {/* Pause/Resume button */}
        {arState === 'ready' || arState === 'paused' ? (
          <button
            onClick={togglePause}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
          >
            {arState === 'paused' ? (
              <Play className="w-5 h-5 text-white" />
            ) : (
              <Pause className="w-5 h-5 text-white" />
            )}
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Camera View with AR Overlay */}
      <div className="flex-1 relative overflow-hidden">
        {/* Video feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        />

        {/* AR Overlay Canvas */}
        <canvas
          ref={overlayCanvasRef}
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1] pointer-events-none"
        />

        {/* Hidden analysis canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Loading State */}
        {(arState === 'initializing' || arState === 'loading-model') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <Loader2 className="w-12 h-12 text-primary-400 animate-spin mb-4" />
            <p className="text-white">
              {arState === 'loading-model' ? t.loadingModel : t.analyzing}
            </p>
          </div>
        )}

        {/* Error State */}
        {arState === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black px-8">
            <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
            <p className="text-white text-center mb-6">{error}</p>
            <button
              onClick={initARCamera}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium active:scale-95 transition-transform"
            >
              <Camera className="w-5 h-5" />
              {t.tryAgain}
            </button>
          </div>
        )}

        {/* Paused Overlay */}
        {arState === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="text-center">
              <Pause className="w-16 h-16 text-white/60 mx-auto mb-2" />
              <p className="text-white/80">{t.pause}</p>
            </div>
          </div>
        )}

        {/* Status Indicators */}
        {(arState === 'ready' || arState === 'paused') && (
          <>
            {/* Face Detection Status */}
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-sm ${
              liveMetrics.faceDetected 
                ? isStabilized 
                  ? 'bg-green-500/80' 
                  : 'bg-yellow-500/80'
                : 'bg-red-500/80'
            }`}>
              <p className="text-white text-sm font-medium">
                {!liveMetrics.faceDetected 
                  ? t.faceNotDetected 
                  : isStabilized 
                    ? t.resultsStable 
                    : t.holdStill
                }
              </p>
            </div>

            {/* Lighting Indicator */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
              <Sun className={`w-4 h-4 ${getLightingColor(liveMetrics.lightingQuality)}`} />
              <span className={`text-xs font-medium ${getLightingColor(liveMetrics.lightingQuality)}`}>
                {getLightingLabel(liveMetrics.lightingQuality)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Live Metrics Panel */}
      {(arState === 'ready' || arState === 'paused') && liveMetrics.faceDetected && (
        <div 
          className="bg-gradient-to-t from-black via-black/95 to-transparent px-4 pt-4 flex-shrink-0"
          style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))' }}
        >
          {/* Skin Type Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/30 to-primary-600/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs">{t.skinType}</p>
                <p className="text-white font-bold text-lg">
                  {skinTypeLabels[liveMetrics.skinType]?.[locale] || liveMetrics.skinType}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs">Confidence</p>
              <p className="text-white font-bold text-lg">{liveMetrics.confidence}%</p>
            </div>
          </div>

          {/* Live Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <LiveMetricCard
              icon={<Droplets className="w-4 h-4" />}
              label={t.oiliness}
              value={liveMetrics.oiliness}
              color="amber"
            />
            <LiveMetricCard
              icon={<Target className="w-4 h-4" />}
              label={t.hydration}
              value={liveMetrics.hydration}
              color="blue"
            />
            <LiveMetricCard
              icon={<Flame className="w-4 h-4" />}
              label={t.redness}
              value={liveMetrics.redness}
              color="red"
            />
          </div>

          {/* Toggle Details */}
          <button
            onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}
            className="w-full flex items-center justify-center gap-2 text-white/60 text-sm mb-4"
          >
            {showDetailedMetrics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showDetailedMetrics ? t.hideDetails : t.showDetails}
          </button>

          {/* Detailed Zone Metrics */}
          {showDetailedMetrics && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {faceZones.map((zone) => (
                <div key={zone.name} className="bg-white/5 rounded-xl p-3">
                  <p className="text-white/60 text-xs mb-1">
                    {t[zone.name as keyof typeof t] || zone.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500 rounded-full transition-all duration-300" 
                          style={{ width: `${zone.metrics.oiliness}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-white text-xs font-medium w-8">{zone.metrics.oiliness}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Capture Button */}
          <button
            onClick={captureResults}
            disabled={!isStabilized}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all active:scale-[0.98] ${
              isStabilized
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            <Camera className="w-5 h-5" />
            {t.captureResults}
          </button>
        </div>
      )}
    </div>
  )

  if (!mounted) return null
  
  return createPortal(cameraContent, document.body)
}

// Live Metric Card Component
function LiveMetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: 'amber' | 'blue' | 'red'
}) {
  const colorClasses = {
    amber: { bg: 'bg-amber-500/20', fill: 'bg-amber-500', text: 'text-amber-400' },
    blue: { bg: 'bg-blue-500/20', fill: 'bg-blue-500', text: 'text-blue-400' },
    red: { bg: 'bg-red-500/20', fill: 'bg-red-500', text: 'text-red-400' },
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3">
      <div className={cn('w-6 h-6 rounded-full mb-2 flex items-center justify-center', colorClasses[color].bg)}>
        <span className={colorClasses[color].text}>{icon}</span>
      </div>
      <p className="text-white/50 text-[10px] mb-1">{label}</p>
      <p className="text-white font-bold text-xl">{value}%</p>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
        <div
          className={cn('h-full rounded-full transition-all duration-300', colorClasses[color].fill)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default ARSkinAnalysisCamera
