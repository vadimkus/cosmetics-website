'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Camera, X, RefreshCw, Check, Sparkles, AlertCircle, Loader2, Sun, Moon, Eye, Droplets, Flame, Target, Clock, Info, ShieldCheck } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import { cn } from '@/lib/utils'

// Skin analysis result types
export interface SkinAnalysisResult {
  skinType: 'dry' | 'oily' | 'combination' | 'normal' | 'sensitive'
  confidence: number // 0-100
  concerns: string[]
  recommendations: string[]
  ageGroup?: 'teen' | 'young-adult' | 'adult' | 'mature'
  oilinessLevel: number // 0-100
  hydrationLevel: number // 0-100
  rednessLevel: number // 0-100
  // New detailed metrics
  skinTone: 'fair' | 'light' | 'medium' | 'tan' | 'deep'
  undertone: 'warm' | 'cool' | 'neutral'
  textureScore: number // 0-100 (smoothness)
  poreVisibility: 'minimal' | 'moderate' | 'visible'
  evenness: number // 0-100 (color uniformity)
  tZoneOiliness: number // 0-100
  cheekHydration: number // 0-100
  estimatedSkinAge: number
  lightingQuality: 'poor' | 'fair' | 'good' | 'excellent'
}

interface SkinAnalysisCameraProps {
  onAnalysisComplete: (result: SkinAnalysisResult) => void
  onClose: () => void
  className?: string
}

type CameraState = 'initializing' | 'ready' | 'countdown' | 'capturing' | 'analyzing' | 'complete' | 'error'


