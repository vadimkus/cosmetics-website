/**
 * Skin Analysis Utilities
 * 
 * Advanced skin analysis algorithms including:
 * - Blemish/Acne Detection
 * - Wrinkle/Fine Line Analysis
 * - Dark Spot Detection
 * - Texture Analysis
 */

import type { BlemishAnalysis, BlemishDetail, BlemishType } from '@/components/SkinAnalysisCamera'

// P1-4: Pigmentation/Dark Spot Analysis Types
export interface PigmentationAnalysis {
  // Overall pigmentation score (0 = even, 100 = very uneven)
  unevenness: number
  // Classification
  level: 'even' | 'minimal' | 'mild' | 'moderate' | 'significant'
  // Number of detected dark spots
  darkSpotCount: number
  // Affected areas
  areas: PigmentationArea[]
  // Skin tone uniformity score (100 = perfectly uniform)
  uniformityScore: number
}

export interface PigmentationArea {
  name: string
  unevenness: number // 0-100
  darkSpotCount: number
  type: 'freckles' | 'sunspots' | 'melasma' | 'post-inflammatory' | 'general'
}

// P1-3: Wrinkle Analysis Types
export interface WrinkleAnalysis {
  // Overall wrinkle score (0 = none, 100 = severe)
  severity: number
  // Age-related classification
  level: 'none' | 'minimal' | 'mild' | 'moderate' | 'advanced'
  // Detected wrinkle areas
  areas: WrinkleArea[]
  // Estimated skin age impact
  skinAgeImpact: number
}

export interface WrinkleArea {
  name: 'forehead' | 'crowsFeet' | 'frowLines' | 'nasolabial' | 'underEye' | 'neckLines'
  label: { en: string; ar: string; ru: string }
  severity: number // 0-100
  confidence: number // 0-100
}

// Configuration for blemish detection
const BLEMISH_CONFIG = {
  // Minimum size (radius) in pixels to consider as a blemish
  minBlemishSize: 3,
  // Maximum size for individual blemish detection
  maxBlemishSize: 30,
  // Redness threshold (how much redder than surrounding area)
  rednessThreshold: 15,
  // Darkness threshold for dark spots
  darknessThreshold: 20,
  // Brightness threshold for whiteheads
  brightnessThreshold: 25,
  // Grid size for scanning (larger = faster but less precise)
  scanGridSize: 4,
  // Minimum contrast difference to detect texture anomaly
  textureContrastThreshold: 30,
}

/**
 * Detect blemishes in an image region
 * Uses color anomaly and texture analysis
 */
