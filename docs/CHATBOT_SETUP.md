# AI Chatbot Setup Guide

This document explains how to set up and configure the GENOSYS AI Beauty Advisor chatbot.

## Overview

The chatbot is powered by OpenAI's GPT-4o-mini model via the Vercel AI SDK. It provides:
- Product recommendations based on skin concerns
- Ingredient explanations
- Skincare routine guidance
- FAQ answers
- Multi-language support (EN, AR, RU)

## Quick Setup

### 1. Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account or sign in
3. Navigate to **API Keys** → **Create new secret key**
4. Copy the key (starts with `sk-`)

### 2. Configure Environment Variable

Add to your `.env.local` file:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

For Vercel deployment, add this in:
- Project Settings → Environment Variables

### 3. Test the Chatbot

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Look for the red chat bubble in the bottom-right corner
4. Click to open and test!

You can also check the API health endpoint:
```bash
curl http://localhost:3000/api/chat
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
└── messages/
    ├── en.json               # English translations
    ├── ar.json               # Arabic translations
    └── ru.json               # Russian translations
```

## Configuration

### Chatbot Personality

Edit `lib/chatbot/config.ts` to customize:

```typescript
export const CHATBOT_CONFIG = {
  model: 'gpt-4o-mini',      // OpenAI model
  maxTokens: 500,            // Max response length
  temperature: 0.7,          // Creativity (0-1)
  maxMessagesPerMinute: 10,  // Rate limiting
}
```

### System Prompt

The system prompt in `config.ts` defines the chatbot's:
- Personality and tone
- Product knowledge
- Business rules (pricing, shipping, etc.)
- Language handling
- Restricted topics

## Cost Estimation

GPT-4o-mini pricing (as of 2024):
- Input: $0.15 / 1M tokens
- Output: $0.60 / 1M tokens

**Estimated costs:**
| Usage | Monthly Cost |
|-------|-------------|
| 100 conversations | ~$0.20 |
| 1,000 conversations | ~$2 |
| 10,000 conversations | ~$20 |

## Rate Limiting

The API includes built-in rate limiting:
- 10 messages per minute per IP
- 100 messages per day per IP (configurable)

For production with high traffic, consider:
1. Using Redis for distributed rate limiting
2. Adding user authentication for per-user limits
3. Implementing cost alerts in OpenAI dashboard

## Features

### Multi-Language Support
- Automatically detects user's site locale
- Responds in the same language the user writes in
- Full RTL support for Arabic

### Quick Action Buttons
Pre-configured suggestions:
- "Dry skin" recommendations
- "Oily skin" recommendations  
- "Anti-aging" products

### Mobile Responsive
- Works on Desktop, Mobile Web, and PWA
- Floating button with minimizable window
- Positioned to avoid overlapping with mobile footer nav

## Customization

### Adding Product Knowledge

To enhance product recommendations, you can:

1. **Expand the system prompt** with more product details
2. **Add RAG (Retrieval Augmented Generation)** by:
   - Installing pgvector: `npm install @pgvector/pgvector`
   - Creating product embeddings
   - Searching products based on user queries

Example RAG flow:
```typescript
// In api/chat/route.ts
const relevantProducts = await searchProductsByEmbedding(userQuery)
const contextualizedPrompt = `${SYSTEM_PROMPT}\n\nRelevant products:\n${relevantProducts}`
```

### Adding Actions

The chatbot can be extended to:
- Add products to cart
- Check order status
- Apply promo codes

This requires additional API integration.

## Troubleshooting

### "Chat service not configured"
- Ensure `OPENAI_API_KEY` is set in environment variables
- Restart the dev server after adding the key

### "Too many messages"
- Rate limit exceeded
- Wait 1 minute and try again
- Increase `maxMessagesPerMinute` in config if needed

### Chat not appearing
- Check browser console for errors
- Verify ChatWidget is imported in layout.tsx
- Check if any CSS is hiding the component

### Arabic/Russian not working
- Ensure translations are in messages/*.json
- Check `locale` is being passed to the API

## Security Considerations

1. **API Key Protection**: Never expose `OPENAI_API_KEY` to the client
2. **Rate Limiting**: Prevents abuse and cost overruns
3. **Content Filtering**: OpenAI has built-in content moderation
4. **Input Validation**: All user messages are sanitized

## Future Enhancements

Planned improvements:
- [ ] Product database RAG integration
- [ ] Add to cart functionality
- [ ] Order status lookup
- [ ] WhatsApp chatbot integration (via Twilio)
- [ ] Conversation history (for logged-in users)
- [ ] Analytics and conversation insights

---

*Last updated: February 2026*
