import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'
import { generateBatchEnhancedProductData } from '@/lib/pricingEngine'
import { buildPricingContract } from '@/lib/pricingContract'
import { getConcernBySlug, CONCERN_PAGES, type ConcernPage } from '@/lib/concernsData'
import { getConcernVisual } from '@/lib/concernVisuals'
import { getProductsByConcern } from '@/lib/productsDb'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { ApiUser } from '@/types/user'

const ROUTINE_ESSENTIALS = [
  { productId: '10', name: 'SNOW O₂ CLEANSER', icon: '🫧', description: { en: 'Oxygen bubble cleanser — gentle yet thorough. Use morning & evening.', ar: 'غسول فقاعات الأكسجين — لطيف وعميق. للاستخدام صباحاً ومساءً.', ru: 'Кислородная пенка — мягкое и тщательное очищение. Утром и вечером.' }, price: '330 AED' },
  { productId: '16', name: 'SNOW BOOSTER', icon: '💦', description: { en: 'Hydrating toner that preps skin for serums & actives.', ar: 'تونر مرطب يحضّر البشرة للسيرومات والمواد الفعالة.', ru: 'Увлажняющий тоник — подготовка кожи к сывороткам и активам.' }, price: '260 AED' },
  { productId: '39', name: 'ULTRA SHIELD SPF 50+', icon: '☀️', description: { en: 'Broad-spectrum SPF 50+ — essential in the UAE sun. Apply every morning.', ar: 'واقي شمس واسع الطيف SPF 50+ — ضروري لشمس الإمارات. ضعيه كل صباح.', ru: 'SPF 50+ широкого спектра — необходим под солнцем ОАЭ. Каждое утро.' }, price: '250 AED' },
]

type Locale = 'en' | 'ar' | 'ru'

