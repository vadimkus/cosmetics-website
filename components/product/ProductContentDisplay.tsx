
'use client'

import Link from 'next/link'
import { Product } from '@/types'
import { getProductDocumentation } from '@/data/productConfig'
import { sanitizeProductDescription, sanitizeHtml } from '@/lib/sanitize'
import { Sparkles } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import ProductInfoAccordion from '@/components/product/ProductInfoAccordion'
import { ROUTINE_STEP_PRODUCT_IDS } from '@/lib/routineStepLinks'
import { getLocalizedPath } from '@/lib/i18n'

interface ProductContentDisplayProps {
  product: Product
}

export default function ProductContentDisplay({ product }: ProductContentDisplayProps) {
  const { t, locale, dir } = useTranslation()
  const arabicTranslations = locale === 'ar' ? getProductTranslations(product.productNumber || product.id) : null
  const russianTranslations = locale === 'ru' ? getProductTranslationsRu(product.productNumber || product.id) : null
  
  // Use translations if available, otherwise fall back to English
  const translations = arabicTranslations || russianTranslations
  const description = translations?.description || product.description
  const productDetailsStr = translations?.productDetails || product.productDetails
  const keyFeaturesStr = translations?.keyFeatures || product.keyFeatures
  const benefitsStr = translations?.benefits || product.benefits
  const ingredientsStr = translations?.ingredients || product.ingredients
  const howToUseStr = translations?.howToUse || product.howToUse
  const directionsStr = translations?.directions || product.directions
  
  // Parse JSON fields safely with proper type assertions
  const productDetails = productDetailsStr ? (tryParseJSON(productDetailsStr) as Record<string, string> | string) : null
  const keyFeatures = keyFeaturesStr ? (tryParseJSON(keyFeaturesStr) as Array<{ title?: string; description?: string }> | string) : null
  const benefits = benefitsStr ? (tryParseJSON(benefitsStr) as string[] | string) : null
  const ingredients = ingredientsStr ? (tryParseJSON(ingredientsStr) as Array<{ name?: string; description?: string; subList?: string[] }> | string) : null
  const howToUse = howToUseStr ? (tryParseJSON(howToUseStr) as string) : null
  const documentation = getProductDocumentation(product.productNumber || product.id, locale)

  // Routine-step titles deep-link to each product's page (self-links skipped)
  const routineTitle = (key: string) => {
    const pid = ROUTINE_STEP_PRODUCT_IDS[key]
    const label = t(`product.${key}`)
    if (!pid || String(product.id) === pid || String(product.productNumber || '') === pid) return label
    return (
      <Link
        href={getLocalizedPath(`/products/${pid}`, locale)}
        className="underline decoration-gray-300 underline-offset-2 transition-colors hover:text-primary-700 hover:decoration-primary-400"
      >
        {label}
      </Link>
    )
  }

  // Parse description for kit items - support English, Arabic, and Russian
  const parseKitDescription = (description: string) => {
    const kitIncludesEn = 'Kit includes:'
    const kitIncludesAr = 'يشمل الطقم:'
    const kitIncludesRu = 'Набор включает:'
    const kitIncludesPattern = description.includes(kitIncludesEn) ? kitIncludesEn : 
                               description.includes(kitIncludesAr) ? kitIncludesAr :
                               description.includes(kitIncludesRu) ? kitIncludesRu : null
    
    if (!kitIncludesPattern) {
      return { intro: description, kitItems: [] }
    }

    const parts = description.split(kitIncludesPattern)
    const intro = parts[0]?.trim() || ''
    const kitSection = parts[1]?.trim() || ''

    // Parse kit items (numbered list)
    const kitItems: Array<{ number: string; name: string; description: string }> = []
    
    // Split by numbered items (1., 2., etc.)
    const itemParts = kitSection.split(/(?=\n\d+\.)/g).filter(Boolean)
    
    itemParts.forEach((part) => {
      const lines = part.trim().split('\n').filter(Boolean)
      if (lines.length === 0) return
      
      const firstLine = lines[0]
      if (!firstLine) return
      
      const numberMatch = firstLine.match(/^(\d+)\.\s*(.+)$/)
      if (numberMatch && numberMatch[1] && numberMatch[2]) {
        const number = numberMatch[1]
        const name = numberMatch[2].trim()
        const description = lines.slice(1).join('\n').trim()
        
        kitItems.push({
          number,
          name,
          description: description || ''
        })
      }
    })

    return { intro, kitItems }
  }

  // Sanitize product description to prevent XSS
  const sanitizedDescription = description ? sanitizeProductDescription(description) : ''
  const { intro, kitItems } = sanitizedDescription ? parseKitDescription(sanitizedDescription) : { intro: '', kitItems: [] }

  // The single-paragraph descriptions often end with a full INCI-style dump
  // ("Key ingredients: …"). That list is already presented properly in the
  // Key Ingredients accordion, so strip it from the intro to keep the
  // description scannable. Only applies when the accordion has data — no
  // information is ever lost.
  const stripIngredientDump = (text: string): string => {
    if (!ingredients || !(Array.isArray(ingredients) ? ingredients.length > 0 : true)) return text
    const startMarkers = ['Key ingredients:', 'المكونات الرئيسية:', 'Ключевые ингредиенты:']
    const endMarkers = ['Effects:', 'التأثيرات:', 'Эффекты:']
    let out = text
    for (const marker of startMarkers) {
      const start = out.indexOf(marker)
      if (start === -1) continue
      let end = out.length
      for (const endMarker of endMarkers) {
        const e = out.indexOf(endMarker, start)
        if (e !== -1 && e < end) end = e
      }
      out = (out.slice(0, start) + out.slice(end)).replace(/[ \t]{2,}/g, ' ').trim()
    }
    return out
  }

  // Process intro text to style bundle price in red
  const processIntroText = (text: string): string => {
    // Match "Bundle price: X AED" pattern and wrap in red span
    let processed = text.replace(
      /(Bundle price:\s*[\d,]+\.?\d*\s+AED)/g,
      '<span class="text-red-600 font-semibold">$1</span>'
    )
    // Match "Save 15% (X AED)" pattern and wrap in red span
    processed = processed.replace(
      /(Save\s+\d+%\s*\([\d,]+\.?\d*\s+AED\))/g,
      '<span class="text-red-600 font-semibold">$1</span>'
    )
    // Sanitize the processed HTML to ensure security
    return sanitizeHtml(processed)
  }

  // Map product names to their IDs (for linking)
  const getProductLink = (productName: string): string | null => {
    const productMap: { [key: string]: string } = {
      'MULTI VITA RADIANCE SERUM': '21',
      'MULTI VITA RADIANCE CREAM': '31',
      'GENOSYS MULTI VITA RADIANCE CREAM': '31',
      'SNOW O₂ CLEANSER': '10',
      'SNOW O2': '10',
      'Snow O2': '10',
      'SNOW BOOSTER': '16',
      'Snow Booster': '16',
      'EPI TURNOVER BOOSTING PEELING GEL': '12',
      'EPI Turnover Boosting Peeling Gel': '12',
      'SOOTHING BOMB SEA ALGAE MASK': '36',
      'Soothing Bomb Sea Algae Mask': '36',
      // Problem Skin Care Beauty Box items
      'PROBLEM CONTROL TONER': '15',
      'Problem Control Toner': '15',
      'PROBLEM CONTROL SERUM': '20',
      'Problem control serum': '20',
      'Problem Control Serum': '20',
      'INTENSIVE PROBLEM CONTROL CREAM': '30',
      'Intensive problem control cream': '30',
      'Intensive Problem Control Cream': '30',
      // Charming Look Beauty Box items
      'SKIN CARING BLEMISH BALM CUSHION': '41',
      'Skin Caring Blemish Balm Cushion': '41',
      'SKIN DEFENDER LIP & EYE MAKEUP REMOVER': '11',
      'Skin Defender Lip & Eye Makeup Remover': '11',
      'SKIN RESCUE OVERNIGHT CREAM MASK': '34',
      'Skin Rescue Overnight Cream Mask': '34',
      // Anti-Aging Beauty Box items
      'MULTI FUNCTIONAL ANTI-WRINKLE SERUM': '22',
      'Multi Functional Anti-wrinkle serum': '22',
      'MULTI FUNCTIONAL ANTI-WRINKLE CREAM': '32',
      'Multifunctional Anti-Wrinkle cream': '32',
      'COLLAGEN MASK': '36',
      'Collagen mask': '36',
      // Deep Moisturizing Beauty Box items
      'MOISTURE REPLENISHING HYALURON SERUM': '18',
      'Moisture Replenishing Hyaluron serum': '18',
      'Moisture Replenishing Hyaluron Serum': '18',
      'MOISTURE REPLENISHING HYALURON CREAM': '29',
      'Moisture Replenishing Hyaluron cream': '29',
      'Moisture Replenishing Hyaluron Cream': '29',
      // Sensitive Skin Beauty Box items
      'ALL FOR SENSITIVE SERUM': '21',
      'All For Sensitive Serum': '21',
      'SKIN BARRIER PROTECTING CREAM WITH CERAMIDES': '31',
      'Skin Barrier Protecting Cream with Ceramides': '31',
      'EGF REPAIR OXYMASK': '52',
      'EGF Repair Oxymask': '52',
    }
    
    // Normalize product name for matching (uppercase, remove extra spaces)
    const normalizedName = productName.toUpperCase().trim()
    
    // Try exact match first
    if (productMap[normalizedName]) {
      return `/products/${productMap[normalizedName]}`
    }
    
    // Try partial match - check if any key is contained in the product name or vice versa
    for (const [key, id] of Object.entries(productMap)) {
      const normalizedKey = key.toUpperCase()
      if (normalizedName.includes(normalizedKey) || normalizedKey.includes(normalizedName)) {
        return `/products/${id}`
      }
    }
    
    return null
  }

  // Convert description to concise bullet points
  // For beauty box kit items, show full description instead of truncating
  const formatDescriptionAsBullets = (description: string, isKitItem: boolean = false): string[] => {
    if (!description) return []
    
    // For kit items in beauty boxes, show full description as paragraphs
    if (isKitItem) {
      // Split by newlines to preserve paragraph structure, but keep the full text
      const lines = description.split('\n').filter(Boolean).map(p => p.trim())
      if (lines.length > 0) {
        return lines
      }
      // Fallback: return as single item if no structure found
      return [description.trim()]
    }
    
    // Check for both English and Arabic key ingredients patterns
    const hasKeyIngredients = description.includes('Key ingredients:') || description.includes('المكونات الرئيسية:')
    
    // For short descriptions (under 200 chars), return as single bullet
    if (description.length < 200 && !hasKeyIngredients && !description.includes('\n')) {
      return [description.trim()]
    }
    
    const bullets: string[] = []
    const lines = description.split('\n').filter(Boolean)
    
    // Extract key information
    let mainDescription = ''
    let keyIngredients: string[] = []
    const benefits: string[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.trim()
      if (!line) continue
      
      // Check for key ingredients in both English and Arabic
      const hasKeyIngredientsInLine = line.includes('Key ingredients:') || line.includes('المكونات الرئيسية:')
      const hasDermatologicallyTested = line.includes('Dermatologically tested') || line.includes('مختبر طبياً')
      
      // Extract main description (first sentence or two)
      if (!mainDescription && line && !hasKeyIngredientsInLine && !hasDermatologicallyTested) {
        // Get first sentence or first 100 characters
        const sentences = line.split('.')
        const firstSentence = sentences[0]
        if (firstSentence && firstSentence.length < 150) {
          mainDescription = firstSentence.trim()
        } else {
          mainDescription = line.substring(0, 120).trim() + '...'
        }
      }
      
      // Extract key ingredients (both English and Arabic)
      if (line.includes('Key ingredients:')) {
        const ingredientsLine = line.replace('Key ingredients:', '').trim()
        if (ingredientsLine) {
          // Split by comma and clean up
          keyIngredients = ingredientsLine.split(',').map(ing => ing.trim()).filter(Boolean)
        }
      } else if (line.includes('المكونات الرئيسية:')) {
        const ingredientsLine = line.replace('المكونات الرئيسية:', '').trim()
        if (ingredientsLine) {
          // Split by comma and clean up (Arabic uses Arabic comma sometimes, but we'll use regular comma)
          keyIngredients = ingredientsLine.split(',').map(ing => ing.trim()).filter(Boolean)
        }
      }
      
      // Extract benefits (look for common benefit phrases in both languages)
      const lowerLine = line.toLowerCase()
      const hasBenefitPhrase = lowerLine.includes('helps') || lowerLine.includes('provides') || 
                               lowerLine.includes('improves') || lowerLine.includes('يساعد') || 
                               lowerLine.includes('يوفر') || lowerLine.includes('يحسن')
      
      if (hasBenefitPhrase) {
        const sentences = line.split('.')
        const benefit = sentences[0]?.trim()
        // Don't add if it's the same as mainDescription or already in benefits
        if (benefit && benefit.length < 100 && benefit !== mainDescription && !benefits.includes(benefit)) {
          benefits.push(benefit)
        }
      }
    }
    
    // Build bullet points
    if (mainDescription) {
      bullets.push(mainDescription)
    }
    
    // Add up to 3 key benefits
    if (benefits.length > 0) {
      bullets.push(...benefits.slice(0, 3))
    }
    
    // Add key ingredients if available (limit to 3-4 main ones)
    if (keyIngredients.length > 0) {
      const mainIngredients = keyIngredients.slice(0, 4).join(', ')
      if (mainIngredients) {
        bullets.push(`${t('product.keyIngredientsLabel')} ${mainIngredients}`)
      }
    }
    
    return bullets.length > 0 ? bullets : [description.substring(0, 150) + '...']
  }

  // Color palette for kit items
  const kitItemColors = [
    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', title: 'text-purple-800' },
    { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-900', title: 'text-pink-800' },
    { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-900', title: 'text-cyan-800' },
    { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-900', title: 'text-indigo-800' },
  ]

  return (
    <div className="space-y-3 lg:space-y-6" dir={dir}>
      {/* Product Description - Always show if description exists */}
      {description && (
        <>
          <h2 className="text-sm lg:text-lg mb-2 lg:mb-4 font-semibold text-gray-800" dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>{t('product.productDescription')}</h2>
          {/* Show intro only if there are kit items, otherwise show full description in fallback */}
          {intro && kitItems.length > 0 && (
            <p 
              className="text-gray-600 mb-2 lg:mb-4 text-xs lg:text-sm whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: processIntroText(intro) }}
            />
          )}

          {/* Kit Includes Section */}
          {kitItems.length > 0 && (
            <div className="mb-3 lg:mb-6">
              <h3 className="text-sm lg:text-lg mb-2 lg:mb-4 font-semibold text-gray-800 flex items-center gap-1 lg:gap-2" dir={dir} style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
                <span className="text-primary-600">{t('product.kitIncludes')}</span>
              </h3>
              <div className="space-y-2 lg:space-y-3">
                {kitItems.map((item, index) => {
                  const colors = kitItemColors[index % kitItemColors.length]
                  if (!colors) return null
                  
                        // Check if this is the Soothing Bomb Sea Algae Mask item for product 56
                        const isSoothingBombItem = (product.id === '56' || product.productNumber === '56') && 
                          (item.name.toLowerCase().includes('soothing bomb') || item.name.toLowerCase().includes('sea algae'))
                        
                        // Check if this is the Soothing Bomb Sea Algae Mask item for product 59
                        const isSoothingBombItem59 = (product.id === '59' || product.productNumber === '59') && 
                          (item.name.toLowerCase().includes('soothing bomb') || item.name.toLowerCase().includes('sea algae'))
                        
                        // Check if this is the Skin Rescue Overnight Cream Mask item for product 57
                        const isOvernightMaskItem = (product.id === '57' || product.productNumber === '57') && 
                          (item.name.toLowerCase().includes('skin rescue') || item.name.toLowerCase().includes('overnight'))
                        
                        // Check if this is the Collagen mask item for product 58
                        const isCollagenMaskItem = (product.id === '58' || product.productNumber === '58') && 
                          (item.name.toLowerCase().includes('collagen mask') || item.name.toLowerCase().includes('collagen'))
                  
                  return (
                    <div key={index}>
                      <div
                        className={`${colors.bg} ${colors.border} border-2 rounded-lg p-2 lg:p-4 shadow-sm hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-start gap-2 lg:gap-3">
                          <span className={`${colors.title} font-bold text-base lg:text-xl w-6 lg:w-8 flex-shrink-0 text-center`}>
                            {item.number}
                          </span>
                          <div className="flex-1">
                            {getProductLink(item.name) ? (
                              <Link href={getProductLink(item.name)!}>
                                <h4 className={`${colors.title} font-semibold text-xs lg:text-sm mb-1 lg:mb-2 hover:underline cursor-pointer transition-colors`}>
                                {item.name}
                              </h4>
                              </Link>
                            ) : (
                              <h4 className={`${colors.title} font-semibold text-xs lg:text-sm mb-1 lg:mb-2`}>
                                {item.name}
                              </h4>
                            )}
                            <div className={`${colors.text} text-xs lg:text-sm leading-normal lg:leading-relaxed space-y-1 lg:space-y-2`}>
                              {formatDescriptionAsBullets(item.description, true).map((bullet, bulletIndex) => (
                                <p key={bulletIndex} className="mb-0.5 lg:mb-1">{bullet}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Skincare Routine Block - Mobile only - Only for Skin Brightening Beauty Box (product 56) - After Soothing Bomb item */}
                      {isSoothingBombItem && (
                        <div className="block lg:hidden bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                          <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary-600 flex-shrink-0" />
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">{t('product.recommendedSkinBrighteningRoutine')}</h3>
                          </div>
                          <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowO2Title')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowBoosterTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowBoosterDescBrightening')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineMultiVitaSerumTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineMultiVitaSerumDesc')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineMultiVitaCreamTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineMultiVitaCreamDesc')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routinePeelingGelTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routinePeelingGelDesc')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">6</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSoothingBombMaskTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSoothingBombMaskDescBrightening')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Skincare Routine Block - Mobile only - Only for Charming Look Beauty Box (product 57) - After Overnight Mask item */}
                      {isOvernightMaskItem && (
                        <div className="block lg:hidden bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                          <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary-600 flex-shrink-0" />
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">{t('product.recommendedSkincareMakeupRoutine')}</h3>
                          </div>
                          <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowO2Title')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowBoosterTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowBoosterDescMakeup')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineBBCushionTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineBBCushionDesc')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineMakeupRemoverTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineMakeupRemoverDesc')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineOvernightMaskTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineOvernightMaskDesc')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Skincare Routine Block - Mobile only - Only for Anti-Aging Beauty Box (product 58) - After Collagen Mask item */}
                      {isCollagenMaskItem && (
                        <div className="block lg:hidden bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                          <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary-600 flex-shrink-0" />
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">{t('product.recommendedAntiAgingRoutine')}</h3>
                          </div>
                          <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowO2Title')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowBoosterTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowBoosterDescAntiAging')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineAntiWrinkleSerumTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineAntiWrinkleSerumDesc')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineAntiWrinkleCreamTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineAntiWrinkleCreamDesc')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineCollagenMaskTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineCollagenMaskDesc')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Skincare Routine Block - Mobile only - Only for Deep Moisturizing Beauty Box (product 59) - After Soothing Bomb item */}
                      {isSoothingBombItem59 && (
                        <div className="block lg:hidden bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                          <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary-600 flex-shrink-0" />
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">{t('product.recommendedDeepMoisturizingRoutine')}</h3>
                          </div>
                          <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowO2Title')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowBoosterTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowBoosterDescMoisturizing')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineHyaluronSerumTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineHyaluronSerumDesc')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineHyaluronCreamTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineHyaluronCreamDesc')}</p>
                              </div>
                            </div>
                            <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSoothingBombMaskTitle')}</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSoothingBombMaskDesc')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Skincare Routine Block - Mobile only - Only for Problem Skin Care Beauty Box (product 55) */}
          {(product.id === '55' || product.productNumber === '55') && kitItems.length > 0 && (
            <div className="block lg:hidden bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
              <div className={`flex items-center gap-2 mb-3 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary-600 flex-shrink-0" />
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">{t('product.recommendedProblemSkinRoutine')}</h3>
              </div>
              <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSnowO2Title')}</h4>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSnowO2Desc')}</p>
                  </div>
                </div>
                <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineProblemControlTonerTitle')}</h4>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineProblemControlTonerDesc')}</p>
                  </div>
                </div>
                <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineProblemControlSerumTitle')}</h4>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineProblemControlSerumDesc')}</p>
                  </div>
                </div>
                <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineProblemControlCreamTitle')}</h4>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineProblemControlCreamDesc')}</p>
                  </div>
                </div>
                <div className={`flex items-start gap-2 sm:gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">{routineTitle('routineSoothingBombMaskTitle')}</h4>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{t('product.routineSoothingBombMaskDescProblem')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fallback: If no kit items parsed, show full description
              (minus the ingredient dump — it lives in the accordion below) */}
          {kitItems.length === 0 && sanitizedDescription && (
            <p 
              className="text-gray-600 mb-2 lg:mb-4 text-xs lg:text-sm whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: processIntroText(stripIngredientDump(sanitizedDescription)) }}
            />
          )}
        </>
      )}

      {/* Product Details - Always just the specs */}
      {productDetails && typeof productDetails === 'object' && !Array.isArray(productDetails) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 lg:p-4 mb-2 lg:mb-4">
          <h3 className="font-semibold text-gray-900 mb-1 lg:mb-2 text-xs lg:text-sm" dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>{t('product.productDetails')}</h3>
          <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-600">
            {Object.entries(productDetails as Record<string, string>)
              // `pdfBrochure` is an internal file path — the brochure is
              // surfaced to users via the "Product Documentation" buttons, so
              // we don't expose the raw /documents/... path here.
              .filter(([key]) => key !== 'pdfBrochure')
              .map(([key, value]) => (
                <p key={key}>
                  <strong className="text-gray-900">{formatKey(key, t)}:</strong> {String(value)}
                </p>
              ))}
          </div>
        </div>
      )}

      {/* Available Colors - For BB Cushion (product 41) */}
      {(product.id === '41' || product.productNumber === '41') && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 lg:p-4 mb-2 lg:mb-4">
          <h3 className="font-semibold text-gray-900 mb-1.5 lg:mb-3 text-xs lg:text-sm" dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
            {locale === 'ar' ? 'الألوان المتوفرة' : locale === 'ru' ? 'Доступные цвета' : 'Available Colors'}
          </h3>
          <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-[#D4A574] border border-gray-300 flex-shrink-0 mt-0.5"></span>
              <div>
                <strong className="text-gray-900">{locale === 'ar' ? 'بيج' : locale === 'ru' ? 'Бежевый' : 'Beige'}:</strong>{' '}
                {locale === 'ar' ? 'لون عالمي يتكيف مع جميع درجات البشرة' : locale === 'ru' ? 'Универсальный оттенок, адаптирующийся к любому тону кожи' : 'Universal shade that adapts to all skin tones'}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-[#FFFAF0] border border-gray-300 flex-shrink-0 mt-0.5"></span>
              <div>
                <strong className="text-gray-900">{locale === 'ar' ? 'عاجي' : locale === 'ru' ? 'Слоновая кость' : 'Ivory'}:</strong>{' '}
                {locale === 'ar' ? 'لون فاتح جداً للبشرة الفاتحة' : locale === 'ru' ? 'Очень светлый тон для светлой кожи' : 'A very light tone for fair skin'}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-[#C19A6B] border border-gray-300 flex-shrink-0 mt-0.5"></span>
              <div>
                <strong className="text-gray-900">{locale === 'ar' ? 'كاميل' : locale === 'ru' ? 'Кэмел' : 'Camel'}:</strong>{' '}
                {locale === 'ar' ? 'للحصول على مظهر سمرة خفيفة رائعة' : locale === 'ru' ? 'Для красивого легкого загорелого оттенка' : 'For gorgeous light tan expression'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Shades - For Revita Glow BB Cream (product 63) */}
      {(product.id === '63' || product.productNumber === '63') && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 lg:p-4 mb-2 lg:mb-4">
          <h3 className="font-semibold text-gray-900 mb-1.5 lg:mb-3 text-xs lg:text-sm" dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
            {locale === 'ar' ? 'الظلال المتوفرة' : locale === 'ru' ? 'Доступные оттенки' : 'Available Shades'}
          </h3>
          <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-[#FFF5E6] border border-gray-300 flex-shrink-0 mt-0.5"></span>
              <div>
                <strong className="text-gray-900">#01 Bright:</strong>{' '}
                {locale === 'ar' ? 'توهج مضيء لبشرة مشرقة وصافية' : locale === 'ru' ? 'Сияющий блеск для чистого, лучезарного цвета лица' : 'Illuminating glow for a clear, radiant complexion'}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-[#E8D5B7] border border-gray-300 flex-shrink-0 mt-0.5"></span>
              <div>
                <strong className="text-gray-900">#02 Natural:</strong>{' '}
                {locale === 'ar' ? 'توهج طبيعي لبشرة صحية ومشرقة' : locale === 'ru' ? 'Утончённое сияние для естественного, здорового цвета лица' : 'Refined glow for a natural, healthy-looking complexion'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Documentation Section - ALWAYS right after Product Details */}
      {documentation && documentation.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 lg:p-4">
          <h4 className="font-semibold text-gray-900 mb-1 lg:mb-2 text-xs lg:text-sm" dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>{t('product.productDocumentation')}</h4>
          <p className="text-gray-600 text-xs lg:text-sm mb-2 lg:mb-3" dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
            {t('product.documentationDescription')}
          </p>
          <div className="flex gap-2 lg:gap-3" dir={dir} style={{ flexDirection: dir === 'rtl' ? 'row-reverse' : 'row' }}>
            <button
              onClick={() => {
                const localePrefix = locale === 'en' ? '' : `/${locale}`
                const pdfUrl = `${window.location.origin}${localePrefix}/pdf-viewer?file=${encodeURIComponent(documentation[0]?.url || '')}`
                window.open(pdfUrl, '_blank', 'noopener,noreferrer')
              }}
              className="inline-flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium min-h-[44px] min-w-[44px] cursor-pointer"
            >
              <svg className="h-3 w-3 lg:h-4 lg:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {t('product.viewPdf')}
            </button>
            <a
              href={documentation[0]?.url || '#'}
              download={documentation[0]?.title || 'documentation'}
              className="inline-flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium min-h-[44px] min-w-[44px]"
            >
              <svg className="h-3 w-3 lg:h-4 lg:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('product.download')}
            </a>
          </div>
        </div>
      )}

      {/* Key Features - only shown if they exist (for products that have them) */}
      {keyFeatures && Array.isArray(keyFeatures) && keyFeatures.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-800 mb-2 lg:mb-3 text-xs lg:text-sm" dir={dir} style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>{t('product.keyFeatures')}</h2>
          <div className="space-y-2 lg:space-y-3">
            {(keyFeatures as Array<{ title?: string; description?: string }>).map((feature, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-2 lg:p-3">
                <h3 className="font-semibold text-gray-800 mb-0.5 lg:mb-1 text-xs lg:text-sm">
                  {feature.title}
                </h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible info sections - cleaner vertical hierarchy vs stacked colored boxes */}
      {(
        (benefits && Array.isArray(benefits) && benefits.length > 0) ||
        (howToUse && typeof howToUse === 'string') ||
        (howToUse && Array.isArray(howToUse)) ||
        (ingredients && Array.isArray(ingredients) && ingredients.length > 0) ||
        directionsStr
      ) && (
        <div className="mt-2 lg:mt-4">
          {/* Benefits */}
          {benefits && Array.isArray(benefits) && benefits.length > 0 && (
            <ProductInfoAccordion title={t('product.benefits')} defaultOpen>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {(benefits as string[]).map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </ProductInfoAccordion>
          )}

          {/* Directions - when howToUse is a string */}
          {howToUse && typeof howToUse === 'string' && (
            <ProductInfoAccordion title={t('product.directions')}>
              <p className="whitespace-pre-line text-gray-700">{howToUse}</p>
            </ProductInfoAccordion>
          )}

          {/* How to Use - when howToUse is an array of steps */}
          {howToUse && Array.isArray(howToUse) && (
            <ProductInfoAccordion title={t('product.howToUse')}>
              <ol className="list-decimal list-inside space-y-1.5 text-gray-700">
                {howToUse.map((step, index) => (
                  <li key={index}>
                    <strong className="text-gray-900">{step.step}:</strong> {step.instruction}
                  </li>
                ))}
              </ol>
            </ProductInfoAccordion>
          )}

      {/* Key Ingredients (inside accordion) */}
      {ingredients && Array.isArray(ingredients) && ingredients.length > 0 && (
            <ProductInfoAccordion title={t('product.keyIngredients')}>
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index}>
                    <h5 className="font-semibold text-gray-900 mb-1 text-sm">{ingredient.name}</h5>
                    {/* Handle special formatting for Repairing Pep9 Complex */}
                    {ingredient.name === 'Repairing Pep9 Complex' && ingredient.subList ? (
                      <div className="text-sm space-y-2 text-gray-700">
                        <div>
                          <strong>{t('product.collagenInduction')}</strong>
                          <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                            {ingredient.subList.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong>{t('product.firming')}</strong> Acetyl Hexapeptide-8
                        </div>
                        <div>
                          <strong>{t('product.skinBrightening')}</strong> Nonapeptide-1
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700">
                        {ingredient.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ProductInfoAccordion>
          )}

          {/* Note / Directions supplementary text */}
          {directionsStr && (
            <ProductInfoAccordion title={t('product.note').replace(/:$/, '')}>
              <div className="whitespace-pre-line text-gray-700">{directionsStr}</div>
            </ProductInfoAccordion>
          )}
        </div>
      )}

    </div>
  )
}

// Helper function to safely parse JSON - returns original string if not valid JSON
function tryParseJSON(jsonString: string): unknown {
  try {
    return JSON.parse(jsonString)
        } catch {
    // If it's not valid JSON, return the original string
    return jsonString
  }
}

// Helper function to format keys (camelCase to Sentence Case) with translations
function formatKey(key: string, t: (key: string) => string): string {
  // Map of product detail keys to translation keys (handle both camelCase and lowercase)
  const keyTranslations: Record<string, string> = {
    'form': 'product.detailForm',
    'size': 'product.detailSize',
    'skintype': 'product.detailSkinType',
    'skinType': 'product.detailSkinType',
    'skin_type': 'product.detailSkinType',
    'technology': 'product.detailTechnology',
    'keybenefits': 'product.detailKeyBenefits',
    'keyBenefits': 'product.detailKeyBenefits',
    'key_benefits': 'product.detailKeyBenefits',
    'usage': 'product.detailUsage',
    'kitcontents': 'product.detailKitContents',
    'kitContents': 'product.detailKitContents',
    'kit_contents': 'product.detailKitContents',
    'specialfeature': 'product.detailSpecialFeature',
    'specialFeature': 'product.detailSpecialFeature',
    'special_feature': 'product.detailSpecialFeature',
    'origin': 'product.detailOrigin',
    'protection': 'product.detailProtection',
    'target': 'product.detailTarget',
    'application': 'product.detailApplication',
    'formulation': 'product.detailFormulation',
    'type': 'product.detailType',
    'system': 'product.detailSystem'
  }
  
  // Normalize key (lowercase) for lookup
  const normalizedKey = key.toLowerCase()
  
  // Check if translation exists for this key
  const translationKey = keyTranslations[normalizedKey] || keyTranslations[key]
  if (translationKey) {
    const translated = t(translationKey)
    // If translation exists and is not the same as the key, use it
    if (translated && translated !== translationKey) {
      return translated
    }
  }
  
  // Fallback to original formatting
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

