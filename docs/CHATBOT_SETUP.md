# AI Chatbot Setup Guide

Complete documentation for the GENOSYS AI Beauty Advisor chatbot.

## Overview

The chatbot is powered by OpenAI's GPT-4o-mini model via the Vercel AI SDK. It provides:
- Product recommendations based on skin concerns
- Ingredient explanations with educational facts
- Skincare routine guidance
- Multi-language support (EN, AR, RU)
- Links to products and PDF brochures
- Promotion of special features (Bundle Builder, AI Skin Analysis)

## Quick Setup

### 1. Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account or sign in
3. Navigate to **API Keys** → **Create new secret key**
4. **Permissions**: Select "All" or at minimum enable "Model capabilities" for Chat
5. Copy the key (starts with `sk-proj-`)

### 2. Configure Environment Variable

**Local Development** - Add to `.env.local`:
```env
OPENAI_API_KEY=sk-proj-your-api-key-here
```

**Vercel Deployment**:
1. Go to Project Settings → Environment Variables
2. Add `OPENAI_API_KEY` with your key
3. Redeploy the project

### 3. Test the Chatbot

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Look for the red chat bubble in the bottom-right corner
4. Click to open and test!

Health check endpoint:
```bash
curl https://genosys.ae/api/chat
# Returns: { "service": "GENOSYS AI Chat", "configured": true, ... }
```

## File Structure

```
cosmetics-website/
├── app/api/chat/
│   └── route.ts              # Chat API endpoint (streaming)
├── components/
│   └── ChatWidget.tsx        # Chat UI component
├── lib/chatbot/
│   └── config.ts             # System prompt & configuration
└── docs/
    └── CHATBOT_SETUP.md      # This documentation
```

## Configuration

### Chatbot Settings

Edit `lib/chatbot/config.ts`:

```typescript
export const CHATBOT_CONFIG = {
  model: 'gpt-4o-mini',        // OpenAI model (cost-effective)
  maxTokens: 700,              // Max response length
  temperature: 0.8,            // Creativity (0=deterministic, 1=creative)
  maxMessagesPerMinute: 10,    // Rate limiting per IP
  maxMessagesPerDay: 100,      // Daily limit per IP
}
```

### System Prompt

The system prompt in `config.ts` contains:

