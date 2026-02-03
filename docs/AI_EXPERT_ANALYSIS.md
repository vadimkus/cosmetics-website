# AI Expert Skin Analysis

## Overview

The AI Expert Analysis feature enhances the skin recommendation page by providing professional-grade skin analysis using GPT-4o-mini's vision capabilities. This feature works alongside the existing instant local analysis to give users deeper insights and personalized product recommendations.

## Features

### 1. GPT-4o-mini Vision Analysis
- Professional dermatologist-level skin assessment
- Analyzes skin type, concerns, and overall health
- Provides evidence-based product recommendations
- Generates personalized AM/PM skincare routines
- Offers tailored skincare tips

### 2. Seamless Integration
- Appears after user captures a photo (camera or AR)
- Works with existing instant local analysis
- Optional feature - users can skip if they prefer quick results

### 3. Add to Cart from Analysis
- Product recommendations include direct "Add to Bag" buttons
- Products are linked to the catalog with correct IDs
- Seamless shopping experience within the analysis flow

## User Flow

```
1. User visits /skin-recommendation
2. Takes a selfie using:
   - Standard Camera Analysis
   - Live AR Analysis
3. Instant local analysis shows metrics:
   - Skin type detection
   - Oiliness/Hydration/Redness levels
   - Texture and evenness scores
   - Estimated skin age
4. NEW: "Get AI Expert Analysis" button appears
5. User clicks → Photo sent to GPT-4o-mini
6. AI analysis displays:
   - Health Score (1-10)
   - Professional analysis text
   - Key concerns (tags)
   - Product recommendations with Add to Bag
   - Morning/Evening routine
   - Personalized tips
7. User can add products directly or view full catalog
```

## Technical Implementation

### API Endpoint

**Path:** `/api/skin-analysis/ai`  
**Method:** POST  
**Content-Type:** application/json

#### Request Body
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

#### Response (Success)
```json
{
  "success": true,
  "data": {
    "skinType": "combination",
    "healthScore": 7,
    "concerns": ["dehydration", "visible pores", "minor redness"],
    "analysis": "Your skin shows characteristics of combination type with a slightly oily T-zone and normal to dry cheeks. The dehydration is likely due to the UAE climate with frequent AC exposure...",
    "recommendations": [
      {
        "product": "[MOISTURE REPLENISHING HYALURON SERUM](https://genosys.ae/products/18){{id:18}}",
        "reason": "Multi-weight hyaluronic acid will address dehydration at multiple skin layers, ideal for UAE's climate challenges."
      }
    ],
    "routine": {
      "am": [
        "SNOW O₂ CLEANSER - Gentle cleanse",
        "MOISTURE REPLENISHING HYALURON SERUM - Hydration",
        "ULTRA SHIELD SUN CREAM SPF 50+ - Protection"
      ],
      "pm": [
        "SNOW O₂ CLEANSER - Double cleanse",
        "MOISTURE REPLENISHING HYALURON SERUM - Hydration",
        "MOISTURE REPLENISHING HYALURON CREAM - Lock in moisture"
      ]
    },
    "tips": [
      "Apply hydrating products on slightly damp skin for better absorption",
      "Consider a humidifier in AC rooms to combat transepidermal water loss"
    ]
  }
}
```

#### Response (Error)
```json
{
  "error": "Rate limit exceeded. Please try again later."
}
```

### Rate Limiting

| Parameter | Value |
|-----------|-------|
| Max requests | 10 per hour |
| Window | 60 minutes |
| Key | IP address |

### Files Modified/Created

| File | Purpose |
|------|---------|
| `app/api/skin-analysis/ai/route.ts` | API endpoint for GPT-4o-mini vision analysis |
| `app/skin-recommendation/SkinRecommendationClient.tsx` | UI integration, AI analysis button and results display |
| `components/SkinAnalysisCamera.tsx` | Modified to pass captured image to parent |
| `components/ar/ARSkinAnalysisCamera.tsx` | Modified to pass captured image to parent |

### State Management