export function detectBlemishes(
  imageData: ImageData,
  zoneName: string = 'face'
): BlemishAnalysis {
  const { data: pixels, width, height } = imageData
  const blemishes: BlemishDetail[] = []
  const typeCounters: Record<string, { count: number; totalConfidence: number }> = {
    'acne': { count: 0, totalConfidence: 0 },
    'blackhead': { count: 0, totalConfidence: 0 },
    'whitehead': { count: 0, totalConfidence: 0 },
    'scar': { count: 0, totalConfidence: 0 },
    'dark-spot': { count: 0, totalConfidence: 0 },
    'redness': { count: 0, totalConfidence: 0 },
  }

  // Calculate average skin color for baseline
  const avgColor = calculateAverageColor(pixels)
  
  // Scan the image in a grid pattern for efficiency
  const gridSize = BLEMISH_CONFIG.scanGridSize
  
  for (let y = gridSize; y < height - gridSize; y += gridSize) {
    for (let x = gridSize; x < width - gridSize; x += gridSize) {
      const result = analyzePixelRegion(pixels, width, height, x, y, avgColor)
      
      if (result) {
        blemishes.push({
          ...result,
          x,
          y,
        })
        
        // Update type counters
        const counter = typeCounters[result.type]
        if (counter) {
          counter.count++
          counter.totalConfidence += result.severity
        }
      }
    }
  }

  // Merge nearby blemishes and calculate final results
  const mergedBlemishes = mergeBlemishes(blemishes)
  
  // Calculate overall severity
  const severity = calculateOverallSeverity(mergedBlemishes)
  
  // Determine level
  const level = getSeverityLevel(severity, mergedBlemishes.length)
  
  // Build blemish types array
  const types: BlemishType[] = Object.entries(typeCounters)
    .filter(([, data]) => data.count > 0)
    .map(([type, data]) => ({
      type: type as BlemishType['type'],
      count: data.count,
      confidence: data.count > 0 ? Math.round(data.totalConfidence / data.count) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  return {
    severity,
    count: mergedBlemishes.length,
    level,
    types,
    affectedZones: mergedBlemishes.length > 0 ? [zoneName] : [],
    details: mergedBlemishes.slice(0, 50), // Limit to 50 for performance
  }
}

/**
 * Analyze a pixel region for blemish indicators
 */
function analyzePixelRegion(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  _avgColor: { r: number; g: number; b: number }
): Omit<BlemishDetail, 'x' | 'y'> | null {
  // Get the center pixel color
  const centerIdx = (centerY * width + centerX) * 4
  const centerR = pixels[centerIdx] ?? 0
  const centerG = pixels[centerIdx + 1] ?? 0
  const centerB = pixels[centerIdx + 2] ?? 0
  
  // Calculate surrounding average (ring around center)
  const surroundingColor = calculateSurroundingColor(
    pixels, width, height, centerX, centerY, 
    BLEMISH_CONFIG.minBlemishSize, BLEMISH_CONFIG.maxBlemishSize / 2
  )
  
  // Skip if surrounding calculation failed
  if (!surroundingColor) return null
  
  // Calculate differences from surrounding area
  const rDiff = centerR - surroundingColor.r
  const gDiff = centerG - surroundingColor.g
  const bDiff = centerB - surroundingColor.b
  
  // Calculate brightness difference
  const centerBrightness = (centerR + centerG + centerB) / 3
  const surroundingBrightness = (surroundingColor.r + surroundingColor.g + surroundingColor.b) / 3
  const brightnessDiff = centerBrightness - surroundingBrightness
  
  // Calculate redness (red channel dominance)
  const rednessScore = (rDiff - gDiff) + (rDiff - bDiff) / 2
  
  // Detect acne (localized redness with slight brightness)
  if (rednessScore > BLEMISH_CONFIG.rednessThreshold && brightnessDiff > 5) {
    const severity = Math.min(100, Math.round(rednessScore * 2))
    return {
      type: 'acne',
      size: estimateBlemishSize(pixels, width, height, centerX, centerY, 'acne'),
      severity,
    }
  }
  
  // Detect dark spots (darker than surrounding, not red)
  if (brightnessDiff < -BLEMISH_CONFIG.darknessThreshold && Math.abs(rednessScore) < 10) {
    const severity = Math.min(100, Math.round(Math.abs(brightnessDiff) * 2))
    return {
      type: 'dark-spot',
      size: estimateBlemishSize(pixels, width, height, centerX, centerY, 'dark-spot'),
      severity,
    }
  }
  
  // Detect whiteheads (brighter than surrounding, small area)
  if (brightnessDiff > BLEMISH_CONFIG.brightnessThreshold) {
    const severity = Math.min(100, Math.round(brightnessDiff * 1.5))
    return {
      type: 'whitehead',
      size: estimateBlemishSize(pixels, width, height, centerX, centerY, 'whitehead'),
      severity,
    }
  }
  
  // Detect blackheads (very small dark spots, usually in T-zone)
  if (brightnessDiff < -15 && brightnessDiff > -BLEMISH_CONFIG.darknessThreshold) {
    // Check if it's a small point (not a larger dark area)
    const size = estimateBlemishSize(pixels, width, height, centerX, centerY, 'blackhead')
    if (size < 8) {
      return {
        type: 'blackhead',
        size,
        severity: Math.min(100, Math.round(Math.abs(brightnessDiff) * 3)),
      }
    }
  }
  
  // Detect redness zones (larger areas of redness without bumps)
  if (rednessScore > 10 && rednessScore <= BLEMISH_CONFIG.rednessThreshold) {
    return {
      type: 'redness',
      size: estimateBlemishSize(pixels, width, height, centerX, centerY, 'redness'),
      severity: Math.min(100, Math.round(rednessScore * 3)),
    }
  }
  
  return null
}

/**
 * Calculate average color of all pixels
 */
function calculateAverageColor(pixels: Uint8ClampedArray): { r: number; g: number; b: number } {
  let totalR = 0, totalG = 0, totalB = 0
  let count = 0
  
  // Sample every 16th pixel for performance
  for (let i = 0; i < pixels.length; i += 64) {
    totalR += pixels[i] ?? 0
    totalG += pixels[i + 1] ?? 0
    totalB += pixels[i + 2] ?? 0
    count++
  }
  
  return {
    r: count > 0 ? totalR / count : 128,
    g: count > 0 ? totalG / count : 128,
    b: count > 0 ? totalB / count : 128,
  }
}

/**
 * Calculate average color of surrounding ring
 */
function calculateSurroundingColor(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  innerRadius: number,
  outerRadius: number
): { r: number; g: number; b: number } | null {
  let totalR = 0, totalG = 0, totalB = 0
  let count = 0
  
  // Sample points in a ring around the center
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
    for (let r = innerRadius; r <= outerRadius; r += 2) {
      const x = Math.round(centerX + Math.cos(angle) * r)
      const y = Math.round(centerY + Math.sin(angle) * r)
      
      if (x >= 0 && x < width && y >= 0 && y < height) {
        const idx = (y * width + x) * 4
        totalR += pixels[idx] ?? 0
        totalG += pixels[idx + 1] ?? 0
        totalB += pixels[idx + 2] ?? 0
        count++
      }
    }
  }
  
  if (count < 4) return null
  
  return {
    r: totalR / count,
    g: totalG / count,
    b: totalB / count,
  }
}

/**
 * Estimate the size of a blemish by checking how far the anomaly extends
 */
function estimateBlemishSize(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  type: BlemishDetail['type']
): number {
  const centerIdx = (centerY * width + centerX) * 4
  const centerR = pixels[centerIdx] ?? 0
  const centerG = pixels[centerIdx + 1] ?? 0
  const centerB = pixels[centerIdx + 2] ?? 0
  const centerBrightness = (centerR + centerG + centerB) / 3
  
  // Threshold for considering a pixel as part of the blemish
  const threshold = type === 'blackhead' ? 10 : 20
  
  let maxRadius = BLEMISH_CONFIG.minBlemishSize
  
  // Check in 8 directions
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
    for (let r = 1; r <= BLEMISH_CONFIG.maxBlemishSize; r++) {
      const x = Math.round(centerX + Math.cos(angle) * r)
      const y = Math.round(centerY + Math.sin(angle) * r)
      
      if (x < 0 || x >= width || y < 0 || y >= height) break
      
      const idx = (y * width + x) * 4
      const pixelR = pixels[idx] ?? 0
      const pixelG = pixels[idx + 1] ?? 0
      const pixelB = pixels[idx + 2] ?? 0
      const pixelBrightness = (pixelR + pixelG + pixelB) / 3
      
      const diff = Math.abs(pixelBrightness - centerBrightness)
      
      if (diff > threshold) {
        // Found edge of blemish
        if (r > maxRadius) maxRadius = r
        break
      }
    }
  }
  
  return maxRadius
}

/**
 * Merge nearby blemishes to avoid duplicates
 */
function mergeBlemishes(blemishes: BlemishDetail[]): BlemishDetail[] {
  if (blemishes.length === 0) return []
  
  const merged: BlemishDetail[] = []
  const used = new Set<number>()
  
  for (let i = 0; i < blemishes.length; i++) {
    if (used.has(i)) continue
    
    const current = blemishes[i]
    if (!current) continue
    
    let mergedX = current.x
    let mergedY = current.y
    let mergedSize = current.size
    let mergedSeverity = current.severity
    let count = 1
    
    // Find nearby blemishes of the same type to merge
    for (let j = i + 1; j < blemishes.length; j++) {
      if (used.has(j)) continue
      
      const other = blemishes[j]
      if (!other) continue
      
      // Check if same type and close enough
      if (other.type === current.type) {
        const dist = Math.sqrt(
          Math.pow(other.x - current.x, 2) + 
          Math.pow(other.y - current.y, 2)
        )
        
        // Merge if within combined radius
        if (dist < (current.size + other.size) * 1.5) {
          used.add(j)
          mergedX = (mergedX * count + other.x) / (count + 1)
          mergedY = (mergedY * count + other.y) / (count + 1)
          mergedSize = Math.max(mergedSize, other.size)
          mergedSeverity = Math.max(mergedSeverity, other.severity)
          count++
        }
      }
    }
    
    used.add(i)
    merged.push({
      type: current.type,
      x: Math.round(mergedX),
      y: Math.round(mergedY),
      size: mergedSize,
      severity: mergedSeverity,
    })
  }
  
  return merged
}

/**
 * Calculate overall severity from detected blemishes
 */
function calculateOverallSeverity(blemishes: BlemishDetail[]): number {
  if (blemishes.length === 0) return 0
  
  // Weight by type severity
  const typeWeights: Record<BlemishDetail['type'], number> = {
    'acne': 1.5,
    'blackhead': 0.5,
    'whitehead': 1.0,
    'scar': 2.0,
    'dark-spot': 1.2,
    'redness': 0.8,
  }
  
  let totalWeightedSeverity = 0
  
  for (const blemish of blemishes) {
    const weight = typeWeights[blemish.type] ?? 1.0
    totalWeightedSeverity += blemish.severity * weight
  }
  
  // Scale to 0-100 based on count and severity
  // More blemishes = higher base severity
  const countFactor = Math.min(1, blemishes.length / 20) // Max out at 20 blemishes
  const avgSeverity = totalWeightedSeverity / blemishes.length
  
  return Math.min(100, Math.round(avgSeverity * 0.5 + countFactor * 50))
}

/**
 * Get severity level classification
 */
function getSeverityLevel(
  severity: number, 
  count: number
): BlemishAnalysis['level'] {
  if (count === 0 || severity < 10) return 'clear'
  if (count <= 3 && severity < 25) return 'minimal'
  if (count <= 8 && severity < 45) return 'mild'
  if (count <= 15 && severity < 70) return 'moderate'
  return 'severe'
}

/**
 * Analyze multiple zones and combine results
 */
export function analyzeMultipleZones(
  ctx: CanvasRenderingContext2D,
  zones: Array<{ name: string; x: number; y: number; width: number; height: number }>
): BlemishAnalysis {
  const allBlemishes: BlemishDetail[] = []
  const affectedZones: string[] = []
  const allTypes: Map<string, { count: number; totalConfidence: number }> = new Map()
  
  for (const zone of zones) {
    try {
      const imageData = ctx.getImageData(
        Math.floor(zone.x),
        Math.floor(zone.y),
        Math.floor(zone.width),
        Math.floor(zone.height)
      )
      
      const result = detectBlemishes(imageData, zone.name)
      
      if (result.count > 0) {
        affectedZones.push(zone.name)
        
        // Adjust blemish positions to absolute coordinates
        if (result.details) {
          for (const detail of result.details) {
            allBlemishes.push({
              ...detail,
              x: detail.x + zone.x,
              y: detail.y + zone.y,
            })
          }
        }
        
        // Aggregate types
        for (const type of result.types) {
          const existing = allTypes.get(type.type) ?? { count: 0, totalConfidence: 0 }
          existing.count += type.count
          existing.totalConfidence += type.confidence * type.count
          allTypes.set(type.type, existing)
        }
      }
    } catch {
      // Skip zones that fail to analyze
      continue
    }
  }
  
  // Calculate final results
  const severity = calculateOverallSeverity(allBlemishes)
  const level = getSeverityLevel(severity, allBlemishes.length)
  
  const types: BlemishType[] = Array.from(allTypes.entries())
    .map(([type, data]) => ({
      type: type as BlemishType['type'],
      count: data.count,
      confidence: data.count > 0 ? Math.round(data.totalConfidence / data.count) : 0,
    }))
    .sort((a, b) => b.count - a.count)
  
  return {
    severity,
    count: allBlemishes.length,
    level,
    types,
    affectedZones,
    details: allBlemishes.slice(0, 100), // Limit for performance
  }
}

/**
 * Get localized label for blemish level
 */
export function getBlemishLevelLabel(
  level: BlemishAnalysis['level'],
  locale: string
): string {
  const labels: Record<BlemishAnalysis['level'], Record<string, string>> = {
    clear: { en: 'Clear', ar: 'صافية', ru: 'Чистая' },
    minimal: { en: 'Minimal', ar: 'قليلة', ru: 'Минимально' },
    mild: { en: 'Mild', ar: 'خفيفة', ru: 'Лёгкие' },
    moderate: { en: 'Moderate', ar: 'متوسطة', ru: 'Умеренные' },
    severe: { en: 'Severe', ar: 'شديدة', ru: 'Выраженные' },
  }
  
  return labels[level]?.[locale] ?? labels[level]?.en ?? level
}

/**
 * Get localized label for blemish type
 */
export function getBlemishTypeLabel(
  type: BlemishType['type'],
  locale: string
): string {
  const labels: Record<BlemishType['type'], Record<string, string>> = {
    acne: { en: 'Acne', ar: 'حب الشباب', ru: 'Акне' },
    blackhead: { en: 'Blackheads', ar: 'الرؤوس السوداء', ru: 'Чёрные точки' },
    whitehead: { en: 'Whiteheads', ar: 'الرؤوس البيضاء', ru: 'Белые точки' },
    scar: { en: 'Scars', ar: 'ندوب', ru: 'Шрамы' },
    'dark-spot': { en: 'Dark Spots', ar: 'بقع داكنة', ru: 'Тёмные пятна' },
    redness: { en: 'Redness', ar: 'احمرار', ru: 'Покраснение' },
  }
  
  return labels[type]?.[locale] ?? labels[type]?.en ?? type
}

// =============================================================================
// P1-3: WRINKLE/FINE LINE ANALYSIS
// =============================================================================

// Wrinkle detection configuration
const WRINKLE_CONFIG = {
  // Edge detection sensitivity (lower = more sensitive)
  edgeThreshold: 25,
  // Minimum line length to consider as wrinkle
  minLineLength: 8,
  // Grid size for scanning
  scanGridSize: 2,
  // Local contrast threshold
  contrastThreshold: 15,
}

// Wrinkle area labels
const WRINKLE_AREA_LABELS: Record<WrinkleArea['name'], { en: string; ar: string; ru: string }> = {
  forehead: { en: 'Forehead Lines', ar: 'خطوط الجبهة', ru: 'Морщины на лбу' },
  crowsFeet: { en: "Crow's Feet", ar: 'خطوط حول العينين', ru: 'Гусиные лапки' },
  frowLines: { en: 'Frown Lines', ar: 'خطوط التجهم', ru: 'Межбровные морщины' },
  nasolabial: { en: 'Nasolabial Folds', ar: 'الخطوط الأنفية', ru: 'Носогубные складки' },
  underEye: { en: 'Under-Eye Lines', ar: 'خطوط تحت العين', ru: 'Морщины под глазами' },
  neckLines: { en: 'Neck Lines', ar: 'خطوط الرقبة', ru: 'Морщины на шее' },
}

/**
 * Analyze wrinkles in facial zones
 * Uses edge detection and texture analysis to find fine lines
 */
export function analyzeWrinkles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  faceLandmarks?: Array<{ x: number; y: number }> | null
): WrinkleAnalysis {
  const areas: WrinkleArea[] = []
  
  // Define wrinkle-prone zones based on face proportions or landmarks
  const zones = getWrinkleZones(width, height, faceLandmarks)
  
  for (const zone of zones) {
    try {
      const x = Math.max(0, Math.floor(zone.x))
      const y = Math.max(0, Math.floor(zone.y))
      const w = Math.min(width - x, Math.floor(zone.width))
      const h = Math.min(height - y, Math.floor(zone.height))
      
      if (w <= 0 || h <= 0) continue
      
      const imageData = ctx.getImageData(x, y, w, h)
      const result = detectWrinklesInZone(imageData, zone.orientation)
      
      if (result.severity > 5) { // Only include if wrinkles detected
        areas.push({
          name: zone.name,
          label: WRINKLE_AREA_LABELS[zone.name],
          severity: result.severity,
          confidence: result.confidence,
        })
      }
    } catch {
      // Skip zones that fail
      continue
    }
  }
  
  // Calculate overall severity
  const totalSeverity = areas.reduce((sum, a) => sum + a.severity, 0)
  const avgSeverity = areas.length > 0 ? totalSeverity / areas.length : 0
  const maxSeverity = areas.length > 0 ? Math.max(...areas.map(a => a.severity)) : 0
  
  // Weighted overall severity (max counts more)
  const severity = Math.round(avgSeverity * 0.4 + maxSeverity * 0.6)
  
  // Determine level
  const level = getWrinkleLevel(severity)
  
  // Estimate skin age impact (wrinkles can add perceived years)
  const skinAgeImpact = Math.round(severity * 0.2) // Up to 20 years for severe wrinkles
  
  return {
    severity,
    level,
    areas,
    skinAgeImpact,
  }
}

/**
 * Get wrinkle-prone zones based on face dimensions or landmarks
 */
interface WrinkleZone {
  name: WrinkleArea['name']
  x: number
  y: number
  width: number
  height: number
  orientation: 'horizontal' | 'vertical' | 'diagonal'
}

function getWrinkleZones(
  width: number,
  height: number,
  landmarks?: Array<{ x: number; y: number }> | null
): WrinkleZone[] {
  // If we have face landmarks, use precise positions
  if (landmarks && landmarks.length >= 468) {
    return getWrinkleZonesFromLandmarks(landmarks, width, height)
  }
  
  // Otherwise use approximate face proportions
  return [
    // Forehead (horizontal lines)
    {
      name: 'forehead',
      x: width * 0.3,
      y: height * 0.15,
      width: width * 0.4,
      height: height * 0.1,
      orientation: 'horizontal',
    },
    // Frown lines (between eyebrows - vertical)
    {
      name: 'frowLines',
      x: width * 0.42,
      y: height * 0.22,
      width: width * 0.16,
      height: height * 0.08,
      orientation: 'vertical',
    },
    // Crow's feet left (diagonal)
    {
      name: 'crowsFeet',
      x: width * 0.15,
      y: height * 0.28,
      width: width * 0.12,
      height: height * 0.1,
      orientation: 'diagonal',
    },
    // Crow's feet right (diagonal)
    {
      name: 'crowsFeet',
      x: width * 0.73,
      y: height * 0.28,
      width: width * 0.12,
      height: height * 0.1,
      orientation: 'diagonal',
    },
    // Under-eye left
    {
      name: 'underEye',
      x: width * 0.25,
      y: height * 0.32,
      width: width * 0.15,
      height: height * 0.06,
      orientation: 'horizontal',
    },
    // Under-eye right
    {
      name: 'underEye',
      x: width * 0.6,
      y: height * 0.32,
      width: width * 0.15,
      height: height * 0.06,
      orientation: 'horizontal',
    },
    // Nasolabial left
    {
      name: 'nasolabial',
      x: width * 0.28,
      y: height * 0.45,
      width: width * 0.12,
      height: height * 0.15,
      orientation: 'diagonal',
    },
    // Nasolabial right
    {
      name: 'nasolabial',
      x: width * 0.6,
      y: height * 0.45,
      width: width * 0.12,
      height: height * 0.15,
      orientation: 'diagonal',
    },
  ]
}

