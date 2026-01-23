'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { 
  Camera, X, Sparkles, AlertCircle, Loader2, Sun, 
  Droplets, Target, Flame, Zap, Pause, Play,
  ChevronDown, ChevronUp, Scan, Clock, Eye, Palette, CircleDot, User
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import { type FaceDetectionResult, FACE_LANDMARKS } from '@/hooks/useFaceMesh'
import { cn } from '@/lib/utils'
import { 
  analyzeMultipleZones, 
  getBlemishLevelLabel, 
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
        videoRef.current.srcObject = stream
        // Wait for video to be ready with proper timeout handling
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error('Video element not available'))
            return
          }
          const video = videoRef.current
          let resolved = false
          
          const handleReady = () => {
            if (resolved) return
            resolved = true
            video.play()
              .then(() => resolve())
              .catch(reject)
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
          
          // Timeout for video load
          setTimeout(() => {
            if (!resolved) {
              resolved = true
              reject(new Error('Video load timed out'))
            }
          }, 10000)
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

          // Run gender analysis every 30 frames (less frequent, more stable)
          genderAnalysisFrameRef.current++
          let currentGender = genderAnalysis
          if (genderAnalysisFrameRef.current % 30 === 0 && metrics.faceDetected) {
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

    return {
      oiliness: avgOiliness,
      hydration: avgHydration,
      redness: avgRedness,
      skinType,
      confidence,
      faceDetected: true,
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

    if (!metrics.faceDetected) return

    // Draw face mesh landmarks if available (shows precise detection)
    if (faceDetection?.detected && faceDetection.landmarks && useFaceMeshDetection) {
      // Draw subtle face mesh points
      overlayCtx.fillStyle = 'rgba(99, 102, 241, 0.4)' // Indigo color
      
      // Draw key landmark points (not all 468 for performance)
      const keyLandmarkIndices = [
        ...FACE_LANDMARKS.FACE_OVAL, // Face outline
        ...FACE_LANDMARKS.NOSE.bridge,
        ...FACE_LANDMARKS.NOSE.tip,
      ]
      
      for (const idx of keyLandmarkIndices) {
        const landmark = faceDetection.landmarks[idx]
        if (landmark) {
          overlayCtx.beginPath()
          overlayCtx.arc(landmark.x, landmark.y, 2, 0, 2 * Math.PI)
          overlayCtx.fill()
        }
      }

      // Draw face oval from actual landmarks
      if (faceDetection.faceOval) {
        const oval = faceDetection.faceOval
        overlayCtx.strokeStyle = 'rgba(34, 197, 94, 0.8)' // Green for detected
        overlayCtx.lineWidth = 2
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
      }
    } else {
      // Draw approximate face oval guide when no face mesh
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

    // Draw zone overlays with color-coded metrics
    for (const zone of metrics.zones) {
      // Determine zone color based on metrics
      const hue = getMetricHue(zone.metrics.oiliness, zone.metrics.hydration, zone.metrics.redness)
      
      // Draw semi-transparent zone overlay
      overlayCtx.fillStyle = `hsla(${hue}, 70%, 50%, 0.15)`
      overlayCtx.strokeStyle = `hsla(${hue}, 70%, 50%, 0.5)`
      overlayCtx.lineWidth = 2
      
      // Draw rounded rectangle for zone
      const radius = Math.min(zone.width, zone.height) * 0.15
      overlayCtx.beginPath()
      overlayCtx.roundRect(zone.x, zone.y, zone.width, zone.height, radius)
      overlayCtx.fill()
      overlayCtx.stroke()

      // Draw zone label with background
      const label = `${zone.metrics.oiliness}%`
      overlayCtx.font = 'bold 11px system-ui'
      const textWidth = overlayCtx.measureText(label).width
      const labelX = zone.x + zone.width / 2
      const labelY = zone.y + zone.height / 2
      
      // Label background
      overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      overlayCtx.beginPath()
      overlayCtx.roundRect(labelX - textWidth / 2 - 4, labelY - 8, textWidth + 8, 16, 4)
      overlayCtx.fill()
      
      // Label text
      overlayCtx.fillStyle = 'white'
      overlayCtx.textAlign = 'center'
      overlayCtx.textBaseline = 'middle'
      overlayCtx.fillText(label, labelX, labelY)
    }
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
          try {
            result.poreAnalysis = analyzePores(imageData)
            if (result.poreAnalysis.visibility > 50) result.poreVisibility = 'visible'
            else if (result.poreAnalysis.visibility > 25) result.poreVisibility = 'moderate'
            else result.poreVisibility = 'minimal'
          } catch { /* continue */ }
          
          // P2-2: Under-Eye Analysis
          try {
            result.underEyeAnalysis = analyzeUnderEye(imageData)
          } catch { /* continue */ }
          
          // P2-3: Firmness Analysis
          try {
            result.firmnessAnalysis = analyzeFirmness(imageData)
          } catch { /* continue */ }
          
          // P2-4: Sun Damage
          try {
            result.sunDamageAnalysis = analyzeSunDamage(imageData)
          } catch { /* continue */ }
          
          // P2-5: Lip Analysis
          try {
            result.lipAnalysis = analyzeLips(imageData)
          } catch { /* continue */ }
          
          // P2-6: Eyebrow Analysis
          try {
            result.eyebrowAnalysis = analyzeEyebrows(imageData)
          } catch { /* continue */ }
          
          // P2-7: Age Estimation
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

            {/* Lighting & Face Mesh Indicators */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-3">
              {/* Face Mesh Status */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-sm ${
                useFaceMeshDetection ? 'bg-indigo-500/30' : 'bg-black/40'
              }`}>
                <Scan className={`w-3.5 h-3.5 ${useFaceMeshDetection ? 'text-indigo-300' : 'text-white/60'}`} />
                <span className={`text-[10px] font-medium ${useFaceMeshDetection ? 'text-indigo-200' : 'text-white/60'}`}>
                  {useFaceMeshDetection ? t.faceMeshActive : t.faceMeshFallback}
                </span>
              </div>
              
              {/* Lighting Indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
                <Sun className={`w-3.5 h-3.5 ${getLightingColor(liveMetrics.lightingQuality)}`} />
                <span className={`text-[10px] font-medium ${getLightingColor(liveMetrics.lightingQuality)}`}>
                  {getLightingLabel(liveMetrics.lightingQuality)}
                </span>
              </div>
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
          {/* Skin Type & Gender Badge */}
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
            {/* Gender Detection */}
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                liveMetrics.gender === 'male' 
                  ? 'bg-blue-500/20' 
                  : liveMetrics.gender === 'female' 
                    ? 'bg-pink-500/20' 
                    : 'bg-white/10'
              )}>
                <User className={cn(
                  'w-5 h-5',
                  liveMetrics.gender === 'male' 
                    ? 'text-blue-400' 
                    : liveMetrics.gender === 'female' 
                      ? 'text-pink-400' 
                      : 'text-white/40'
                )} />
              </div>
              <div>
                <p className="text-white/60 text-xs">{t.gender}</p>
                <p className={cn(
                  'font-bold text-lg',
                  liveMetrics.gender === 'male' 
                    ? 'text-blue-400' 
                    : liveMetrics.gender === 'female' 
                      ? 'text-pink-400' 
                      : 'text-white/40'
                )}>
                  {liveMetrics.gender === 'male' ? t.male : liveMetrics.gender === 'female' ? t.female : t.unknown}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs">Confidence</p>
              <p className="text-white font-bold text-lg">{liveMetrics.confidence}%</p>
            </div>
          </div>

          {/* Live Metrics Grid - Row 1 */}
          <div className="grid grid-cols-4 gap-2 mb-2">
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
            <LiveMetricCard
              icon={<Sparkles className="w-4 h-4" />}
              label={t.skinClarity}
              value={100 - liveMetrics.blemishSeverity}
              color="green"
              subtitle={getBlemishLevelLabel(liveMetrics.blemishLevel, locale)}
            />
          </div>
          
          {/* Live Metrics Grid - Row 2 */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <LiveMetricCard
              icon={<Eye className="w-4 h-4" />}
              label={t.texture}
              value={liveMetrics.textureScore}
              color="cyan"
            />
            <LiveMetricCard
              icon={<Palette className="w-4 h-4" />}
              label={t.evenness}
              value={liveMetrics.evenness}
              color="purple"
            />
            <LiveMetricCard
              icon={<CircleDot className="w-4 h-4" />}
              label={t.spots}
              value={Math.max(0, 100 - liveMetrics.blemishCount * 10)}
              color="pink"
              subtitle={`${liveMetrics.blemishCount} detected`}
            />
            <LiveMetricCard
              icon={<Clock className="w-4 h-4" />}
              label={t.skinAge}
              value={Math.round(25 + (100 - liveMetrics.evenness) * 0.2 + liveMetrics.blemishSeverity * 0.1)}
              color="orange"
              isAge={true}
              subtitle="estimated"
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
  subtitle,
  isAge,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: 'amber' | 'blue' | 'red' | 'green' | 'purple' | 'cyan' | 'pink' | 'orange'
  subtitle?: string
  isAge?: boolean
}) {
  const colorClasses = {
    amber: { bg: 'bg-amber-500/20', fill: 'bg-amber-500', text: 'text-amber-400' },
    blue: { bg: 'bg-blue-500/20', fill: 'bg-blue-500', text: 'text-blue-400' },
    red: { bg: 'bg-red-500/20', fill: 'bg-red-500', text: 'text-red-400' },
    green: { bg: 'bg-emerald-500/20', fill: 'bg-emerald-500', text: 'text-emerald-400' },
    purple: { bg: 'bg-purple-500/20', fill: 'bg-purple-500', text: 'text-purple-400' },
    cyan: { bg: 'bg-cyan-500/20', fill: 'bg-cyan-500', text: 'text-cyan-400' },
    pink: { bg: 'bg-pink-500/20', fill: 'bg-pink-500', text: 'text-pink-400' },
    orange: { bg: 'bg-orange-500/20', fill: 'bg-orange-500', text: 'text-orange-400' },
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2.5">
      <div className={cn('w-5 h-5 rounded-full mb-1.5 flex items-center justify-center', colorClasses[color].bg)}>
        <span className={colorClasses[color].text}>{icon}</span>
      </div>
      <p className="text-white/50 text-[9px] mb-0.5 truncate">{label}</p>
      <p className="text-white font-bold text-lg leading-tight">
        {isAge ? `~${value}` : `${value}%`}
      </p>
      {subtitle && (
        <p className={cn('text-[8px] mt-0.5 truncate', colorClasses[color].text)}>{subtitle}</p>
      )}
      {!isAge && (
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
          <div
            className={cn('h-full rounded-full transition-all duration-300', colorClasses[color].fill)}
            style={{ width: `${value}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default ARSkinAnalysisCamera