#### Brand Knowledge
- GENOSYS brand story and history (founded 2006, Korea)
- Unique selling points (world's first microneedling brand)
- Core technologies (PDRN, Bio-Meso Spicules, Peptides)
- Quality certifications (ISO, GMP, KFDA, UAE registered)

#### Product Catalog
- Complete product list with exact URLs and prices
- Categories: Devices, PRO Solutions, Cleansers, Serums, Creams, Masks, Sun Protection, Hair Care
- Example: `[Microneedle Roller](https://genosys.ae/products/1) - AED 230`

#### PDF Documentation
- Product brochures and guides
- Home Care Guide, Professional Manual, Glass Skin Guide
- Example: `[Download brochure](https://genosys.ae/documents/PPT/GENOSYS%20ULTRA%20SHIELD%20SUN%20CREAM.pdf)`

#### Ingredient Facts Database
- Hyaluronic Acid facts
- Peptide information
- PDRN/Salmon DNA science
- Vitamin facts
- Skin science facts
- Routine/technique tips

#### Special Features
- **Bundle Builder** with discount tiers (5-20% off)
- **AI Skin Analysis** with AR camera

## Features

### 1. Contextual Greetings
- Time-based: Morning ☀️, Afternoon 🌤️, Evening 🌅, Night 🌙
- Weekend detection (Friday/Saturday in UAE)
- Locale-aware messages

### 2. Quick Action Buttons
Pre-configured suggestions in 3 rows:

**Row 1 - Skin Types:**
- 💧 Dry skin
- 🧴 Oily skin
- ✨ Anti-aging
- 🪞 Glass skin

**Row 2 - Concerns & Info:**
- 🌿 Acne/Sensitive
- 📋 Daily routine
- 🏆 Why GENOSYS?
- ☀️ Sun protection

**Row 3 - Special Features (Highlighted):**
- 🎁 20% OFF! (Bundle Builder promotion)
- 📸 AI Skin Analysis

### 3. Smart Product Links
- Internal links (genosys.ae) open in same window using Next.js router
- Chat stays active with conversation preserved
- External links (PDFs, YouTube) open in new tab

### 4. Educational Responses
Every response includes:
- A relevant skincare fact or "Did you know?"
- Product recommendations with clickable links
- Explanation of why products/ingredients work
- A follow-up question to keep conversation going
- Natural emoji use (2-4 per response)

### 5. Multi-Language Support
- English (default)
- Arabic (RTL support)
- Russian
- Auto-detects from site locale
- Responds in user's language

### 6. Mobile Responsive
- Works on Desktop, Mobile Web, and PWA
- Floating button with minimizable window
- **Mobile:** 65vh height (65% of viewport)
- **Desktop:** 500px height (max 70vh)
- Positioned above mobile footer navigation (`bottom-20`)
- Footer stays visible when chat is open

## Bundle Builder Promotion

The chatbot promotes the Bundle Builder feature:

**Discount Tiers:**
| Products | Discount |
|----------|----------|
| 2 items  | 5% OFF   |
| 3 items  | 10% OFF  |
| 4 items  | 15% OFF  |
| 5+ items | 20% OFF  |

**When chatbot recommends it:**
- Customer wants multiple products
- Customer asks about routines
- Customer mentions budget/value
- Customer building a skincare routine

**URL:** https://genosys.ae/bundle-builder

## AI Skin Analysis Promotion

The chatbot promotes the AI Skin Analysis feature:

**How it works:**
1. Customer uses phone/webcam camera
2. AR technology analyzes skin in real-time
3. AI detects: skin type, hydration, concerns
4. Provides personalized product recommendations

**When chatbot recommends it:**
- Customer unsure about skin type
- Customer has multiple concerns
- Customer wants personalized recommendations
- Customer says "I don't know what I need"

**URL:** https://genosys.ae/skin-recommendation

## Cost Estimation

GPT-4o-mini pricing (as of 2024):
- Input: $0.15 / 1M tokens
- Output: $0.60 / 1M tokens

**Estimated monthly costs:**
| Usage | Cost |
|-------|------|
| 100 conversations | ~$0.30 |
| 1,000 conversations | ~$3 |
| 10,000 conversations | ~$30 |

## Rate Limiting

Built-in rate limiting protects against abuse:
- 10 messages per minute per IP
- 100 messages per day per IP

For high-traffic production:
1. Use Redis for distributed rate limiting
2. Add user authentication for per-user limits
3. Set up cost alerts in OpenAI dashboard

## Monitoring Usage

### Vercel Dashboard
1. Go to your Vercel project
2. Navigate to **Logs** tab
3. Filter by `/api/chat`
4. View all API invocations with timestamps

### OpenAI Dashboard
1. Go to https://platform.openai.com/usage
2. View API calls and token usage
3. Set up usage alerts/limits

## Troubleshooting

### "Chat service not configured"
- Ensure `OPENAI_API_KEY` is set in environment variables
- Restart the dev server after adding the key
- Check Vercel environment variables for production

### "Too many messages"
- Rate limit exceeded
- Wait 1 minute and try again
- Increase `maxMessagesPerMinute` in config if needed

### Chat not appearing
- Check browser console for errors
- Verify ChatWidget is imported in `app/layout.tsx`
- Check if any CSS is hiding the component

### Links not working
- Internal links should navigate without page refresh
- External links (PDFs) should open in new tab
- Check console for navigation errors

### Arabic/Russian not working
- Check `locale` is being passed correctly
- Verify RTL styling for Arabic

## Security

1. **API Key Protection**: `OPENAI_API_KEY` is never exposed to client
2. **Rate Limiting**: Prevents abuse and cost overruns
3. **Content Filtering**: OpenAI has built-in content moderation
4. **Input Validation**: All user messages are sanitized

## API Reference

### POST /api/chat

Send a chat message and receive a streaming response.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "What's good for dry skin?" }
  ],
  "locale": "en"
}
```

**Response:** Server-Sent Events stream with AI response

### GET /api/chat

Health check endpoint.

**Response:**
```json
{
  "service": "GENOSYS AI Chat",
  "configured": true,
  "model": "gpt-4o-mini",
  "message": "Chat service is ready"
}
```

## Future Enhancements

Potential improvements:
- [ ] Usage analytics dashboard
- [ ] Conversation history (for logged-in users)
- [ ] Add to cart functionality from chat
- [ ] Order status lookup
- [ ] WhatsApp integration (via Twilio)
- [ ] Voice input support
- [ ] Product image recognition

---

*Last updated: February 3, 2026*