/**
 * Get precise wrinkle zones from face landmarks
 */
function getWrinkleZonesFromLandmarks(
  landmarks: Array<{ x: number; y: number }>,
  _width: number,
  _height: number
): WrinkleZone[] {
  const zones: WrinkleZone[] = []
  
  // Forehead: between eyebrows and hairline
  const leftEyebrow = landmarks[70] // Left eyebrow top
  const rightEyebrow = landmarks[300] // Right eyebrow top
  const foreheadTop = landmarks[10] // Top of face
  
  if (leftEyebrow && rightEyebrow && foreheadTop) {
    zones.push({
      name: 'forehead',
      x: leftEyebrow.x,
      y: foreheadTop.y,
      width: rightEyebrow.x - leftEyebrow.x,
      height: leftEyebrow.y - foreheadTop.y,
      orientation: 'horizontal',
    })
  }
  
  // Frown lines: between eyebrows
  const leftBrowInner = landmarks[107] // Left eyebrow inner
  const rightBrowInner = landmarks[336] // Right eyebrow inner
  
  if (leftBrowInner && rightBrowInner) {
    zones.push({
      name: 'frowLines',
      x: leftBrowInner.x,
      y: leftBrowInner.y - 15,
      width: rightBrowInner.x - leftBrowInner.x,
      height: 30,
      orientation: 'vertical',
    })
  }
  
  // Crow's feet: outer eye corners
  const leftEyeOuter = landmarks[130] // Left eye outer corner
  const rightEyeOuter = landmarks[359] // Right eye outer corner
  
  if (leftEyeOuter) {
    zones.push({
      name: 'crowsFeet',
      x: leftEyeOuter.x - 25,
      y: leftEyeOuter.y - 15,
      width: 35,
      height: 35,
      orientation: 'diagonal',
    })
  }
  
  if (rightEyeOuter) {
    zones.push({
      name: 'crowsFeet',
      x: rightEyeOuter.x - 10,
      y: rightEyeOuter.y - 15,
      width: 35,
      height: 35,
      orientation: 'diagonal',
    })
  }
  
  // Under-eye: below eyes
  const leftEyeBottom = landmarks[111] // Left eye bottom
  const rightEyeBottom = landmarks[340] // Right eye bottom
  
  if (leftEyeBottom) {
    zones.push({
      name: 'underEye',
      x: leftEyeBottom.x - 20,
      y: leftEyeBottom.y,
      width: 45,
      height: 20,
      orientation: 'horizontal',
    })
  }
  
  if (rightEyeBottom) {
    zones.push({
      name: 'underEye',
      x: rightEyeBottom.x - 25,
      y: rightEyeBottom.y,
      width: 45,
      height: 20,
      orientation: 'horizontal',
    })
  }
  
  // Nasolabial folds: nose to mouth corners
  const noseBottom = landmarks[2] // Nose bottom
  const leftMouth = landmarks[61] // Left mouth corner
  const rightMouth = landmarks[291] // Right mouth corner
  
  if (noseBottom && leftMouth) {
    zones.push({
      name: 'nasolabial',
      x: leftMouth.x - 10,
      y: noseBottom.y,
      width: 30,
      height: leftMouth.y - noseBottom.y,
      orientation: 'diagonal',
    })
  }
  
  if (noseBottom && rightMouth) {
    zones.push({
      name: 'nasolabial',
      x: rightMouth.x - 20,
      y: noseBottom.y,
      width: 30,
      height: rightMouth.y - noseBottom.y,
      orientation: 'diagonal',
    })
  }
  
  return zones
}

/**
 * Detect wrinkles in a zone using edge detection
 */
function detectWrinklesInZone(
  imageData: ImageData,
  orientation: 'horizontal' | 'vertical' | 'diagonal'
): { severity: number; confidence: number } {
  const { data: pixels, width, height } = imageData
  
  // Convert to grayscale and calculate gradients
  const grayscale: number[] = []
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i] ?? 0
    const g = pixels[i + 1] ?? 0
    const b = pixels[i + 2] ?? 0
    grayscale.push(r * 0.299 + g * 0.587 + b * 0.114)
  }
  
  // Apply Sobel edge detection
  let edgeCount = 0
  let totalEdgeStrength = 0
  const scanSize = WRINKLE_CONFIG.scanGridSize
  
  for (let y = scanSize; y < height - scanSize; y += scanSize) {
    for (let x = scanSize; x < width - scanSize; x += scanSize) {
      const gradient = calculateGradient(grayscale, width, x, y, orientation)
      
      if (gradient > WRINKLE_CONFIG.edgeThreshold) {
        edgeCount++
        totalEdgeStrength += gradient
      }
    }
  }
  
  // Calculate metrics
  const totalPixels = ((width / scanSize) * (height / scanSize))
  const edgeDensity = totalPixels > 0 ? edgeCount / totalPixels : 0
  const avgEdgeStrength = edgeCount > 0 ? totalEdgeStrength / edgeCount : 0
  
  // Convert to severity (0-100)
  // Higher edge density + stronger edges = more wrinkles
  const severity = Math.min(100, Math.round(
    (edgeDensity * 200) * 0.6 + (avgEdgeStrength / 2) * 0.4
  ))
  
  // Confidence based on sample size and consistency
  const confidence = Math.min(100, Math.round(
    70 + (edgeCount > 10 ? 15 : 0) + (avgEdgeStrength > 30 ? 15 : 0)
  ))
  
  return { severity, confidence }
}

/**
 * Calculate gradient strength at a point
 */
function calculateGradient(
  grayscale: number[],
  width: number,
  x: number,
  y: number,
  orientation: 'horizontal' | 'vertical' | 'diagonal'
): number {
  const idx = y * width + x
  const current = grayscale[idx] ?? 128
  
  let gx = 0
  let gy = 0
  
  // Sobel kernels
  if (orientation === 'horizontal' || orientation === 'diagonal') {
    // Horizontal edges (for horizontal wrinkles like forehead lines)
    const top = grayscale[idx - width] ?? current
    const bottom = grayscale[idx + width] ?? current
    gy = Math.abs(bottom - top)
  }
  
  if (orientation === 'vertical' || orientation === 'diagonal') {
    // Vertical edges (for vertical wrinkles like frown lines)
    const left = grayscale[idx - 1] ?? current
    const right = grayscale[idx + 1] ?? current
    gx = Math.abs(right - left)
  }
  
  // Combine gradients
  return Math.sqrt(gx * gx + gy * gy)
}

/**
 * Get wrinkle severity level
 */
function getWrinkleLevel(severity: number): WrinkleAnalysis['level'] {
  if (severity < 10) return 'none'
  if (severity < 25) return 'minimal'
  if (severity < 45) return 'mild'
  if (severity < 70) return 'moderate'
  return 'advanced'
}

/**
 * Get localized label for wrinkle level
 */
export function getWrinkleLevelLabel(
  level: WrinkleAnalysis['level'],
  locale: string
): string {
  const labels: Record<WrinkleAnalysis['level'], Record<string, string>> = {
    none: { en: 'None', ar: 'لا يوجد', ru: 'Нет' },
    minimal: { en: 'Minimal', ar: 'قليلة', ru: 'Минимальные' },
    mild: { en: 'Mild', ar: 'خفيفة', ru: 'Лёгкие' },
    moderate: { en: 'Moderate', ar: 'متوسطة', ru: 'Умеренные' },
    advanced: { en: 'Advanced', ar: 'متقدمة', ru: 'Выраженные' },
  }
  
  return labels[level]?.[locale] ?? labels[level]?.en ?? level
}

/**
 * Get localized label for wrinkle area
 */
export function getWrinkleAreaLabel(
  name: WrinkleArea['name'],
  locale: string
): string {
  return WRINKLE_AREA_LABELS[name]?.[locale as 'en' | 'ar' | 'ru'] ?? 
         WRINKLE_AREA_LABELS[name]?.en ?? 
         name
}

// =============================================================================
// P1-4: PIGMENTATION / DARK SPOT ANALYSIS
// =============================================================================

/**
 * Analyze skin pigmentation and detect dark spots
 */
export function analyzePigmentation(
  ctx: CanvasRenderingContext2D,
  zones: Array<{ name: string; x: number; y: number; width: number; height: number }>
): PigmentationAnalysis {
  const areas: PigmentationArea[] = []
  let totalUnevenness = 0
  let totalDarkSpots = 0
  let totalUniformity = 0
  let validZones = 0
  
  for (const zone of zones) {
    try {
      const x = Math.max(0, Math.floor(zone.x))
      const y = Math.max(0, Math.floor(zone.y))
      const w = Math.min(ctx.canvas.width - x, Math.floor(zone.width))
      const h = Math.min(ctx.canvas.height - y, Math.floor(zone.height))
      
      if (w <= 0 || h <= 0) continue
      
      const imageData = ctx.getImageData(x, y, w, h)
      const result = analyzePigmentationInZone(imageData)
      
      areas.push({
        name: zone.name,
        unevenness: result.unevenness,
        darkSpotCount: result.darkSpotCount,
        type: result.type,
      })
      
      totalUnevenness += result.unevenness
      totalDarkSpots += result.darkSpotCount
      totalUniformity += result.uniformity
      validZones++
    } catch {
      continue
    }
  }
  
  if (validZones === 0) {
    return {
      unevenness: 0,
      level: 'even',
      darkSpotCount: 0,
      areas: [],
      uniformityScore: 100,
    }
  }
  
  const avgUnevenness = Math.round(totalUnevenness / validZones)
  const uniformityScore = Math.round(totalUniformity / validZones)
  const level = getPigmentationLevel(avgUnevenness)
  
  return {
    unevenness: avgUnevenness,
    level,
    darkSpotCount: totalDarkSpots,
    areas,
    uniformityScore,
  }
}

/**
 * Analyze pigmentation in a single zone
 */
function analyzePigmentationInZone(imageData: ImageData): {
  unevenness: number
  darkSpotCount: number
  uniformity: number
  type: PigmentationArea['type']
} {
  const { data: pixels, width, height } = imageData
  
  // Calculate luminance for each pixel
  const luminanceMap: number[] = []
  let totalLuminance = 0
  
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i] ?? 0
    const g = pixels[i + 1] ?? 0
    const b = pixels[i + 2] ?? 0
    // Standard luminance formula
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b
    luminanceMap.push(luminance)
    totalLuminance += luminance
  }
  
  const avgLuminance = totalLuminance / luminanceMap.length
  
  // Calculate luminance variance (uniformity)
  let variance = 0
  for (const lum of luminanceMap) {
    variance += Math.pow(lum - avgLuminance, 2)
  }
  variance = variance / luminanceMap.length
  const stdDev = Math.sqrt(variance)
  
  // Detect dark spots (pixels significantly darker than average)
  const darkThreshold = avgLuminance - stdDev * 1.5
  let darkSpotCount = 0
  const darkPixelPositions: Array<{ x: number; y: number }> = []
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      const lum = luminanceMap[idx] ?? avgLuminance
      
      if (lum < darkThreshold) {
        darkPixelPositions.push({ x, y })
      }
    }
  }
  
  // Cluster dark pixels into spots
  darkSpotCount = clusterDarkPixels(darkPixelPositions, 5) // 5px minimum cluster distance
  
  // Calculate unevenness (0-100)
  // Higher standard deviation = more uneven
  const unevenness = Math.min(100, Math.round(stdDev * 2))
  
  // Calculate uniformity score (inverse of unevenness)
  const uniformity = 100 - unevenness
  
  // Determine pigmentation type based on characteristics
  let type: PigmentationArea['type'] = 'general'
  
  if (darkSpotCount > 10 && unevenness < 30) {
    type = 'freckles' // Many small spots, relatively even otherwise
  } else if (darkSpotCount <= 5 && unevenness > 40) {
    type = 'melasma' // Few spots but very uneven (patches)
  } else if (darkSpotCount > 5 && unevenness > 30) {
    type = 'sunspots' // Multiple defined spots
  }
  
  return {
    unevenness,
    darkSpotCount,
    uniformity,
    type,
  }
}

