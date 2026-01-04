'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { ShoppingCart, Heart, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Info, Star, Camera, Scan, Droplets, Target, Flame, Eye, Palette, Clock } from 'lucide-react'
import { SkinAnalysisCamera, SkinAnalysisResult } from '@/components/SkinAnalysisCamera'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { errorLog } from '@/lib/logger'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
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
  const searchParams = useSearchParams()
  
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
  const [cameraResult, setCameraResult] = useState<SkinAnalysisResult | null>(null)
  const [showAnalysisReport, setShowAnalysisReport] = useState(false)

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
  const handleCameraAnalysisComplete = (result: SkinAnalysisResult) => {
    setCameraResult(result)
    setShowCamera(false)
    
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir={dir}>
      <BreadcrumbSchema 
        items={[
          { name: t('common.home'), url: getLocalizedPath('/', locale) },
          { name: t('profile.skinRecommendation'), url: getLocalizedPath('/skin-recommendation', locale) }
        ]}
      />

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Navigation Breadcrumb */}
          <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
            <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">{t('skinRecommendation.title')}</span>
          </nav>
          
          {/* Back to Home */}
          <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span>{t('common.backToHome')}</span>
          </Link>

      {/* Camera Modal */}
      {showCamera && (
        <SkinAnalysisCamera
          onAnalysisComplete={handleCameraAnalysisComplete}
          onClose={() => setShowCamera(false)}
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
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-5 text-white">
              <div className={`flex items-center justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className="text-primary-100 text-sm mb-1">
                    {locale === 'ar' ? 'نوع بشرتك' : locale === 'ru' ? 'Тип вашей кожи' : 'Your Skin Type'}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold">
                    {SKIN_TYPES.find(st => st.value === cameraResult.skinType)?.icon}{' '}
                    {SKIN_TYPES.find(st => st.value === cameraResult.skinType)?.label || cameraResult.skinType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-primary-100 text-sm mb-1">
                    {locale === 'ar' ? 'دقة التحليل' : locale === 'ru' ? 'Точность' : 'Confidence'}
                  </p>
                  <p className="text-2xl font-bold">{cameraResult.confidence}%</p>
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

          {/* Get Recommendations Button */}
          <div className="text-center">
            <button
              onClick={async () => {
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
                  if (!response.ok) throw new Error('Failed to fetch')
                  const products = await response.json()
                  
                  setRecommendations(products)
                  setShowResults(true)
                  setShowAnalysisReport(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                } catch (error) {
                  errorLog('Error fetching recommendations:', error)
                  alert(t('skinRecommendation.failedToLoadRecommendations'))
                } finally {
                  setIsLoading(false)
                }
              }}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {isLoading 
                ? (locale === 'ar' ? 'جاري التحميل...' : locale === 'ru' ? 'Загрузка...' : 'Loading...')
                : (locale === 'ar' ? 'عرض المنتجات الموصى بها' : locale === 'ru' ? 'Показать рекомендации' : 'View Recommended Products')
              }
              {!isLoading && <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />}
            </button>
            <p className="text-gray-500 text-sm mt-3">
              {locale === 'ar' ? 'منتجات GENOSYS المناسبة لنوع بشرتك' : locale === 'ru' ? 'Продукты GENOSYS для вашего типа кожи' : 'GENOSYS products tailored for your skin type'}
            </p>
          </div>
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

                <button
                  onClick={() => setShowCamera(true)}
                  className={`mt-4 w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all active:scale-[0.98] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                >
                  <Camera className="w-5 h-5" />
                  {cameraResult 
                    ? (locale === 'ar' ? 'إعادة التحليل' : locale === 'ru' ? 'Повторить анализ' : 'Analyze Again')
                    : (locale === 'ar' ? 'ابدأ تحليل البشرة' : locale === 'ru' ? 'Начать анализ' : 'Start Skin Analysis')
                  }
                </button>
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
