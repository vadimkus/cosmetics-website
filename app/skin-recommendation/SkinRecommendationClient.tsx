'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { ShoppingCart, Heart, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Info, Star, Scan, Droplets, Target, Flame, Eye, Eye as EyeIcon, Palette, Clock, Zap, CircleDot, Sun, Moon, User, Brain, Loader2, ShoppingBag, Check } from 'lucide-react'
import type { SkinAnalysisResult } from '@/components/SkinAnalysisCamera'
import dynamic from 'next/dynamic'

// Lazy load heavy camera/analysis components (~1800 lines each, camera/AR/AI deps)
const SkinAnalysisCamera = dynamic(
  () => import('@/components/SkinAnalysisCamera').then(mod => ({ default: mod.SkinAnalysisCamera })),
  { ssr: false }
)
const ARSkinAnalysisCamera = dynamic(
  () => import('@/components/ar/ARSkinAnalysisCamera'),
  { ssr: false }
)
// Lazy load Power Animal game
const PowerAnimalGame = dynamic(() => import('@/components/PowerAnimalGame'), { ssr: false })
import { useCart } from '@/components/cart/CartProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { usePWAMode } from '@/hooks/usePWAMode'
import { errorLog } from '@/lib/logger'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'
import type { Product } from '@/types'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

// Product type from @/types now includes skinType, targetConcerns, usage, and ageGroup fields
type SkinRecommendationProduct = Product