/**
 * Cluster dark pixels into discrete spots
 */
function clusterDarkPixels(
  pixels: Array<{ x: number; y: number }>,
  minDistance: number
): number {
  if (pixels.length === 0) return 0
  
  const used = new Set<number>()
  let clusters = 0
  
  for (let i = 0; i < pixels.length; i++) {
    if (used.has(i)) continue
    
    // Start a new cluster
    clusters++
    used.add(i)
    
    // Find all connected pixels
    const stack = [i]
    while (stack.length > 0) {
      const currentIdx = stack.pop()!
      const current = pixels[currentIdx]
      if (!current) continue
      
      for (let j = 0; j < pixels.length; j++) {
        if (used.has(j)) continue
        
        const other = pixels[j]
        if (!other) continue
        
        const dist = Math.sqrt(
          Math.pow(other.x - current.x, 2) + 
          Math.pow(other.y - current.y, 2)
        )
        
        if (dist <= minDistance) {
          used.add(j)
          stack.push(j)
        }
      }
    }
  }
  
  return clusters
}

/**
 * Get pigmentation level
 */
function getPigmentationLevel(unevenness: number): PigmentationAnalysis['level'] {
  if (unevenness < 10) return 'even'
  if (unevenness < 25) return 'minimal'
  if (unevenness < 45) return 'mild'
  if (unevenness < 70) return 'moderate'
  return 'significant'
}

/**
 * Get localized label for pigmentation level
 */
export function getPigmentationLevelLabel(
  level: PigmentationAnalysis['level'],
  locale: string
): string {
  const labels: Record<PigmentationAnalysis['level'], Record<string, string>> = {
    even: { en: 'Even Tone', ar: 'لون موحد', ru: 'Ровный тон' },
    minimal: { en: 'Minimal', ar: 'قليلة', ru: 'Минимальная' },
    mild: { en: 'Mild', ar: 'خفيفة', ru: 'Лёгкая' },
    moderate: { en: 'Moderate', ar: 'متوسطة', ru: 'Умеренная' },
    significant: { en: 'Significant', ar: 'ملحوظة', ru: 'Заметная' },
  }
  
  return labels[level]?.[locale] ?? labels[level]?.en ?? level
}

// ============================================================
// P1-5: Gender Detection Analysis
// ============================================================

export interface GenderAnalysis {
  // Predicted gender
  gender: 'male' | 'female' | 'unknown'
  // Confidence score (0-100)
  confidence: number
  // Individual feature scores
  features: {
    skinTexture: number      // Rougher texture = more male (0-100)
    facialHair: number       // Darker jaw/upper lip = more male (0-100)
    jawDefinition: number    // Sharper jawline = more male (0-100)
    browProminence: number   // Prominent brow = more male (0-100)
    skinSoftness: number     // Softer skin = more female (0-100)
  }
}

/**
 * Analyze facial features to estimate gender
 * Uses multiple indicators: skin texture, facial hair shadow, jawline, brow ridge
 */
type FaceZone = { x: number; y: number; width: number; height: number }

interface GenderFaceZones {
  forehead: FaceZone
  jawLeft: FaceZone
  jawRight: FaceZone
  upperLip: FaceZone
  chin: FaceZone
  cheekLeft: FaceZone
  cheekRight: FaceZone
}

export function analyzeGender(
  imageData: ImageData,
  _faceZones?: { [key: string]: FaceZone }
): GenderAnalysis {
  const { data, width, height } = imageData
  
  // Default face zones (approximate positions for gender analysis)
  const zones: GenderFaceZones = {
    forehead: { x: width * 0.25, y: height * 0.05, width: width * 0.5, height: height * 0.15 },
    jawLeft: { x: width * 0.1, y: height * 0.65, width: width * 0.2, height: height * 0.2 },
    jawRight: { x: width * 0.7, y: height * 0.65, width: width * 0.2, height: height * 0.2 },
    upperLip: { x: width * 0.3, y: height * 0.55, width: width * 0.4, height: height * 0.08 },
    chin: { x: width * 0.3, y: height * 0.75, width: width * 0.4, height: height * 0.15 },
    cheekLeft: { x: width * 0.1, y: height * 0.35, width: width * 0.2, height: height * 0.25 },
    cheekRight: { x: width * 0.7, y: height * 0.35, width: width * 0.2, height: height * 0.25 },
  }
  
  // 1. Analyze skin texture (rougher = more male)
  const textureScore = analyzeTextureRoughness(data, width, height, zones.cheekLeft, zones.cheekRight)
  
  // 2. Analyze facial hair shadow (darker lower face = more male)
  const facialHairScore = analyzeFacialHairShadow(data, width, height, zones.jawLeft, zones.jawRight, zones.upperLip, zones.chin)
  
  // 3. Analyze jaw definition (sharper edges = more male)
  const jawScore = analyzeJawDefinition(data, width, height, zones.jawLeft, zones.jawRight)
  
  // 4. Analyze brow prominence
  const browScore = analyzeBrowProminence(data, width, height, zones.forehead)
  
  // 5. Analyze skin softness (smoother = more female)
  const softnessScore = 100 - textureScore
  
  // Calculate weighted male probability
  // Weights based on discriminative power of each feature
  const maleScore = (
    textureScore * 0.20 +       // Texture roughness
    facialHairScore * 0.35 +    // Facial hair shadow (strongest indicator)
    jawScore * 0.25 +           // Jaw definition
    browScore * 0.20            // Brow prominence
  )
  
  // Determine gender with confidence
  const threshold = 50
  const gender: GenderAnalysis['gender'] = 
    maleScore > threshold + 10 ? 'male' :
    maleScore < threshold - 10 ? 'female' :
    'unknown'
  
  // Calculate confidence (distance from threshold)
  const confidence = Math.min(100, Math.abs(maleScore - threshold) * 2 + 50)
  
  return {
    gender,
    confidence: Math.round(confidence),
    features: {
      skinTexture: Math.round(textureScore),
      facialHair: Math.round(facialHairScore),
      jawDefinition: Math.round(jawScore),
      browProminence: Math.round(browScore),
      skinSoftness: Math.round(softnessScore),
    }
  }
}

/**
 * Analyze skin texture roughness
 */
function analyzeTextureRoughness(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  zone1: { x: number; y: number; width: number; height: number },
  zone2: { x: number; y: number; width: number; height: number }
): number {
  const zones = [zone1, zone2]
  let totalVariance = 0
  let sampleCount = 0
  
  for (const zone of zones) {
    const startX = Math.floor(zone.x)
    const startY = Math.floor(zone.y)
    const endX = Math.min(width - 1, Math.floor(zone.x + zone.width))
    const endY = Math.min(height - 1, Math.floor(zone.y + zone.height))
    
    // Calculate local variance (texture indicator)
    for (let y = startY + 1; y < endY - 1; y += 2) {
      for (let x = startX + 1; x < endX - 1; x += 2) {
        const idx = (y * width + x) * 4
        const center = ((data[idx] ?? 0) + (data[idx + 1] ?? 0) + (data[idx + 2] ?? 0)) / 3
        
        // Check neighbors
        const neighbors = [
          ((y - 1) * width + x) * 4,
          ((y + 1) * width + x) * 4,
          (y * width + (x - 1)) * 4,
          (y * width + (x + 1)) * 4,
        ]
        
        let neighborVariance = 0
        for (const nIdx of neighbors) {
          const nVal = ((data[nIdx] ?? 0) + (data[nIdx + 1] ?? 0) + (data[nIdx + 2] ?? 0)) / 3
          neighborVariance += Math.abs(nVal - center)
        }
        
        totalVariance += neighborVariance / 4
        sampleCount++
      }
    }
  }
  
  // Higher variance = rougher texture = more male
  const avgVariance = sampleCount > 0 ? totalVariance / sampleCount : 0
  // Normalize: typical range is 2-15
  return Math.min(100, (avgVariance / 12) * 100)
}

/**
 * Analyze facial hair shadow (darker pixels in beard area)
 */
function analyzeFacialHairShadow(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  jawLeft: { x: number; y: number; width: number; height: number },
  jawRight: { x: number; y: number; width: number; height: number },
  upperLip: { x: number; y: number; width: number; height: number },
  chin: { x: number; y: number; width: number; height: number }
): number {
  const zones = [jawLeft, jawRight, upperLip, chin]
  let darkPixelRatio = 0
  let totalPixels = 0
  let darkPixels = 0
  
  // Also get reference brightness from cheek area (face skin baseline)
  const cheekZone = { 
    x: width * 0.35, 
    y: height * 0.4, 
    width: width * 0.3, 
    height: height * 0.15 
  }
  
  let cheekBrightness = 0
  let cheekCount = 0
  
  const cheekStartX = Math.floor(cheekZone.x)
  const cheekStartY = Math.floor(cheekZone.y)
  const cheekEndX = Math.min(width, Math.floor(cheekZone.x + cheekZone.width))
  const cheekEndY = Math.min(height, Math.floor(cheekZone.y + cheekZone.height))
  
  for (let y = cheekStartY; y < cheekEndY; y += 2) {
    for (let x = cheekStartX; x < cheekEndX; x += 2) {
      const idx = (y * width + x) * 4
      cheekBrightness += ((data[idx] ?? 0) + (data[idx + 1] ?? 0) + (data[idx + 2] ?? 0)) / 3
      cheekCount++
    }
  }
  
  const avgCheekBrightness = cheekCount > 0 ? cheekBrightness / cheekCount : 128
  const darkThreshold = avgCheekBrightness * 0.85 // 15% darker than cheeks
  
  // Analyze beard zones
  for (const zone of zones) {
    const startX = Math.floor(zone.x)
    const startY = Math.floor(zone.y)
    const endX = Math.min(width, Math.floor(zone.x + zone.width))
    const endY = Math.min(height, Math.floor(zone.y + zone.height))
    
    for (let y = startY; y < endY; y += 2) {
      for (let x = startX; x < endX; x += 2) {
        const idx = (y * width + x) * 4
        const brightness = ((data[idx] ?? 0) + (data[idx + 1] ?? 0) + (data[idx + 2] ?? 0)) / 3
        
        totalPixels++
        if (brightness < darkThreshold) {
          darkPixels++
        }
      }
    }
  }
  
  darkPixelRatio = totalPixels > 0 ? darkPixels / totalPixels : 0
  
  // Higher ratio of dark pixels = more facial hair = more male
  // Typical range: 0.05 (smooth) to 0.4 (visible stubble/beard)
  return Math.min(100, darkPixelRatio * 250)
}

/**
 * Analyze jaw definition (contrast at jaw edges)
 */
