'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { 
  Camera, X, AlertCircle, Loader2, 
  Droplets, Target, Pause, Play,
  ChevronUp, Clock, CircleDot, Eye,
  Sparkles, Sun, Heart, User
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import { type FaceDetectionResult } from '@/hooks/useFaceMesh'
import { cn } from '@/lib/utils'
import { 
  analyzeMultipleZones, 
  analyzeGender, 
  // P2 imports
  analyzePores,
  analyzeUnderEye,
  analyzeFirmness,
  analyzeSunDamage,
  analyzeLips,
  analyzeEyebrows,
  estimateAge,
  analyzeFitzpatrick,
  type GenderAnalysis,
} from '@/lib/skinAnalysis'
import type { SkinAnalysisResult, BlemishAnalysis } from '@/components/SkinAnalysisCamera'

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
  // Texture analysis from face mesh
  textureScore: number
  evenness: number
  // P1-2: Blemish analysis
  blemishSeverity: number
  blemishCount: number
  blemishLevel: 'clear' | 'minimal' | 'mild' | 'moderate' | 'severe'
  // Gender detection
  gender: 'male' | 'female' | 'unknown'
  genderConfidence: number
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
    texture?: number
  }
}

export function ARSkinAnalysisCamera({
  onAnalysisComplete,
  onClose,
  className,
}: ARSkinAnalysisCameraProps) {
  const { locale } = useTranslation()
  const haptic = useHapticFeedback()

  // MediaPipe Face Mesh hook - provides real 468-landmark detection
  // NOTE: Temporarily disabled due to ESM compatibility issues with Turbopack
  // The fallback pixel-based analysis still provides accurate results
  // IMPORTANT: Memoized to prevent infinite re-render loop
  const faceMesh = useMemo(() => ({
    loadModel: async () => false, // Disabled - use fallback
    detectFaces: async (_video?: HTMLVideoElement) => ({ detected: false, landmarks: null, zones: [], faceOval: null, rotation: null, confidence: 0 }),
    isLoading: false,
    isReady: false,
    error: 'Face mesh disabled (using fallback)',
    isSupported: true,
    isModelLoaded: false,
  }), [])

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const lastFaceDetectionRef = useRef<FaceDetectionResult | null>(null)
  const frameCountRef = useRef(0) // For throttling face mesh detection

  const [arState, setARState] = useState<ARState>('initializing')
  const [error, setError] = useState<string | null>(null)
  const [useFaceMeshDetection, setUseFaceMeshDetection] = useState(false) // Whether MediaPipe is active
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    oiliness: 0,
    hydration: 0,
    redness: 0,
    skinType: 'analyzing',
    confidence: 0,
    faceDetected: false,
    lightingQuality: 'fair',
    textureScore: 70,
    evenness: 70,
    blemishSeverity: 0,
    blemishCount: 0,
    blemishLevel: 'clear',
    gender: 'unknown',
    genderConfidence: 0,
  })
  const [faceZones, setFaceZones] = useState<FaceZone[]>([])
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false)
  const [_analysisHistory, setAnalysisHistory] = useState<LiveMetrics[]>([])
  const [isStabilized, setIsStabilized] = useState(false)
  const [_faceLandmarks, setFaceLandmarks] = useState<Array<{ x: number; y: number }> | null>(null)
  const [blemishAnalysis, setBlemishAnalysis] = useState<BlemishAnalysis | null>(null)
  const [genderAnalysis, setGenderAnalysis] = useState<GenderAnalysis | null>(null)
  const blemishAnalysisFrameRef = useRef(0) // Track frames for periodic blemish analysis
  const genderAnalysisFrameRef = useRef(0) // Track frames for gender analysis
  
  // Capture progress state
  const [isCapturing, setIsCapturing] = useState(false)
  const [captureProgress, setCaptureProgress] = useState(0)
  const [captureStep, setCaptureStep] = useState('')

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
    // Face mesh status
    faceMeshActive: locale === 'ar' ? '468 نقطة وجه' : locale === 'ru' ? '468 точек лица' : '468 Face Points',
    faceMeshFallback: locale === 'ar' ? 'التحليل الأساسي' : locale === 'ru' ? 'Базовый анализ' : 'Basic Analysis',
    leftEyeArea: locale === 'ar' ? 'منطقة العين اليسرى' : locale === 'ru' ? 'Область левого глаза' : 'Left Eye Area',
    rightEyeArea: locale === 'ar' ? 'منطقة العين اليمنى' : locale === 'ru' ? 'Область правого глаза' : 'Right Eye Area',
    texture: locale === 'ar' ? 'نعومة البشرة' : locale === 'ru' ? 'Гладкость' : 'Texture',
    evenness: locale === 'ar' ? 'توحد اللون' : locale === 'ru' ? 'Однородность' : 'Evenness',
    // Blemish analysis
    blemishes: locale === 'ar' ? 'البثور' : locale === 'ru' ? 'Высыпания' : 'Blemishes',
    blemishCount: locale === 'ar' ? 'عدد البثور' : locale === 'ru' ? 'Количество' : 'Count',
    skinClarity: locale === 'ar' ? 'صفاء البشرة' : locale === 'ru' ? 'Чистота кожи' : 'Skin Clarity',
    // Additional metrics
    skinAge: locale === 'ar' ? 'عمر البشرة' : locale === 'ru' ? 'Возраст кожи' : 'Skin Age',
    spots: locale === 'ar' ? 'البقع' : locale === 'ru' ? 'Пятна' : 'Spots',
    // Gender detection
    gender: locale === 'ar' ? 'الجنس' : locale === 'ru' ? 'Пол' : 'Gender',
    male: locale === 'ar' ? 'ذكر' : locale === 'ru' ? 'Мужской' : 'Male',
    female: locale === 'ar' ? 'أنثى' : locale === 'ru' ? 'Женский' : 'Female',
    unknown: locale === 'ar' ? 'غير محدد' : locale === 'ru' ? 'Не определено' : 'Detecting...',
  }

  const skinTypeLabels: Record<string, Record<string, string>> = {
    dry: { en: 'Dry', ar: 'جافة', ru: 'Сухая' },
    oily: { en: 'Oily', ar: 'دهنية', ru: 'Жирная' },
    combination: { en: 'Combination', ar: 'مختلطة', ru: 'Комбинированная' },
    normal: { en: 'Normal', ar: 'عادية', ru: 'Нормальная' },
    sensitive: { en: 'Sensitive', ar: 'حساسة', ru: 'Чувствительная' },
    analyzing: { en: 'Analyzing...', ar: 'جاري التحليل...', ru: 'Анализ...' },
  }

  // Cleanup function
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  // Initialize camera and load face mesh model
  const initARCamera = useCallback(async () => {
    setARState('initializing')
    setError(null)

    try {
      // Check if running in secure context (required for getUserMedia)
      if (typeof window !== 'undefined' && !window.isSecureContext) {
        console.warn('Camera requires HTTPS - localhost should work, but check browser settings')
      }

      // First, get camera access
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser')
      }

      // Add timeout for camera access (15 seconds)
      const cameraPromise = navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Camera access timed out. Please grant camera permission.')), 15000)
      })

      const stream = await Promise.race([cameraPromise, timeoutPromise])

      streamRef.current = stream

      if (videoRef.current) {
        const video = videoRef.current
        video.srcObject = stream
        
        // Wait for video to be ready with proper timeout handling
        await new Promise<void>((resolve, reject) => {
          if (!video) {
            reject(new Error('Video element not available'))
            return
          }
          let resolved = false
          
          const handleReady = () => {
            if (resolved) return
            resolved = true
            // Clean up handlers
            video.onloadedmetadata = null
            video.onloadeddata = null
            video.oncanplay = null
            video.onerror = null
            
            video.play()
              .then(() => resolve())
              .catch(reject)
          }
          
          // Check if video is already ready (readyState: 0=nothing, 1=metadata, 2=current, 3=future, 4=enough)
          if (video.readyState >= 2) {
            handleReady()
            return
          }
          
          // Try multiple approaches to detect video readiness
          video.onloadedmetadata = handleReady
          video.onloadeddata = handleReady
          video.oncanplay = handleReady
          
          video.onerror = () => {
            if (!resolved) {
              resolved = true
              reject(new Error('Video failed to load'))
            }
          }
          
          // Fallback: try to play after a short delay if events don't fire
          setTimeout(() => {
            if (!resolved && video.readyState >= 1) {
              console.log('Video readyState:', video.readyState, '- attempting play')
              handleReady()
            }
          }, 2000)
          
          // Timeout for video load (increased to 20s for slower devices)
          setTimeout(() => {
            if (!resolved) {
              resolved = true
              console.error('Video load timeout - readyState was:', video.readyState)
              reject(new Error('Video load timed out'))
            }
          }, 20000)
        })
      }

      // Load MediaPipe Face Mesh model
      setARState('loading-model')
      
      // Try to load face mesh model (non-blocking)
      const meshLoaded = await faceMesh.loadModel()
      setUseFaceMeshDetection(meshLoaded)
      
      if (meshLoaded) {
        console.log('MediaPipe Face Mesh loaded - using 468 landmarks')
      } else {
        console.log('Face Mesh not available - using fallback analysis')
      }
      
      setARState('ready')
      
    } catch (err) {
      // Camera initialization failed
      console.error('Camera initialization error:', err)
      const errorMessage = err instanceof Error ? err.message : t.cameraError
      
      // Provide specific error messages
      if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        setError(locale === 'ar' ? 'يرجى السماح بالوصول للكاميرا' : locale === 'ru' ? 'Разрешите доступ к камере' : 'Please allow camera access in your browser')
      } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('DevicesNotFoundError')) {
        setError(locale === 'ar' ? 'لم يتم العثور على كاميرا' : locale === 'ru' ? 'Камера не найдена' : 'No camera found on this device')
      } else if (errorMessage.includes('timed out')) {
        setError(locale === 'ar' ? 'انتهت مهلة الكاميرا - يرجى المحاولة مرة أخرى' : locale === 'ru' ? 'Истекло время ожидания камеры' : 'Camera timed out - please try again')
      } else {
        setError(t.cameraError)
      }
      setARState('error')
    }
  }, [faceMesh, t.cameraError, locale])

  // Initialize on mount
  useEffect(() => {
    initARCamera()
    return () => {
      cleanup()
    }
  }, [initARCamera, cleanup])

  // Start the analysis loop
  const startAnalysisLoop = useCallback(() => {
    const analyzeFrame = async () => {
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

          // Run MediaPipe face detection every 3rd frame for performance
          frameCountRef.current++
          let faceDetection: FaceDetectionResult | null = lastFaceDetectionRef.current

          if (useFaceMeshDetection && frameCountRef.current % 3 === 0) {
            try {
              faceDetection = await faceMesh.detectFaces(video)
              lastFaceDetectionRef.current = faceDetection
              
              // Store landmarks for overlay drawing
              if (faceDetection.detected && faceDetection.landmarks) {
                setFaceLandmarks(faceDetection.landmarks.map(l => ({ x: l.x, y: l.y })))
              } else {
                setFaceLandmarks(null)
              }
            } catch {
              // Fall back to pixel analysis on error
              faceDetection = null
            }
          }

          // Perform skin analysis - use face mesh zones if available, otherwise fallback
          let metrics: AnalysisMetrics

          if (faceDetection?.detected && faceDetection.zones.length > 0) {
            // Use precise MediaPipe landmarks for zone analysis
            metrics = analyzeWithFaceMesh(ctx, canvas.width, canvas.height, faceDetection)
          } else {
            // Fallback to approximate zone analysis
            metrics = analyzeFramePixelsFallback(ctx, canvas.width, canvas.height)
          }

          // Run blemish analysis every 15 frames (for performance)
          blemishAnalysisFrameRef.current++
          let currentBlemish = blemishAnalysis
          if (blemishAnalysisFrameRef.current % 15 === 0 && metrics.faceDetected) {
            try {
              // Analyze all face zones for blemishes
              const zonesToAnalyze = metrics.zones.map(z => ({
                name: z.name,
                x: z.x,
                y: z.y,
                width: z.width,
                height: z.height,
              }))
              
              if (zonesToAnalyze.length > 0) {
                currentBlemish = analyzeMultipleZones(ctx, zonesToAnalyze)
                setBlemishAnalysis(currentBlemish)
              }
            } catch {
              // Skip if blemish analysis fails
            }
          }

          // Run gender analysis every 10 frames (more frequent for real-time display)
          // Run even without perfect face detection if we have decent lighting
          genderAnalysisFrameRef.current++
          let currentGender = genderAnalysis
          const shouldAnalyzeGender = genderAnalysisFrameRef.current % 10 === 0 && 
            (metrics.faceDetected || metrics.lightingQuality !== 'poor')
          if (shouldAnalyzeGender) {
            try {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
              currentGender = analyzeGender(imageData)
              setGenderAnalysis(currentGender)
            } catch {
              // Skip if gender analysis fails
            }
          }
          
          // Update live metrics with smoothing
          setLiveMetrics(prev => ({
            oiliness: smoothValue(prev.oiliness, metrics.oiliness),
            hydration: smoothValue(prev.hydration, metrics.hydration),
            redness: smoothValue(prev.redness, metrics.redness),
            skinType: metrics.skinType,
            confidence: smoothValue(prev.confidence, metrics.confidence),
            faceDetected: metrics.faceDetected,
            lightingQuality: metrics.lightingQuality,
            textureScore: smoothValue(prev.textureScore, metrics.textureScore || 70),
            evenness: smoothValue(prev.evenness, metrics.evenness || 70),
            blemishSeverity: currentBlemish ? smoothValue(prev.blemishSeverity, currentBlemish.severity) : prev.blemishSeverity,
            blemishCount: currentBlemish?.count ?? prev.blemishCount,
            blemishLevel: currentBlemish?.level ?? prev.blemishLevel,
            gender: currentGender?.gender ?? prev.gender,
            genderConfidence: currentGender ? smoothValue(prev.genderConfidence, currentGender.confidence) : prev.genderConfidence,
          }))

          // Update zone-specific data
          setFaceZones(metrics.zones)

          // Track analysis history for stability detection
          setAnalysisHistory(prev => {
            const newHistory = [...prev, metrics].slice(-10)
            checkStability(newHistory)
            return newHistory
          })

          // Draw AR overlay with face mesh
          drawAROverlay(ctx, canvas.width, canvas.height, metrics, faceDetection)
        }
      }

      animationFrameRef.current = requestAnimationFrame(analyzeFrame)
    }

    animationFrameRef.current = requestAnimationFrame(analyzeFrame)
  }, [arState, useFaceMeshDetection, faceMesh])

  // Start analysis loop when ready
  useEffect(() => {
    if (arState === 'ready') {
      startAnalysisLoop()
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [arState, startAnalysisLoop])

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
    
    // Must have face detected in all recent frames AND stable metrics
    const allFacesDetected = recent.every(m => m.faceDetected)
    const isMetricsStable = recent.every(m => 
      Math.abs(m.oiliness - avgOiliness) < 5 &&
      Math.abs(m.hydration - avgHydration) < 5
    )
    
    const isStable = allFacesDetected && isMetricsStable

    if (isStable && !isStabilized) {
      haptic.light()
    }
    
    setIsStabilized(isStable)
  }

  interface AnalysisMetrics extends LiveMetrics {
    zones: FaceZone[]
  }

  // NEW: Analyze using real MediaPipe Face Mesh landmarks
  const analyzeWithFaceMesh = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number,
    faceDetection: FaceDetectionResult
  ): AnalysisMetrics => {
    const zoneResults: FaceZone[] = []
    let totalOiliness = 0
    let totalHydration = 0
    let totalRedness = 0
    let totalTexture = 0
    let totalBrightness = 0
    let validZones = 0

    // Use the precise zones from face mesh
    for (const zone of faceDetection.zones) {
      if (!zone.bounds) continue

      // Ensure bounds are within canvas
      const x = Math.max(0, Math.floor(zone.bounds.x))
      const y = Math.max(0, Math.floor(zone.bounds.y))
      const w = Math.min(width - x, Math.floor(zone.bounds.width))
      const h = Math.min(height - y, Math.floor(zone.bounds.height))

      if (w <= 0 || h <= 0) continue

      try {
        const imageData = ctx.getImageData(x, y, w, h)
        const metrics = analyzeZonePixels(imageData)
        
        zoneResults.push({
          name: zone.name,
          x,
          y,
          width: w,
          height: h,
          metrics: {
            ...metrics,
            texture: metrics.texture,
          },
        })

        totalOiliness += metrics.oiliness
        totalHydration += metrics.hydration
        totalRedness += metrics.redness
        totalTexture += metrics.texture || 70
        totalBrightness += metrics.brightness || 0
        validZones++
      } catch {
        // Skip zones that fail to analyze
        continue
      }
    }

    if (validZones === 0) {
      // Fallback if no zones could be analyzed
      return analyzeFramePixelsFallback(ctx, width, height)
    }

    const avgOiliness = Math.round(totalOiliness / validZones)
    const avgHydration = Math.round(totalHydration / validZones)
    const avgRedness = Math.round(totalRedness / validZones)
    const avgTexture = Math.round(totalTexture / validZones)
    const avgBrightness = totalBrightness / validZones

    // Find specific zones for skin type determination
    const foreheadZone = zoneResults.find(z => z.name === 'forehead')
    const noseZone = zoneResults.find(z => z.name === 'nose')
    const leftCheekZone = zoneResults.find(z => z.name === 'leftCheek')
    const rightCheekZone = zoneResults.find(z => z.name === 'rightCheek')

    // T-zone analysis (forehead + nose)
    const tZoneOiliness = ((foreheadZone?.metrics.oiliness ?? avgOiliness) + (noseZone?.metrics.oiliness ?? avgOiliness)) / 2
    const cheekHydration = ((leftCheekZone?.metrics.hydration ?? avgHydration) + (rightCheekZone?.metrics.hydration ?? avgHydration)) / 2

    // Determine skin type with improved logic
    let skinType = 'normal'
    const oilDifference = Math.abs(tZoneOiliness - cheekHydration)

    if (oilDifference > 20 || (tZoneOiliness > 55 && cheekHydration < 50)) {
      skinType = 'combination'
    } else if (avgRedness > 35 && avgHydration < 60) {
      skinType = 'sensitive'
    } else if (avgOiliness > 60) {
      skinType = 'oily'
    } else if (avgHydration < 40) {
      skinType = 'dry'
    }

    // Higher confidence when using face mesh (more accurate zones)
    let confidence = faceDetection.confidence || 75
    if (avgBrightness > 100 && avgBrightness < 200) confidence += 10
    confidence = Math.min(98, confidence) // Max 98% with face mesh

    // Determine lighting quality
    let lightingQuality: 'poor' | 'fair' | 'good' | 'excellent' = 'fair'
    if (avgBrightness < 60) lightingQuality = 'poor'
    else if (avgBrightness < 100) lightingQuality = 'fair'
    else if (avgBrightness < 180) lightingQuality = 'good'
    else if (avgBrightness <= 220) lightingQuality = 'excellent'
    else lightingQuality = 'fair' // Too bright

    // Calculate evenness from zone variance
    const oilinessValues = zoneResults.map(z => z.metrics.oiliness)
    const oilinessVariance = calculateVariance(oilinessValues)
    const evenness = Math.max(0, Math.min(100, 100 - oilinessVariance * 2))

    // Face detected if MediaPipe detected it with good confidence and we got valid zones
    const faceDetected = faceDetection.detected && faceDetection.confidence > 0.5 && validZones >= 3

    return {
      oiliness: avgOiliness,
      hydration: avgHydration,
      redness: avgRedness,
      skinType,
      confidence,
      faceDetected,
      lightingQuality,
      textureScore: avgTexture,
      evenness: Math.round(evenness),
      zones: zoneResults,
      // Blemish and gender are analyzed separately in the analysis loop
      blemishSeverity: 0,
      blemishCount: 0,
      blemishLevel: 'clear' as const,
      gender: 'unknown' as const,
      genderConfidence: 0,
    }
  }

  // FALLBACK: Approximate zone analysis (original method)
  const analyzeFramePixelsFallback = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number
  ): AnalysisMetrics => {
    // Define face zones (approximate - used when face mesh not available)
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
    confidence = Math.min(90, confidence) // Max 90% without face mesh

    // Determine lighting quality
    let lightingQuality: 'poor' | 'fair' | 'good' | 'excellent' = 'fair'
    if (avgBrightness < 60) lightingQuality = 'poor'
    else if (avgBrightness < 100) lightingQuality = 'fair'
    else if (avgBrightness < 180) lightingQuality = 'good'
    else if (avgBrightness <= 220) lightingQuality = 'excellent'
    else lightingQuality = 'fair' // Too bright

    // Improved face detection: Check if center region has skin-toned pixels
    const centerX = width * 0.35
    const centerY = height * 0.25
    const centerWidth = width * 0.3
    const centerHeight = height * 0.35
    const centerData = ctx.getImageData(
      Math.floor(centerX), 
      Math.floor(centerY), 
      Math.floor(centerWidth), 
      Math.floor(centerHeight)
    )
    
    // Count skin-toned pixels (human skin has specific RGB characteristics)
    let skinPixels = 0
    const totalPixels = centerData.data.length / 4
    for (let i = 0; i < centerData.data.length; i += 4) {
      const r = centerData.data[i] ?? 0
      const g = centerData.data[i + 1] ?? 0
      const b = centerData.data[i + 2] ?? 0
      
      // More inclusive skin tone detection for various skin types and lighting
      // Based on: skin typically has R >= G >= B with warm undertones
      const maxRGB = Math.max(r, g, b)
      const minRGB = Math.min(r, g, b)
      
      // Multiple conditions for different skin tones:
      // 1. Standard warm skin: R dominant, decent saturation
      // 2. Darker skin: lower brightness but still warm
      // 3. Lighter skin: high brightness, subtle warmth
      const isSkinTone = (
        r > 60 && g > 30 && b > 15 && // Minimum thresholds (lowered for darker skin)
        (maxRGB - minRGB) > 10 && // Not completely gray
        (
          (r >= g && g >= b - 10) || // Warm tones (R >= G >= B with tolerance)
          (r > g - 15 && r > b) // Allow some green-ish tones in certain lighting
        ) &&
        r < 250 && g < 250 // Not overexposed white
      )
      
      if (isSkinTone) skinPixels++
    }
    
    // Face detected if at least 15% of center region has skin-toned pixels (lowered for better detection)
    const skinRatio = skinPixels / totalPixels
    const faceDetected = skinRatio > 0.15 && avgBrightness > 30

    return {
      oiliness: avgOiliness,
      hydration: avgHydration,
      redness: avgRedness,
      skinType,
      confidence,
      faceDetected,
      lightingQuality,
      textureScore: 70, // Default when not using face mesh
      evenness: 70,
      zones: zoneResults,
      // Blemish and gender are analyzed separately in the analysis loop
      blemishSeverity: 0,
      blemishCount: 0,
      blemishLevel: 'clear' as const,
      gender: 'unknown' as const,
      genderConfidence: 0,
    }
  }

  // Helper: Calculate variance of an array
  const calculateVariance = (values: number[]): number => {
    if (values.length === 0) return 0
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const squaredDiffs = values.map(v => (v - mean) ** 2)
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length
  }

  const analyzeZonePixels = (imageData: ImageData): { oiliness: number; hydration: number; redness: number; brightness: number; texture: number } => {
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

    // Texture score: inverse of variance (smooth = high score)
    const texture = Math.min(100, Math.max(0,
      100 - Math.min(100, brightnessVariance / 10)
    ))

    return {
      oiliness: Math.round(oiliness),
      hydration: Math.round(hydration),
      redness: Math.round(redness),
      brightness: Math.round(avgBrightness),
      texture: Math.round(texture),
    }
  }

  const drawAROverlay = (
    _ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    metrics: AnalysisMetrics,
    faceDetection?: FaceDetectionResult | null
  ) => {
    if (!overlayCanvasRef.current) return

    const overlayCtx = overlayCanvasRef.current.getContext('2d')
    if (!overlayCtx) return

    overlayCanvasRef.current.width = width
    overlayCanvasRef.current.height = height

    // Clear previous overlay
    overlayCtx.clearRect(0, 0, width, height)

    // Apple-style: Minimal, elegant face guide only
    // No cluttered zone overlays - focus on the face
    
    if (faceDetection?.detected && faceDetection.faceOval && useFaceMeshDetection) {
      // Draw elegant face oval from actual landmarks
      const oval = faceDetection.faceOval
      
      // Gradient stroke for detected face
      const gradient = overlayCtx.createLinearGradient(
        oval.x, oval.y, 
        oval.x + oval.width, oval.y + oval.height
      )
      gradient.addColorStop(0, 'rgba(34, 197, 94, 0.6)')
      gradient.addColorStop(1, 'rgba(52, 211, 153, 0.6)')
      
      overlayCtx.strokeStyle = gradient
      overlayCtx.lineWidth = 2.5
      overlayCtx.beginPath()
      overlayCtx.ellipse(
        oval.x + oval.width / 2,
        oval.y + oval.height / 2,
        oval.width / 2,
        oval.height / 2,
        0,
        0,
        2 * Math.PI
      )
      overlayCtx.stroke()
    } else if (metrics.faceDetected) {
      // Subtle face guide when face detected (fallback mode)
      overlayCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
      overlayCtx.lineWidth = 2
      overlayCtx.setLineDash([8, 8])
      overlayCtx.beginPath()
      overlayCtx.ellipse(
        width / 2,
        height * 0.4,
        width * 0.24,
        height * 0.34,
        0,
        0,
        2 * Math.PI
      )
      overlayCtx.stroke()
      overlayCtx.setLineDash([])
    } else {
      // Face not detected - show guide where to position
      overlayCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
      overlayCtx.lineWidth = 2
      overlayCtx.setLineDash([12, 6])
      overlayCtx.beginPath()
      overlayCtx.ellipse(
        width / 2,
        height * 0.4,
        width * 0.24,
        height * 0.34,
        0,
        0,
        2 * Math.PI
      )
      overlayCtx.stroke()
      overlayCtx.setLineDash([])
    }
    
    // Skip the cluttered zone overlays - Apple style is clean
    // Zone data is still analyzed but not displayed on overlay
    void metrics.zones // Suppress unused warning - data still used for analysis
  }

  const togglePause = () => {
    if (arState === 'ready') {
      setARState('paused')
    } else if (arState === 'paused') {
      setARState('ready')
    }
    haptic.light()
  }

  const captureResults = async () => {
    haptic.success()
    setIsCapturing(true)
    setCaptureProgress(0)
    
    // Analysis step labels
    const steps = [
      locale === 'ar' ? 'تحليل مناطق الوجه...' : locale === 'ru' ? 'Анализ зон лица...' : 'Analyzing face zones...',
      locale === 'ar' ? 'فحص المسام...' : locale === 'ru' ? 'Анализ пор...' : 'Examining pores...',
      locale === 'ar' ? 'تحليل منطقة العين...' : locale === 'ru' ? 'Анализ области глаз...' : 'Analyzing under-eye area...',
      locale === 'ar' ? 'تقييم مرونة البشرة...' : locale === 'ru' ? 'Оценка упругости...' : 'Evaluating skin firmness...',
      locale === 'ar' ? 'فحص أضرار الشمس...' : locale === 'ru' ? 'Проверка солнечных повреждений...' : 'Checking sun damage...',
      locale === 'ar' ? 'تحليل صحة الشفاه...' : locale === 'ru' ? 'Анализ здоровья губ...' : 'Analyzing lip health...',
      locale === 'ar' ? 'فحص الحواجب...' : locale === 'ru' ? 'Анализ бровей...' : 'Examining eyebrows...',
      locale === 'ar' ? 'تقدير عمر البشرة...' : locale === 'ru' ? 'Оценка возраста кожи...' : 'Estimating skin age...',
      locale === 'ar' ? 'تحديد نوع البشرة...' : locale === 'ru' ? 'Определение типа кожи...' : 'Classifying skin type...',
      locale === 'ar' ? 'إنشاء التقرير...' : locale === 'ru' ? 'Создание отчета...' : 'Generating report...',
    ]
    
    const updateProgress = async (step: number) => {
      setCaptureStep(steps[step] || '')
      setCaptureProgress(Math.round((step + 1) / steps.length * 100))
      // Small delay for smooth animation
      await new Promise(r => setTimeout(r, 150))
    }
    
    await updateProgress(0)
    
    // Find zones by name for accurate T-zone/cheek metrics
    const foreheadZone = faceZones.find(z => z.name === 'forehead')
    const noseZone = faceZones.find(z => z.name === 'nose')
    const leftCheekZone = faceZones.find(z => z.name === 'leftCheek')
    const rightCheekZone = faceZones.find(z => z.name === 'rightCheek')
    
    // Calculate T-zone oiliness (forehead + nose average)
    const tZoneOiliness = Math.round(
      ((foreheadZone?.metrics.oiliness ?? liveMetrics.oiliness) + 
       (noseZone?.metrics.oiliness ?? liveMetrics.oiliness)) / 2
    )
    
    // Calculate cheek hydration average
    const cheekHydration = Math.round(
      ((leftCheekZone?.metrics.hydration ?? liveMetrics.hydration) + 
       (rightCheekZone?.metrics.hydration ?? liveMetrics.hydration)) / 2
    )
    
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
      textureScore: liveMetrics.textureScore,
      poreVisibility: liveMetrics.oiliness > 60 ? 'visible' : liveMetrics.oiliness > 40 ? 'moderate' : 'minimal',
      evenness: liveMetrics.evenness,
      tZoneOiliness,
      cheekHydration,
      estimatedSkinAge: 30,
      lightingQuality: liveMetrics.lightingQuality,
      // Gender Detection
      gender: liveMetrics.gender,
      genderConfidence: liveMetrics.genderConfidence,
    }
    
    // P1-2: Include blemish analysis only if available
    if (blemishAnalysis) {
      result.blemishAnalysis = blemishAnalysis
    }

    // P2: Run additional analyses on capture (uses canvas image data)
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          
          // P2-1: Pore Analysis
          await updateProgress(1)
          try {
            result.poreAnalysis = analyzePores(imageData)
            if (result.poreAnalysis.visibility > 50) result.poreVisibility = 'visible'
            else if (result.poreAnalysis.visibility > 25) result.poreVisibility = 'moderate'
            else result.poreVisibility = 'minimal'
          } catch { /* continue */ }
          
          // P2-2: Under-Eye Analysis
          await updateProgress(2)
          try {
            result.underEyeAnalysis = analyzeUnderEye(imageData)
          } catch { /* continue */ }
          
          // P2-3: Firmness Analysis
          await updateProgress(3)
          try {
            result.firmnessAnalysis = analyzeFirmness(imageData)
          } catch { /* continue */ }
          
          // P2-4: Sun Damage
          await updateProgress(4)
          try {
            result.sunDamageAnalysis = analyzeSunDamage(imageData)
          } catch { /* continue */ }
          
          // P2-5: Lip Analysis
          await updateProgress(5)
          try {
            result.lipAnalysis = analyzeLips(imageData)
          } catch { /* continue */ }
          
          // P2-6: Eyebrow Analysis
          await updateProgress(6)
          try {
            result.eyebrowAnalysis = analyzeEyebrows(imageData)
          } catch { /* continue */ }
          
          // P2-7: Age Estimation
          await updateProgress(7)
          try {
            const ageAnalysisInput: {
              pores?: { visibility: number };
              underEye?: { healthScore: number };
              firmness?: { firmness: number };
            } = {}
            if (result.poreAnalysis) ageAnalysisInput.pores = { visibility: result.poreAnalysis.visibility }
            if (result.underEyeAnalysis) ageAnalysisInput.underEye = { healthScore: result.underEyeAnalysis.healthScore }
            if (result.firmnessAnalysis) ageAnalysisInput.firmness = { firmness: result.firmnessAnalysis.firmness }
            
            result.ageEstimation = estimateAge(imageData, ageAnalysisInput)
            result.estimatedSkinAge = result.ageEstimation.estimatedAge
            // Map middle-age to adult for SkinAnalysisResult compatibility
            const ageGroup = result.ageEstimation.ageGroup
            result.ageGroup = ageGroup === 'middle-age' ? 'adult' : ageGroup
          } catch { /* continue */ }
          
          // P2-8: Fitzpatrick Classification
          await updateProgress(8)
          try {
            result.fitzpatrickType = analyzeFitzpatrick(imageData)
            const fitzType = result.fitzpatrickType.type
            if (fitzType <= 2) result.skinTone = 'fair'
            else if (fitzType === 3) result.skinTone = 'light'
            else if (fitzType === 4) result.skinTone = 'medium'
            else if (fitzType === 5) result.skinTone = 'tan'
            else result.skinTone = 'deep'
          } catch { /* continue */ }
          
        } catch (e) {
          console.warn('P2 analysis failed:', e)
        }
      }
    }

    // Final step
    await updateProgress(9)
    await new Promise(r => setTimeout(r, 300)) // Brief pause to show completion
    
    setIsCapturing(false)
    onAnalysisComplete(result)
  }

  const generateConcerns = (metrics: LiveMetrics): string[] => {
    const concerns: string[] = []
    if (metrics.oiliness > 55) concerns.push('pore-care')
    if (metrics.hydration < 50) concerns.push('hydration')
    if (metrics.redness > 30) concerns.push('sensitivity')
    // P1-2: Add blemish-related concerns
    if (metrics.blemishLevel === 'moderate' || metrics.blemishLevel === 'severe') {
      concerns.push('acne-blemishes')
    } else if (metrics.blemishLevel === 'mild') {
      concerns.push('pore-care')
    }
    if (concerns.length === 0) concerns.push('hydration')
    return Array.from(new Set(concerns)) // Remove duplicates
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
      {/* Minimal Header - Apple Style */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-20"
        style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}
      >
        <button
          onClick={onClose}
          className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center active:scale-95 transition-all hover:bg-black/50"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        
        {/* Pause/Resume - Right side */}
        {arState === 'ready' || arState === 'paused' ? (
          <button
            onClick={togglePause}
            className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center active:scale-95 transition-all hover:bg-black/50"
          >
            {arState === 'paused' ? (
              <Play className="w-5 h-5 text-white" />
            ) : (
              <Pause className="w-5 h-5 text-white" />
            )}
          </button>
        ) : (
          <div className="w-11" />
        )}
      </div>

      {/* Camera View - Full Screen Hero */}
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

        {/* Loading State - Centered, Minimal */}
        {(arState === 'initializing' || arState === 'loading-model') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full border-2 border-white/20 border-t-white animate-spin mb-6" />
            <p className="text-white/90 text-lg font-medium tracking-wide">
              {arState === 'loading-model' ? t.loadingModel : t.analyzing}
            </p>
          </div>
        )}

        {/* Error State */}
        {arState === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm px-8">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <p className="text-white/90 text-center text-lg mb-8 max-w-sm">{error}</p>
            <button
              onClick={initARCamera}
              className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold active:scale-95 transition-transform"
            >
              <Camera className="w-5 h-5" />
              {t.tryAgain}
            </button>
          </div>
        )}

        {/* Paused Overlay */}
        {arState === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
              <Pause className="w-12 h-12 text-white/80" />
            </div>
          </div>
        )}

        {/* Apple-Style Capture Progress Overlay */}
        {isCapturing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-xl z-50">
            <div className="flex flex-col items-center">
              {/* Circular Progress Ring */}
              <div className="relative w-32 h-32 mb-8">
                {/* Background ring */}
                <svg className="w-32 h-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                    fill="none"
                  />
                  {/* Progress ring */}
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#captureGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${captureProgress * 3.52} 352`}
                    className="transition-all duration-300 ease-out"
                  />
                  <defs>
                    <linearGradient id="captureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="50%" stopColor="#818CF8" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Percentage */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-semibold text-3xl tracking-tight">
                    {captureProgress}%
                  </span>
                </div>
              </div>
              
              {/* Analysis Step Text */}
              <p className="text-white/90 text-lg font-medium tracking-wide mb-2">
                {locale === 'ar' ? 'تحليل البشرة' : locale === 'ru' ? 'Анализ кожи' : 'Analyzing Skin'}
              </p>
              <p className="text-white/50 text-sm max-w-xs text-center animate-pulse">
                {captureStep}
              </p>
              
              {/* Progress Steps Dots */}
              <div className="flex items-center gap-1.5 mt-6">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-1.5 h-1.5 rounded-full transition-all duration-300',
                      i < Math.ceil(captureProgress / 10)
                        ? 'bg-white scale-100'
                        : 'bg-white/20 scale-75'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Minimal Status - Top Center */}
        {(arState === 'ready' || arState === 'paused') && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10">
            <div className={cn(
              'px-5 py-2.5 rounded-full backdrop-blur-xl transition-all duration-300',
              liveMetrics.faceDetected 
                ? isStabilized 
                  ? 'bg-green-500/90' 
                  : 'bg-white/20'
                : 'bg-red-500/80'
            )}>
              <p className="text-white text-sm font-medium tracking-wide">
                {!liveMetrics.faceDetected 
                  ? t.faceNotDetected 
                  : isStabilized 
                    ? '✓ Ready to capture' 
                    : t.holdStill
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Elegant Bottom Panel - Apple Style */}
      {(arState === 'ready' || arState === 'paused') && liveMetrics.faceDetected && (
        <div 
          className="absolute bottom-0 left-0 right-0 z-20"
          style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))' }}
        >
          {/* Expandable Metrics Sheet */}
          <div className={cn(
            'mx-4 mb-6 rounded-3xl backdrop-blur-2xl overflow-hidden transition-all duration-500 ease-out',
            showDetailedMetrics 
              ? 'bg-black/80 max-h-[75vh]' 
              : 'bg-black/60 max-h-28'
          )}>
            {/* Compact Summary Bar - Always Visible */}
            <button 
              onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}
              className="w-full px-6 py-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {/* Skin Score Circle */}
                <div className="relative w-14 h-14">
                  <svg className="w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="url(#scoreGradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${liveMetrics.confidence * 1.51} 151`}
                      className="transition-all duration-700"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#34D399" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{liveMetrics.confidence}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-white font-semibold text-lg tracking-tight">
                    {skinTypeLabels[liveMetrics.skinType]?.[locale] || liveMetrics.skinType}
                  </p>
                  <p className="text-white/50 text-sm">
                    {liveMetrics.gender !== 'unknown' && (
                      <span className={liveMetrics.gender === 'male' ? 'text-blue-400' : 'text-pink-400'}>
                        {liveMetrics.gender === 'male' ? '♂' : '♀'} 
                      </span>
                    )}
                    {' '}Skin Analysis
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Quick Metrics Pills */}
                <div className="hidden sm:flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                    {liveMetrics.oiliness}% oil
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                    {liveMetrics.hydration}% hydrated
                  </span>
                </div>
                
                <ChevronUp className={cn(
                  'w-5 h-5 text-white/40 transition-transform duration-300',
                  showDetailedMetrics ? 'rotate-180' : ''
                )} />
              </div>
            </button>
            
            {/* Expanded Metrics */}
            {showDetailedMetrics && (
              <div className="px-6 pb-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-y-auto max-h-[calc(75vh-7rem)]">
                {/* Divider */}
                <div className="h-px bg-white/10" />
                
                {/* Primary Metrics - Large Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <MetricCardPro 
                    label={t.oiliness} 
                    value={liveMetrics.oiliness} 
                    icon={<Droplets className="w-5 h-5" />}
                    color="amber"
                  />
                  <MetricCardPro 
                    label={t.hydration} 
                    value={liveMetrics.hydration} 
                    icon={<Target className="w-5 h-5" />}
                    color="blue"
                  />
                </div>
                
                {/* Secondary Metrics - Compact Row */}
                <div className="grid grid-cols-4 gap-3">
                  <MetricPill label={t.redness} value={liveMetrics.redness} color="red" />
                  <MetricPill label={t.texture} value={liveMetrics.textureScore} color="cyan" />
                  <MetricPill label={t.evenness} value={liveMetrics.evenness} color="purple" />
                  <MetricPill label={t.skinClarity} value={100 - liveMetrics.blemishSeverity} color="green" />
                </div>
                
                {/* Skin Age & Gender Row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Skin Age Estimate */}
                  <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/40" />
                      <span className="text-white/50 text-xs">
                        {locale === 'ar' ? 'عمر البشرة' : locale === 'ru' ? 'Возраст' : 'Skin Age'}
                      </span>
                    </div>
                    <span className="text-white font-semibold">
                      ~{Math.round(25 + (100 - liveMetrics.evenness) * 0.2 + liveMetrics.blemishSeverity * 0.1)}
                    </span>
                  </div>
                  
                  {/* Gender */}
                  <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-white/40" />
                      <span className="text-white/50 text-xs">
                        {locale === 'ar' ? 'الجنس' : locale === 'ru' ? 'Пол' : 'Gender'}
                      </span>
                    </div>
                    <span className={cn(
                      'font-semibold',
                      liveMetrics.gender === 'male' ? 'text-blue-400' : 
                      liveMetrics.gender === 'female' ? 'text-pink-400' : 'text-white/50'
                    )}>
                      {liveMetrics.gender === 'male' 
                        ? (locale === 'ar' ? 'ذكر ♂' : locale === 'ru' ? 'Муж ♂' : 'Male ♂')
                        : liveMetrics.gender === 'female'
                        ? (locale === 'ar' ? 'أنثى ♀' : locale === 'ru' ? 'Жен ♀' : 'Female ♀')
                        : '—'}
                    </span>
                  </div>
                </div>
                
                {/* Advanced Analysis Section */}
                <div className="space-y-4 pt-2">
                  <div className="h-px bg-white/10" />
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
                    {locale === 'ar' ? 'تحليل متقدم' : locale === 'ru' ? 'Расширенный анализ' : 'Advanced Analysis'}
                  </p>
                  
                  {/* Advanced Metrics Grid - 3 columns */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Pore Size */}
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <CircleDot className="w-4 h-4 text-amber-400/70" />
                        <span className="text-white/50 text-xs">
                          {locale === 'ar' ? 'المسام' : locale === 'ru' ? 'Поры' : 'Pores'}
                        </span>
                      </div>
                      <p className="text-amber-300 font-semibold text-sm">
                        {liveMetrics.oiliness > 60 ? (locale === 'ar' ? 'كبيرة' : locale === 'ru' ? 'Крупные' : 'Large') : 
                         liveMetrics.oiliness > 40 ? (locale === 'ar' ? 'متوسطة' : locale === 'ru' ? 'Средние' : 'Medium') : 
                         (locale === 'ar' ? 'صغيرة' : locale === 'ru' ? 'Мелкие' : 'Small')}
                      </p>
                    </div>
                    
                    {/* Under-Eye */}
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-blue-400/70" />
                        <span className="text-white/50 text-xs">
                          {locale === 'ar' ? 'تحت العين' : locale === 'ru' ? 'Под глазами' : 'Under-Eye'}
                        </span>
                      </div>
                      <p className="text-blue-300 font-semibold text-sm">
                        {liveMetrics.hydration < 40 ? (locale === 'ar' ? 'متعبة' : locale === 'ru' ? 'Усталые' : 'Tired') : 
                         liveMetrics.hydration < 60 ? (locale === 'ar' ? 'عادية' : locale === 'ru' ? 'Нормальные' : 'Normal') : 
                         (locale === 'ar' ? 'مرتاحة' : locale === 'ru' ? 'Отдохнувшие' : 'Rested')}
                      </p>
                    </div>
                    
                    {/* Firmness */}
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-emerald-400/70" />
                        <span className="text-white/50 text-xs">
                          {locale === 'ar' ? 'المرونة' : locale === 'ru' ? 'Упругость' : 'Firmness'}
                        </span>
                      </div>
                      <p className="text-emerald-300 font-semibold text-sm">
                        {Math.round(liveMetrics.evenness * 0.8 + liveMetrics.textureScore * 0.2)}%
                      </p>
                    </div>
                    
                    {/* Sun Damage */}
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="w-4 h-4 text-orange-400/70" />
                        <span className="text-white/50 text-xs">
                          {locale === 'ar' ? 'أضرار الشمس' : locale === 'ru' ? 'Солнце' : 'Sun Damage'}
                        </span>
                      </div>
                      <p className={cn(
                        'font-semibold text-sm',
                        (100 - liveMetrics.evenness) > 50 ? 'text-orange-400' : 
                        (100 - liveMetrics.evenness) > 25 ? 'text-orange-300' : 'text-emerald-300'
                      )}>
                        {(100 - liveMetrics.evenness) > 50 ? (locale === 'ar' ? 'شديد' : locale === 'ru' ? 'Сильное' : 'Severe') : 
                         (100 - liveMetrics.evenness) > 25 ? (locale === 'ar' ? 'معتدل' : locale === 'ru' ? 'Умеренное' : 'Moderate') : 
                         (locale === 'ar' ? 'خفيف' : locale === 'ru' ? 'Легкое' : 'Low')}
                      </p>
                    </div>
                    
                    {/* Lip Health */}
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-rose-400/70" />
                        <span className="text-white/50 text-xs">
                          {locale === 'ar' ? 'الشفاه' : locale === 'ru' ? 'Губы' : 'Lips'}
                        </span>
                      </div>
                      <p className={cn(
                        'font-semibold text-sm',
                        liveMetrics.hydration < 40 ? 'text-rose-400' : 
                        liveMetrics.hydration < 60 ? 'text-amber-300' : 'text-emerald-300'
                      )}>
                        {liveMetrics.hydration < 40 ? (locale === 'ar' ? 'جافة' : locale === 'ru' ? 'Сухие' : 'Chapped') : 
                         liveMetrics.hydration < 60 ? (locale === 'ar' ? 'عادية' : locale === 'ru' ? 'Нормальные' : 'Normal') : 
                         (locale === 'ar' ? 'رطبة' : locale === 'ru' ? 'Увлажненные' : 'Hydrated')}
                      </p>
                    </div>
                    
                    {/* Skin Phototype (Fitzpatrick) */}
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/10">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-violet-400/70" />
                        <span className="text-white/50 text-xs">
                          {locale === 'ar' ? 'النمط' : locale === 'ru' ? 'Фототип' : 'Phototype'}
                        </span>
                      </div>
                      <p className="text-violet-300 font-semibold text-sm">
                        Type III
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Capture Button - Apple Camera Style */}
          <div className="flex justify-center">
            <button
              onClick={captureResults}
              disabled={!isStabilized || isCapturing}
              className={cn(
                'group relative w-20 h-20 rounded-full transition-all duration-300 active:scale-95',
                isStabilized && !isCapturing
                  ? 'bg-white hover:bg-white/90'
                  : 'bg-white/20 cursor-not-allowed'
              )}
            >
              {/* Inner ring */}
              <div className={cn(
                'absolute inset-2 rounded-full border-2 transition-colors',
                isStabilized && !isCapturing ? 'border-black/10' : 'border-white/20'
              )} />
              
              {/* Center dot when ready */}
              {isStabilized && !isCapturing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white group-hover:bg-white/90 transition-colors" />
                </div>
              )}
              
              {/* Not ready indicator */}
              {(!isStabilized || isCapturing) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                </div>
              )}
            </button>
          </div>
          
          {/* Hint Text */}
          <p className={cn(
            'text-center mt-4 tracking-wide transition-all duration-300',
            isStabilized && !isCapturing
              ? 'text-white text-sm font-medium animate-pulse'
              : 'text-white/40 text-xs'
          )}>
            {isCapturing 
              ? (locale === 'ar' ? 'جاري المعالجة...' : locale === 'ru' ? 'Обработка...' : 'Processing...')
              : isStabilized 
                ? (locale === 'ar' ? '👆 انقر للتحليل' : locale === 'ru' ? '👆 Нажмите для анализа' : '👆 Tap to run analysis')
                : (locale === 'ar' ? 'ابق ثابتاً...' : locale === 'ru' ? 'Не двигайтесь...' : 'Hold steady...')
            }
          </p>
        </div>
      )}
    </div>
  )

  if (!mounted) return null
  
  return createPortal(cameraContent, document.body)
}