export function SkinAnalysisCamera({
  onAnalysisComplete,
  onClose,
  className,
}: SkinAnalysisCameraProps) {
  const { locale } = useTranslation()
  const haptic = useHapticFeedback()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [cameraState, setCameraState] = useState<CameraState>('initializing')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [lightingWarning, setLightingWarning] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savePhoto, setSavePhoto] = useState(true) // Option to save photo

  // Translations
  const t = {
    title: locale === 'ar' ? 'تحليل البشرة بالذكاء الاصطناعي' : locale === 'ru' ? 'AI Анализ кожи' : 'AI Skin Analysis',
    subtitle: locale === 'ar' ? 'التقط صورة سيلفي للتحليل المتقدم' : locale === 'ru' ? 'Сделайте селфи для детального анализа' : 'Take a selfie for detailed analysis',
    positionFace: locale === 'ar' ? 'ضع وجهك في الإطار' : locale === 'ru' ? 'Расположите лицо в рамке' : 'Position your face in the oval',
    goodLighting: locale === 'ar' ? 'إضاءة طبيعية أفضل' : locale === 'ru' ? 'Естественный свет лучше' : 'Natural light works best',
    noMakeup: locale === 'ar' ? 'بدون مكياج للحصول على نتائج دقيقة' : locale === 'ru' ? 'Без макияжа для точного анализа' : 'No makeup for accurate results',
    capture: locale === 'ar' ? 'تحليل' : locale === 'ru' ? 'Анализ' : 'Analyze',
    retake: locale === 'ar' ? 'إعادة' : locale === 'ru' ? 'Заново' : 'Retake',
    analyzing: locale === 'ar' ? 'جاري تحليل بشرتك...' : locale === 'ru' ? 'Анализируем вашу кожу...' : 'Analyzing your skin...',
    useResults: locale === 'ar' ? 'استخدم النتائج' : locale === 'ru' ? 'Применить' : 'Apply Results',
    cameraError: locale === 'ar' ? 'لا يمكن الوصول للكاميرا' : locale === 'ru' ? 'Нет доступа к камере' : 'Cannot access camera',
    permissionDenied: locale === 'ar' ? 'تم رفض إذن الكاميرا' : locale === 'ru' ? 'Доступ к камере запрещен' : 'Camera permission denied',
    tryAgain: locale === 'ar' ? 'حاول مرة أخرى' : locale === 'ru' ? 'Попробовать снова' : 'Try Again',
    skinType: locale === 'ar' ? 'نوع البشرة' : locale === 'ru' ? 'Тип кожи' : 'Skin Type',
    confidence: locale === 'ar' ? 'دقة التحليل' : locale === 'ru' ? 'Точность' : 'Accuracy',
    oiliness: locale === 'ar' ? 'الدهنية' : locale === 'ru' ? 'Жирность' : 'Oiliness',
    hydration: locale === 'ar' ? 'الترطيب' : locale === 'ru' ? 'Увлажнение' : 'Hydration',
    redness: locale === 'ar' ? 'الاحمرار' : locale === 'ru' ? 'Покраснение' : 'Redness',
    texture: locale === 'ar' ? 'نعومة البشرة' : locale === 'ru' ? 'Гладкость' : 'Smoothness',
    evenness: locale === 'ar' ? 'توحد اللون' : locale === 'ru' ? 'Однородность' : 'Evenness',
    pores: locale === 'ar' ? 'المسام' : locale === 'ru' ? 'Поры' : 'Pores',
    skinAge: locale === 'ar' ? 'عمر البشرة' : locale === 'ru' ? 'Возраст кожи' : 'Skin Age',
    skinTone: locale === 'ar' ? 'لون البشرة' : locale === 'ru' ? 'Тон кожи' : 'Skin Tone',
    undertone: locale === 'ar' ? 'الدرجة الأساسية' : locale === 'ru' ? 'Подтон' : 'Undertone',
    tZone: locale === 'ar' ? 'منطقة T' : locale === 'ru' ? 'T-зона' : 'T-Zone',
    cheeks: locale === 'ar' ? 'الخدين' : locale === 'ru' ? 'Щеки' : 'Cheeks',
    viewDetails: locale === 'ar' ? 'عرض التفاصيل' : locale === 'ru' ? 'Подробнее' : 'View Details',
    hideDetails: locale === 'ar' ? 'إخفاء التفاصيل' : locale === 'ru' ? 'Скрыть' : 'Hide Details',
    lowLight: locale === 'ar' ? 'الإضاءة ضعيفة' : locale === 'ru' ? 'Мало света' : 'Low light detected',
    betterLight: locale === 'ar' ? 'توجه للإضاءة' : locale === 'ru' ? 'Найдите свет' : 'Move to better lighting',
    years: locale === 'ar' ? 'سنة' : locale === 'ru' ? 'лет' : 'years',
    // Analysis steps
    step1: locale === 'ar' ? 'تحليل لون البشرة...' : locale === 'ru' ? 'Анализ тона кожи...' : 'Analyzing skin tone...',
    step2: locale === 'ar' ? 'فحص المسام والملمس...' : locale === 'ru' ? 'Проверка пор и текстуры...' : 'Checking pores & texture...',
    step3: locale === 'ar' ? 'قياس مستويات الترطيب...' : locale === 'ru' ? 'Измерение увлажнения...' : 'Measuring hydration levels...',
    step4: locale === 'ar' ? 'تحديد نوع البشرة...' : locale === 'ru' ? 'Определение типа кожи...' : 'Determining skin type...',
    step5: locale === 'ar' ? 'إنشاء التوصيات...' : locale === 'ru' ? 'Создание рекомендаций...' : 'Generating recommendations...',
  }

  // Skin type labels with descriptions
  const skinTypeData: Record<string, { 
    label: Record<string, string>
    emoji: string
    description: Record<string, string>
  }> = {
    dry: { 
      label: { en: 'Dry', ar: 'جافة', ru: 'Сухая' },
      emoji: '🏜️',
      description: { 
        en: 'Your skin lacks moisture and may feel tight',
        ar: 'بشرتك تفتقر للرطوبة وقد تشعر بالشد',
        ru: 'Вашей коже не хватает влаги, может ощущаться стянутость'
      }
    },
    oily: { 
      label: { en: 'Oily', ar: 'دهنية', ru: 'Жирная' },
      emoji: '💧',
      description: { 
        en: 'Your skin produces excess sebum',
        ar: 'بشرتك تفرز الزيوت الزائدة',
        ru: 'Ваша кожа вырабатывает избыток себума'
      }
    },
    combination: { 
      label: { en: 'Combination', ar: 'مختلطة', ru: 'Комбинированная' },
      emoji: '⚖️',
      description: { 
        en: 'Oily T-zone with dry or normal cheeks',
        ar: 'منطقة T دهنية مع خدين جافين أو عاديين',
        ru: 'Жирная Т-зона с сухими или нормальными щеками'
      }
    },
    normal: { 
      label: { en: 'Normal', ar: 'عادية', ru: 'Нормальная' },
      emoji: '✨',
      description: { 
        en: 'Well-balanced skin with minimal concerns',
        ar: 'بشرة متوازنة مع مخاوف قليلة',
        ru: 'Хорошо сбалансированная кожа с минимальными проблемами'
      }
    },
    sensitive: { 
      label: { en: 'Sensitive', ar: 'حساسة', ru: 'Чувствительная' },
      emoji: '🌸',
      description: { 
        en: 'Prone to redness and reactions',
        ar: 'عرضة للاحمرار والتفاعلات',
        ru: 'Склонна к покраснениям и реакциям'
      }
    },
  }

  const poreLabels: Record<string, Record<string, string>> = {
    minimal: { en: 'Minimal', ar: 'بالكاد مرئية', ru: 'Минимальные' },
    moderate: { en: 'Moderate', ar: 'متوسطة', ru: 'Умеренные' },
    visible: { en: 'Visible', ar: 'واضحة', ru: 'Заметные' },
  }

  const undertoneLabels: Record<string, Record<string, string>> = {
    warm: { en: 'Warm', ar: 'دافئة', ru: 'Теплый' },
    cool: { en: 'Cool', ar: 'باردة', ru: 'Холодный' },
    neutral: { en: 'Neutral', ar: 'محايدة', ru: 'Нейтральный' },
  }

  const skinToneLabels: Record<string, Record<string, string>> = {
    fair: { en: 'Fair', ar: 'فاتحة جداً', ru: 'Очень светлый' },
    light: { en: 'Light', ar: 'فاتحة', ru: 'Светлый' },
    medium: { en: 'Medium', ar: 'متوسطة', ru: 'Средний' },
    tan: { en: 'Tan', ar: 'قمحية', ru: 'Загорелый' },
    deep: { en: 'Deep', ar: 'داكنة', ru: 'Темный' },
  }

  // Initialize camera
  useEffect(() => {
    initCamera()
    return () => {
      stopCamera()
    }
  }, [facingMode])

  // Check lighting periodically
  useEffect(() => {
    if (cameraState !== 'ready') return

    const checkLighting = () => {
      if (!videoRef.current || !canvasRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 100
      canvas.height = 100
      ctx.drawImage(videoRef.current, 0, 0, 100, 100)
      const imageData = ctx.getImageData(0, 0, 100, 100)
      
      let brightness = 0
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i] ?? 0
        const g = imageData.data[i+1] ?? 0
        const b = imageData.data[i+2] ?? 0
        brightness += (r + g + b) / 3
      }
      brightness = brightness / (100 * 100)

      if (brightness < 60) {
        setLightingWarning(t.lowLight)
      } else if (brightness < 90) {
        setLightingWarning(t.betterLight)
      } else {
        setLightingWarning(null)
      }
    }

    const interval = setInterval(checkLighting, 1000)
    return () => clearInterval(interval)
  }, [cameraState, t.lowLight, t.betterLight])

  const initCamera = async () => {
    setCameraState('initializing')
    setError(null)

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraState('ready')
      }
    } catch (err) {
      console.error('Camera init error:', err)
      
      if ((err as Error).name === 'NotAllowedError') {
        setError(t.permissionDenied)
      } else {
        setError(t.cameraError)
      }
      setCameraState('error')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const startCountdown = useCallback(() => {
    haptic.light()
    setCameraState('countdown')
    setCountdown(3)
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          captureImage()
          return null
        }
        haptic.light()
        return prev - 1
      })
    }, 1000)
  }, [haptic])

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    haptic.medium()
    setCameraState('capturing')

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    // High resolution capture
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Mirror for selfie camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL('image/jpeg', 0.95)
    setCapturedImage(imageData)
    stopCamera()

    // Start analysis with progress
    analyzeImage(ctx, canvas.width, canvas.height)
  }, [facingMode, haptic])

  const analyzeImage = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    setCameraState('analyzing')
    setAnalysisProgress(0)

    const imageData = ctx.getImageData(0, 0, width, height)
    const pixels = imageData.data

    // Simulate progressive analysis for UX
    const steps = [
      { progress: 20, delay: 400 },
      { progress: 40, delay: 800 },
      { progress: 60, delay: 1200 },
      { progress: 80, delay: 1600 },
      { progress: 100, delay: 2000 },
    ]

    steps.forEach(({ progress, delay }) => {
      setTimeout(() => setAnalysisProgress(progress), delay)
    })

    setTimeout(() => {
      const result = performAdvancedSkinAnalysis(pixels, width, height)
      setAnalysisResult(result)
      setCameraState('complete')
      haptic.success()
    }, 2500)
  }

  // Advanced skin analysis with multiple zone sampling
  const performAdvancedSkinAnalysis = (
    pixels: Uint8ClampedArray,
    width: number,
    height: number
  ): SkinAnalysisResult => {
    
    // Define analysis zones (approximate face regions)
    const zones = {
      forehead: { x: width * 0.35, y: height * 0.2, w: width * 0.3, h: height * 0.12 },
      nose: { x: width * 0.42, y: height * 0.35, w: width * 0.16, h: height * 0.2 },
      leftCheek: { x: width * 0.2, y: height * 0.35, w: width * 0.18, h: height * 0.18 },
      rightCheek: { x: width * 0.62, y: height * 0.35, w: width * 0.18, h: height * 0.18 },
      chin: { x: width * 0.38, y: height * 0.6, w: width * 0.24, h: height * 0.12 },
    }

    // Analyze each zone
    const zoneResults: Record<string, ZoneAnalysis> = {}
    for (const [zoneName, zone] of Object.entries(zones)) {
      zoneResults[zoneName] = analyzeZone(pixels, width, zone)
    }

    // Default zone for safety
    const defaultZone: ZoneAnalysis = {
      oiliness: 50, hydration: 50, redness: 20, smoothness: 70, evenness: 70,
      brightness: 130, avgR: 180, avgG: 150, avgB: 130
    }

    // Get zone with fallback
    const getZone = (name: string): ZoneAnalysis => zoneResults[name] || defaultZone
    
    const forehead = getZone('forehead')
    const nose = getZone('nose')
    const leftCheek = getZone('leftCheek')
    const rightCheek = getZone('rightCheek')
    const chin = getZone('chin')

    // Calculate T-zone metrics (forehead + nose)
    const tZoneOiliness = Math.round((forehead.oiliness + nose.oiliness) / 2)

    // Calculate cheek metrics
    const cheekHydration = Math.round((leftCheek.hydration + rightCheek.hydration) / 2)

    // Overall metrics (weighted average)
    const avgOiliness = Math.round(
      forehead.oiliness * 0.25 +
      nose.oiliness * 0.25 +
      leftCheek.oiliness * 0.15 +
      rightCheek.oiliness * 0.15 +
      chin.oiliness * 0.2
    )

    const avgHydration = Math.round(
      forehead.hydration * 0.2 +
      leftCheek.hydration * 0.3 +
      rightCheek.hydration * 0.3 +
      chin.hydration * 0.2
    )

    const avgRedness = Math.round(
      Object.values(zoneResults).reduce((sum, z) => sum + z.redness, 0) / 
      Math.max(1, Object.values(zoneResults).length)
    )

    const avgTexture = Math.round(
      Object.values(zoneResults).reduce((sum, z) => sum + z.smoothness, 0) / 
      Math.max(1, Object.values(zoneResults).length)
    )

    const avgEvenness = Math.round(
      Object.values(zoneResults).reduce((sum, z) => sum + z.evenness, 0) / 
      Math.max(1, Object.values(zoneResults).length)
    )

    // Determine skin tone from cheek areas (most reliable)
    const skinTone = determineSkinTone(
      (leftCheek.avgR + rightCheek.avgR) / 2,
      (leftCheek.avgG + rightCheek.avgG) / 2,
      (leftCheek.avgB + rightCheek.avgB) / 2
    )

    // Determine undertone
    const undertone = determineUndertone(
      (leftCheek.avgR + rightCheek.avgR) / 2,
      (leftCheek.avgG + rightCheek.avgG) / 2,
      (leftCheek.avgB + rightCheek.avgB) / 2
    )

    // Determine pore visibility from T-zone texture
    let poreVisibility: 'minimal' | 'moderate' | 'visible' = 'minimal'
    const tZoneTexture = (forehead.smoothness + nose.smoothness) / 2
    if (tZoneTexture < 50) poreVisibility = 'visible'
    else if (tZoneTexture < 70) poreVisibility = 'moderate'

    // Determine skin type with improved logic
    let skinType: SkinAnalysisResult['skinType'] = 'normal'
    let confidence = 75

    // Check for combination skin first (T-zone vs cheeks difference)
    const oilDifference = Math.abs(tZoneOiliness - avgOiliness)

    if (oilDifference > 20 || (tZoneOiliness > 60 && cheekHydration < 50)) {
      skinType = 'combination'
      confidence = 80 + Math.min(10, oilDifference / 3)
    } else if (avgRedness > 35 && avgHydration < 60) {
      skinType = 'sensitive'
      confidence = 70 + Math.min(15, avgRedness / 3)
    } else if (avgOiliness > 60) {
      skinType = 'oily'
      confidence = 75 + Math.min(15, (avgOiliness - 60) / 2)
    } else if (avgHydration < 40) {
      skinType = 'dry'
      confidence = 75 + Math.min(15, (40 - avgHydration) / 2)
    } else {
      skinType = 'normal'
      confidence = 80 + Math.min(10, avgTexture / 10)
    }

    confidence = Math.min(95, Math.round(confidence))

    // Estimate skin age based on texture, evenness, and hydration
    let estimatedSkinAge = 25 // Base age
    if (avgTexture < 70) estimatedSkinAge += Math.round((70 - avgTexture) / 5)
    if (avgEvenness < 70) estimatedSkinAge += Math.round((70 - avgEvenness) / 7)
    if (avgHydration < 50) estimatedSkinAge += Math.round((50 - avgHydration) / 10)
    estimatedSkinAge = Math.max(18, Math.min(65, estimatedSkinAge))

    // Determine age group from estimated skin age
    let ageGroup: SkinAnalysisResult['ageGroup'] = 'young-adult'
    if (estimatedSkinAge < 20) ageGroup = 'teen'
    else if (estimatedSkinAge < 30) ageGroup = 'young-adult'
    else if (estimatedSkinAge < 45) ageGroup = 'adult'
    else ageGroup = 'mature'

    // Determine lighting quality
    const zoneCount = Math.max(1, Object.values(zoneResults).length)
    const avgBrightness = Object.values(zoneResults).reduce((sum, z) => sum + z.brightness, 0) / zoneCount
    let lightingQuality: SkinAnalysisResult['lightingQuality'] = 'good'
    if (avgBrightness < 80) lightingQuality = 'poor'
    else if (avgBrightness < 120) lightingQuality = 'fair'
    else if (avgBrightness > 200) lightingQuality = 'fair' // Too bright
    else if (avgBrightness > 160) lightingQuality = 'excellent'

    // Adjust confidence based on lighting
    if (lightingQuality === 'poor') confidence = Math.max(50, confidence - 15)
    else if (lightingQuality === 'fair') confidence = Math.max(60, confidence - 8)

    // Generate concerns
    const concerns: string[] = []
    if (avgOiliness > 55) concerns.push('pore-care')
    if (avgHydration < 50) concerns.push('hydration')
    if (avgRedness > 30) concerns.push('sensitivity')
    if (avgTexture < 60) concerns.push('anti-aging')
    if (avgEvenness < 60) concerns.push('brightening')
    if (skinType === 'oily' && avgTexture < 70) concerns.push('acne-blemishes')
    if (ageGroup === 'mature' || ageGroup === 'adult') concerns.push('eye-care')
    if (concerns.length === 0) concerns.push('hydration') // Default

    // Generate personalized recommendations
    const recommendations = generateRecommendations(skinType, concerns, locale)

    return {
      skinType,
      confidence,
      concerns,
      recommendations,
      ageGroup,
      oilinessLevel: avgOiliness,
      hydrationLevel: avgHydration,
      rednessLevel: avgRedness,
      skinTone,
      undertone,
      textureScore: avgTexture,
      poreVisibility,
      evenness: avgEvenness,
      tZoneOiliness,
      cheekHydration,
      estimatedSkinAge,
      lightingQuality,
    }
  }

  interface ZoneAnalysis {
    oiliness: number
    hydration: number
    redness: number
    smoothness: number
    evenness: number
    brightness: number
    avgR: number
    avgG: number
    avgB: number
  }

  const analyzeZone = (
    pixels: Uint8ClampedArray,
    imageWidth: number,
    zone: { x: number; y: number; w: number; h: number }
  ): ZoneAnalysis => {
    let totalR = 0, totalG = 0, totalB = 0
    let count = 0
    const brightnesses: number[] = []
    const colorVariances: number[] = []

    const startX = Math.floor(zone.x)
    const startY = Math.floor(zone.y)
    const endX = Math.floor(zone.x + zone.w)
    const endY = Math.floor(zone.y + zone.h)

    // Sample every other pixel for performance
    for (let y = startY; y < endY; y += 2) {
      for (let x = startX; x < endX; x += 2) {
        const i = (y * imageWidth + x) * 4
        const r = pixels[i] ?? 0
        const g = pixels[i + 1] ?? 0
        const b = pixels[i + 2] ?? 0

        totalR += r
        totalG += g
        totalB += b

        const brightness = (r + g + b) / 3
        brightnesses.push(brightness)
        
        // Color variance for evenness
        colorVariances.push(Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r))
        
        count++
      }
    }

    if (count === 0) count = 1

    const avgR = totalR / count
    const avgG = totalG / count
    const avgB = totalB / count
    const avgBrightness = brightnesses.reduce((a, b) => a + b, 0) / count

    // Calculate variance for texture analysis
    let brightnessVariance = 0
    for (const b of brightnesses) {
      brightnessVariance += (b - avgBrightness) ** 2
    }
    brightnessVariance = brightnessVariance / count

    // Calculate color evenness
    const avgColorVariance = colorVariances.reduce((a, b) => a + b, 0) / count

    // Oiliness: Based on brightness and low variance (smooth = shiny = oily)
    const oiliness = Math.min(100, Math.max(0,
      (avgBrightness / 255 * 60) + 
      (brightnessVariance < 300 ? 25 : 0) + 
      (brightnessVariance < 150 ? 15 : 0) - 20
    ))

    // Hydration: Based on color balance and moderate brightness
    const colorBalance = 100 - Math.min(100, Math.abs(avgR - avgG) * 0.8 + Math.abs(avgG - avgB) * 0.5)
    const hydration = Math.min(100, Math.max(0,
      colorBalance * 0.5 + 
      (avgBrightness > 100 && avgBrightness < 180 ? 30 : 10) +
      (brightnessVariance < 500 ? 20 : 0)
    ))

    // Redness: Red channel dominance over green
    const redness = Math.min(100, Math.max(0,
      (avgR - avgG) * 1.2 + (avgR - avgB) * 0.6 + 10
    ))

    // Smoothness: Inverse of texture variance
    const smoothness = Math.min(100, Math.max(0,
      100 - Math.min(100, brightnessVariance / 15)
    ))

    // Evenness: Based on color uniformity
    const evenness = Math.min(100, Math.max(0,
      100 - Math.min(100, avgColorVariance / 2)
    ))

    return {
      oiliness: Math.round(oiliness),
      hydration: Math.round(hydration),
      redness: Math.round(redness),
      smoothness: Math.round(smoothness),
      evenness: Math.round(evenness),
      brightness: Math.round(avgBrightness),
      avgR,
      avgG,
      avgB,
    }
  }

  const determineSkinTone = (r: number, g: number, b: number): SkinAnalysisResult['skinTone'] => {
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b
    
    if (luminance > 200) return 'fair'
    if (luminance > 160) return 'light'
    if (luminance > 120) return 'medium'
    if (luminance > 80) return 'tan'
    return 'deep'
  }

  const determineUndertone = (r: number, g: number, b: number): SkinAnalysisResult['undertone'] => {
    // Warm undertones have more yellow/red
    // Cool undertones have more blue/pink
    const warmScore = (r - b) + (g - b) * 0.5
    
    if (warmScore > 30) return 'warm'
    if (warmScore < -10) return 'cool'
    return 'neutral'
  }

  const generateRecommendations = (
    skinType: SkinAnalysisResult['skinType'],
    concerns: string[],
    lang: string
  ): string[] => {
    const recs: string[] = []
    
    const recommendations: Record<string, Record<string, string[]>> = {
      oily: {
        en: [
          'Use a gentle, foaming cleanser twice daily',
          'Apply oil-free, non-comedogenic moisturizer',
          'Try products with niacinamide for pore control',
          'Use clay masks 1-2 times per week',
        ],
        ar: [
          'استخدم غسول رغوي لطيف مرتين يومياً',
          'ضع مرطب خالي من الزيوت',
          'جرب منتجات بالنياسيناميد للتحكم بالمسام',
          'استخدم أقنعة الطين 1-2 مرة أسبوعياً',
        ],
        ru: [
          'Используйте мягкую пенку для умывания дважды в день',
          'Наносите безмасляный увлажняющий крем',
          'Попробуйте средства с ниацинамидом',
          'Делайте глиняные маски 1-2 раза в неделю',
        ],
      },
      dry: {
        en: [
          'Use a cream or oil-based cleanser',
          'Apply rich moisturizer while skin is damp',
          'Look for hyaluronic acid and ceramides',
          'Avoid hot water when cleansing',
        ],
        ar: [
          'استخدم منظف كريمي أو زيتي',
          'ضع مرطب غني على بشرة رطبة',
          'ابحث عن حمض الهيالورونيك والسيراميد',
          'تجنب الماء الساخن عند التنظيف',
        ],
        ru: [
          'Используйте кремовое или масляное очищающее средство',
          'Наносите насыщенный крем на влажную кожу',
          'Ищите гиалуроновую кислоту и керамиды',
          'Избегайте горячей воды при умывании',
        ],
      },
      combination: {
        en: [
          'Use a gel cleanser for balance',
          'Apply lighter products on T-zone',
          'Use different products for different areas',
          'Try multi-masking techniques',
        ],
        ar: [
          'استخدم غسول جل للتوازن',
          'ضع منتجات خفيفة على منطقة T',
          'استخدم منتجات مختلفة لمناطق مختلفة',
          'جرب تقنية الأقنعة المتعددة',
        ],
        ru: [
          'Используйте гелевое очищающее средство',
          'Наносите легкие текстуры на Т-зону',
          'Используйте разные средства для разных зон',
          'Попробуйте мультимаскинг',
        ],
      },
      sensitive: {
        en: [
          'Choose fragrance-free products',
          'Look for soothing ingredients like aloe',
          'Patch test new products first',
          'Avoid harsh exfoliants',
        ],
        ar: [
          'اختر منتجات خالية من العطور',
          'ابحث عن مكونات مهدئة مثل الألوفيرا',
          'اختبر المنتجات الجديدة أولاً',
          'تجنب المقشرات القوية',
        ],
        ru: [
          'Выбирайте продукты без отдушек',
          'Ищите успокаивающие ингредиенты',
          'Тестируйте новые средства на запястье',
          'Избегайте агрессивных пилингов',
        ],
      },
      normal: {
        en: [
          'Maintain your balanced routine',
          'Don\'t forget SPF daily',
          'Stay hydrated inside and out',
          'Treat occasional concerns as needed',
        ],
        ar: [
          'حافظ على روتينك المتوازن',
          'لا تنس واقي الشمس يومياً',
          'حافظ على ترطيبك داخلياً وخارجياً',
          'عالج المخاوف العرضية عند الحاجة',
        ],
        ru: [
          'Поддерживайте сбалансированный уход',
          'Не забывайте SPF ежедневно',
          'Пейте достаточно воды',
          'Решайте проблемы по мере появления',
        ],
      },
    }

    const langKey = lang === 'ar' ? 'ar' : lang === 'ru' ? 'ru' : 'en'
    const defaultRecs = ['Maintain your balanced routine', 'Don\'t forget SPF daily']
    const typeRecs = recommendations[skinType]?.[langKey] || recommendations.normal?.en || defaultRecs
    recs.push(...typeRecs.slice(0, 2))

    // Add concern-specific recommendations
    if (concerns.includes('anti-aging')) {
      recs.push(
        lang === 'ar' ? 'استخدم منتجات بالريتينول ليلاً' :
        lang === 'ru' ? 'Используйте ретинол на ночь' :
        'Use retinol products at night'
      )
    }

    return recs.slice(0, 4)
  }

  const retakePhoto = () => {
    haptic.light()
    setCapturedImage(null)
    setAnalysisResult(null)
    setCameraState('initializing')
    setShowDetails(false)
    initCamera()
  }

  const switchCamera = () => {
    haptic.light()
    stopCamera()
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  const handleUseResults = async () => {
    if (!analysisResult) return
    
    setIsSaving(true)
    haptic.success()
    
    try {
      // Save analysis to database
      const response = await fetch('/api/skin-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: savePhoto ? capturedImage : null, // Only save if user opted in
          skinType: analysisResult.skinType,
          confidence: analysisResult.confidence,
          oilinessLevel: analysisResult.oilinessLevel,
          hydrationLevel: analysisResult.hydrationLevel,
          rednessLevel: analysisResult.rednessLevel,
          textureScore: analysisResult.textureScore,
          evennessScore: analysisResult.evenness,
          tZoneOiliness: analysisResult.tZoneOiliness,
          cheekHydration: analysisResult.cheekHydration,
          skinTone: analysisResult.skinTone,
          undertone: analysisResult.undertone,
          poreVisibility: analysisResult.poreVisibility,
          estimatedSkinAge: analysisResult.estimatedSkinAge,
          concerns: analysisResult.concerns,
          recommendations: analysisResult.recommendations,
          ageGroup: analysisResult.ageGroup,
          lightingQuality: analysisResult.lightingQuality,
          locale,
        }),
      })
      
      if (!response.ok) {
        console.error('Failed to save skin analysis')
      }
    } catch (error) {
      console.error('Error saving skin analysis:', error)
    } finally {
      setIsSaving(false)
      onAnalysisComplete(analysisResult)
    }
  }

  const getAnalysisStepText = () => {
    if (analysisProgress <= 20) return t.step1
    if (analysisProgress <= 40) return t.step2
    if (analysisProgress <= 60) return t.step3
    if (analysisProgress <= 80) return t.step4
    return t.step5
  }

  return (
    <div className={cn(
      'fixed inset-0 z-50 bg-black flex flex-col',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/90 to-transparent safe-area-top relative z-10">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="text-center flex-1 px-4">
          <h2 className="text-white font-semibold text-lg">{t.title}</h2>
          <p className="text-white/60 text-xs">{t.subtitle}</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Camera View / Captured Image */}
      <div className="flex-1 relative overflow-hidden">
        {/* Video Preview */}
        {!capturedImage && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                'absolute inset-0 w-full h-full object-cover',
                facingMode === 'user' && 'scale-x-[-1]'
              )}
            />
            
            {/* Face Guide Overlay */}
            {(cameraState === 'ready' || cameraState === 'countdown') && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Darkened corners - responsive mask size */}
                <div className="absolute inset-0 bg-black/40 hidden md:block" style={{
                  maskImage: 'radial-gradient(ellipse 120px 155px at 50% 50%, transparent 98%, black 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 120px 155px at 50% 50%, transparent 98%, black 100%)',
                }} />
                {/* Mobile mask - larger oval, adjusted position for PWA nav bar */}
                <div className="absolute inset-0 bg-black/40 md:hidden" style={{
                  maskImage: 'radial-gradient(ellipse 130px 170px at 50% 40%, transparent 98%, black 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 130px 170px at 50% 40%, transparent 98%, black 100%)',
                }} />
                
                {/* Face oval guide - responsive sizing */}
                {/* Desktop: smaller, centered */}
                <div className="hidden md:block w-[240px] h-[310px] relative">
                  <div className="absolute inset-0 border-2 border-white/60 rounded-[50%]" />
                  <div className="absolute inset-2 border border-white/30 rounded-[50%]" />
                  
                  {/* Corner markers */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-white rounded-full" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-white rounded-full" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full" />
                  
                  {/* Countdown display */}
                  {cameraState === 'countdown' && countdown !== null && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl font-bold text-white animate-pulse drop-shadow-lg">
                        {countdown}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Mobile: larger oval, positioned higher for PWA nav bar */}
                <div className="md:hidden w-[260px] h-[340px] relative -mt-32">
                  <div className="absolute inset-0 border-2 border-white/60 rounded-[50%]" />
                  <div className="absolute inset-2 border border-white/30 rounded-[50%]" />
                  
                  {/* Corner markers */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full" />
                  
                  {/* Countdown display */}
                  {cameraState === 'countdown' && countdown !== null && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl font-bold text-white animate-pulse drop-shadow-lg">
                        {countdown}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lighting Warning */}
            {lightingWarning && cameraState === 'ready' && (
              <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-amber-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm animate-pulse">
                <Sun className="w-4 h-4" />
                {lightingWarning}
              </div>
            )}

            {/* Camera initializing */}
            {cameraState === 'initializing' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
            )}

            {/* Error state */}
            {cameraState === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black px-8">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <p className="text-white text-center mb-6">{error}</p>
                <button
                  onClick={initCamera}
                  className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium active:scale-95 transition-transform"
                >
                  <RefreshCw className="w-5 h-5" />
                  {t.tryAgain}
                </button>
              </div>
            )}
          </>
        )}

        {/* Captured Image */}
        {capturedImage && (
          <div className="absolute inset-0">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />

            {/* Analysis Overlay */}
            {cameraState === 'analyzing' && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                {/* Animated analysis graphic */}
                <div className="w-32 h-32 relative mb-6">
                  <div className="absolute inset-0 border-4 border-primary-500/30 rounded-full" />
                  <div 
                    className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"
                    style={{ animationDuration: '1s' }}
                  />
                  <div 
                    className="absolute inset-2 border-4 border-transparent border-t-primary-400 rounded-full animate-spin"
                    style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary-400" />
                  </div>
                </div>
                
                {/* Progress text */}
                <p className="text-white text-lg font-medium mb-3">{t.analyzing}</p>
                <p className="text-white/60 text-sm mb-4">{getAnalysisStepText()}</p>
                
                {/* Progress bar */}
                <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Results Overlay */}
            {cameraState === 'complete' && analysisResult && (
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/40">
                <div className="absolute bottom-0 left-0 right-0 max-h-[75vh] overflow-y-auto p-5 safe-area-bottom">
                  
                  {/* Main Result Card */}
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 mb-4">
                    {/* Skin Type Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-white/60 text-sm mb-1">{t.skinType}</p>
                        <p className="text-white text-2xl font-bold">
                          {skinTypeData[analysisResult.skinType]?.label[locale] || analysisResult.skinType}
                        </p>
                        <p className="text-white/50 text-xs mt-1">
                          {skinTypeData[analysisResult.skinType]?.description[locale]}
                        </p>
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/30 to-primary-600/20 flex items-center justify-center">
                        <span className="text-3xl">
                          {skinTypeData[analysisResult.skinType]?.emoji}
                        </span>
                      </div>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <MetricCard
                        icon={<Droplets className="w-4 h-4" />}
                        label={t.oiliness}
                        value={analysisResult.oilinessLevel}
                        color="amber"
                      />
                      <MetricCard
                        icon={<Target className="w-4 h-4" />}
                        label={t.hydration}
                        value={analysisResult.hydrationLevel}
                        color="blue"
                      />
                      <MetricCard
                        icon={<Flame className="w-4 h-4" />}
                        label={t.redness}
                        value={analysisResult.rednessLevel}
                        color="red"
                      />
                    </div>

                    {/* Accuracy & Skin Age */}
                    <div className="flex items-center justify-between py-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">{t.confidence}</p>
                          <p className="text-white font-semibold">{analysisResult.confidence}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="text-right">
                          <p className="text-white/60 text-xs">{t.skinAge}</p>
                          <p className="text-white font-semibold">{analysisResult.estimatedSkinAge} {t.years}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Details Button */}
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 py-2.5 rounded-xl mb-4 transition-colors"
                  >
                    <Info className="w-4 h-4" />
                    {showDetails ? t.hideDetails : t.viewDetails}
                  </button>

                  {/* Detailed Analysis */}
                  {showDetails && (
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 mb-4 space-y-4">
                      {/* Skin Tone & Undertone */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 rounded-xl p-3">
                          <p className="text-white/50 text-xs mb-1">{t.skinTone}</p>
                          <p className="text-white font-medium">
                            {skinToneLabels[analysisResult.skinTone]?.[locale] || analysisResult.skinTone}
                          </p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3">
                          <p className="text-white/50 text-xs mb-1">{t.undertone}</p>
                          <p className="text-white font-medium">
                            {undertoneLabels[analysisResult.undertone]?.[locale] || analysisResult.undertone}
                          </p>
                        </div>
                      </div>

                      {/* Zone Analysis */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 rounded-xl p-3">
                          <p className="text-white/50 text-xs mb-1">{t.tZone}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 rounded-full" 
                                style={{ width: `${analysisResult.tZoneOiliness}%` }}
                              />
                            </div>
                            <span className="text-white text-sm font-medium w-8">{analysisResult.tZoneOiliness}%</span>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3">
                          <p className="text-white/50 text-xs mb-1">{t.cheeks}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${analysisResult.cheekHydration}%` }}
                              />
                            </div>
                            <span className="text-white text-sm font-medium w-8">{analysisResult.cheekHydration}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Additional Metrics */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/5 rounded-xl p-2.5 text-center">
                          <p className="text-white/50 text-[10px] mb-0.5">{t.texture}</p>
                          <p className="text-white font-semibold text-sm">{analysisResult.textureScore}%</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-2.5 text-center">
                          <p className="text-white/50 text-[10px] mb-0.5">{t.evenness}</p>
                          <p className="text-white font-semibold text-sm">{analysisResult.evenness}%</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-2.5 text-center">
                          <p className="text-white/50 text-[10px] mb-0.5">{t.pores}</p>
                          <p className="text-white font-semibold text-sm">
                            {poreLabels[analysisResult.poreVisibility]?.[locale] || analysisResult.poreVisibility}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Photo Toggle with Privacy Notice */}
                  <div className="bg-white/5 rounded-xl mb-4 overflow-hidden">
                    <button
                      onClick={() => setSavePhoto(!savePhoto)}
                      className="w-full flex items-center justify-between hover:bg-white/5 text-white/80 px-4 py-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                          savePhoto ? 'bg-primary-600/20' : 'bg-white/10'
                        )}>
                          {savePhoto ? (
                            <Camera className="w-4 h-4 text-primary-400" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-medium block">
                            {locale === 'ar' ? 'حفظ الصورة للسجل' : locale === 'ru' ? 'Сохранить фото' : 'Save photo to history'}
                          </span>
                          <span className="text-xs text-white/50">
                            {savePhoto 
                              ? (locale === 'ar' ? 'سيتم حفظ صورتك' : locale === 'ru' ? 'Фото будет сохранено' : 'Your photo will be stored')
                              : (locale === 'ar' ? 'البيانات فقط' : locale === 'ru' ? 'Только данные' : 'Only analysis data saved')
                            }
                          </span>
                        </div>
                      </div>
                      <div className={cn(
                        'w-11 h-6 rounded-full transition-colors flex items-center px-0.5',
                        savePhoto ? 'bg-primary-600' : 'bg-white/20'
                      )}>
                        <div className={cn(
                          'w-5 h-5 rounded-full bg-white shadow transition-transform',
                          savePhoto ? 'translate-x-5' : 'translate-x-0'
                        )} />
                      </div>
                    </button>
                    {/* Privacy note */}
                    <div className="px-4 pb-3 flex items-start gap-2 text-white/40">
                      <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] leading-tight">
                        {locale === 'ar' 
                          ? 'صورتك آمنة ومخزنة بشكل مشفر. يمكنك حذفها في أي وقت من سجل التحليلات.'
                          : locale === 'ru' 
                            ? 'Ваше фото защищено и хранится в зашифрованном виде. Вы можете удалить его в любое время.'
                            : 'Your photo is securely encrypted. You can delete it anytime from your analysis history.'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={retakePhoto}
                      disabled={isSaving}
                      className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white py-3.5 rounded-xl font-medium transition-colors active:scale-[0.98]"
                    >
                      <RefreshCw className="w-5 h-5" />
                      {t.retake}
                    </button>
                    <button
                      onClick={handleUseResults}
                      disabled={isSaving}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-70 text-white py-3.5 rounded-xl font-semibold transition-colors active:scale-[0.98]"
                    >
                      {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                      {isSaving 
                        ? (locale === 'ar' ? 'جاري الحفظ...' : locale === 'ru' ? 'Сохранение...' : 'Saving...')
                        : t.useResults
                      }
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Bottom Controls */}
      {!capturedImage && cameraState === 'ready' && (
        <div className="px-4 pt-4 pb-8 mb-16 md:mb-4 bg-gradient-to-t from-black via-black/95 to-transparent">
          {/* Capture Button - Put first for visibility */}
          <div className="flex items-center justify-center gap-6 mb-4">
            {/* Switch Camera */}
            <button
              onClick={switchCamera}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </button>

            {/* Capture */}
            <button
              onClick={startCountdown}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center ring-4 ring-white/30 active:scale-95 transition-transform shadow-lg shadow-white/20"
            >
              <Camera className="w-8 h-8 text-gray-900" />
            </button>

            {/* Placeholder for symmetry */}
            <div className="w-12 h-12" />
          </div>

          {/* Tips */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-white/50 text-xs">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {t.positionFace}
            </span>
            <span className="flex items-center gap-1">
              <Sun className="w-3 h-3" />
              {t.goodLighting}
            </span>
            <span className="flex items-center gap-1">
              <Moon className="w-3 h-3" />
              {t.noMakeup}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// Metric Card Component
function MetricCard({
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
    <div className="bg-white/5 rounded-xl p-3">
      <div className={cn('w-6 h-6 rounded-full mb-2 flex items-center justify-center', colorClasses[color].bg)}>
        <span className={colorClasses[color].text}>{icon}</span>
      </div>
      <p className="text-white/50 text-[10px] mb-1">{label}</p>
      <p className="text-white font-semibold text-lg">{value}%</p>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
        <div
          className={cn('h-full rounded-full transition-all', colorClasses[color].fill)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default SkinAnalysisCamera