function analyzeJawDefinition(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  jawLeft: { x: number; y: number; width: number; height: number },
  jawRight: { x: number; y: number; width: number; height: number }
): number {
  const zones = [jawLeft, jawRight]
  let totalEdgeStrength = 0
  let edgeCount = 0
  
  for (const zone of zones) {
    const startX = Math.floor(zone.x)
    const startY = Math.floor(zone.y)
    const endX = Math.min(width - 1, Math.floor(zone.x + zone.width))
    const endY = Math.min(height - 1, Math.floor(zone.y + zone.height))
    
    // Look for strong horizontal edges (jaw line)
    for (let y = startY + 1; y < endY - 1; y++) {
      for (let x = startX; x < endX; x += 2) {
        const idxAbove = ((y - 1) * width + x) * 4
        const idxBelow = ((y + 1) * width + x) * 4
        
        const above = ((data[idxAbove] ?? 0) + (data[idxAbove + 1] ?? 0) + (data[idxAbove + 2] ?? 0)) / 3
        const below = ((data[idxBelow] ?? 0) + (data[idxBelow + 1] ?? 0) + (data[idxBelow + 2] ?? 0)) / 3
        
        // Edge strength (Sobel-like)
        const edgeStrength = Math.abs(above - below)
        
        if (edgeStrength > 10) { // Only count significant edges
          totalEdgeStrength += edgeStrength
          edgeCount++
        }
      }
    }
  }
  
  const avgEdgeStrength = edgeCount > 0 ? totalEdgeStrength / edgeCount : 0
  
  // Sharper edges = more defined jaw = more male
  // Typical range: 15-40
  return Math.min(100, ((avgEdgeStrength - 15) / 25) * 100)
}

/**
 * Analyze brow ridge prominence (shadow under brow)
 */
function analyzeBrowProminence(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  foreheadZone: { x: number; y: number; width: number; height: number }
): number {
  // Look at lower part of forehead (brow area)
  const browZone = {
    x: foreheadZone.x,
    y: foreheadZone.y + foreheadZone.height * 0.6,
    width: foreheadZone.width,
    height: foreheadZone.height * 0.4
  }
  
  const upperZone = {
    x: foreheadZone.x,
    y: foreheadZone.y,
    width: foreheadZone.width,
    height: foreheadZone.height * 0.5
  }
  
  // Get average brightness of upper forehead vs brow area
  let upperBrightness = 0
  let upperCount = 0
  let browBrightness = 0
  let browCount = 0
  
  // Upper forehead
  for (let y = Math.floor(upperZone.y); y < Math.floor(upperZone.y + upperZone.height); y += 2) {
    for (let x = Math.floor(upperZone.x); x < Math.floor(upperZone.x + upperZone.width); x += 2) {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        const idx = (y * width + x) * 4
        upperBrightness += ((data[idx] ?? 0) + (data[idx + 1] ?? 0) + (data[idx + 2] ?? 0)) / 3
        upperCount++
      }
    }
  }
  
  // Brow area
  for (let y = Math.floor(browZone.y); y < Math.floor(browZone.y + browZone.height); y += 2) {
    for (let x = Math.floor(browZone.x); x < Math.floor(browZone.x + browZone.width); x += 2) {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        const idx = (y * width + x) * 4
        browBrightness += ((data[idx] ?? 0) + (data[idx + 1] ?? 0) + (data[idx + 2] ?? 0)) / 3
        browCount++
      }
    }
  }
  
  const avgUpper = upperCount > 0 ? upperBrightness / upperCount : 128
  const avgBrow = browCount > 0 ? browBrightness / browCount : 128
  
  // Bigger difference = more prominent brow ridge = more male
  const browShadow = avgUpper - avgBrow
  
  // Typical range: 0-20
  return Math.min(100, Math.max(0, (browShadow / 15) * 100))
}

/**
 * Get localized gender label
 */
export function getGenderLabel(
  gender: GenderAnalysis['gender'],
  locale: string
): string {
  const labels: Record<GenderAnalysis['gender'], Record<string, string>> = {
    male: { en: 'Male', ar: 'ذكر', ru: 'Мужской' },
    female: { en: 'Female', ar: 'أنثى', ru: 'Женский' },
    unknown: { en: 'Unknown', ar: 'غير محدد', ru: 'Не определено' },
  }
  
  return labels[gender]?.[locale] ?? labels[gender]?.en ?? gender
}

// ============================================================
// P2-1: Pore Size Analysis
// ============================================================

export interface PoreAnalysis {
  // Overall pore visibility score (0 = invisible, 100 = very visible)
  visibility: number
  // Classification
  level: 'minimal' | 'small' | 'moderate' | 'large' | 'enlarged'
  // Zone-specific scores
  zones: {
    nose: number
    leftCheek: number
    rightCheek: number
    forehead: number
    chin: number
  }
  // Estimated pore count per zone
  estimatedCount: number
}

/**
 * Analyze pore size and visibility
 * Uses local contrast and texture analysis to detect pores
 */
export function analyzePores(
  imageData: ImageData,
  width?: number,
  height?: number
): PoreAnalysis {
  const data = imageData.data
  const w = width || imageData.width
  const h = height || imageData.height
  
  // Define pore-prone zones
  const zones = {
    nose: { x: w * 0.4, y: h * 0.35, width: w * 0.2, height: h * 0.2 },
    leftCheek: { x: w * 0.15, y: h * 0.35, width: w * 0.2, height: h * 0.2 },
    rightCheek: { x: w * 0.65, y: h * 0.35, width: w * 0.2, height: h * 0.2 },
    forehead: { x: w * 0.3, y: h * 0.1, width: w * 0.4, height: h * 0.15 },
    chin: { x: w * 0.35, y: h * 0.7, width: w * 0.3, height: h * 0.12 },
  }
  
  const analyzeZonePores = (zone: { x: number; y: number; width: number; height: number }): number => {
    let poreIndicators = 0
    let totalPixels = 0
    
    const startX = Math.floor(zone.x)
    const startY = Math.floor(zone.y)
    const endX = Math.min(w - 2, Math.floor(zone.x + zone.width))
    const endY = Math.min(h - 2, Math.floor(zone.y + zone.height))
    
    // Look for dark spots surrounded by lighter pixels (pore signature)
    for (let y = startY + 1; y < endY - 1; y += 2) {
      for (let x = startX + 1; x < endX - 1; x += 2) {
        const idx = (y * w + x) * 4
        const center = ((data[idx] ?? 0) + (data[idx + 1] ?? 0) + (data[idx + 2] ?? 0)) / 3
        
        // Check 4 neighbors
        const neighbors = [
          ((y - 1) * w + x) * 4,
          ((y + 1) * w + x) * 4,
          (y * w + (x - 1)) * 4,
          (y * w + (x + 1)) * 4,
        ]
        
        let neighborSum = 0
        for (const nIdx of neighbors) {
          neighborSum += ((data[nIdx] ?? 0) + (data[nIdx + 1] ?? 0) + (data[nIdx + 2] ?? 0)) / 3
        }
        const neighborAvg = neighborSum / 4
        
        // Pore signature: center is darker than surroundings
        if (neighborAvg - center > 8) {
          poreIndicators++
        }
        totalPixels++
      }
    }
    
    // Calculate pore density and normalize
    const poreDensity = totalPixels > 0 ? (poreIndicators / totalPixels) * 100 : 0
    return Math.min(100, poreDensity * 8) // Scale for visibility
  }
  
  const zoneScores = {
    nose: analyzeZonePores(zones.nose),
    leftCheek: analyzeZonePores(zones.leftCheek),
    rightCheek: analyzeZonePores(zones.rightCheek),
    forehead: analyzeZonePores(zones.forehead),
    chin: analyzeZonePores(zones.chin),
  }
  
  // Nose typically has most visible pores, weight it higher
  const overallVisibility = Math.round(
    zoneScores.nose * 0.35 +
    (zoneScores.leftCheek + zoneScores.rightCheek) / 2 * 0.35 +
    zoneScores.forehead * 0.15 +
    zoneScores.chin * 0.15
  )
  
  return {
    visibility: overallVisibility,
    level: getPoreLevel(overallVisibility),
    zones: zoneScores,
    estimatedCount: Math.round(overallVisibility * 2), // Rough estimate
  }
}

function getPoreLevel(visibility: number): PoreAnalysis['level'] {
  if (visibility < 15) return 'minimal'
  if (visibility < 30) return 'small'
  if (visibility < 50) return 'moderate'
  if (visibility < 70) return 'large'
  return 'enlarged'
}

export function getPoreLevelLabel(level: PoreAnalysis['level'], locale: string): string {
  const labels: Record<PoreAnalysis['level'], Record<string, string>> = {
    minimal: { en: 'Minimal', ar: 'ضئيلة', ru: 'Минимальные' },
    small: { en: 'Small', ar: 'صغيرة', ru: 'Мелкие' },
    moderate: { en: 'Moderate', ar: 'متوسطة', ru: 'Умеренные' },
    large: { en: 'Large', ar: 'كبيرة', ru: 'Крупные' },
    enlarged: { en: 'Enlarged', ar: 'موسعة', ru: 'Расширенные' },
  }
  return labels[level]?.[locale] ?? labels[level]?.en ?? level
}

// ============================================================
// P2-2: Under-Eye Analysis
// ============================================================

export interface UnderEyeAnalysis {
  // Dark circles severity (0 = none, 100 = severe)
  darkCircles: number
  // Puffiness level (0 = none, 100 = severe)
  puffiness: number
  // Fine lines around eyes (0 = none, 100 = many)
  fineLines: number
  // Overall under-eye health (100 = excellent, 0 = poor)
  healthScore: number
  // Classification
  level: 'excellent' | 'good' | 'fair' | 'tired' | 'fatigued'
}

/**
 * Analyze under-eye area for dark circles, puffiness, and fine lines
 */