function pickLocale<T>(obj: { en: T; ar: T; ru: T } | undefined, locale: Locale): T | null {
  if (!obj) return null
  return obj[locale] ?? obj.en ?? null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const startTime = Date.now()

  try {
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.MOBILE_APP_KEY

    if (!expectedKey) {
      errorLog('[CONCERNS_API] MOBILE_APP_KEY not configured')
      return NextResponse.json({ success: false, error: 'API service unavailable' }, { status: 503 })
    }
    if (!apiKey || apiKey !== expectedKey) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const locale = ((request.headers.get('x-locale') || request.nextUrl.searchParams.get('locale') || 'en').toLowerCase()) as Locale
    const validLocale: Locale = ['en', 'ar', 'ru'].includes(locale) ? locale : 'en'

    const concern = getConcernBySlug(slug)
    if (!concern) {
      return NextResponse.json({ success: false, error: 'Concern not found' }, { status: 404 })
    }
    const visual = getConcernVisual(concern.slug)

    debugLog(`[CONCERNS_API] Fetching concern: ${slug}, locale: ${validLocale}`)

    // Extract all product numbers referenced in routine steps (all locales)
    const routineProductNumbers = new Set<string>()
    for (const localeRoutines of Object.values(concern.routine || {})) {
      for (const section of localeRoutines as { steps: { products: { url: string }[] }[] }[]) {
        for (const step of section.steps) {
          for (const p of step.products) {
            const m = p.url?.match(/\/products\/(\d+)/)
            if (m?.[1]) routineProductNumbers.add(m[1])
          }
        }
      }
    }

    // Fetch and enhance concern-matched products
    const rawProducts = await getProductsByConcern(concern.concernKeys, concern.categoryFallbacks)
    const productIds = rawProducts.map(p => String(p.id))

    const productSelect = {
      id: true, productNumber: true, name: true, nameRu: true, nameAr: true,
      price: true, description: true, descriptionRu: true, descriptionAr: true,
      image: true, images: true, category: true, inStock: true, rating: true,
      size: true, noDiscount: true, isPriceOnRequest: true, createdAt: true, updatedAt: true,
      skinType: true, targetConcerns: true, usage: true, ageGroup: true,
      productDetails: true, keyFeatures: true, benefits: true, ingredients: true,
      howToUse: true, directions: true, videoUrl: true,
      variants: {
        select: { id: true, size: true, color: true, price: true, available: true, isDefault: true, stockQuantity: true },
        orderBy: [{ isDefault: 'desc' as const }, { price: 'asc' as const }],
      },
    }

    const dbProducts = productIds.length > 0
      ? await prisma.product.findMany({ where: { id: { in: productIds }, isHidden: false }, select: productSelect })
      : []

    // Fetch routine-referenced products that weren't already included
    // Legacy products may have id === productNumber with productNumber field null
    const existingKeys = new Set<string>()
    for (const p of dbProducts) {
      existingKeys.add(String(p.id))
      if (p.productNumber) existingKeys.add(String(p.productNumber))
    }
    const missingNumbers = Array.from(routineProductNumbers).filter(n => !existingKeys.has(n))
    const routineDbProducts = missingNumbers.length > 0
      ? await prisma.product.findMany({
          where: {
            isHidden: false,
            OR: [
              { productNumber: { in: missingNumbers } },
              { id: { in: missingNumbers } },
            ],
          },
          select: productSelect,
        })
      : []

    const allDbProducts = [...dbProducts, ...routineDbProducts]

    const userId = request.headers.get('x-user-id')
    let user: ApiUser | null = null
    if (userId) {
      try {
        user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, name: true, discountType: true, discountPercentage: true, canSeePrices: true },
        })
        debugLog(`[CONCERNS_API] User context loaded: ${user?.email || 'not found'}`)
      } catch {
        debugLog('[CONCERNS_API] Failed to load user context')
      }
    }

    const enhanced = generateBatchEnhancedProductData(allDbProducts, user)
    const wantAr = validLocale === 'ar'
    const wantRu = validLocale === 'ru'

    const products = enhanced.map((p) => {
      const db = allDbProducts.find(d => String(d.id) === String(p.id))
      const pNum = String(db?.productNumber || p.id || '').trim()
      const fileTr = wantAr ? getProductTranslations(pNum) : wantRu ? getProductTranslationsRu(pNum) : null
      const localizedName = (wantAr ? db?.nameAr : wantRu ? db?.nameRu : null) || p.name || ''
      const localizedDescription = fileTr?.description || (wantAr ? db?.descriptionAr : wantRu ? db?.descriptionRu : null) || p.description || ''
      return {
        ...p,
        productNumber: pNum,
        localizedName,
        localizedDescription,
        videoUrl: db?.videoUrl || null,
        isPriceOnRequest: db?.isPriceOnRequest ?? false,
        ...(db ? { pricing: buildPricingContract(db, user) } : {}),
      }
    })

    // Build localized response
    const seo = pickLocale(concern.seo, validLocale)
    const why = pickLocale(concern.why, validLocale)
    const routine = pickLocale(concern.routine, validLocale)
    const faq = pickLocale(concern.faq, validLocale)

    const protocolPdf = concern.protocolPdf
      ? {
          url: concern.protocolPdf.url,
          title: concern.protocolPdf.title[validLocale] || concern.protocolPdf.title.en,
          description: concern.protocolPdf.description[validLocale] || concern.protocolPdf.description.en,
          fileSize: concern.protocolPdf.fileSize,
        }
      : null

    const relatedConcerns = concern.relatedConcerns
      .map(s => CONCERN_PAGES.find((c: ConcernPage) => c.slug === s))
      .filter(Boolean)
      .map(rc => {
        const rcSeo = pickLocale(rc!.seo, validLocale)
        return {
          slug: rc!.slug,
          icon: rc!.icon || '',
          image: getConcernVisual(rc!.slug)?.image || null,
          h1: rcSeo?.h1 || '',
          heroShort: rcSeo?.heroShort || rcSeo?.intro || '',
        }
      })

    const routineEssentials = slug !== 'hair-loss'
      ? ROUTINE_ESSENTIALS.map(e => ({
          ...e,
          description: e.description[validLocale] || e.description.en,
        }))
      : null

    const duration = Date.now() - startTime
    debugLog(`[CONCERNS_API] ${slug}: ${products.length} products in ${duration}ms`)

    return NextResponse.json({
      success: true,
      data: {
        slug: concern.slug,
        icon: concern.icon || '',
        image: visual?.image || null,
        imagePosition: visual?.imagePosition || null,
        seo,
        why,
        protocolPdf,
        routine,
        products,
        faq,
        relatedConcerns,
        routineEssentials,
      },
      meta: {
        locale: validLocale,
        productCount: products.length,
        timestamp: new Date().toISOString(),
        processingTime: `${duration}ms`,
      },
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' },
    })

  } catch (error) {
    const duration = Date.now() - startTime
    errorLog('[CONCERNS_API] Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
    })
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
}