export default function SkinRecommendationClient() {
  const { t, locale, dir } = useTranslation()
  const { user } = useAuth()
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { isPWA, isClient } = usePWAMode()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  
  // Detect mobile web (non-PWA mobile)
  useEffect(() => {
    const checkMobileWeb = () => {
      const isMobile = window.innerWidth < 768
      setIsMobileWeb(isMobile && !isPWA)
    }
    checkMobileWeb()
    window.addEventListener('resize', checkMobileWeb)
    return () => window.removeEventListener('resize', checkMobileWeb)
  }, [isPWA])
  
  // App-like mode: PWA or mobile web
  const isAppLikeMode = (isPWA && isClient) || isMobileWeb
  
  const [selectedSkinType, setSelectedSkinType] = useState('')
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('')
  const [selectedTargetConcerns, setSelectedTargetConcerns] = useState<string[]>([])
  const [selectedUsage, setSelectedUsage] = useState('')
  const [recommendations, setRecommendations] = useState<SkinRecommendationProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Camera analysis state
  const [showCamera, setShowCamera] = useState(false)
  const [showARCamera, setShowARCamera] = useState(false) // New AR mode
  const [cameraResult, setCameraResult] = useState<SkinAnalysisResult | null>(null)
  const [showAnalysisReport, setShowAnalysisReport] = useState(false)
  const [showPowerAnimal, setShowPowerAnimal] = useState(false) // Power Animal game
  
  // AI Expert Analysis state
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false)
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    skinType: string
    healthScore: number
    concerns: string[]
    analysis: string
    recommendations: Array<{ product: string; reason: string }>
    routine?: { am: string[]; pm: string[] }
    tips?: string[]
  } | null>(null)
  const [showAiAnalysis, setShowAiAnalysis] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [aiProductDetails, setAiProductDetails] = useState<Map<string, any>>(new Map())

  const AI_PRODUCT_NAME_TO_ID: Record<string, string> = useMemo(() => ({
    'MOISTURE REPLENISHING HYALURON SERUM': '18',
    'MOISTURE REPLENISHING HYALURON CREAM': '29',
    'INTENSIVE PROBLEM CONTROL TONER': '15',
    'PROBLEM CONTROL SERUM': '20',
    'INTENSIVE PROBLEM CONTROL CREAM': '30',
    'ALL FOR SENSITIVE SERUM': '19',
    'SKIN BARRIER PROTECTING CREAM': '27',
    'MULTI FUNCTIONAL ANTI-WRINKLE SERUM': '22',
    'MULTI FUNCTIONAL ANTI-WRINKLE CREAM': '32',
    'ND CELL ANTI-WRINKLE CREAM': '23',
    'MULTI VITA RADIANCE SERUM': '21',
    'MULTI VITA RADIANCE CREAM': '31',
    'SNOW O₂ CLEANSER': '10',
    'SNOW BOOSTER': '16',
    'ULTRA SHIELD SUN CREAM SPF 50+': '39',
    'EYECELL EYE CONTOUR SERUM': '17',
    'EYECELL EYE CONTOUR CREAM': '24',
  }), [])

  // Load analysis data from URL params and sessionStorage
  useEffect(() => {
    const fromAnalysis = searchParams.get('fromAnalysis')
    const skinType = searchParams.get('skinType')
    const concerns = searchParams.get('concerns')
    
    if (fromAnalysis === 'true' && skinType) {
      // Try to load full analysis from sessionStorage
      const storedAnalysis = typeof window !== 'undefined' 
        ? sessionStorage.getItem('skinAnalysisResult') 
        : null
      
      if (storedAnalysis) {
        try {
          const analysisData = JSON.parse(storedAnalysis) as SkinAnalysisResult
          setCameraResult(analysisData)
          setSelectedSkinType(analysisData.skinType)
          setSelectedTargetConcerns(analysisData.concerns)
          
          // Estimate age group
          if (analysisData.concerns.includes('anti-aging')) {
            setSelectedAgeGroup('mature')
          } else if (analysisData.concerns.includes('acne-blemishes')) {
            setSelectedAgeGroup('teen')
          } else if (analysisData.hydrationLevel < 50) {
            setSelectedAgeGroup('adult')
          } else {
            setSelectedAgeGroup('young-adult')
          }
          
          setShowAnalysisReport(true)
          // Clear sessionStorage after loading
          sessionStorage.removeItem('skinAnalysisResult')
        } catch (e) {
          errorLog('Error parsing stored analysis:', e)
        }
      } else if (concerns) {
        // Fallback to URL params only - create minimal result from URL data
        const concernsArray = concerns.split(',').filter(Boolean)
        setSelectedSkinType(skinType)
        setSelectedTargetConcerns(concernsArray)
        
        // Create a minimal cameraResult from URL params with estimated defaults
        const fallbackResult: SkinAnalysisResult = {
          skinType: skinType as SkinAnalysisResult['skinType'],
          confidence: 75,
          concerns: concernsArray,
          recommendations: [],
          ageGroup: concernsArray.includes('anti-aging') ? 'mature' : 'adult',
          oilinessLevel: skinType === 'oily' ? 70 : skinType === 'dry' ? 30 : 50,
          hydrationLevel: skinType === 'dry' ? 35 : skinType === 'oily' ? 60 : 55,
          rednessLevel: concernsArray.includes('sensitivity') ? 45 : 20,
          skinTone: 'medium',
          undertone: 'neutral',
          textureScore: concernsArray.includes('anti-aging') ? 55 : 70,
          poreVisibility: skinType === 'oily' ? 'visible' : 'moderate',
          evenness: concernsArray.includes('brightening') ? 55 : 70,
          tZoneOiliness: skinType === 'oily' || skinType === 'combination' ? 65 : 40,
          cheekHydration: skinType === 'dry' ? 35 : 55,
          estimatedSkinAge: concernsArray.includes('anti-aging') ? 42 : 32,
          lightingQuality: 'good'
        }
        
        setCameraResult(fallbackResult)
        setSelectedAgeGroup(fallbackResult.ageGroup || 'adult')
        setShowAnalysisReport(true)
      }
    }
  }, [searchParams])

  // Handle camera analysis completion
  const handleCameraAnalysisComplete = (result: SkinAnalysisResult, image?: string) => {
    setCameraResult(result)
    setCapturedImage(image || null)
    setShowCamera(false)
    setShowARCamera(false) // Also close AR camera
    
    // Auto-fill form based on camera analysis
    setSelectedSkinType(result.skinType)
    setSelectedTargetConcerns(result.concerns)
    
    // Estimate age group from skin characteristics
    if (result.concerns.includes('anti-aging')) {
      setSelectedAgeGroup('mature')
    } else if (result.concerns.includes('acne-blemishes')) {
      setSelectedAgeGroup('teen')
    } else if (result.hydrationLevel < 50) {
      setSelectedAgeGroup('adult')
    } else {
      setSelectedAgeGroup('young-adult')
    }
    
    // Show analysis report
    setShowAnalysisReport(true)
  }

  // Handle AI Expert Analysis
  const handleAIExpertAnalysis = async () => {
    if (!capturedImage) return
    
    setAiAnalysisLoading(true)
    try {
      const response = await fetch('/api/skin-analysis/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage, locale }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to analyze')
      }
      
      const { data } = await response.json()
      setAiAnalysisResult(data)
      
      // Fetch product details for recommendations
      if (data.recommendations && data.recommendations.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const productDetailsMap = new Map<string, any>()
        
        await Promise.all(
          data.recommendations.map(async (rec: { product: string; reason: string }) => {
            const linkMatch = rec.product.match(/\[([^\]]+)\]\(([^)]+)\)\{\{id:(\d+)\}\}/)
            let productId: string | null = linkMatch?.[3] ?? null

            if (!productId) {
              const nameRaw = (linkMatch?.[1] ?? rec.product).toUpperCase().trim()
              productId = AI_PRODUCT_NAME_TO_ID[nameRaw] ?? null
              if (!productId) {
                for (const [name, id] of Object.entries(AI_PRODUCT_NAME_TO_ID)) {
                  if (nameRaw.includes(name) || name.includes(nameRaw)) {
                    productId = id
                    break
                  }
                }
              }
            }

            if (productId) {
              try {
                const productResponse = await fetch(`/api/products/${productId}`)
                if (productResponse.ok) {
                  const product = await productResponse.json()
                  productDetailsMap.set(productId, product)
                }
              } catch {
                // Ignore errors for individual products
              }
            }
          })
        )
        
        setAiProductDetails(productDetailsMap)
      }
      
      setShowAiAnalysis(true)
    } catch (error) {
      errorLog('AI Analysis Error:', error)
      alert(locale === 'ar' 
        ? 'فشل التحليل بالذكاء الاصطناعي. حاول مرة أخرى.' 
        : locale === 'ru' 
          ? 'Ошибка AI-анализа. Попробуйте ещё раз.'
          : 'AI analysis failed. Please try again.')
    } finally {
      setAiAnalysisLoading(false)
    }
  }

  // Helper function to translate analysis levels
  const translateLevel = (level: string): string => {
    const levelTranslations: Record<string, { en: string; ru: string; ar: string }> = {
      'minimal': { en: 'Minimal', ru: 'Минимальный', ar: 'ضئيل' },
      'low': { en: 'Low', ru: 'Низкий', ar: 'منخفض' },
      'moderate': { en: 'Moderate', ru: 'Умеренный', ar: 'معتدل' },
      'high': { en: 'High', ru: 'Высокий', ar: 'عالي' },
      'severe': { en: 'Severe', ru: 'Выраженный', ar: 'شديد' },
      'good': { en: 'Good', ru: 'Хороший', ar: 'جيد' },
      'fair': { en: 'Fair', ru: 'Средний', ar: 'معقول' },
      'poor': { en: 'Poor', ru: 'Плохой', ar: 'ضعيف' },
      'excellent': { en: 'Excellent', ru: 'Отличный', ar: 'ممتاز' },
      'healthy': { en: 'Healthy', ru: 'Здоровый', ar: 'صحي' },
      'visible': { en: 'Visible', ru: 'Заметный', ar: 'واضح' },
      'prominent': { en: 'Prominent', ru: 'Выраженный', ar: 'بارز' },
      'fine': { en: 'Fine', ru: 'Тонкий', ar: 'ناعم' },
      'normal': { en: 'Normal', ru: 'Нормальный', ar: 'طبيعي' },
      // Pore sizes
      'small': { en: 'Small', ru: 'Маленькие', ar: 'صغيرة' },
      'medium': { en: 'Medium', ru: 'Средние', ar: 'متوسطة' },
      'large': { en: 'Large', ru: 'Большие', ar: 'كبيرة' },
      // Lip health
      'chapped': { en: 'Chapped', ru: 'Сухие', ar: 'متشققة' },
      'dry': { en: 'Dry', ru: 'Сухие', ar: 'جافة' },
      'hydrated': { en: 'Hydrated', ru: 'Увлажнённые', ar: 'مرطبة' },
      // General conditions
      'sensitive': { en: 'Sensitive', ru: 'Чувствительный', ar: 'حساسة' },
      'balanced': { en: 'Balanced', ru: 'Сбалансированный', ar: 'متوازن' },
      'oily': { en: 'Oily', ru: 'Жирный', ar: 'دهنية' },
    }
    const key = level.toLowerCase()
    const translation = levelTranslations[key]
    if (translation) {
      return translation[locale as 'en' | 'ru' | 'ar'] || translation.en
    }
    return level // Return original if no translation found
  }

  // Helper function to translate AI analysis concerns
  const translateConcern = (concern: string): string => {
    const concernTranslations: Record<string, { en: string; ru: string; ar: string }> = {
      'dehydration': { en: 'Dehydration', ru: 'Обезвоживание', ar: 'جفاف' },
      'fine lines': { en: 'Fine lines', ru: 'Мелкие морщины', ar: 'خطوط دقيقة' },
      'pores': { en: 'Pores', ru: 'Поры', ar: 'المسام' },
      'wrinkles': { en: 'Wrinkles', ru: 'Морщины', ar: 'تجاعيد' },
      'acne': { en: 'Acne', ru: 'Акне', ar: 'حب الشباب' },
      'dark spots': { en: 'Dark spots', ru: 'Тёмные пятна', ar: 'بقع داكنة' },
      'pigmentation': { en: 'Pigmentation', ru: 'Пигментация', ar: 'تصبغات' },
      'redness': { en: 'Redness', ru: 'Покраснение', ar: 'احمرار' },
      'sensitivity': { en: 'Sensitivity', ru: 'Чувствительность', ar: 'حساسية' },
      'dullness': { en: 'Dullness', ru: 'Тусклость', ar: 'بهتان' },
      'uneven tone': { en: 'Uneven tone', ru: 'Неровный тон', ar: 'لون غير متساوي' },
      'oiliness': { en: 'Oiliness', ru: 'Жирность', ar: 'دهنية' },
      'dryness': { en: 'Dryness', ru: 'Сухость', ar: 'جفاف' },
      'texture': { en: 'Texture', ru: 'Текстура', ar: 'الملمس' },
      'enlarged pores': { en: 'Enlarged pores', ru: 'Расширенные поры', ar: 'مسام واسعة' },
      'sagging': { en: 'Sagging', ru: 'Дряблость', ar: 'ترهل' },
      'loss of firmness': { en: 'Loss of firmness', ru: 'Потеря упругости', ar: 'فقدان المرونة' },
      'dark circles': { en: 'Dark circles', ru: 'Тёмные круги', ar: 'هالات سوداء' },
      'puffiness': { en: 'Puffiness', ru: 'Отёчность', ar: 'انتفاخ' },
      'sun damage': { en: 'Sun damage', ru: 'Фотоповреждение', ar: 'أضرار الشمس' },
      'blackheads': { en: 'Blackheads', ru: 'Чёрные точки', ar: 'الرؤوس السوداء' },
      'blemishes': { en: 'Blemishes', ru: 'Несовершенства', ar: 'شوائب' },
    }
    const key = concern.toLowerCase()
    const translation = concernTranslations[key]
    if (translation) {
      return translation[locale as 'en' | 'ru' | 'ar'] || translation.en
    }
    return concern // Return original if no translation found
  }

  // Helper function to translate Fitzpatrick skin type
  const translateFitzpatrick = (typeName: string, description: string): { name: string; desc: string } => {
    // Translations for full format "Type X - Description"
    const fitzpatrickFullTranslations: Record<string, { name: { ru: string; ar: string }; desc: { ru: string; ar: string } }> = {
      'Type I - Very Fair': {
        name: { ru: 'Тип I - Очень светлая', ar: 'النوع الأول - فاتحة جداً' },
        desc: { ru: 'Всегда обгорает, никогда не загорает', ar: 'دائماً تحترق، لا تسمر أبداً' }
      },
      'Type II - Fair': {
        name: { ru: 'Тип II - Светлая', ar: 'النوع الثاني - فاتحة' },
        desc: { ru: 'Легко обгорает, загорает минимально', ar: 'تحترق بسهولة، تسمر قليلاً' }
      },
      'Type III - Medium': {
        name: { ru: 'Тип III - Средняя', ar: 'النوع الثالث - متوسطة' },
        desc: { ru: 'Иногда обгорает, загорает постепенно', ar: 'تحترق أحياناً، تسمر تدريجياً' }
      },
      'Type IV - Olive': {
        name: { ru: 'Тип IV - Оливковая', ar: 'النوع الرابع - زيتونية' },
        desc: { ru: 'Редко обгорает, легко загорает', ar: 'نادراً تحترق، تسمر بسهولة' }
      },
      'Type V - Brown': {
        name: { ru: 'Тип V - Смуглая', ar: 'النوع الخامس - بنية' },
        desc: { ru: 'Очень редко обгорает, загорает интенсивно', ar: 'نادراً جداً تحترق، تسمر بكثافة' }
      },
      'Type VI - Dark': {
        name: { ru: 'Тип VI - Тёмная', ar: 'النوع السادس - داكنة' },
        desc: { ru: 'Никогда не обгорает, глубокий загар', ar: 'لا تحترق أبداً، سمرة عميقة' }
      }
    }
    
    // Translations for short format "Type X" only
    const fitzpatrickTypeTranslations: Record<string, { ru: string; ar: string }> = {
      'Type I': { ru: 'Тип I', ar: 'النوع الأول' },
      'Type II': { ru: 'Тип II', ar: 'النوع الثاني' },
      'Type III': { ru: 'Тип III', ar: 'النوع الثالث' },
      'Type IV': { ru: 'Тип IV', ar: 'النوع الرابع' },
      'Type V': { ru: 'Тип V', ar: 'النوع الخامس' },
      'Type VI': { ru: 'Тип VI', ar: 'النوع السادس' },
    }
    
    // Translations for skin tone descriptions
    const skinToneTranslations: Record<string, { ru: string; ar: string }> = {
      'Very Fair': { ru: 'Очень светлая', ar: 'فاتحة جداً' },
      'Fair': { ru: 'Светлая', ar: 'فاتحة' },
      'Medium': { ru: 'Средняя', ar: 'متوسطة' },
      'Olive': { ru: 'Оливковая', ar: 'زيتونية' },
      'Brown': { ru: 'Смуглая', ar: 'بنية' },
      'Dark': { ru: 'Тёмная', ar: 'داكنة' },
    }
    
    if (locale === 'en') {
      return { name: typeName, desc: description }
    }
    
    // First try full format translation
    const fullTranslation = fitzpatrickFullTranslations[typeName]
    if (fullTranslation) {
      return {
        name: fullTranslation.name[locale as 'ru' | 'ar'] || typeName,
        desc: fullTranslation.desc[locale as 'ru' | 'ar'] || description
      }
    }
    
    // Try short type format (e.g., "Type III")
    const typeTranslation = fitzpatrickTypeTranslations[typeName]
    const descTranslation = skinToneTranslations[description]
    
    return {
      name: typeTranslation ? typeTranslation[locale as 'ru' | 'ar'] : typeName,
      desc: descTranslation ? descTranslation[locale as 'ru' | 'ar'] : description
    }
  }

  // Get translated data arrays
  const SKIN_TYPES = [
    { 
      value: 'dry', 
      label: t('skinRecommendation.drySkin'), 
      icon: '🌵',
      description: t('skinRecommendation.drySkinDescription'),
      tips: t('skinRecommendation.drySkinTips')
    },
    { 
      value: 'oily', 
      label: t('skinRecommendation.oilySkin'), 
      icon: '💧',
      description: t('skinRecommendation.oilySkinDescription'),
      tips: t('skinRecommendation.oilySkinTips')
    },
    { 
      value: 'combination', 
      label: t('skinRecommendation.combinationSkin'), 
      icon: '⚖️',
      description: t('skinRecommendation.combinationSkinDescription'),
      tips: t('skinRecommendation.combinationSkinTips')
    },
    { 
      value: 'normal', 
      label: t('skinRecommendation.normalSkin'), 
      icon: '✨',
      description: t('skinRecommendation.normalSkinDescription'),
      tips: t('skinRecommendation.normalSkinTips')
    },
    { 
      value: 'sensitive', 
      label: t('skinRecommendation.sensitiveSkin'), 
      icon: '🤲',
      description: t('skinRecommendation.sensitiveSkinDescription'),
      tips: t('skinRecommendation.sensitiveSkinTips')
    }
  ]

  const AGE_GROUPS = [
    { 
      value: 'teen', 
      label: t('skinRecommendation.teen'), 
      icon: '🎓',
      focus: t('skinRecommendation.teenFocus'),
      targetConcerns: ['acne-blemishes', 'hydration', 'pore-care'] 
    },
    { 
      value: 'young-adult', 
      label: t('skinRecommendation.youngAdult'), 
      icon: '🌟',
      focus: t('skinRecommendation.youngAdultFocus'),
      targetConcerns: ['acne-blemishes', 'hydration', 'brightening', 'pore-care'] 
    },
    { 
      value: 'adult', 
      label: t('skinRecommendation.adult'), 
      icon: '💼',
      focus: t('skinRecommendation.adultFocus'),
      targetConcerns: ['anti-aging', 'hydration', 'brightening', 'sensitivity'] 
    },
    { 
      value: 'mature', 
      label: t('skinRecommendation.mature'), 
      icon: '👑',
      focus: t('skinRecommendation.matureFocus'),
      targetConcerns: ['anti-aging', 'hydration', 'sensitivity', 'eye-care'] 
    }
  ]

  const TARGET_CONCERNS = [
    { 
      value: 'anti-aging', 
      label: t('skinRecommendation.antiAging'), 
      icon: '🕰️',
      description: t('skinRecommendation.antiAgingDescription'),
      keyIngredients: t('skinRecommendation.antiAgingIngredients')
    },
    { 
      value: 'acne-blemishes', 
      label: t('skinRecommendation.acneBlemishes'), 
      icon: '🎯',
      description: t('skinRecommendation.acneBlemishesDescription'),
      keyIngredients: t('skinRecommendation.acneBlemishesIngredients')
    },
    { 
      value: 'hydration', 
      label: t('skinRecommendation.hydration'), 
      icon: '💧',
      description: t('skinRecommendation.hydrationDescription'),
      keyIngredients: t('skinRecommendation.hydrationIngredients')
    },
    { 
      value: 'brightening', 
      label: t('skinRecommendation.brightening'), 
      icon: '✨',
      description: t('skinRecommendation.brighteningDescription'),
      keyIngredients: t('skinRecommendation.brighteningIngredients')
    },
    { 
      value: 'sensitivity', 
      label: t('skinRecommendation.sensitivity'), 
      icon: '🤲',
      description: t('skinRecommendation.sensitivityDescription'),
      keyIngredients: t('skinRecommendation.sensitivityIngredients')
    },
    { 
      value: 'pore-care', 
      label: t('skinRecommendation.poreCare'), 
      icon: '🔍',
      description: t('skinRecommendation.poreCareDescription'),
      keyIngredients: t('skinRecommendation.poreCareIngredients')
    },
    { 
      value: 'eye-care', 
      label: t('skinRecommendation.eyeCare'), 
      icon: '👁️',
      description: t('skinRecommendation.eyeCareDescription'),
      keyIngredients: t('skinRecommendation.eyeCareIngredients')
    },
    { 
      value: 'hair', 
      label: t('skinRecommendation.hairCare'), 
      icon: '💇‍♀️',
      description: t('skinRecommendation.hairCareDescription'),
      keyIngredients: t('skinRecommendation.hairCareIngredients')
    }
  ]

  const USAGE_OPTIONS = [
    { value: 'morning', label: t('skinRecommendation.morning'), icon: '🌅', description: t('skinRecommendation.morningDescription') },
    { value: 'evening', label: t('skinRecommendation.evening'), icon: '🌙', description: t('skinRecommendation.eveningDescription') },
    { value: 'all-day', label: t('skinRecommendation.allDay'), icon: '☀️', description: t('skinRecommendation.allDayDescription') },
    { value: 'morning-evening', label: t('skinRecommendation.morningEvening'), icon: '🔄', description: t('skinRecommendation.morningEveningDescription') }
  ]

  const handleTargetConcernToggle = (concern: string) => {
    setSelectedTargetConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const params = new URLSearchParams()
      if (selectedSkinType) params.append('skinType', selectedSkinType)
      if (selectedAgeGroup) params.append('ageGroup', selectedAgeGroup)
      if (selectedTargetConcerns.length > 0) {
        params.append('targetConcerns', selectedTargetConcerns.join(','))
      }
      
      // Pass analysis metrics for smarter recommendations
      if (cameraResult) {
        params.append('oilinessLevel', cameraResult.oilinessLevel.toString())
        params.append('hydrationLevel', cameraResult.hydrationLevel.toString())
        params.append('rednessLevel', cameraResult.rednessLevel.toString())
      }

      const response = await fetch(`/api/skin-recommendations?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }
      const products = await response.json()
      
      setRecommendations(products)
      setShowResults(true)
      setShowAnalysisReport(false) // Hide report when showing products
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      errorLog('Error fetching recommendations:', error)
      alert(t('skinRecommendation.failedToLoadRecommendations'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (product: SkinRecommendationProduct) => {
    if (!user) {
      window.location.href = getLocalizedPath('/login', locale)
      return
    }
    addItem(product, 1, '', '')
  }

  const resetForm = () => {
    setSelectedSkinType('')
    setSelectedAgeGroup('')
    setSelectedTargetConcerns([])
    setSelectedUsage('')
    setRecommendations([])
    setShowResults(false)
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Group products by category for better display
  const groupedProducts = useMemo(() => {
    const groups: Record<string, SkinRecommendationProduct[]> = {}
    recommendations.forEach(product => {
      const category = product.category || 'Other'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(product)
    })
    return groups
  }, [recommendations])

  const isRTL = dir === 'rtl'

  return (
    <div className={`min-h-[100dvh] bg-gradient-to-b from-gray-50 to-white ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir} data-pwa-light-header-page>
      <BreadcrumbSchema 
        items={[
          { name: t('common.home'), url: getLocalizedPath('/', locale) },
          { name: t('profile.skinRecommendation'), url: getLocalizedPath('/skin-recommendation', locale) }
        ]}
      />

      {/* PWA/Mobile Web Simple Navigation Header */}
      {isAppLikeMode && (
        <div className={`flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={() => router.push(getLocalizedPath('/products', locale))}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base text-red-600">
              {t('common.home') || 'Home'}
            </span>
          </button>
          <span className="text-base font-semibold text-gray-900">
            {locale === 'ar' ? 'تحليل البشرة' : locale === 'ru' ? 'Анализ кожи' : 'Skin Analysis'}
          </span>
          {/* Profile Icon - green dot only when logged in */}
          <button 
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[80px] flex justify-end"
          >
            <div className="relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${user ? 'bg-red-600' : 'bg-gray-400'}`}>
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                </span>
              </div>
              {/* Green online dot - only when logged in */}
              {user && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
              )}
            </div>
          </button>
        </div>
      )}

      <div className={`container mx-auto px-3 md:px-4 ${isAppLikeMode ? 'py-4' : 'py-4 md:py-16'}`}>
        <div className="max-w-5xl mx-auto">
          {/* Navigation Breadcrumb - Hide in PWA/Mobile Web */}
          {!isAppLikeMode && (
            <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
              <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
              <span> / </span>
              <span className="text-gray-900 font-medium">{t('skinRecommendation.title')}</span>
            </nav>
          )}
          
          {/* Back to Home - Hide in PWA/Mobile Web */}
          {!isAppLikeMode && (
            <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              <span>{t('common.backToHome')}</span>
            </Link>
          )}

      {/* Camera Modal - Photo Mode */}
      {showCamera && (
        <SkinAnalysisCamera
          onAnalysisComplete={handleCameraAnalysisComplete}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* AR Camera Modal - Live Analysis Mode */}
      {showARCamera && (
        <ARSkinAnalysisCamera
          onAnalysisComplete={handleCameraAnalysisComplete}
          onClose={() => setShowARCamera(false)}
        />
      )}

      {/* Power Animal Game Modal */}
      {showPowerAnimal && (
        <PowerAnimalGame
          locale={locale}
          onClose={() => setShowPowerAnimal(false)}
        />
      )}

      {/* Analysis Report - Shown when coming from camera analysis */}
      {showAnalysisReport && cameraResult && !showResults ? (
        <div className="mb-8">
          {/* Report Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 mb-4 shadow-lg shadow-primary-200">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {locale === 'ar' ? 'تقرير تحليل بشرتك' : locale === 'ru' ? 'Отчёт анализа кожи' : 'Your Skin Analysis Report'}
            </h1>
            <p className="text-gray-600">
              {locale === 'ar' ? 'نتائج تحليل بشرتك بالذكاء الاصطناعي' : locale === 'ru' ? 'Результаты AI-анализа вашей кожи' : 'AI-powered skin analysis results'}
            </p>
          </div>

          {/* Main Results Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
            {/* Skin Type Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 sm:px-6 py-4 sm:py-5 text-white">
              {/* Mobile: Stack vertically, Desktop: Row */}
              <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 ${dir === 'rtl' ? 'sm:flex-row-reverse' : ''}`}>
                {/* Skin Type - Always on top/first */}
                <div className={`${dir === 'rtl' ? 'text-right' : ''}`}>
                  <p className="text-primary-100 text-xs sm:text-sm mb-1">
                    {locale === 'ar' ? 'نوع بشرتك' : locale === 'ru' ? 'Тип вашей кожи' : 'Your Skin Type'}
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                    {SKIN_TYPES.find(st => st.value === cameraResult.skinType)?.icon}{' '}
                    {SKIN_TYPES.find(st => st.value === cameraResult.skinType)?.label || cameraResult.skinType}
                  </p>
                </div>
                
                {/* Gender and Confidence - Row on all screens */}
                <div className={`flex items-center gap-4 sm:gap-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  {/* Gender */}
                  {cameraResult.gender && cameraResult.gender !== 'unknown' && (
                    <div className={`${dir === 'rtl' ? 'text-right' : ''}`}>
                      <p className="text-primary-100 text-xs sm:text-sm mb-0.5 sm:mb-1">
                        {locale === 'ar' ? 'الجنس' : locale === 'ru' ? 'Пол' : 'Gender'}
                      </p>
                      <p className={`text-lg sm:text-xl font-bold ${cameraResult.gender === 'male' ? 'text-blue-200' : 'text-pink-200'}`}>
                        {cameraResult.gender === 'male' 
                          ? (locale === 'ar' ? '♂ ذكر' : locale === 'ru' ? '♂ М' : '♂ Male')
                          : (locale === 'ar' ? '♀ أنثى' : locale === 'ru' ? '♀ Ж' : '♀ Female')
                        }
                      </p>
                    </div>
                  )}
                  {/* Confidence */}
                  <div className={`${dir === 'rtl' ? 'text-right' : 'text-right'}`}>
                    <p className="text-primary-100 text-xs sm:text-sm mb-0.5 sm:mb-1">
                      {locale === 'ar' ? 'الدقة' : locale === 'ru' ? 'Точность' : 'Confidence'}
                    </p>
                    <p className="text-lg sm:text-xl font-bold">{cameraResult.confidence}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="p-6">
              <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                {locale === 'ar' ? 'مقاييس البشرة' : locale === 'ru' ? 'Показатели кожи' : 'Skin Metrics'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Oiliness */}
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">
                      {locale === 'ar' ? 'الدهنية' : locale === 'ru' ? 'Жирность' : 'Oiliness'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-amber-700">{cameraResult.oilinessLevel}%</p>
                  <div className="h-2 bg-amber-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${cameraResult.oilinessLevel}%` }} />
                  </div>
                </div>

                {/* Hydration */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      {locale === 'ar' ? 'الترطيب' : locale === 'ru' ? 'Увлажнение' : 'Hydration'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{cameraResult.hydrationLevel}%</p>
                  <div className="h-2 bg-blue-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${cameraResult.hydrationLevel}%` }} />
                  </div>
                </div>

                {/* Redness */}
                <div className="bg-red-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      {locale === 'ar' ? 'الاحمرار' : locale === 'ru' ? 'Покраснение' : 'Redness'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-red-700">{cameraResult.rednessLevel}%</p>
                  <div className="h-2 bg-red-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${cameraResult.rednessLevel}%` }} />
                  </div>
                </div>

                {/* Texture */}
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">
                      {locale === 'ar' ? 'نعومة البشرة' : locale === 'ru' ? 'Текстура' : 'Texture'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">{cameraResult.textureScore}%</p>
                  <div className="h-2 bg-purple-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${cameraResult.textureScore}%` }} />
                  </div>
                </div>

                {/* Evenness */}
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {locale === 'ar' ? 'توحيد اللون' : locale === 'ru' ? 'Ровность тона' : 'Evenness'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{cameraResult.evenness}%</p>
                  <div className="h-2 bg-green-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${cameraResult.evenness}%` }} />
                  </div>
                </div>

                {/* Skin Age */}
                <div className="bg-pink-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-pink-600" />
                    <span className="text-sm font-medium text-pink-800">
                      {locale === 'ar' ? 'عمر البشرة' : locale === 'ru' ? 'Возраст кожи' : 'Skin Age'}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-pink-700">~{cameraResult.estimatedSkinAge}</p>
                  <p className="text-xs text-pink-600 mt-1">
                    {locale === 'ar' ? 'تقديري' : locale === 'ru' ? 'примерно' : 'estimated'}
                  </p>
                </div>
              </div>
            </div>

            {/* P2: Advanced Analysis Section */}
            {(cameraResult.poreAnalysis || cameraResult.underEyeAnalysis || cameraResult.firmnessAnalysis || 
              cameraResult.sunDamageAnalysis || cameraResult.lipAnalysis || cameraResult.fitzpatrickType) && (
              <div className="px-6 pb-6">
                <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {locale === 'ar' ? 'التحليل المتقدم' : locale === 'ru' ? 'Расширенный анализ' : 'Advanced Analysis'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  
                  {/* Pore Size */}
                  {cameraResult.poreAnalysis && (
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CircleDot className="w-5 h-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-800">
                          {locale === 'ar' ? 'حجم المسام' : locale === 'ru' ? 'Размер пор' : 'Pore Size'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-slate-700 capitalize">{translateLevel(cameraResult.poreAnalysis.level)}</p>
                      <div className="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-slate-500 rounded-full" style={{ width: `${cameraResult.poreAnalysis.visibility}%` }} />
                      </div>
                    </div>
                  )}
                  
                  {/* Under-Eye Health */}
                  {cameraResult.underEyeAnalysis && (
                    <div className="bg-indigo-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <EyeIcon className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-800">
                          {locale === 'ar' ? 'منطقة العين' : locale === 'ru' ? 'Область глаз' : 'Under-Eye'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-indigo-700 capitalize">{translateLevel(cameraResult.underEyeAnalysis.level)}</p>
                      <p className="text-xs text-indigo-600 mt-1">
                        {locale === 'ar' ? `هالات: ${cameraResult.underEyeAnalysis.darkCircles}%` : 
                         locale === 'ru' ? `Круги: ${cameraResult.underEyeAnalysis.darkCircles}%` : 
                         `Dark circles: ${cameraResult.underEyeAnalysis.darkCircles}%`}
                      </p>
                    </div>
                  )}
                  
                  {/* Firmness */}
                  {cameraResult.firmnessAnalysis && (
                    <div className="bg-teal-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-teal-600" />
                        <span className="text-sm font-medium text-teal-800">
                          {locale === 'ar' ? 'مرونة البشرة' : locale === 'ru' ? 'Упругость' : 'Firmness'}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-teal-700">{cameraResult.firmnessAnalysis.firmness}%</p>
                      <div className="h-2 bg-teal-100 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${cameraResult.firmnessAnalysis.firmness}%` }} />
                      </div>
                    </div>
                  )}
                  
                  {/* Sun Damage */}
                  {cameraResult.sunDamageAnalysis && (
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">
                          {locale === 'ar' ? 'أضرار الشمس' : locale === 'ru' ? 'УФ-повреждение' : 'Sun Damage'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-orange-700 capitalize">{translateLevel(cameraResult.sunDamageAnalysis.level)}</p>
                      <p className="text-xs text-orange-600 mt-1">
                        {locale === 'ar' ? `النمش: ${cameraResult.sunDamageAnalysis.indicators.frecklingIntensity}%` : 
                         locale === 'ru' ? `Веснушки: ${cameraResult.sunDamageAnalysis.indicators.frecklingIntensity}%` : 
                         `Freckling: ${cameraResult.sunDamageAnalysis.indicators.frecklingIntensity}%`}
                      </p>
                    </div>
                  )}
                  
                  {/* Lip Health */}
                  {cameraResult.lipAnalysis && (
                    <div className="bg-rose-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-rose-600" />
                        <span className="text-sm font-medium text-rose-800">
                          {locale === 'ar' ? 'صحة الشفاه' : locale === 'ru' ? 'Здоровье губ' : 'Lip Health'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-rose-700 capitalize">{translateLevel(cameraResult.lipAnalysis.level)}</p>
                      <p className="text-xs text-rose-600 mt-1">
                        {locale === 'ar' ? `ترطيب: ${cameraResult.lipAnalysis.hydration}%` : 
                         locale === 'ru' ? `Увлажн.: ${cameraResult.lipAnalysis.hydration}%` : 
                         `Hydration: ${cameraResult.lipAnalysis.hydration}%`}
                      </p>
                    </div>
                  )}
                  
                  {/* Fitzpatrick Skin Type */}
                  {cameraResult.fitzpatrickType && (
                    <div className="bg-amber-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">
                          {locale === 'ar' ? 'نوع البشرة' : locale === 'ru' ? 'Фототип' : 'Skin Phototype'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-amber-700">{translateFitzpatrick(cameraResult.fitzpatrickType.typeName, cameraResult.fitzpatrickType.description).name}</p>
                      <p className="text-xs text-amber-600 mt-1">{translateFitzpatrick(cameraResult.fitzpatrickType.typeName, cameraResult.fitzpatrickType.description).desc}</p>
                    </div>
                  )}
                  
                </div>
              </div>
            )}

            {/* Concerns */}
            {cameraResult.concerns.length > 0 && (
              <div className="px-6 pb-6">
                <h3 className={`text-lg font-semibold text-gray-900 mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {locale === 'ar' ? 'مخاوف البشرة المكتشفة' : locale === 'ru' ? 'Выявленные проблемы' : 'Detected Skin Concerns'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cameraResult.concerns.map((concern) => (
                    <span 
                      key={concern}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {TARGET_CONCERNS.find(tc => tc.value === concern)?.label || concern}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Expert Analysis Section */}
          {capturedImage && !showAiAnalysis && (
            <div className="mb-8 bg-gradient-to-br from-primary-50 to-red-100 rounded-2xl p-6 border border-primary-200">
              <div className={`flex items-start gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-200">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className={`flex-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {locale === 'ar' ? '🧬 تحليل خبير الذكاء الاصطناعي' : locale === 'ru' ? '🧬 Экспертный AI-анализ' : '🧬 AI Expert Analysis'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {locale === 'ar' 
                      ? 'احصل على تحليل احترافي للبشرة مع توصيات منتجات مخصصة من خبيرنا الذكي'
                      : locale === 'ru'
                        ? 'Получите профессиональный анализ кожи с персональными рекомендациями продуктов от нашего AI-эксперта'
                        : 'Get a professional skin analysis with personalized product recommendations from our AI dermatologist expert'}
                  </p>
                  <button
                    onClick={handleAIExpertAnalysis}
                    disabled={aiAnalysisLoading}
                    className={`inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                  >
                    {aiAnalysisLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {locale === 'ar' ? 'جاري التحليل...' : locale === 'ru' ? 'Анализируем...' : 'Analyzing...'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        {locale === 'ar' ? 'احصل على تحليل الخبير' : locale === 'ru' ? 'Получить анализ эксперта' : 'Get Expert Analysis'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Expert Analysis Results */}
          {showAiAnalysis && aiAnalysisResult && (
            <div className="mb-8 bg-gradient-to-br from-primary-50 to-red-100 rounded-2xl overflow-hidden border border-primary-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 text-white">
                <div className={`flex items-center justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Brain className="w-6 h-6" />
                    <div>
                      <h3 className="font-bold text-lg">
                        {locale === 'ar' ? 'تحليل خبير الذكاء الاصطناعي' : locale === 'ru' ? 'Экспертный AI-анализ' : 'AI Expert Analysis'}
                      </h3>
                      <p className="text-primary-100 text-sm">
                        {locale === 'ar' ? 'تحليل احترافي لبشرتك' : locale === 'ru' ? 'Профессиональный анализ вашей кожи' : 'Professional analysis of your skin'}
                      </p>
                    </div>
                  </div>
                  {aiAnalysisResult.healthScore && (
                    <div className="text-center">
                      <p className="text-primary-100 text-xs">
                        {locale === 'ar' ? 'صحة البشرة' : locale === 'ru' ? 'Здоровье' : 'Health Score'}
                      </p>
                      <p className="text-2xl font-bold">{aiAnalysisResult.healthScore}/10</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                {/* Analysis Text */}
                <div className={`mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {locale === 'ar' ? '📋 التحليل' : locale === 'ru' ? '📋 Анализ' : '📋 Analysis'}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{aiAnalysisResult.analysis}</p>
                </div>

                {/* Concerns */}
                {aiAnalysisResult.concerns && aiAnalysisResult.concerns.length > 0 && (
                  <div className={`mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {locale === 'ar' ? '⚠️ المخاوف الرئيسية' : locale === 'ru' ? '⚠️ Основные проблемы' : '⚠️ Key Concerns'}
                    </h4>
                    <div className={`flex flex-wrap gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      {aiAnalysisResult.concerns.map((concern, idx) => (
                        <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                          {translateConcern(concern)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Recommendations */}
                {aiAnalysisResult.recommendations && aiAnalysisResult.recommendations.length > 0 && (
                  <div className={`mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {locale === 'ar' ? '✨ المنتجات الموصى بها' : locale === 'ru' ? '✨ Рекомендуемые продукты' : '✨ Recommended Products'}
                    </h4>
                    <div className="space-y-4">
                      {aiAnalysisResult.recommendations.map((rec, idx) => {
                        const linkMatch = rec.product.match(/\[([^\]]+)\]\(([^)]+)\)\{\{id:(\d+)\}\}/)
                        const productName = linkMatch?.[1] ?? rec.product
                        let productId: string | null = linkMatch?.[3] ?? null
                        if (!productId) {
                          const nameUpper = productName.toUpperCase().trim()
                          productId = AI_PRODUCT_NAME_TO_ID[nameUpper] ?? null
                          if (!productId) {
                            for (const [name, id] of Object.entries(AI_PRODUCT_NAME_TO_ID)) {
                              if (nameUpper.includes(name) || name.includes(nameUpper)) { productId = id; break }
                            }
                          }
                        }
                        const productUrl = linkMatch ? linkMatch[2] : (productId ? `/products/${productId}` : null)
                        const productDetails = productId ? aiProductDetails.get(productId) : null
                        
                        return (
                          <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm border border-primary-100">
                            <div className={`flex ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                              {/* Product Image & Size */}
                              <div className="flex-shrink-0 flex flex-col">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50">
                                  {productDetails?.image ? (
                                    <Image
                                      src={productDetails.image}
                                      alt={productDetails.name || productName || 'Product'}
                                      width={112}
                                      height={112}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-red-100">
                                      <Sparkles className="w-8 h-8 text-primary-400" />
                                    </div>
                                  )}
                                </div>
                                {/* Product Size */}
                                {productDetails?.size && (
                                  <div className="bg-gray-100 px-2 py-1 text-center">
                                    <span className="text-xs text-gray-600">{productDetails.size}</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Product Info */}
                              <div className={`flex-1 p-3 sm:p-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                                {/* Product Name */}
                                {productUrl ? (
                                  <Link 
                                    href={productUrl}
                                    className="font-semibold text-primary-700 hover:text-primary-900 hover:underline text-sm sm:text-base line-clamp-2"
                                  >
                                    {productDetails?.name || productName}
                                  </Link>
                                ) : (
                                  <span className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                                    {productName}
                                  </span>
                                )}
                                
                                {/* Price */}
                                {productDetails?.price && canUserSeePrices(user) && (() => {
                                  const pricing = calculateDiscountedPrice(productDetails as Product, user)
                                  return pricing.hasDiscount ? (
                                    <div className="flex items-baseline gap-1.5 mt-1">
                                      <span className="text-primary-600 font-bold text-base sm:text-lg">
                                        AED {pricing.discountedPrice.toFixed(0)}
                                      </span>
                                      <span className="text-gray-400 line-through text-xs">
                                        {pricing.originalPrice.toFixed(0)}
                                      </span>
                                    </div>
                                  ) : (
                                    <p className="text-primary-600 font-bold text-base sm:text-lg mt-1">
                                      AED {pricing.originalPrice.toFixed(0)}
                                    </p>
                                  )
                                })()}
                                
                                {/* Reason */}
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{rec.reason}</p>
                                
                                {/* Add to Bag Button */}
                                {productId && productDetails && (
                                  <button
                                    onClick={() => {
                                      addItem(productDetails, 1)
                                      alert(locale === 'ar' ? 'تمت الإضافة إلى السلة! 🛍️' : locale === 'ru' ? 'Добавлено в корзину! 🛍️' : 'Added to bag! 🛍️')
                                    }}
                                    className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                                  >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    {locale === 'ar' ? 'أضف إلى السلة' : locale === 'ru' ? 'В корзину' : 'Add to Bag'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Daily Routine */}
                {aiAnalysisResult.routine && (
                  <div className={`mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {locale === 'ar' ? '🌅 روتينك اليومي' : locale === 'ru' ? '🌅 Ваш ежедневный уход' : '🌅 Your Daily Routine'}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* AM Routine */}
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <h5 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          {locale === 'ar' ? 'الصباح' : locale === 'ru' ? 'Утро' : 'Morning'}
                        </h5>
                        <ol className="space-y-3">
                          {aiAnalysisResult.routine.am?.map((step, idx) => {
                            // Clean up any markdown links and {{id:XX}} patterns
                            const cleanStep = step
                              .replace(/\{\{id:\d+\}\}/g, '') // Remove {{id:XX}}
                              .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert [text](url) to just text
                              .trim()
                            
                            return (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <span className="text-sm text-gray-700">{cleanStep}</span>
                              </li>
                            )
                          })}
                        </ol>
                      </div>
                      {/* PM Routine */}
                      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                        <h5 className="font-medium text-indigo-800 mb-3 flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          {locale === 'ar' ? 'المساء' : locale === 'ru' ? 'Вечер' : 'Evening'}
                        </h5>
                        <ol className="space-y-3">
                          {aiAnalysisResult.routine.pm?.map((step, idx) => {
                            // Clean up any markdown links and {{id:XX}} patterns
                            const cleanStep = step
                              .replace(/\{\{id:\d+\}\}/g, '') // Remove {{id:XX}}
                              .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert [text](url) to just text
                              .trim()
                            
                            return (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-200 text-indigo-800 text-xs font-bold flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <span className="text-sm text-gray-700">{cleanStep}</span>
                              </li>
                            )
                          })}
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tips */}
                {aiAnalysisResult.tips && aiAnalysisResult.tips.length > 0 && (
                  <div className={dir === 'rtl' ? 'text-right' : ''}>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {locale === 'ar' ? '💡 نصائح مخصصة' : locale === 'ru' ? '💡 Персональные советы' : '💡 Personalized Tips'}
                    </h4>
                    <ul className="space-y-2">
                      {aiAnalysisResult.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Close AI Analysis */}
                <div className="mt-6 pt-4 border-t border-primary-200 text-center">
                  <button
                    onClick={() => setShowAiAnalysis(false)}
                    className="text-primary-600 hover:text-primary-800 font-medium text-sm"
                  >
                    {locale === 'ar' ? '← العودة إلى التقرير' : locale === 'ru' ? '← Назад к отчёту' : '← Back to Report'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : !showResults ? (
        <>
          {/* Header */}
          <div className="text-center mb-6 md:mb-12">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
              {t('skinRecommendation.title')}
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              {t('skinRecommendation.subtitle')}
            </p>
          </div>

          {/* Camera Analysis Option - Available on all platforms */}
          <div className="mb-6 md:mb-10">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-5 md:p-6 border border-primary-200">
                <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-200">
                    <Scan className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className={`flex-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                      {locale === 'ar' ? 'تحليل البشرة بالكاميرا' : locale === 'ru' ? 'Анализ кожи камерой' : 'AI Skin Analysis'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {locale === 'ar' ? 'التقط صورة سيلفي وسنحلل بشرتك' : locale === 'ru' ? 'Сделайте селфи, и мы проанализируем вашу кожу' : 'Take a selfie and we\'ll analyze your skin'}
                    </p>
                  </div>
                </div>

                {/* Two Action Buttons - Power Animal & Live AR */}
                <div className="mt-4 mb-4">
                  <div className="flex gap-4">
                    {/* Power Animal Button */}
                    <div className="flex-1">
                      <button
                        onClick={() => setShowPowerAnimal(true)}
                        className={`w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-base font-semibold transition-all border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 hover:border-amber-400 hover:shadow-lg active:scale-[0.98] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                      >
                        <span className="text-xl">🦁</span>
                        {locale === 'ar' ? 'حيوان القوة' : locale === 'ru' ? 'Тотем' : 'Power Animal'}
                      </button>
                      <p className={`mt-2 text-xs text-gray-500 text-center leading-relaxed`}>
                        {locale === 'ar' 
                          ? 'اكتشف حيوانك الروحي مع روتين العناية المضحك!'
                          : locale === 'ru'
                            ? 'Узнайте своё тотемное животное с забавным уходом!'
                            : 'Discover your spirit animal with a funny skincare routine!'}
                      </p>
                    </div>
                    
                    {/* Live AR Button */}
                    <div className="flex-1">
                      <button
                        onClick={() => setShowARCamera(true)}
                        className={`w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-base font-semibold transition-all border-2 border-primary-200 bg-gradient-to-r from-primary-50 to-red-50 text-primary-700 hover:border-primary-400 hover:shadow-lg active:scale-[0.98] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                      >
                        <Zap className="w-5 h-5" />
                        {locale === 'ar' ? 'تحليل AR' : locale === 'ru' ? 'AR Анализ' : 'Live AR'}
                      </button>
                      <p className={`mt-2 text-xs text-gray-500 text-center leading-relaxed`}>
                        {locale === 'ar'
                          ? 'تحليل فوري للبشرة بالذكاء الاصطناعي في الوقت الفعلي'
                          : locale === 'ru'
                            ? 'ИИ анализ кожи в реальном времени с камерой'
                            : 'Real-time AI skin analysis with your camera'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Camera Analysis Result Banner */}
                {cameraResult && (
                  <div className={`mt-4 pt-4 border-t border-primary-200 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 text-sm text-primary-700 mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-medium">
                        {locale === 'ar' ? 'تم تحليل بشرتك' : locale === 'ru' ? 'Ваша кожа проанализирована' : 'Your skin has been analyzed'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-3 flex-wrap ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="bg-white px-3 py-1.5 rounded-full text-sm font-medium text-gray-900 shadow-sm">
                        {SKIN_TYPES.find(st => st.value === cameraResult.skinType)?.icon}{' '}
                        {SKIN_TYPES.find(st => st.value === cameraResult.skinType)?.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {cameraResult.confidence}% {locale === 'ar' ? 'ثقة' : locale === 'ru' ? 'уверенность' : 'confidence'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className={`flex items-center gap-4 my-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-sm text-gray-400 font-medium">
                  {locale === 'ar' ? 'أو' : locale === 'ru' ? 'или' : 'or answer manually'}
                </span>
                <div className="flex-1 border-t border-gray-200" />
              </div>
            </div>

          {/* Progress Indicator */}
          <div className="mb-4 md:mb-8">
            <div className={`flex items-center justify-between mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <span className="text-xs md:text-sm font-medium text-gray-700">{t('skinRecommendation.step')} {currentStep} {t('skinRecommendation.of')} 4</span>
              <span className="text-xs md:text-sm text-gray-500">{Math.round((currentStep / 4) * 100)}% {t('skinRecommendation.complete')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
              <div 
                className="bg-primary-600 h-1.5 md:h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
            {/* Step 1: Skin Type */}
            <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-6 lg:p-8 shadow-sm">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary-100 rounded-full text-primary-600 font-bold text-sm md:text-base">
                  1
                </div>
                <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900">{t('skinRecommendation.whatsYourSkinType')}</h2>
              </div>
              <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6">{t('skinRecommendation.selectBestDescribes')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {SKIN_TYPES.map((skinType) => (
                  <button
                    key={skinType.value}
                    type="button"
                    onClick={() => {
                      setSelectedSkinType(skinType.value)
                      setCurrentStep(2)
                    }}
                    className={`p-4 md:p-6 rounded-lg md:rounded-xl border-2 transition-all duration-200 ${dir === 'rtl' ? 'text-right' : 'text-left'} group min-h-[120px] md:min-h-[140px] ${
                      selectedSkinType === skinType.value
                        ? 'border-primary-500 bg-primary-50 shadow-md'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 active:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                      <span className="text-2xl md:text-3xl">{skinType.icon}</span>
                      <div className="font-semibold text-base md:text-lg text-gray-900">{skinType.label}</div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">{skinType.description}</p>
                    {selectedSkinType === skinType.value && (
                      <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-primary-200">
                        <div className="flex items-start gap-1.5 md:gap-2">
                          <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                          <p className="text-[10px] md:text-xs text-primary-700 leading-relaxed">{skinType.tips}</p>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Age Group */}
            {selectedSkinType && (
              <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-6 lg:p-8 shadow-sm">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary-100 rounded-full text-primary-600 font-bold text-sm md:text-base">
                    2
                  </div>
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900">{t('skinRecommendation.whatsYourAgeGroup')}</h2>
                </div>
                <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6">{t('skinRecommendation.helpsRecommendAgeAppropriate')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {AGE_GROUPS.map((ageGroup) => (
                    <button
                      key={ageGroup.value}
                      type="button"
                      onClick={() => {
                        setSelectedAgeGroup(ageGroup.value)
                        setCurrentStep(3)
                      }}
                      className={`p-4 md:p-6 rounded-lg md:rounded-xl border-2 transition-all duration-200 ${dir === 'rtl' ? 'text-right' : 'text-left'} min-h-[100px] md:min-h-[120px] ${
                        selectedAgeGroup === ageGroup.value
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 active:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <span className="text-xl md:text-2xl">{ageGroup.icon}</span>
                        <div className="font-semibold text-base md:text-lg text-gray-900">{ageGroup.label}</div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600">{ageGroup.focus}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Target Concerns */}
            {selectedAgeGroup && (
              <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-6 lg:p-8 shadow-sm">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary-100 rounded-full text-primary-600 font-bold text-sm md:text-base">
                    3
                  </div>
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900">{t('skinRecommendation.whatAreMainConcerns')}</h2>
                </div>
                <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6">{t('skinRecommendation.selectAllThatApply')}</p>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
                  {TARGET_CONCERNS.map((concern) => (
                    <button
                      key={concern.value}
                      type="button"
                      onClick={() => {
                        handleTargetConcernToggle(concern.value)
                        setCurrentStep(4)
                      }}
                      className={`p-3 md:p-5 rounded-lg md:rounded-xl border-2 transition-all duration-200 ${dir === 'rtl' ? 'text-right' : 'text-left'} min-h-[100px] md:min-h-[120px] ${
                        selectedTargetConcerns.includes(concern.value)
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 active:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                        <span className="text-lg md:text-2xl">{concern.icon}</span>
                        <span className="font-semibold text-sm md:text-base text-gray-900 leading-tight">{concern.label}</span>
                      </div>
                      <p className="text-[10px] md:text-xs text-gray-600 mb-1 md:mb-2 line-clamp-2">{concern.description}</p>
                      {selectedTargetConcerns.includes(concern.value) && concern.keyIngredients && (
                        <div className="mt-1.5 md:mt-2 pt-1.5 md:pt-2 border-t border-primary-200">
                          <p className="text-[10px] md:text-xs text-primary-700 font-medium">{t('skinRecommendation.keyIngredients')}: {concern.keyIngredients}</p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Usage Time */}
            {selectedTargetConcerns.length > 0 && (
              <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-6 lg:p-8 shadow-sm">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary-100 rounded-full text-primary-600 font-bold text-sm md:text-base">
                    4
                  </div>
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900">{t('skinRecommendation.whenPreferUseSkincare')}</h2>
                </div>
                <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6">{t('skinRecommendation.helpsRecommendRoutine')}</p>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
                  {USAGE_OPTIONS.map((usage) => (
                    <button
                      key={usage.value}
                      type="button"
                      onClick={() => setSelectedUsage(usage.value)}
                      className={`p-4 md:p-6 rounded-lg md:rounded-xl border-2 transition-all duration-200 text-center min-h-[100px] md:min-h-[120px] ${
                        selectedUsage === usage.value
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 active:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl md:text-4xl mb-2 md:mb-3">{usage.icon}</div>
                      <div className="font-semibold text-sm md:text-lg text-gray-900 mb-1">{usage.label}</div>
                      <p className="text-[10px] md:text-xs text-gray-600">{usage.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            {selectedSkinType && (
              <div className="text-center pt-2 md:pt-4">
                <button
                  type="submit"
                  disabled={!selectedSkinType || isLoading}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 md:py-4 px-6 md:px-12 rounded-lg md:rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg disabled:shadow-none flex items-center gap-2 mx-auto text-sm md:text-base min-h-[44px] md:min-h-[52px] touch-manipulation"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                      <span className="text-xs md:text-base">{t('skinRecommendation.gettingRecommendations')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('skinRecommendation.getMyRecommendations')}</span>
                      <ArrowRight className={`w-4 h-4 md:w-5 md:h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>
                {!selectedTargetConcerns.length && selectedSkinType && (
                  <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4 px-4">
                    {t('skinRecommendation.tipSelectingConcerns')}
                  </p>
                )}
              </div>
            )}
          </form>
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          {/* Results Header - Apple Style */}
          <div className="text-center mb-12 md:mb-20">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-gray-900 tracking-tight mb-4 md:mb-6">
              {locale === 'ar' ? 'اخترنا لك' : locale === 'ru' ? 'Подобрано для вас' : 'Curated for You'}
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
              {locale === 'ar' 
                ? 'منتجات مختارة بعناية بناءً على تحليل بشرتك الشخصي'
                : locale === 'ru'
                ? 'Продукты, подобранные на основе анализа вашей кожи'
                : 'Products carefully selected based on your personal skin analysis'
              }
            </p>
            
            {/* Skin Profile Pills - Minimal */}
            <div className={`flex flex-wrap items-center justify-center gap-3 mt-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                {SKIN_TYPES.find(type => type.value === selectedSkinType)?.icon}
                {SKIN_TYPES.find(type => type.value === selectedSkinType)?.label || selectedSkinType}
              </span>
              {selectedTargetConcerns.slice(0, 3).map(concern => {
                const concernData = TARGET_CONCERNS.find(c => c.value === concern)
                return concernData ? (
                  <span key={concern} className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                    {concernData.icon} {concernData.label}
                  </span>
                ) : null
              })}
              {selectedTargetConcerns.length > 3 && (
                <span className="text-sm text-gray-400">
                  +{selectedTargetConcerns.length - 3} {locale === 'ar' ? 'أخرى' : locale === 'ru' ? 'ещё' : 'more'}
                </span>
              )}
            </div>
            
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 font-light">
              {locale === 'ar' 
                ? `وجدنا ${recommendations.length} منتج مثالي لبشرتك`
                : locale === 'ru'
                ? `Мы нашли ${recommendations.length} продуктов для вашей кожи`
                : `We found ${recommendations.length} products perfect for your skin`
              }
            </p>
            <button
              onClick={resetForm}
              className={`inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm md:text-base transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              {locale === 'ar' ? 'تحليل جديد' : locale === 'ru' ? 'Новый анализ' : 'New Analysis'}
            </button>
          </div>

          {/* Results by Category - Apple-like Clean Design */}
          {recommendations.length > 0 ? (
            <>
            <div className="space-y-12 md:space-y-20">
              {Object.entries(groupedProducts).map(([category, products]) => (
                <section key={category}>
                  {/* Category Header - Apple Style */}
                  <div className="mb-8 md:mb-12">
                    <h2 className={`text-2xl md:text-4xl font-semibold text-gray-900 tracking-tight ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {category}
                    </h2>
                    <p className={`text-gray-500 mt-2 text-base md:text-lg ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {products.length} {locale === 'ar' ? 'منتج مختار لك' : locale === 'ru' ? 'товаров подобрано для вас' : 'products curated for you'}
                    </p>
                  </div>
                  
                  {/* Product Grid - Clean Apple Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {products.map((product) => {
                      const discountedPrice = calculateDiscountedPrice(product, user)
                      const canSeePrice = canUserSeePrices(user)
                      
                      return (
                        <article
                          key={product.id}
                          className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/50"
                        >
                          {/* Product Image */}
                          <Link href={getLocalizedPath(`/products/${product.id}`, locale)} className="block">
                            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              />
                              
                              {/* Subtle Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Favorite Button - Minimal */}
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  toggleFavorite(product)
                                }}
                                className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white hover:shadow-md transition-all duration-300 z-10`}
                              >
                                <Heart
                                  className={`w-5 h-5 transition-colors ${
                                    isFavorite(product.id)
                                      ? 'text-primary-600 fill-primary-600'
                                      : 'text-gray-400 group-hover:text-gray-600'
                                  }`}
                                />
                              </button>
                              
                              {/* Rating Badge - Subtle */}
                              {product.rating && product.rating >= 4.5 && (
                                <div className={`absolute bottom-4 ${dir === 'rtl' ? 'right-4' : 'left-4'} flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm`}>
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span className="text-xs font-medium text-gray-900">{product.rating.toFixed(1)}</span>
                                </div>
                              )}
                              
                              {/* Discount Badge */}
                              {discountedPrice.hasDiscount && (
                                <div className={`absolute top-4 ${dir === 'rtl' ? 'right-4' : 'left-4'} bg-primary-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg`}>
                                  {Math.round(((product.price - discountedPrice.discountedPrice) / product.price) * 100)}% OFF
                                </div>
                              )}
                            </div>
                          </Link>
                          
                          {/* Product Info - Spacious & Clean */}
                          <div className="p-5 md:p-6">
                            <Link href={getLocalizedPath(`/products/${product.id}`, locale)} className="block">
                              <h3 className={`font-semibold text-gray-900 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300 ${dir === 'rtl' ? 'text-right' : ''}`}>
                                {product.name}
                              </h3>
                            </Link>
                            
                            {/* Subtle Description */}
                            <p className={`text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                              {product.description}
                            </p>
                            
                            {/* Price Section - Clean */}
                            <div className={`flex items-end justify-between mb-5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                              {canSeePrice ? (
                                <div>
                                  {discountedPrice.hasDiscount ? (
                                    <div className={`flex items-baseline gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                      <span className="text-2xl font-semibold text-gray-900">
                                        AED {discountedPrice.discountedPrice.toFixed(0)}
                                      </span>
                                      <span className="text-sm text-gray-400 line-through">
                                        {product.price.toFixed(0)}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-2xl font-semibold text-gray-900">
                                      AED {product.price.toFixed(0)}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">
                                  {locale === 'ar' ? 'سجل لعرض السعر' : locale === 'ru' ? 'Войдите для цены' : 'Sign in for price'}
                                </span>
                              )}
                              
                              {/* Stock Indicator - Minimal */}
                              {!product.inStock && (
                                <span className="text-xs font-medium text-gray-400">
                                  {locale === 'ar' ? 'غير متوفر' : locale === 'ru' ? 'Нет в наличии' : 'Out of stock'}
                                </span>
                              )}
                            </div>
                            
                            {/* Add to Cart - Apple Button Style */}
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                              className={`w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-3.5 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:cursor-not-allowed shadow-sm hover:shadow-md ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>{locale === 'ar' ? 'أضف للسلة' : locale === 'ru' ? 'В корзину' : 'Add to Bag'}</span>
                            </button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>

            {/* Browse by Skin Concern CTA */}
            <div className="mt-12 rounded-2xl border border-gray-100 bg-gradient-to-br from-rose-50/60 to-white p-6 sm:p-8 text-center">
              <span className="text-3xl mb-3 block">🌿</span>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                {locale === 'ar' ? 'استكشفي حسب مشكلة البشرة' : locale === 'ru' ? 'Подберите по проблеме кожи' : 'Browse by Skin Concern'}
              </h3>
              <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">
                {locale === 'ar'
                  ? 'صفحات مخصصة لكل مشكلة جلدية مع منتجات مختارة وروتين يومي كامل'
                  : locale === 'ru'
                  ? 'Специальные страницы для каждой проблемы кожи с подобранными продуктами и полным ежедневным уходом'
                  : 'Dedicated pages for each skin concern with curated products & complete daily routines'}
              </p>
              <Link
                href={getLocalizedPath('/products?categories=skin-concern', locale)}
                className={`inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 shadow-sm hover:shadow-md ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                {locale === 'ar' ? 'اكتشفي المشاكل' : locale === 'ru' ? 'Смотреть проблемы' : 'Explore Concerns'}
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">{t('skinRecommendation.noProductsFound')}</h3>
              <p className={`text-gray-500 mb-8 max-w-md mx-auto ${dir === 'rtl' ? 'text-right' : 'text-center'}`}>
                {t('skinRecommendation.couldntFindProducts')}
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={resetForm}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  {t('skinRecommendation.adjustSelections')}
                </button>
                <Link
                  href={getLocalizedPath('/products', locale)}
                  className={`bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors inline-flex items-center justify-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                >
                  {t('skinRecommendation.browseAllProducts')}
                  <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
        </div>
      </div>
    </div>
  )
}
