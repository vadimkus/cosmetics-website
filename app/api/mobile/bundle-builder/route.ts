/**
 * Mobile Bundle Builder API - GET /api/mobile/bundle-builder
 * Returns eligible products grouped by routine step for the native bundle builder.
 * Also returns discount tiers, step definitions, and pricing rules.
 *
 * Headers:
 *   x-api-key: required
 *   x-locale: 'en' | 'ar' | 'ru' (optional, default: 'en')
 *   x-user-id: userId (optional, for user-specific pricing)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { errorLog } from '@/lib/logger'
import { buildPricingContract } from '@/lib/pricingContract'
import { Product } from '@/types'
import { localizeProductImage } from '@/lib/localizedProductImages'

type ProductTranslation = { name?: string; description?: string } | null

// Routine steps for the bundle builder
const ROUTINE_STEPS = [
  { id: 'cleanser', name: 'Cleanser', nameAr: 'غسول', nameRu: 'Очищение', required: true, icon: '🧴', category: 'Cleanser', description: 'Start with a clean slate', descriptionAr: 'ابدأ ببشرة نظيفة', descriptionRu: 'Начните с чистого лица' },
  { id: 'peeling', name: 'Peeling', nameAr: 'تقشير', nameRu: 'Пилинг', required: false, icon: '✨', category: 'Peeling', description: 'Exfoliate for radiance', descriptionAr: 'قشّر للإشراق', descriptionRu: 'Эксфолиация для сияния' },
  { id: 'toner', name: 'Toner / Mist', nameAr: 'تونر / رذاذ', nameRu: 'Тоник / Мист', required: false, icon: '💧', category: 'Toner/Mist', description: 'Balance and hydrate', descriptionAr: 'توازن وترطيب', descriptionRu: 'Баланс и увлажнение' },
  { id: 'serum', name: 'Serum', nameAr: 'سيروم', nameRu: 'Сыворотка', required: true, icon: '💎', category: 'Serum', description: 'Target your concerns', descriptionAr: 'استهدف مشاكل بشرتك', descriptionRu: 'Решение проблем кожи' },
  { id: 'cream', name: 'Cream', nameAr: 'كريم', nameRu: 'Крем', required: true, icon: '🤍', category: 'Cream', description: 'Lock in moisture', descriptionAr: 'احبس الرطوبة', descriptionRu: 'Удерживайте влагу' },
  { id: 'eye-care', name: 'Eye Care', nameAr: 'العناية بالعين', nameRu: 'Уход за глазами', required: false, icon: '👁️', category: 'Eye care', description: 'Protect delicate skin', descriptionAr: 'احمِ البشرة الحساسة', descriptionRu: 'Защита нежной кожи' },
  { id: 'mask', name: 'Mask', nameAr: 'ماسك', nameRu: 'Маска', required: false, icon: '🧖', category: 'Mask', description: 'Weekly treatment', descriptionAr: 'علاج أسبوعي', descriptionRu: 'Еженедельный уход' },
  { id: 'sun', name: 'Sun Protection', nameAr: 'الحماية من الشمس', nameRu: 'Защита от солнца', required: false, icon: '☀️', category: 'Sun', description: 'Shield from UV', descriptionAr: 'حماية من الأشعة', descriptionRu: 'Защита от УФ' },
]

// Discount tiers
const DISCOUNT_TIERS = [
  { minItems: 2, discount: 5 },
  { minItems: 3, discount: 10 },
  { minItems: 4, discount: 15 },
  { minItems: 5, discount: 20 },
]

// Products excluded from bundle builder by name (none currently - SRS was
// re-admitted 2026-07-06; category-level exclusions in the query still apply)
const EXCLUDED_PRODUCTS: string[] = []

// Category matching for each step
function matchesStep(category: string, stepCategory: string): boolean {
  const cat = category.toLowerCase()
  const step = stepCategory.toLowerCase()
  
  // Special mappings
  if (step === 'toner/mist') return cat.includes('toner') || cat.includes('mist')
  if (step === 'eye care') return cat.includes('eye')
  // Bio Meso PDRN ampoules are serum-type treatments
  if (step === 'serum') return cat.includes('serum') || cat.includes('bio meso')
  
  return cat.includes(step)
}

export async function GET(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.MOBILE_APP_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locale = request.headers.get('x-locale') || 'en'

    // Fetch all eligible products
    const products = await prisma.product.findMany({
      where: {
        isHidden: false,
        inStock: true,
        isPriceOnRequest: false,
        category: { notIn: ['Beauty Boxes', 'PRO Solution'] },
      },
      select: {
        id: true,
        productNumber: true,
        name: true,
        nameRu: true,
        nameAr: true,
        price: true,
        description: true,
        descriptionRu: true,
        descriptionAr: true,
        image: true,
        images: true,
        category: true,
        size: true,
        noDiscount: true,
        rating: true,
        variants: {
          select: {
            id: true,
            size: true,
            color: true,
            price: true,
            available: true,
            isDefault: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    // Filter out excluded products
    const eligible = products.filter(p =>
      !EXCLUDED_PRODUCTS.some(ex => p.name.toUpperCase().includes(ex.toUpperCase()))
    )

    // Build localized product data
    const localizeProduct = (p: typeof eligible[0]) => {
      let name = p.name
      let description = p.description || ''

      if (locale === 'ar') {
        const t: ProductTranslation = getProductTranslations(p.id)
        if (t) { name = t.name || name; description = t.description || description }
        else if (p.nameAr) name = p.nameAr
      } else if (locale === 'ru') {
        const t: ProductTranslation = getProductTranslationsRu(p.id)
        if (t) { name = t.name || name; description = t.description || description }
        else if (p.nameRu) name = p.nameRu
      }

      // Bundle builder: NO user/VIP discount - only bundle tier discount applies.
      // Display price = retail price (bundle discount is applied at checkout based on item count).
      const displayPrice = p.price
      const variants = p.variants
        .filter(v => v.available && (v.size || v.color))
        .map(v => ({
          id: v.id,
          size: v.size,
          color: v.color,
          price: v.price,
          available: v.available,
          isDefault: v.isDefault,
        }))
      const contractProduct = {
        id: p.id,
        productNumber: p.productNumber,
        name: p.name,
        nameRu: p.nameRu,
        nameAr: p.nameAr,
        price: p.price,
        description: p.description || '',
        descriptionRu: p.descriptionRu,
        descriptionAr: p.descriptionAr,
        image: p.image || '',
        images: p.images,
        category: p.category,
        size: p.size,
        noDiscount: p.noDiscount,
        rating: p.rating,
        inStock: true,
        variants,
      } as Product

      return {
        id: p.id,
        productNumber: p.productNumber,
        name,
        description,
        // Localized first, then made absolute: slides carry their claims as printed text,
        // so a translated set is served where one exists.
        image: p.image
          ? (p.image.startsWith('http') ? p.image : `https://genosys.ae${localizeProductImage(p.image, locale)}`)
          : null,
        images: p.images
          ? (JSON.parse(p.images) as string[]).map(img =>
              img.startsWith('http') ? img : `https://genosys.ae${localizeProductImage(img, locale)}`
            )
          : [],
        category: p.category,
        size: p.size,
        price: p.price,
        displayPrice,
        originalPrice: null,
        userDiscountPct: null,
        noDiscount: p.noDiscount,
        rating: p.rating,
        variants: variants.map(v => ({
          id: v.id,
          size: v.size,
          color: v.color,
          price: v.price,
          isDefault: v.isDefault,
        })),
        pricing: buildPricingContract(contractProduct, null),
      }
    }

    // Group products by step
    const steps = ROUTINE_STEPS.map(step => {
      const stepProducts = eligible
        .filter(p => matchesStep(p.category, step.category))
        .map(localizeProduct)

      return {
        id: step.id,
        name: locale === 'ar' ? step.nameAr : locale === 'ru' ? step.nameRu : step.name,
        description: locale === 'ar' ? step.descriptionAr : locale === 'ru' ? step.descriptionRu : step.description,
        required: step.required,
        icon: step.icon,
        products: stepProducts,
        productCount: stepProducts.length,
      }
    })

    return NextResponse.json({
      steps,
      discountTiers: DISCOUNT_TIERS,
      stats: {
        totalProducts: eligible.length,
        totalSteps: ROUTINE_STEPS.length,
        requiredSteps: ROUTINE_STEPS.filter(s => s.required).length,
        maxDiscount: 20,
      },
      locale,
    })
  } catch (error) {
    errorLog('Mobile Bundle Builder API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