New state variables in `SkinRecommendationClient`:

```typescript
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

// Product details fetched from API for display (images, prices, sizes)
const [aiProductDetails, setAiProductDetails] = useState<Map<string, any>>(new Map())
```

### Product Data Fetching

When AI analysis completes, product details are fetched in parallel:

```typescript
// Fetch product details for each recommendation
await Promise.all(
  recommendations.map(async (rec) => {
    const productId = extractProductId(rec.product)
    const response = await fetch(`/api/products/${productId}`)
    const product = await response.json()
    productDetailsMap.set(productId, product)
  })
)
```

This provides:
- Product images from catalog
- Current prices
- Product sizes (e.g., "50ml")
- Full product data for Add to Bag functionality

## Cost Analysis

### GPT-4o-mini Pricing (as of 2025)

| Component | Cost |
|-----------|------|
| Input (image ~100KB) | ~$0.001-0.002 |
| Input (prompt ~2KB) | ~$0.0001 |
| Output (~500 tokens) | ~$0.001 |
| **Total per analysis** | **~$0.002-0.005** |

### Monthly Cost Estimates

| Usage Level | Analyses/Month | Estimated Cost |
|-------------|----------------|----------------|
| Low | 100 | $0.20 - $0.50 |
| Medium | 1,000 | $2 - $5 |
| High | 10,000 | $20 - $50 |

## Multi-Language Support

The feature supports all three website languages:

### English
- "AI Expert Analysis"
- "Get Expert Analysis"
- "Analyzing..."
- "Added to bag!"

### Arabic (RTL)
- "تحليل خبير الذكاء الاصطناعي"
- "احصل على تحليل الخبير"
- "جاري التحليل..."
- "تمت الإضافة إلى السلة!"

### Russian
- "Экспертный AI-анализ"
- "Получить анализ эксперта"
- "Анализируем..."
- "Добавлено в корзину!"

## Product Mapping

The AI is trained on the complete GENOSYS product catalog with correct IDs:

| Product | ID | URL |
|---------|-----|-----|
| MOISTURE REPLENISHING HYALURON SERUM | 18 | /products/18 |
| MOISTURE REPLENISHING HYALURON CREAM | 29 | /products/29 |
| INTENSIVE PROBLEM CONTROL TONER | 15 | /products/15 |
| PROBLEM CONTROL SERUM | 20 | /products/20 |
| ALL FOR SENSITIVE SERUM | 19 | /products/19 |
| SKIN BARRIER PROTECTING CREAM | 27 | /products/27 |
| MULTI FUNCTIONAL ANTI-WRINKLE SERUM | 22 | /products/22 |
| MULTI VITA RADIANCE SERUM | 21 | /products/21 |
| SNOW O₂ CLEANSER | 10 | /products/10 |
| ULTRA SHIELD SUN CREAM SPF 50+ | 39 | /products/39 |
| EyeCell EYE CONTOUR SERUM | 17 | /products/17 |
| EyeCell EYE CONTOUR CREAM | 24 | /products/24 |

## UI Components

### AI Analysis Button
- **Location:** After instant analysis report
- **Style:** Purple/violet gradient theme
- **Icon:** Brain icon (lucide-react)
- **States:** Default, Loading (with spinner)

### AI Analysis Results Card

**Header Section:**
- Purple gradient background (`from-violet-600 to-purple-600`)
- Brain icon with title "AI Expert Analysis"
- Subtitle: "Professional analysis of your skin"
- Health Score badge (1-10) on the right

**Content Sections:**

1. **📋 Analysis** - Professional 2-3 sentence skin assessment
2. **⚠️ Key Concerns** - Amber tags (e.g., "dehydration", "fine lines", "oiliness")
3. **✨ Recommended Products** - Product cards with images, prices, sizes, Add to Bag
4. **🌅 Your Daily Routine** - Morning/Evening routine cards with numbered steps
5. **💡 Personalized Tips** - Green checkmark list with skincare advice

**Footer:**
- "← Back to Report" link to return to instant analysis