export function analyzeUnderEye(
  imageData: ImageData,
  width?: number,
  height?: number
): UnderEyeAnalysis {
  const data = imageData.data
  const w = width || imageData.width
  const h = height || imageData.height
  
  // Define under-eye zones (below eyes)
  const leftUnderEye = { x: w * 0.22, y: h * 0.42, width: w * 0.18, height: h * 0.08 }
  const rightUnderEye = { x: w * 0.6, y: h * 0.42, width: w * 0.18, height: h * 0.08 }
  
  // Reference zone (cheek - should be brighter than under-eye if dark circles exist)
  const leftCheekRef = { x: w * 0.2, y: h * 0.5, width: w * 0.15, height: h * 0.1 }
  const rightCheekRef = { x: w * 0.65, y: h * 0.5, width: w * 0.15, height: h * 0.1 }
  
  const getZoneBrightness = (zone: { x: number; y: number; width: number; height: number }): number => {
    let sum = 0
    let count = 0
    
    for (let y = Math.floor(zone.y); y < Math.floor(zone.y + zone.height); y += 2) {
      for (let x = Math.floor(zone.x); x < Math.floor(zone.x + zone.width); x += 2) {
        if (x >= 0 && x < w && y >= 0 && y < h) {
          const idx = (y * w + x) * 4
          sum += ((data[idx] ?? 0) + (data[idx + 1] ?? 0) + (data[idx + 2] ?? 0)) / 3
          count++
        }
      }
    }
    return count > 0 ? sum / count : 128
  }
  
  const getZoneVariance = (zone: { x: number; y: number; width: number; height: number }): number => {
    const values: number[] = []
    
    for (let y = Math.floor(zone.y); y < Math.floor(zone.y + zone.height); y += 2) {
      for (let x = Math.floor(zone.x); x < Math.floor(zone.x + zone.width); x += 2) {
        if (x >= 0 && x < w && y >= 0 && y < h) {
          const idx = (y * w + x) * 4
          values.push(((data[idx] ?? 0) + (data[idx + 1] ?? 0) + (data[idx + 2] ?? 0)) / 3)
        }
      }
    }
    
    if (values.length === 0) return 0
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
    return Math.sqrt(variance)
  }
  
  // Calculate dark circles (brightness difference between under-eye and cheek)
  const leftUnderEyeBrightness = getZoneBrightness(leftUnderEye)
  const rightUnderEyeBrightness = getZoneBrightness(rightUnderEye)
  const leftCheekBrightness = getZoneBrightness(leftCheekRef)
  const rightCheekBrightness = getZoneBrightness(rightCheekRef)
  
  const leftDarkness = Math.max(0, leftCheekBrightness - leftUnderEyeBrightness)
  const rightDarkness = Math.max(0, rightCheekBrightness - rightUnderEyeBrightness)
  const avgDarkness = (leftDarkness + rightDarkness) / 2
  
  // Dark circles score (0-100)
  const darkCircles = Math.min(100, avgDarkness * 4)
  
  // Fine lines detection (high variance in under-eye area)
  const leftVariance = getZoneVariance(leftUnderEye)
  const rightVariance = getZoneVariance(rightUnderEye)
  const avgVariance = (leftVariance + rightVariance) / 2
  const fineLines = Math.min(100, avgVariance * 3)
  
  // Puffiness estimation (brightness gradient - lighter below eye = puffiness)
  // This is approximate - real puffiness detection would need depth/3D
  const puffiness = Math.min(100, Math.max(0, (rightUnderEyeBrightness + leftUnderEyeBrightness) / 2 - 100) * 2)
  
  // Overall health score (inverse of problems)
  const healthScore = Math.max(0, 100 - (darkCircles * 0.5 + fineLines * 0.3 + puffiness * 0.2))
  
  return {
    darkCircles: Math.round(darkCircles),
    puffiness: Math.round(puffiness),
    fineLines: Math.round(fineLines),
    healthScore: Math.round(healthScore),
    level: getUnderEyeLevel(healthScore),
  }
}

function getUnderEyeLevel(healthScore: number): UnderEyeAnalysis['level'] {
  if (healthScore >= 80) return 'excellent'
  if (healthScore >= 65) return 'good'
  if (healthScore >= 50) return 'fair'
  if (healthScore >= 35) return 'tired'
  return 'fatigued'
}

export function getUnderEyeLevelLabel(level: UnderEyeAnalysis['level'], locale: string): string {
  const labels: Record<UnderEyeAnalysis['level'], Record<string, string>> = {
    excellent: { en: 'Excellent', ar: 'ممتازة', ru: 'Отличное' },
    good: { en: 'Good', ar: 'جيدة', ru: 'Хорошее' },
    fair: { en: 'Fair', ar: 'مقبولة', ru: 'Удовлетворительное' },
    tired: { en: 'Tired', ar: 'متعبة', ru: 'Уставшее' },
    fatigued: { en: 'Fatigued', ar: 'مرهقة', ru: 'Утомлённое' },
  }
  return labels[level]?.[locale] ?? labels[level]?.en ?? level
}

// ============================================================
// P2-3: Skin Firmness/Elasticity Analysis
// ============================================================

export interface FirmnessAnalysis {
  // Overall firmness score (100 = very firm, 0 = saggy)
  firmness: number
  // Elasticity estimate (100 = elastic, 0 = inelastic)
  elasticity: number
  // Sagging indicators
  sagging: {
    jawline: number
    cheeks: number
    underEye: number
    forehead: number
  }
  // Classification
  level: 'excellent' | 'good' | 'moderate' | 'reduced' | 'significant-loss'
}

/**
 * Estimate skin firmness and elasticity
 * Uses texture smoothness, edge definition, and brightness gradients
 */
export function analyzeFirmness(
  imageData: ImageData,
  width?: number,
  height?: number
): FirmnessAnalysis {
  const data = imageData.data
  const w = width || imageData.width
  const h = height || imageData.height
  
  // Analyze jawline definition (sharper = firmer)
  const jawlineLeft = { x: w * 0.1, y: h * 0.65, width: w * 0.15, height: h * 0.15 }
  const jawlineRight = { x: w * 0.75, y: h * 0.65, width: w * 0.15, height: h * 0.15 }
  
  const getEdgeStrength = (zone: { x: number; y: number; width: number; height: number }): number => {
    let edgeSum = 0
    let count = 0
    
    for (let y = Math.floor(zone.y) + 1; y < Math.floor(zone.y + zone.height) - 1; y += 2) {
      for (let x = Math.floor(zone.x) + 1; x < Math.floor(zone.x + zone.width) - 1; x += 2) {
        if (x >= 0 && x < w && y >= 0 && y < h) {
          const aboveIdx = ((y - 1) * w + x) * 4
          const belowIdx = ((y + 1) * w + x) * 4
          
          const above = ((data[aboveIdx] ?? 0) + (data[aboveIdx + 1] ?? 0) + (data[aboveIdx + 2] ?? 0)) / 3
          const below = ((data[belowIdx] ?? 0) + (data[belowIdx + 1] ?? 0) + (data[belowIdx + 2] ?? 0)) / 3
          
          edgeSum += Math.abs(above - below)
          count++
        }
      }
    }
    
    return count > 0 ? edgeSum / count : 0
  }
  
  const getTextureScore = (zone: { x: number; y: number; width: number; height: number }): number => {
    let variance = 0
    const values: number[] = []
    
    for (let y = Math.floor(zone.y); y < Math.floor(zone.y + zone.height); y += 2) {
      for (let x = Math.floor(zone.x); x < Math.floor(zone.x + zone.width); x += 2) {
        if (x >= 0 && x < w && y >= 0 && y < h) {
          const idx = (y * w + x) * 4
          values.push(((data[idx] ?? 0) + (data[idx + 1] ?? 0) + (data[idx + 2] ?? 0)) / 3)
        }
      }
    }
    
    if (values.length > 0) {
      const mean = values.reduce((a, b) => a + b, 0) / values.length
      variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
    }
    
    // Lower variance = smoother skin = more firm appearance
    return Math.max(0, 100 - Math.sqrt(variance) * 5)
  }
  
  // Jawline edge definition
  const jawlineScore = (getEdgeStrength(jawlineLeft) + getEdgeStrength(jawlineRight)) / 2
  const jawlineFirmness = Math.min(100, jawlineScore * 3)
  
  // Cheek firmness (texture smoothness)
  const cheekLeft = { x: w * 0.2, y: h * 0.4, width: w * 0.15, height: h * 0.15 }
  const cheekRight = { x: w * 0.65, y: h * 0.4, width: w * 0.15, height: h * 0.15 }
  const cheekFirmness = (getTextureScore(cheekLeft) + getTextureScore(cheekRight)) / 2
  
  // Under-eye area
  const underEyeZone = { x: w * 0.25, y: h * 0.4, width: w * 0.5, height: h * 0.1 }
  const underEyeFirmness = getTextureScore(underEyeZone)
  
  // Forehead
  const foreheadZone = { x: w * 0.25, y: h * 0.1, width: w * 0.5, height: h * 0.15 }
  const foreheadFirmness = getTextureScore(foreheadZone)
  
  // Calculate overall firmness
  const firmness = Math.round(
    jawlineFirmness * 0.3 +
    cheekFirmness * 0.35 +
    underEyeFirmness * 0.2 +
    foreheadFirmness * 0.15
  )
  
  // Elasticity is related but separate - smoother gradients indicate better elasticity
  const elasticity = Math.round((firmness + cheekFirmness) / 2)
  
  return {
    firmness,
    elasticity,
    sagging: {
      jawline: Math.round(100 - jawlineFirmness),
      cheeks: Math.round(100 - cheekFirmness),
      underEye: Math.round(100 - underEyeFirmness),
      forehead: Math.round(100 - foreheadFirmness),
    },
    level: getFirmnessLevel(firmness),
  }
}

function getFirmnessLevel(firmness: number): FirmnessAnalysis['level'] {
  if (firmness >= 80) return 'excellent'
  if (firmness >= 65) return 'good'
  if (firmness >= 50) return 'moderate'
  if (firmness >= 35) return 'reduced'
  return 'significant-loss'
}

export function getFirmnessLevelLabel(level: FirmnessAnalysis['level'], locale: string): string {
  const labels: Record<FirmnessAnalysis['level'], Record<string, string>> = {
    'excellent': { en: 'Excellent', ar: 'ممتازة', ru: 'Отличная' },
    'good': { en: 'Good', ar: 'جيدة', ru: 'Хорошая' },
    'moderate': { en: 'Moderate', ar: 'متوسطة', ru: 'Умеренная' },
    'reduced': { en: 'Reduced', ar: 'منخفضة', ru: 'Сниженная' },
    'significant-loss': { en: 'Needs Care', ar: 'تحتاج عناية', ru: 'Требует ухода' },
  }
  return labels[level]?.[locale] ?? labels[level]?.en ?? level
}

// ============================================================
// P2-4: Sun Damage Assessment
// ============================================================

export interface SunDamageAnalysis {
  // Overall sun damage score (0 = none, 100 = severe)
  damage: number
  // UV damage indicators
  indicators: {
    frecklingIntensity: number  // Freckling density
    pigmentIrregularity: number // Uneven pigmentation
    sunSpots: number            // Distinct sun spots
    photoaging: number          // General photo-aging signs
  }
  // Classification
  level: 'minimal' | 'mild' | 'moderate' | 'significant' | 'severe'
  // Estimated UV exposure history
  exposureHistory: 'protected' | 'occasional' | 'regular' | 'frequent' | 'excessive'
}

/**
 * Assess sun damage and UV exposure signs
 */
