
import Link from 'next/link'
import { Product } from '@/types'
import { getProductDocumentation } from '@/data/productConfig'
import { sanitizeProductDescription, sanitizeHtml } from '@/lib/sanitize'
import { Sparkles } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getProductTranslations } from '@/data/productTranslations'

interface ProductContentDisplayProps {
  product: Product
}

export default function ProductContentDisplay({ product }: ProductContentDisplayProps) {
  const { t, locale, dir } = useTranslation()
  const arabicTranslations = locale === 'ar' ? getProductTranslations(product.id) : null
  
  // Use Arabic translations if available, otherwise fall back to English
  const description = arabicTranslations?.description || product.description
  const productDetailsStr = arabicTranslations?.productDetails || product.productDetails
  const keyFeaturesStr = arabicTranslations?.keyFeatures || product.keyFeatures
  const benefitsStr = arabicTranslations?.benefits || product.benefits
  const ingredientsStr = arabicTranslations?.ingredients || product.ingredients
  const howToUseStr = arabicTranslations?.howToUse || product.howToUse
  const directionsStr = arabicTranslations?.directions || product.directions
  
  // Parse JSON fields safely with proper type assertions
  const productDetails = productDetailsStr ? (tryParseJSON(productDetailsStr) as Record<string, string> | string) : null
  const keyFeatures = keyFeaturesStr ? (tryParseJSON(keyFeaturesStr) as Array<{ title?: string; description?: string }> | string) : null
  const benefits = benefitsStr ? (tryParseJSON(benefitsStr) as string[] | string) : null
  const ingredients = ingredientsStr ? (tryParseJSON(ingredientsStr) as Array<{ name?: string; description?: string; subList?: string[] }> | string) : null
  const howToUse = howToUseStr ? (tryParseJSON(howToUseStr) as string) : null
  const documentation = getProductDocumentation(product.id)

  // Parse description for kit items - support both English and Arabic
  const parseKitDescription = (description: string) => {
    const kitIncludesEn = 'Kit includes:'
    const kitIncludesAr = 'يشمل الطقم:'
    const kitIncludesPattern = description.includes(kitIncludesEn) ? kitIncludesEn : 
                               description.includes(kitIncludesAr) ? kitIncludesAr : null
    
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
  const formatDescriptionAsBullets = (description: string): string[] => {
    if (!description) return []
    
    // For short descriptions (under 200 chars), return as single bullet
    if (description.length < 200 && !description.includes('Key ingredients:') && !description.includes('\n')) {
      return [description.trim()]
    }
    
    const bullets: string[] = []
    const lines = description.split('\n').filter(Boolean)
    
    // Extract key information
    let mainDescription = ''
    let keyIngredients: string[] = []
    let benefits: string[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.trim()
      if (!line) continue
      
      // Extract main description (first sentence or two)
      if (!mainDescription && line && !line.includes('Key ingredients:') && !line.includes('Dermatologically tested')) {
        // Get first sentence or first 100 characters
        const sentences = line.split('.')
        const firstSentence = sentences[0]
        if (firstSentence && firstSentence.length < 150) {
          mainDescription = firstSentence.trim()
        } else {
          mainDescription = line.substring(0, 120).trim() + '...'
        }
      }
      
      // Extract key ingredients
      if (line.includes('Key ingredients:')) {
        const ingredientsLine = line.replace('Key ingredients:', '').trim()
        if (ingredientsLine) {
          // Split by comma and clean up
          keyIngredients = ingredientsLine.split(',').map(ing => ing.trim()).filter(Boolean)
        }
      }
      
      // Extract benefits (look for common benefit phrases)
      if (line.toLowerCase().includes('helps') || line.toLowerCase().includes('provides') || line.toLowerCase().includes('improves')) {
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
    <div className="space-y-6" dir={dir}>
      {/* Product Description - Always show if description exists */}
      {description && (
        <>
          <h2 className={`text-lg font-semibold text-gray-800 mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('product.productDescription')}</h2>
          {/* Show intro only if there are kit items, otherwise show full description in fallback */}
          {intro && kitItems.length > 0 && (
            <p 
              className="text-gray-600 mb-4 text-sm whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: processIntroText(intro) }}
            />
          )}

          {/* Kit Includes Section */}
          {kitItems.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <span className="text-primary-600">{t('product.kitIncludes')}</span>
              </h3>
              <div className="space-y-3">
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
                        className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`${colors.title} font-bold text-xl flex-shrink-0 w-8 text-center`}>
                            {item.number}
                          </span>
                          <div className="flex-1">
                            {getProductLink(item.name) ? (
                              <Link href={getProductLink(item.name)!}>
                                <h4 className={`${colors.title} font-semibold text-sm mb-2 hover:underline cursor-pointer transition-colors`}>
                                {item.name}
                              </h4>
                              </Link>
                            ) : (
                              <h4 className={`${colors.title} font-semibold text-sm mb-2`}>
                                {item.name}
                              </h4>
                            )}
                            <ul className={`${colors.text} text-sm leading-relaxed space-y-1 list-disc list-inside`}>
                              {formatDescriptionAsBullets(item.description).map((bullet, bulletIndex) => (
                                <li key={bulletIndex}>{bullet}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* Skincare Routine Block - Mobile only - Only for Skin Brightening Beauty Box (product 56) - After Soothing Bomb item */}
                      {isSoothingBombItem && (
                        <div className="block lg:hidden bg-orange-50 border-2 border-orange-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                          <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-orange-600 flex-shrink-0" />
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">Recommended Skincare Routine</h3>
                          </div>
                          <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow O₂ Cleanser</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Start your routine by cleansing your face with Snow O₂. Apply to dry skin, wait for oxygen bubbles to form, then gently massage and rinse with lukewarm water.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow Booster Toner</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">After cleansing, apply the toner to moisturize and refine skin texture. It helps balance pH level and prepares your skin for the brightening treatment.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Multi Vita Radiance Serum</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Apply the serum to even skin tone and revive natural brightness. The MELAZERO® complex and multi vitamins work together to reduce dullness and reveal a brighter complexion.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Multi Vita Radiance Cream</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Finish with the cream to maintain and protect your brightened skin. It forms a moisturizing barrier and continues to even skin tone for a luminous glow.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">EPI Turnover Boosting Peeling Gel</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Use 1-2 times per week to remove dead skin cells and smooth texture. This gentle enzymatic peeling gel reveals brighter, smoother skin without irritation.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">6</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Soothing Bomb Sea Algae Mask</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Use 2-3 times per week to complement your routine. It provides intensive hydration and soothes skin while enhancing the brightening effects.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Skincare Routine Block - Mobile only - Only for Charming Look Beauty Box (product 57) - After Overnight Mask item */}
                      {isOvernightMaskItem && (
                        <div className="block lg:hidden bg-pink-50 border-2 border-pink-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                          <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-pink-600 flex-shrink-0" />
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">Recommended Skincare & Makeup Routine</h3>
                          </div>
                          <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow O₂ Cleanser</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Start your routine by cleansing your face with Snow O₂. Apply to dry skin, wait for oxygen bubbles to form, then gently massage and rinse with lukewarm water.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow Booster Toner</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">After cleansing, apply the toner to moisturize and refine skin texture. It helps balance pH level and prepares your skin for makeup application.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Skin Caring Blemish Balm Cushion</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Apply the BB cushion for natural coverage and skin protection. It covers redness and blemishes while providing SPF 50+ PA++++ protection for a flawless, radiant look.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Professional Biphasic Make Up Remover</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">At the end of the day, shake well and use the makeup remover to gently cleanse lip and eye makeup. The biphasic formula removes makeup without irritation while nourishing the delicate areas.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Skin Rescue Overnight Cream Mask</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Before bed, apply the overnight mask to revitalize and provide intensive care to fatigued skin. The oxygen capsules and pink ceramide complex work together to restore and protect your skin overnight.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Skincare Routine Block - Mobile only - Only for Anti-Aging Beauty Box (product 58) - After Collagen Mask item */}
                      {isCollagenMaskItem && (
                        <div className="block lg:hidden bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                          <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-600 flex-shrink-0" />
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">Recommended Anti-Aging Routine</h3>
                          </div>
                          <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow O₂ Cleanser</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Start your routine by cleansing your face with Snow O₂. Apply to dry skin, wait for oxygen bubbles to form, then gently massage and rinse with lukewarm water.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow Booster Toner</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">After cleansing, apply the toner to moisturize and refine skin texture. It helps balance pH level and prepares your skin for the anti-aging treatment.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Multi Functional Anti-Wrinkle Serum</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Apply the serum to visibly smooth wrinkles and reinforce skin firmness. The bakuchiol and anti-aging peptide complex work together to improve skin age index and reduce signs of aging.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Multifunctional Anti-Wrinkle Cream</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Finish with the cream to lock in the anti-aging benefits and provide ongoing protection. It continues to smooth wrinkles and enhance skin firmness throughout the day.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Collagen Mask</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Use 2-3 times per week to complement your routine. The collagen mask provides intensive hydration and supports skin elasticity for enhanced anti-aging results.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Skincare Routine Block - Mobile only - Only for Deep Moisturizing Beauty Box (product 59) - After Soothing Bomb item */}
                      {isSoothingBombItem59 && (
                        <div className="block lg:hidden bg-cyan-50 border-2 border-cyan-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
                          <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-cyan-600 flex-shrink-0" />
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">Recommended Deep Moisturizing Routine</h3>
                          </div>
                          <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow O₂ Cleanser</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Start your routine by cleansing your face with Snow O₂. Apply to dry skin, wait for oxygen bubbles to form, then gently massage and rinse with lukewarm water.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow Booster Toner</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">After cleansing, apply the toner to moisturize and refine skin texture. It helps balance pH level and prepares your skin for deep hydration treatment.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Moisture Replenishing Hyaluron Serum</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Apply the serum to deeply replenish moisture and support the skin barrier. The hyaluronic acid complex delivers intensive hydration for plump, glowing skin.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Moisture Replenishing Hyaluron Cream</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Finish with the cream to lock in moisture and maintain hydration throughout the day. It forms a protective barrier and leaves your complexion soft, plump, and glowing.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                              <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Soothing Bomb Sea Algae Mask</h4>
                                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Use 2-3 times per week to complement your routine. It provides intensive hydration and soothes skin while enhancing the moisturizing effects for optimal results.</p>
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
            <div className="block lg:hidden bg-blue-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-md mt-4">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600 flex-shrink-0" />
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">Recommended Skincare Routine</h3>
              </div>
              <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">1</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Snow O₂ Cleanser</h4>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Start your routine by cleansing your face with Snow O₂. Apply to dry skin, wait for oxygen bubbles to form, then gently massage and rinse with lukewarm water.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">2</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Problem Control Toner</h4>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">After cleansing, apply the toner to remove excess oil and sebum while adding quick hydration. This prepares your skin for the next steps.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">3</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Problem Control Serum</h4>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Apply the serum to regulate excessive oil and sebum production. This helps fight breakouts and refines skin texture for clearer, healthier-looking skin.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">4</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Intensive Problem Control Cream</h4>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Finish with the cream to control blemish-prone skin while keeping it hydrated. This provides ongoing protection and maintains moisture balance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base mt-0.5">5</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 leading-tight">Soothing Bomb Sea Algae Mask</h4>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">Use the mask 2-3 times per week to complement your routine. It provides intensive relief and moisturizes skin with sea algae complex for enhanced results.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fallback: If no kit items parsed, show full description */}
          {kitItems.length === 0 && sanitizedDescription && (
            <p 
              className="text-gray-600 mb-4 text-sm whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: processIntroText(sanitizedDescription) }}
            />
          )}
        </>
      )}

      {/* Product Details - Always just the specs */}
      {productDetails && typeof productDetails === 'object' && !Array.isArray(productDetails) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className={`font-semibold text-blue-800 mb-2 text-sm ${dir === 'rtl' ? 'text-right' : ''}`}>{t('product.productDetails')}</h3>
          <div className="space-y-2 text-blue-800 text-sm">
            {Object.entries(productDetails as Record<string, string>).map(([key, value]) => (
              <p key={key}>
                <strong>{formatKey(key)}:</strong> {String(value)}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Product Documentation Section - ALWAYS right after Product Details */}
      {documentation && documentation.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className={`font-semibold text-blue-800 mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>{t('product.productDocumentation')}</h4>
          <p className={`text-blue-700 text-sm mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
            {t('product.documentationDescription')}
          </p>
          <div className={`flex gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <a
              href={documentation[0]?.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium min-h-[44px] min-w-[44px]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {t('product.viewPdf')}
            </a>
            <a
              href={documentation[0]?.url || '#'}
              download={documentation[0]?.title || 'documentation'}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium min-h-[44px] min-w-[44px]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <h2 className={`font-semibold text-gray-800 mb-3 text-sm ${dir === 'rtl' ? 'text-right' : ''}`}>{t('product.keyFeatures')}</h2>
          <div className="space-y-3">
            {(keyFeatures as Array<{ title?: string; description?: string }>).map((feature, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benefits - ALWAYS a separate section */}
      {benefits && Array.isArray(benefits) && benefits.length > 0 && (
        <div>
          <h2 className={`font-semibold text-gray-800 mb-2 text-sm ${dir === 'rtl' ? 'text-right' : ''}`}>{t('product.benefits')}</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            {(benefits as string[]).map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Directions - When howToUse is a string (not array) */}
      {howToUse && typeof howToUse === 'string' && (
        <div>
          <h4 className={`font-semibold text-gray-800 mb-2 text-sm ${dir === 'rtl' ? 'text-right' : ''}`}>{t('product.directions')}</h4>
          <p className="text-gray-600 mb-4 text-sm">
            {howToUse}
          </p>
        </div>
      )}

      {/* How to Use - When howToUse is an array with steps */}
      {howToUse && Array.isArray(howToUse) && (
        <div>
          <h2 className={`font-semibold text-gray-800 mb-2 text-sm ${dir === 'rtl' ? 'text-right' : ''}`}>{t('product.howToUse')}</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
              {howToUse.map((step, index) => (
                <li key={index}>
                  <strong>{step.step}:</strong> {step.instruction}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Key Ingredients */}
      {ingredients && Array.isArray(ingredients) && ingredients.length > 0 && (
        <div>
          <h2 className={`font-semibold text-gray-800 mb-2 text-sm ${dir === 'rtl' ? 'text-right' : ''}`}>{t('product.keyIngredients')}</h2>
          <div className="space-y-4 mb-4">
            {ingredients.map((ingredient, index) => (
              <div key={index}>
                <h5 className="font-semibold text-gray-800 mb-2 text-sm">{ingredient.name}</h5>
                {/* Handle special formatting for Repairing Pep9 Complex */}
                {ingredient.name === 'Repairing Pep9 Complex' && ingredient.subList ? (
                  <div className="text-sm text-gray-600 space-y-2 mb-4">
                    <div>
                      <strong>Promotion of collagen induction and skin regeneration:</strong>
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                        {ingredient.subList.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Firming:</strong> Acetyl Hexapeptide-8
                    </div>
                    <div>
                      <strong>Skin brightening:</strong> Nonapeptide-1
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mb-4">
                    {ingredient.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Directions / Note */}
      {directionsStr && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className={`text-green-800 text-sm ${dir === 'rtl' ? 'text-right' : ''}`}>
            <strong>{t('product.note')}</strong> {directionsStr}
          </p>
        </div>
      )}

    </div>
  )
}

// Helper function to safely parse JSON - returns original string if not valid JSON
function tryParseJSON(jsonString: string): unknown {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    // If it's not valid JSON, return the original string
    return jsonString
  }
}

// Helper function to format keys (camelCase to Sentence Case)
function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

