import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

// Rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX = 10 // 10 analyses per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0] ?? 'anonymous' : 'anonymous'
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const record = rateLimit.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }
  
  record.count++
  return true
}

const getLanguageInstruction = (locale: string): string => {
  switch (locale) {
    case 'ru':
      return `IMPORTANT: You MUST respond in RUSSIAN language. All text fields (analysis, concerns, routine steps, tips, product reasons) MUST be written in Russian. Product names should stay in English but reasons and descriptions must be in Russian.`
    case 'ar':
      return `IMPORTANT: You MUST respond in ARABIC language. All text fields (analysis, concerns, routine steps, tips, product reasons) MUST be written in Arabic. Product names should stay in English but reasons and descriptions must be in Arabic.`
    default:
      return `Respond in English.`
  }
}

const SKIN_ANALYSIS_PROMPT = `You are an expert dermatologist and cosmetic scientist specializing in skin analysis. Analyze the provided face photo and give a professional skin assessment.

## Your Analysis Should Include:

1. **Skin Type Assessment**: Identify if the skin is dry, oily, combination, normal, or sensitive
2. **Key Concerns**: List visible concerns (dehydration, oiliness, fine lines, pigmentation, pores, redness, etc.)
3. **Skin Condition Score**: Rate overall skin health 1-10
4. **Environmental Factors**: Consider UAE climate (humidity + AC = dehydration)

## Product Recommendations

Based on your analysis, recommend 3-5 GENOSYS products using EXACT format:
[Product Name](https://genosys.ae/products/ID){{id:ID}}

### Available Products (use these exact names and IDs):
- [MOISTURE REPLENISHING HYALURON SERUM](https://genosys.ae/products/18){{id:18}} - AED 330 - Multi-weight HA for deep hydration
- [MOISTURE REPLENISHING HYALURON CREAM](https://genosys.ae/products/29){{id:29}} - AED 290 - Hydrating cream
- [INTENSIVE PROBLEM CONTROL TONER](https://genosys.ae/products/15){{id:15}} - AED 260 - Zinc PCA for oily/acne skin
- [PROBLEM CONTROL SERUM](https://genosys.ae/products/20){{id:20}} - AED 330 - Acne/oily skin treatment
- [INTENSIVE PROBLEM CONTROL CREAM](https://genosys.ae/products/30){{id:30}} - AED 290 - Oil control cream
- [ALL FOR SENSITIVE SERUM](https://genosys.ae/products/19){{id:19}} - AED 330 - Sensitive skin care
- [SKIN BARRIER PROTECTING CREAM](https://genosys.ae/products/27){{id:27}} - AED 450 - Barrier repair
- [MULTI FUNCTIONAL ANTI-WRINKLE SERUM](https://genosys.ae/products/22){{id:22}} - AED 330 - Anti-aging serum
- [MULTI FUNCTIONAL ANTI-WRINKLE CREAM](https://genosys.ae/products/32){{id:32}} - AED 290 - Anti-aging cream
- [ND Cell ANTI-WRINKLE CREAM](https://genosys.ae/products/23){{id:23}} - AED 370 - Premium anti-aging with peptides
- [MULTI VITA RADIANCE SERUM](https://genosys.ae/products/21){{id:21}} - AED 330 - Brightening
- [MULTI VITA RADIANCE CREAM](https://genosys.ae/products/31){{id:31}} - AED 290 - Brightening cream
- [SNOW O₂ CLEANSER](https://genosys.ae/products/10){{id:10}} - AED 330 - Oxygen bubble cleanser
- [SNOW BOOSTER](https://genosys.ae/products/16){{id:16}} - AED 260 - Brightening toner
- [ULTRA SHIELD SUN CREAM SPF 50+](https://genosys.ae/products/39){{id:39}} - AED 250 - Sun protection
- [EyeCell EYE CONTOUR SERUM](https://genosys.ae/products/17){{id:17}} - AED 370 - Eye care serum
- [EyeCell EYE CONTOUR CREAM](https://genosys.ae/products/24){{id:24}} - AED 370 - Eye cream
- [CERABARRIER BIOME GEL CLEANSER](https://genosys.ae/products/66){{id:66}} - AED 380 - Ceramide + probiotic barrier-care daily cleanser
- [Bio-Meso PDRN Homecare Ampoule 5000](https://genosys.ae/products/65){{id:65}} - AED 300 - PDRN regenerating home ampoule (anti-aging, repair)
- [Bio Meso PDRN Ampoule 60000](https://genosys.ae/products/60){{id:60}} - AED 600 - High-strength PDRN ampoule for intensive regeneration
- [SKIN REBOOT PDRN MASK PACK](https://genosys.ae/products/52){{id:52}} - AED 400 - PDRN sheet mask pack (anti-aging, hydration)
- [BIO-FERMENT AGE DEFYING POWDER MASK](https://genosys.ae/products/51){{id:51}} - AED 250 - Fermented enzyme powder mask (anti-aging, glow)

## Response Format

Respond in this JSON structure:
{
  "skinType": "dry|oily|combination|normal|sensitive",
  "healthScore": 7,
  "concerns": ["concern1", "concern2"],
  "analysis": "Professional 2-3 sentence analysis of skin condition",
  "recommendations": [
    {
      "product": "[PRODUCT NAME](https://genosys.ae/products/ID){{id:ID}}",
      "reason": "Why this product specifically helps this skin"
    }
  ],
  "routine": {
    "am": ["Cleanse with SNOW O₂ CLEANSER", "Apply HYALURON SERUM", "Finish with SPF 50+"],
    "pm": ["Double cleanse", "Apply treatment serum", "Moisturize with cream"]
  },
  "tips": ["Personalized tip 1", "Personalized tip 2"]
}

IMPORTANT FOR ROUTINE:
- In the "routine" arrays, use PLAIN TEXT only - just the product names without markdown links or {{id:XX}}
- Example: "Apply MOISTURE REPLENISHING HYALURON SERUM" NOT "[MOISTURE...](url){{id:18}}"
- Keep routine steps short and actionable (e.g., "Cleanse with SNOW O₂ CLEANSER")

Be professional, evidence-based, and reference specific ingredients when explaining recommendations.`

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitKey = getRateLimitKey(request)
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { image, locale = 'en' } = body

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      )
    }

    // Validate image format (should be base64 data URL)
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format. Expected base64 data URL.' },
        { status: 400 }
      )
    }

    // Build prompt with language instruction
    const languageInstruction = getLanguageInstruction(locale)
    const fullPrompt = `${languageInstruction}\n\n${SKIN_ANALYSIS_PROMPT}`

    // Call GPT-4o-mini with vision
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: fullPrompt,
            },
            {
              type: 'image',
              image: image,
            },
          ],
        },
      ],
    })

    // Parse the response
    const responseText = result.text

    // Try to extract JSON from response
    let analysisResult
    try {
      // Find JSON in the response (it might be wrapped in markdown code blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        // If no JSON found, return the raw text
        analysisResult = {
          analysis: responseText,
          skinType: 'unknown',
          concerns: [],
          recommendations: [],
        }
      }
    } catch {
      // If parsing fails, return structured error
      analysisResult = {
        analysis: responseText,
        skinType: 'unknown',
        concerns: [],
        recommendations: [],
        parseError: true,
      }
    }

    return NextResponse.json({
      success: true,
      data: analysisResult,
    })
  } catch (error) {
    console.error('AI Skin Analysis Error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image. Please try again.' },
      { status: 500 }
    )
  }
}