export function analyzeSunDamage(
  imageData: ImageData,
  width?: number,
  height?: number
): SunDamageAnalysis {
  const data = imageData.data
  const w = width || imageData.width
  const h = height || imageData.height
  
  // Analyze sun-exposed areas
  const foreheadZone = { x: w * 0.25, y: h * 0.1, width: w * 0.5, height: h * 0.15 }
  const cheekLeft = { x: w * 0.15, y: h * 0.35, width: w * 0.2, height: h * 0.2 }
  const cheekRight = { x: w * 0.65, y: h * 0.35, width: w * 0.2, height: h * 0.2 }
  const noseZone = { x: w * 0.4, y: h * 0.35, width: w * 0.2, height: h * 0.2 }
  
  const analyzeZoneForSunDamage = (zone: { x: number; y: number; width: number; height: number }) => {
    let darkSpots = 0
    let brightSpots = 0
    let totalPixels = 0
    const luminanceValues: number[] = []
    
    for (let y = Math.floor(zone.y); y < Math.floor(zone.y + zone.height); y += 2) {
      for (let x = Math.floor(zone.x); x < Math.floor(zone.x + zone.width); x += 2) {
        if (x >= 0 && x < w && y >= 0 && y < h) {
          const idx = (y * w + x) * 4
          const r = data[idx] ?? 0, g = data[idx + 1] ?? 0, b = data[idx + 2] ?? 0
          const luminance = (r * 0.299 + g * 0.587 + b * 0.114)
          luminanceValues.push(luminance)
          totalPixels++
        }
      }
    }
    
    if (luminanceValues.length === 0) {
      return { darkSpots: 0, variation: 0, freckles: 0 }
    }
    
    const mean = luminanceValues.reduce((a, b) => a + b, 0) / luminanceValues.length
    const variance = luminanceValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / luminanceValues.length
    
    // Count dark spots (potential sun spots) and light spots (potential freckles)
    for (const lum of luminanceValues) {
      if (lum < mean - 20) darkSpots++
      if (lum > mean + 15 && lum < mean + 35) brightSpots++ // Freckles are slightly lighter
    }
    
    return {
      darkSpots: (darkSpots / totalPixels) * 100,
      variation: Math.sqrt(variance),
      freckles: (brightSpots / totalPixels) * 100,
    }
  }
  
  const foreheadAnalysis = analyzeZoneForSunDamage(foreheadZone)
  const leftCheekAnalysis = analyzeZoneForSunDamage(cheekLeft)
  const rightCheekAnalysis = analyzeZoneForSunDamage(cheekRight)
  const noseAnalysis = analyzeZoneForSunDamage(noseZone)
  
  // Calculate indicators
  const frecklingIntensity = Math.min(100, (
    foreheadAnalysis.freckles + noseAnalysis.freckles + 
    (leftCheekAnalysis.freckles + rightCheekAnalysis.freckles) / 2
  ) * 3)
  
  const pigmentIrregularity = Math.min(100, (
    foreheadAnalysis.variation + noseAnalysis.variation +
    (leftCheekAnalysis.variation + rightCheekAnalysis.variation) / 2
  ) * 2)
  
  const sunSpots = Math.min(100, (
    foreheadAnalysis.darkSpots + noseAnalysis.darkSpots +
    (leftCheekAnalysis.darkSpots + rightCheekAnalysis.darkSpots) / 2
  ) * 4)
  
  // Photoaging combines multiple factors
  const photoaging = Math.min(100, (pigmentIrregularity * 0.4 + sunSpots * 0.4 + frecklingIntensity * 0.2))
  
  // Overall damage score
  const damage = Math.round(
    frecklingIntensity * 0.2 +
    pigmentIrregularity * 0.3 +
    sunSpots * 0.3 +
    photoaging * 0.2
  )
  
  return {
    damage,
    indicators: {
      frecklingIntensity: Math.round(frecklingIntensity),
      pigmentIrregularity: Math.round(pigmentIrregularity),
      sunSpots: Math.round(sunSpots),
      photoaging: Math.round(photoaging),
    },
    level: getSunDamageLevel(damage),
    exposureHistory: getExposureHistory(damage),
  }
}

function getSunDamageLevel(damage: number): SunDamageAnalysis['level'] {
  if (damage < 15) return 'minimal'
  if (damage < 30) return 'mild'
  if (damage < 50) return 'moderate'
  if (damage < 70) return 'significant'
  return 'severe'
}

function getExposureHistory(damage: number): SunDamageAnalysis['exposureHistory'] {
  if (damage < 15) return 'protected'
  if (damage < 30) return 'occasional'
  if (damage < 50) return 'regular'
  if (damage < 70) return 'frequent'
  return 'excessive'
}

export function getSunDamageLevelLabel(level: SunDamageAnalysis['level'], locale: string): string {
  const labels: Record<SunDamageAnalysis['level'], Record<string, string>> = {
    minimal: { en: 'Minimal', ar: 'ضئيل', ru: 'Минимальный' },
    mild: { en: 'Mild', ar: 'خفيف', ru: 'Лёгкий' },
    moderate: { en: 'Moderate', ar: 'متوسط', ru: 'Умеренный' },
    significant: { en: 'Significant', ar: 'ملحوظ', ru: 'Значительный' },
    severe: { en: 'Severe', ar: 'شديد', ru: 'Сильный' },
  }
  return labels[level]?.[locale] ?? labels[level]?.en ?? level
}

// ============================================================
// P2-5: Lip Condition Analysis
// ============================================================

export interface LipAnalysis {
  // Overall lip health (100 = healthy, 0 = poor)
  health: number
  // Individual metrics
  hydration: number    // 100 = well hydrated, 0 = very dry
  color: number        // 100 = healthy pink, lower = pale or discolored
  texture: number      // 100 = smooth, 0 = rough/cracked
  // Classification
  level: 'healthy' | 'good' | 'dry' | 'chapped' | 'needs-care'
  // Detected issues
  issues: ('dryness' | 'cracking' | 'pale' | 'discoloration')[]
}

/**
 * Analyze lip condition
 */
export function analyzeLips(
  imageData: ImageData,
  width?: number,
  height?: number
): LipAnalysis {
  const data = imageData.data
  const w = width || imageData.width
  const h = height || imageData.height
  
  // Lip zone (approximate)
  const lipZone = { x: w * 0.35, y: h * 0.58, width: w * 0.3, height: h * 0.1 }
  
  let rSum = 0, gSum = 0, bSum = 0
  let count = 0
  const values: number[] = []
  
  for (let y = Math.floor(lipZone.y); y < Math.floor(lipZone.y + lipZone.height); y++) {
    for (let x = Math.floor(lipZone.x); x < Math.floor(lipZone.x + lipZone.width); x++) {
      if (x >= 0 && x < w && y >= 0 && y < h) {
        const idx = (y * w + x) * 4
        rSum += data[idx] ?? 0
        gSum += data[idx + 1] ?? 0
        bSum += data[idx + 2] ?? 0
        values.push(((data[idx] ?? 0) + (data[idx + 1] ?? 0) + (data[idx + 2] ?? 0)) / 3)
        count++
      }
    }
  }
  
  if (count === 0) {
    return {
      health: 50,
      hydration: 50,
      color: 50,
      texture: 50,
      level: 'good',
      issues: [],
    }
  }
  
  const avgR = rSum / count
  const avgG = gSum / count
  const avgB = bSum / count
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  
  // Color health: Healthy lips have more red, lower blue
  // Pink-red ratio indicates healthy blood flow
  const pinkness = avgR - (avgG + avgB) / 2
  const color = Math.min(100, Math.max(0, pinkness * 2 + 50))
  
  // Texture: High variance = rough/cracked
  const texture = Math.max(0, 100 - Math.sqrt(variance) * 3)
  
  // Hydration: Related to both color (pale = dehydrated) and texture
  const hydration = Math.round((color * 0.4 + texture * 0.6))
  
  // Detect issues
  const issues: LipAnalysis['issues'] = []
  if (texture < 50) issues.push('cracking')
  if (hydration < 40) issues.push('dryness')
  if (color < 40) issues.push('pale')
  if (avgB > avgR) issues.push('discoloration')
  
  // Overall health
  const health = Math.round((hydration + color + texture) / 3)
  
  return {
    health,
    hydration,
    color,
    texture,
    level: getLipLevel(health),
    issues,
  }
}

function getLipLevel(health: number): LipAnalysis['level'] {
  if (health >= 80) return 'healthy'
  if (health >= 65) return 'good'
  if (health >= 50) return 'dry'
  if (health >= 35) return 'chapped'
  return 'needs-care'
}

export function getLipLevelLabel(level: LipAnalysis['level'], locale: string): string {
  const labels: Record<LipAnalysis['level'], Record<string, string>> = {
    healthy: { en: 'Healthy', ar: 'صحية', ru: 'Здоровые' },
    good: { en: 'Good', ar: 'جيدة', ru: 'Хорошие' },
    dry: { en: 'Dry', ar: 'جافة', ru: 'Сухие' },
    chapped: { en: 'Chapped', ar: 'متشققة', ru: 'Потрескавшиеся' },
    'needs-care': { en: 'Needs Care', ar: 'تحتاج عناية', ru: 'Требуют ухода' },
  }
  return labels[level]?.[locale] ?? labels[level]?.en ?? level
}

// ============================================================
// P2-6: Eyebrow Health Analysis
// ============================================================

export interface EyebrowAnalysis {
  // Overall eyebrow health (100 = full/healthy, 0 = sparse)
  health: number
  // Density score (100 = thick, 0 = sparse)
  density: number
  // Symmetry score (100 = symmetric, 0 = asymmetric)
  symmetry: number
  // Shape definition (100 = well-defined, 0 = undefined)
  definition: number
  // Classification
  level: 'full' | 'normal' | 'thin' | 'sparse' | 'very-sparse'
}

/**
 * Analyze eyebrow health and symmetry
 */
export function analyzeEyebrows(
  imageData: ImageData,
  width?: number,
  height?: number
): EyebrowAnalysis {
  const data = imageData.data
  const w = width || imageData.width
  const h = height || imageData.height
  
  // Eyebrow zones
  const leftBrow = { x: w * 0.2, y: h * 0.22, width: w * 0.18, height: h * 0.06 }
  const rightBrow = { x: w * 0.62, y: h * 0.22, width: w * 0.18, height: h * 0.06 }
  
  // Reference: Forehead skin (should be lighter than eyebrows)
  // Note: foreheadRef reserved for future enhanced eyebrow analysis
  const _foreheadRef = { x: w * 0.35, y: h * 0.12, width: w * 0.3, height: h * 0.06 }
  void _foreheadRef // Suppress unused warning
  
  const analyzeBrow = (zone: { x: number; y: number; width: number; height: number }) => {
    let darkPixels = 0
    let totalPixels = 0
    let edgeCount = 0
    
    for (let y = Math.floor(zone.y); y < Math.floor(zone.y + zone.height); y++) {
      for (let x = Math.floor(zone.x); x < Math.floor(zone.x + zone.width); x++) {
        if (x >= 0 && x < w && y >= 0 && y < h) {
          const idx = (y * w + x) * 4
          const brightness = ((data[idx] ?? 0) + (data[idx + 1] ?? 0) + (data[idx + 2] ?? 0)) / 3
          
          // Eyebrow hairs are typically dark
          if (brightness < 100) darkPixels++
          totalPixels++
          
          // Check for edges (hair definition)
          if (x > Math.floor(zone.x) && y > Math.floor(zone.y)) {
            const leftIdx = (y * w + (x - 1)) * 4
            const leftBrightness = ((data[leftIdx] ?? 0) + (data[leftIdx + 1] ?? 0) + (data[leftIdx + 2] ?? 0)) / 3
            if (Math.abs(brightness - leftBrightness) > 15) edgeCount++
          }
        }
      }
    }
    
    return {
      density: totalPixels > 0 ? (darkPixels / totalPixels) * 100 : 0,
      definition: totalPixels > 0 ? Math.min(100, (edgeCount / totalPixels) * 200) : 0,
    }
  }
  
  const leftAnalysis = analyzeBrow(leftBrow)
  const rightAnalysis = analyzeBrow(rightBrow)
  
  // Calculate symmetry (how similar are left and right)
  const densityDiff = Math.abs(leftAnalysis.density - rightAnalysis.density)
  const definitionDiff = Math.abs(leftAnalysis.definition - rightAnalysis.definition)
  const symmetry = Math.max(0, 100 - (densityDiff + definitionDiff) / 2)
  
  // Average density and definition
  const density = (leftAnalysis.density + rightAnalysis.density) / 2
  const definition = (leftAnalysis.definition + rightAnalysis.definition) / 2
  
  // Overall health
  const health = Math.round(density * 0.5 + definition * 0.3 + symmetry * 0.2)
  
  return {
    health,
    density: Math.round(density),
    symmetry: Math.round(symmetry),
    definition: Math.round(definition),
    level: getEyebrowLevel(density),
  }
}

function getEyebrowLevel(density: number): EyebrowAnalysis['level'] {
  if (density >= 60) return 'full'
  if (density >= 45) return 'normal'
  if (density >= 30) return 'thin'
  if (density >= 15) return 'sparse'
  return 'very-sparse'
}