### Product Recommendation Cards
Each product card displays:
- **Product Image:** 96x96px mobile, 112x112px desktop
- **Product Size:** Displayed below image (e.g., "50ml", "30ml")
- **Product Name:** Clickable violet link to product page
- **Price:** Bold AED format (e.g., "AED 330")
- **Reason:** AI explanation of why this product helps (2-line clamp)
- **Add to Bag Button:** Purple button with shopping bag icon

Card layout:
```
┌─────────────────────────────────────────┐
│ ┌─────────┐  PRODUCT NAME               │
│ │  Image  │  AED 330                    │
│ │         │  This product helps...      │
│ └─────────┘  [🛍️ Add to Bag]            │
│   50ml                                  │
└─────────────────────────────────────────┘
```

### Daily Routine Cards
Morning and Evening routines display:
- **Morning Card:** Amber/yellow theme with sun icon
- **Evening Card:** Indigo/purple theme with moon icon
- **Numbered Steps:** Colored circular badges (1, 2, 3...)
- **Clean Text:** Plain product names without markdown links

Example routine step display:
```
① Apply MOISTURE REPLENISHING HYALURON SERUM
② Finish with ULTRA SHIELD SUN CREAM SPF 50+
```

The API prompt instructs GPT to return plain text routine steps (not markdown links).

## Security Considerations

1. **Rate Limiting:** Prevents abuse and controls costs
2. **Image Validation:** Only accepts data URLs starting with `data:image/`
3. **No Image Storage:** Images are processed and discarded
4. **API Key Security:** OpenAI key stored in environment variables

## Environment Variables Required

```env
OPENAI_API_KEY=sk-proj-xxx
```

## Testing

### Manual Testing Checklist

**Camera & Image Capture:**
- [ ] Standard camera captures and passes image to AI analysis
- [ ] AR camera captures and passes image to AI analysis
- [ ] Loading spinner displays during analysis

**AI Analysis Results:**
- [ ] Health score displays correctly (1-10)
- [ ] Analysis text renders properly
- [ ] Concerns display as amber tags
- [ ] "Back to Report" link works

**Product Recommendations:**
- [ ] Product images load from catalog
- [ ] Product sizes display below images (e.g., "50ml")
- [ ] Prices display in AED format
- [ ] Product names link to product pages
- [ ] "Add to Bag" buttons add products to cart
- [ ] Toast notification shows on add to bag

**Daily Routine:**
- [ ] Morning routine displays with amber theme
- [ ] Evening routine displays with indigo theme
- [ ] Steps show numbered badges (1, 2, 3...)
- [ ] No raw markdown links visible (clean text only)

**Personalized Tips:**
- [ ] Tips display with green checkmarks
- [ ] Text is readable and helpful

**Error Handling:**
- [ ] Rate limiting shows user-friendly error
- [ ] API errors display retry message

**Internationalization:**
- [ ] English layout correct
- [ ] Arabic RTL layout correct
- [ ] Russian layout correct

### Test URL
```
https://genosys.ae/skin-recommendation
```

## Future Enhancements

1. **Comparison Mode:** Compare analysis results over time
2. **Save Analysis:** Store results in user profile
3. **PDF Report:** Generate downloadable skin report
4. **Ingredient Sensitivity:** Check for potential irritants
5. **Progress Tracking:** Track skin improvements with regular photos

## Troubleshooting

### "Rate limit exceeded"
- Wait 1 hour for rate limit reset
- Each IP address is limited to 10 analyses per hour

### "AI analysis failed"
- Check OPENAI_API_KEY is set in environment
- Verify OpenAI API has sufficient credits
- Check network connectivity

### Image not captured
- Ensure camera permissions are granted
- Try refreshing the page
- Check browser console for errors

## Related Documentation

- [Chatbot Documentation](./CHATBOT_DOCUMENTATION.md)
- [Skin Recommendation Page](./SKIN_RECOMMENDATION.md)
- [Mobile API Documentation](./MOBILE_API_ENHANCED_DOCUMENTATION.md)