// Professional Metric Card - Large Style
function MetricCardPro({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: 'amber' | 'blue' | 'red' | 'green' | 'purple' | 'cyan' | 'pink' | 'orange'
}) {
  const colorMap = {
    amber: { ring: 'stroke-amber-400', bg: 'bg-amber-500/10', text: 'text-amber-400' },
    blue: { ring: 'stroke-blue-400', bg: 'bg-blue-500/10', text: 'text-blue-400' },
    red: { ring: 'stroke-red-400', bg: 'bg-red-500/10', text: 'text-red-400' },
    green: { ring: 'stroke-emerald-400', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    purple: { ring: 'stroke-purple-400', bg: 'bg-purple-500/10', text: 'text-purple-400' },
    cyan: { ring: 'stroke-cyan-400', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
    pink: { ring: 'stroke-pink-400', bg: 'bg-pink-500/10', text: 'text-pink-400' },
    orange: { ring: 'stroke-orange-400', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  }
  
  const colors = colorMap[color]
  
  return (
    <div className={cn('rounded-2xl p-4 flex items-center gap-4', colors.bg)}>
      {/* Circular Progress */}
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg className="w-12 h-12 -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            className={cn('transition-all duration-500', colors.ring)}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${value * 1.26} 126`}
          />
        </svg>
        <div className={cn('absolute inset-0 flex items-center justify-center', colors.text)}>
          {icon}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-white/50 text-xs mb-1 truncate">{label}</p>
        <p className="text-white font-bold text-2xl tracking-tight">{value}%</p>
      </div>
    </div>
  )
}

// Compact Metric Pill
function MetricPill({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: 'amber' | 'blue' | 'red' | 'green' | 'purple' | 'cyan' | 'pink' | 'orange'
}) {
  const colorMap = {
    amber: 'text-amber-400',
    blue: 'text-blue-400',
    red: 'text-red-400',
    green: 'text-emerald-400',
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
    pink: 'text-pink-400',
    orange: 'text-orange-400',
  }
  
  return (
    <div className="bg-white/5 rounded-xl p-3 text-center">
      <p className={cn('text-xl font-bold mb-0.5', colorMap[color])}>{value}%</p>
      <p className="text-white/40 text-[10px] truncate">{label}</p>
    </div>
  )
}

export default ARSkinAnalysisCamera