export function getEyebrowLevelLabel(level: EyebrowAnalysis['level'], locale: string): string {
  const labels: Record<EyebrowAnalysis['level'], Record<string, string>> = {
    full: { en: 'Full', ar: 'كثيفة', ru: 'Густые' },
    normal: { en: 'Normal', ar: 'عادية', ru: 'Нормальные' },
    thin: { en: 'Thin', ar: 'رفيعة', ru: 'Тонкие' },
    sparse: { en: 'Sparse', ar: 'متفرقة', ru: 'Редкие' },
    'very-sparse': { en: 'Very Sparse', ar: 'متفرقة جداً', ru: 'Очень редкие' },
  }
  return labels[level]?.[locale] ?? labels[level]?.en ?? level
}

// ============================================================
// P2-7: Advanced Age Estimation
// ============================================================

export interface AgeEstimation {
  // Estimated age
  estimatedAge: number
  // Confidence range (min-max)
  ageRange: { min: number; max: number }
  // Contributing factors
  factors: {
    skinTexture: number      // Smoothness contributes to younger appearance
    wrinkleScore: number     // More wrinkles = older
    pigmentation: number     // Even tone = younger
    firmness: number         // Firmer skin = younger
    eyeArea: number          // Under-eye condition
    poreSize: number         // Larger pores correlate with age
  }
  // Age group classification
  ageGroup: 'teen' | 'young-adult' | 'adult' | 'middle-age' | 'mature'
}

/**
 * Estimate age using multiple facial indicators
 */
export function estimateAge(
  imageData: ImageData,
  existingAnalyses?: {
    wrinkles?: { severity: number }
    firmness?: { firmness: number }
    underEye?: { healthScore: number }
    pores?: { visibility: number }
    pigmentation?: { unevenness: number }
  }
): AgeEstimation {
  const data = imageData.data
  const w = imageData.width
  const h = imageData.height
  
  // Get texture smoothness from cheek area
  const cheekZone = { x: w * 0.25, y: h * 0.4, width: w * 0.2, height: h * 0.15 }
  let textureVariance = 0
  const values: number[] = []
  
  for (let y = Math.floor(cheekZone.y); y < Math.floor(cheekZone.y + cheekZone.height); y += 2) {
    for (let x = Math.floor(cheekZone.x); x < Math.floor(cheekZone.x + cheekZone.width); x += 2) {
      if (x >= 0 && x < w && y >= 0 && y < h) {
        const idx = (y * w + x) * 4
        values.push(((data[idx] ?? 0) + (data[idx + 1] ?? 0) + (data[idx + 2] ?? 0)) / 3)
      }
    }
  }
  
  if (values.length > 0) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    textureVariance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  }
  
  const skinTexture = Math.max(0, 100 - Math.sqrt(textureVariance) * 4)
  
  // Use existing analyses or defaults
  const wrinkleScore = existingAnalyses?.wrinkles?.severity ?? 30
  const firmness = existingAnalyses?.firmness?.firmness ?? 70
  const eyeArea = existingAnalyses?.underEye?.healthScore ?? 70
  const poreSize = existingAnalyses?.pores?.visibility ?? 30
  const pigmentation = 100 - (existingAnalyses?.pigmentation?.unevenness ?? 20)
  
  // Calculate age indicators (higher = older)
  const ageIndicators = {
    skinTexture: 100 - skinTexture,       // Rougher = older
    wrinkleScore,                          // More wrinkles = older
    pigmentation: 100 - pigmentation,      // Uneven = older
    firmness: 100 - firmness,              // Less firm = older
    eyeArea: 100 - eyeArea,                // Worse under-eye = older
    poreSize,                              // Larger pores = older
  }
  
  // Weighted age calculation
  // Base age 25, each indicator can add up to ~8 years
  const ageContribution = (
    ageIndicators.wrinkleScore * 0.30 +   // Wrinkles strongest indicator
    ageIndicators.firmness * 0.20 +
    ageIndicators.eyeArea * 0.15 +
    ageIndicators.skinTexture * 0.15 +
    ageIndicators.pigmentation * 0.10 +
    ageIndicators.poreSize * 0.10
  )
  
  // Calculate estimated age (range: ~18 to ~65)
  const baseAge = 18
  const estimatedAge = Math.round(baseAge + (ageContribution / 100) * 47)
  
  // Confidence range (±5 years typically)
  const confidence = 5
  const ageRange = {
    min: Math.max(16, estimatedAge - confidence),
    max: Math.min(75, estimatedAge + confidence),
  }
  
  return {
    estimatedAge,
    ageRange,
    factors: {
      skinTexture: Math.round(skinTexture),
      wrinkleScore: Math.round(wrinkleScore),
      pigmentation: Math.round(pigmentation),
      firmness: Math.round(firmness),
      eyeArea: Math.round(eyeArea),
      poreSize: Math.round(poreSize),
    },
    ageGroup: getAgeGroup(estimatedAge),
  }
}

function getAgeGroup(age: number): AgeEstimation['ageGroup'] {
  if (age < 20) return 'teen'
  if (age < 30) return 'young-adult'
  if (age < 45) return 'adult'
  if (age < 60) return 'middle-age'
  return 'mature'
}

export function getAgeGroupLabel(ageGroup: AgeEstimation['ageGroup'], locale: string): string {
  const labels: Record<AgeEstimation['ageGroup'], Record<string, string>> = {
    teen: { en: 'Teen', ar: 'مراهق', ru: 'Подросток' },
    'young-adult': { en: 'Young Adult', ar: 'شاب', ru: 'Молодой' },
    adult: { en: 'Adult', ar: 'بالغ', ru: 'Взрослый' },
    'middle-age': { en: 'Middle Age', ar: 'متوسط العمر', ru: 'Средний возраст' },
    mature: { en: 'Mature', ar: 'ناضج', ru: 'Зрелый' },
  }
  return labels[ageGroup]?.[locale] ?? labels[ageGroup]?.en ?? ageGroup
}

// ============================================================
// P2-8: Fitzpatrick Skin Type Classification
// ============================================================

export interface FitzpatrickAnalysis {
  // Fitzpatrick type (I-VI)
  type: 1 | 2 | 3 | 4 | 5 | 6
  // Type name
  typeName: string
  // Description
  description: string
  // Skin characteristics
  characteristics: {
    burnTendency: 'always' | 'usually' | 'sometimes' | 'rarely' | 'never'
    tanTendency: 'never' | 'minimal' | 'gradual' | 'moderate' | 'easy' | 'very-easy'
  }
  // Confidence (0-100)
  confidence: number
  // Average skin luminance used for classification
  averageLuminance: number
}

/**
 * Classify skin using Fitzpatrick scale (I-VI)
 */
export function analyzeFitzpatrick(
  imageData: ImageData,
  width?: number,
  height?: number
): FitzpatrickAnalysis {
  const data = imageData.data
  const w = width || imageData.width
  const h = height || imageData.height
  
  // Sample from multiple facial zones to get accurate skin color
  const zones = [
    { x: w * 0.25, y: h * 0.15, width: w * 0.2, height: h * 0.1 },  // Forehead
    { x: w * 0.2, y: h * 0.4, width: w * 0.15, height: h * 0.15 },  // Left cheek
    { x: w * 0.65, y: h * 0.4, width: w * 0.15, height: h * 0.15 }, // Right cheek
  ]
  
  let totalR = 0, totalG = 0, totalB = 0, totalCount = 0
  
  for (const zone of zones) {
    for (let y = Math.floor(zone.y); y < Math.floor(zone.y + zone.height); y += 2) {
      for (let x = Math.floor(zone.x); x < Math.floor(zone.x + zone.width); x += 2) {
        if (x >= 0 && x < w && y >= 0 && y < h) {
          const idx = (y * w + x) * 4
          totalR += data[idx] ?? 0
          totalG += data[idx + 1] ?? 0
          totalB += data[idx + 2] ?? 0
          totalCount++
        }
      }
    }
  }
  
  if (totalCount === 0) {
    return {
      type: 3,
      typeName: 'Type III',
      description: 'Medium',
      characteristics: {
        burnTendency: 'sometimes',
        tanTendency: 'gradual',
      },
      confidence: 50,
      averageLuminance: 128,
    }
  }
  
  const avgR = totalR / totalCount
  const avgG = totalG / totalCount
  const avgB = totalB / totalCount
  
  // Calculate luminance (perceived brightness)
  const luminance = (avgR * 0.299 + avgG * 0.587 + avgB * 0.114)
  
  // Individual Typology Angle (ITA) - commonly used for Fitzpatrick
  // ITA = [arctan((L* - 50) / b*)] × (180 / π)
  // Simplified version using luminance
  
  // Classify based on luminance ranges
  let type: FitzpatrickAnalysis['type']
  let typeName: string
  let description: string
  let burnTendency: FitzpatrickAnalysis['characteristics']['burnTendency']
  let tanTendency: FitzpatrickAnalysis['characteristics']['tanTendency']
  
  if (luminance > 200) {
    type = 1
    typeName = 'Type I'
    description = 'Very Fair'
    burnTendency = 'always'
    tanTendency = 'never'
  } else if (luminance > 175) {
    type = 2
    typeName = 'Type II'
    description = 'Fair'
    burnTendency = 'usually'
    tanTendency = 'minimal'
  } else if (luminance > 150) {
    type = 3
    typeName = 'Type III'
    description = 'Medium'
    burnTendency = 'sometimes'
    tanTendency = 'gradual'
  } else if (luminance > 120) {
    type = 4
    typeName = 'Type IV'
    description = 'Olive'
    burnTendency = 'rarely'
    tanTendency = 'moderate'
  } else if (luminance > 85) {
    type = 5
    typeName = 'Type V'
    description = 'Brown'
    burnTendency = 'rarely'
    tanTendency = 'easy'
  } else {
    type = 6
    typeName = 'Type VI'
    description = 'Dark'
    burnTendency = 'never'
    tanTendency = 'very-easy'
  }
  
  // Confidence based on how clearly the luminance falls into a category
  const categoryRanges = [200, 175, 150, 120, 85, 0]
  const closestBoundary = categoryRanges.reduce((closest, boundary) => 
    Math.abs(luminance - boundary) < Math.abs(luminance - closest) ? boundary : closest
  )
  const distanceFromBoundary = Math.abs(luminance - closestBoundary)
  const confidence = Math.min(100, 60 + distanceFromBoundary)
  
  return {
    type,
    typeName,
    description,
    characteristics: {
      burnTendency,
      tanTendency,
    },
    confidence: Math.round(confidence),
    averageLuminance: Math.round(luminance),
  }
}

export function getFitzpatrickLabel(type: FitzpatrickAnalysis['type'], locale: string): string {
  const labels: Record<FitzpatrickAnalysis['type'], Record<string, string>> = {
    1: { en: 'Type I - Very Fair', ar: 'النوع الأول - فاتح جداً', ru: 'Тип I - Очень светлая' },
    2: { en: 'Type II - Fair', ar: 'النوع الثاني - فاتح', ru: 'Тип II - Светлая' },
    3: { en: 'Type III - Medium', ar: 'النوع الثالث - متوسط', ru: 'Тип III - Средняя' },
    4: { en: 'Type IV - Olive', ar: 'النوع الرابع - زيتوني', ru: 'Тип IV - Оливковая' },
    5: { en: 'Type V - Brown', ar: 'النوع الخامس - بني', ru: 'Тип V - Коричневая' },
    6: { en: 'Type VI - Dark', ar: 'النوع السادس - داكن', ru: 'Тип VI - Тёмная' },
  }
  return labels[type]?.[locale] ?? labels[type]?.en ?? `Type ${type}`
}
