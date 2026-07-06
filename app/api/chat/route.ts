import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { SYSTEM_PROMPT, CHATBOT_CONFIG } from '@/lib/chatbot/config'
import { getDynamicCatalogSection, spliceCatalogSection } from '@/lib/chatbot/productCatalog'
import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { OPENAI_API_KEY } from '@/lib/envValidation'

// Message type for chat API - supports AI SDK v6 UIMessage format with parts array
interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content?: string | MessagePart[] // Legacy format
  parts?: MessagePart[] // AI SDK v6 format
}

interface MessagePart {
  type: string
  text?: string
}

// Rate limiting storage (in production, use Redis)
const rateLimits = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] ?? 'anonymous' : 'anonymous'
  return ip
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const limit = rateLimits.get(key)
  
  if (!limit || now > limit.resetTime) {
    // Reset or create new limit
    rateLimits.set(key, {
      count: 1,
      resetTime: now + 60000, // 1 minute window
    })
    return { allowed: true, remaining: CHATBOT_CONFIG.maxMessagesPerMinute - 1 }
  }
  
  if (limit.count >= CHATBOT_CONFIG.maxMessagesPerMinute) {
    return { allowed: false, remaining: 0 }
  }
  
  limit.count++
  return { allowed: true, remaining: CHATBOT_CONFIG.maxMessagesPerMinute - limit.count }
}

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!OPENAI_API_KEY) {
      errorLog('[CHAT] OpenAI API key not configured')
      return NextResponse.json(
        { error: 'Chat service not configured. Please add OPENAI_API_KEY to environment variables.' },
        { status: 503 }
      )
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(request)
    const rateLimit = checkRateLimit(rateLimitKey)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many messages. Please wait a minute before sending more.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { messages, locale = 'en', context, chatId } = body as { 
      messages: ChatMessage[]
      locale?: string
      chatId?: string // Chat session ID for tracking
      context?: {
        timeOfDay?: string // 'morning' | 'afternoon' | 'evening' | 'night'
        dayOfWeek?: string // 'Monday', 'Tuesday', etc.
        isWeekend?: boolean
        localTime?: string // e.g., "14:30"
        timezone?: string
      }
    }
    
    // Extract device info from request headers
    const userAgent = request.headers.get('user-agent') || undefined
    const forwarded = request.headers.get('x-forwarded-for')
    const ipAddress = forwarded ? forwarded.split(',')[0]?.trim() : undefined
    
    // Detect device type from user agent
    const detectDeviceType = (ua: string | undefined): string => {
      if (!ua) return 'unknown'
      if (/mobile/i.test(ua)) return 'mobile'
      if (/tablet|ipad/i.test(ua)) return 'tablet'
      return 'desktop'
    }
    
    // Detect browser from user agent
    const detectBrowser = (ua: string | undefined): string => {
      if (!ua) return 'unknown'
      if (/chrome/i.test(ua) && !/edge/i.test(ua)) return 'Chrome'
      if (/firefox/i.test(ua)) return 'Firefox'
      if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari'
      if (/edge/i.test(ua)) return 'Edge'
      if (/opera|opr/i.test(ua)) return 'Opera'
      return 'Other'
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      )
    }

    // Validate and transform messages to the expected format
    // Handle AI SDK v6 format (parts array) and legacy format (content string/array)
    const validatedMessages = messages
      .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
      .map((msg) => {
        // Extract content - handle AI SDK v6 parts format and legacy content format
        let content = ''
        
        // AI SDK v6 uses 'parts' array
        if (msg.parts && Array.isArray(msg.parts)) {
          content = msg.parts
            .filter((part) => part.type === 'text')
            .map((part) => part.text || '')
            .join('')
        }
        // Legacy format - content as string
        else if (typeof msg.content === 'string') {
          content = msg.content
        }
        // Legacy format - content as parts array
        else if (msg.content && Array.isArray(msg.content)) {
          const parts = msg.content as MessagePart[]
          content = parts
            .filter((part) => part.type === 'text')
            .map((part) => part.text || '')
            .join('')
        }
        
        return {
          role: msg.role as 'user' | 'assistant',
          content,
        }
      })
      .filter((msg) => msg.content.length > 0)

    if (validatedMessages.length === 0) {
      return NextResponse.json(
        { error: 'At least one valid message is required' },
        { status: 400 }
      )
    }

    // Build context string for personalized greetings
    const contextInfo = context ? `
## Current Context (use this for personalized greetings!)
- Time of day: ${context.timeOfDay || 'unknown'}
- Local time: ${context.localTime || 'unknown'}
- Day: ${context.dayOfWeek || 'unknown'}
- Weekend: ${context.isWeekend ? 'Yes (Friday/Saturday in UAE)' : 'No (weekday)'}
- Timezone: ${context.timezone || 'UAE (GMT+4)'}
` : ''

    // Add locale and context to system prompt with strong language instructions
    const languageInstructions = {
      ar: `
## CRITICAL: ARABIC LANGUAGE MODE - يجب الرد بالعربية!
The user's browser is set to Arabic. YOU MUST FOLLOW THESE RULES:
1. **ALWAYS respond ENTIRELY in Arabic** - even if user's message is short or unclear
2. If the user writes in Arabic → Respond 100% in Arabic (NO English sentences!)
3. Use the Arabic example conversations provided in the prompt as templates
4. Keep only product names in English (brand names like "SNOW O₂ CLEANSER")
5. Use "درهم" for AED currency
6. Be warm and professional in Arabic tone
7. Translate ALL descriptions, tips, and explanations to Arabic
8. Reference the Arabic translations section (## ARABIC TRANSLATIONS) for vocabulary
9. DO NOT mix Arabic and English - the entire response must be in Arabic except product names
10. Use RTL-appropriate punctuation`,
      ru: `
## CRITICAL: RUSSIAN LANGUAGE MODE - ОБЯЗАТЕЛЬНО ОТВЕЧАЙТЕ НА РУССКОМ!
The user's browser is set to Russian. YOU MUST FOLLOW THESE RULES:
1. **ALWAYS respond ENTIRELY in Russian** - even if user's message is short or unclear
2. If the user writes in Russian → Respond 100% in Russian (NO English sentences!)
3. Use the Russian example conversations provided in the prompt as templates
4. Keep only product names in English (brand names like "SNOW O₂ CLEANSER")
5. Use "AED" for currency (standard in UAE)
6. Be warm and professional in Russian tone - use "вы" form
7. Translate ALL descriptions, tips, and explanations to Russian
8. Reference the Russian translations section (## RUSSIAN TRANSLATIONS) for vocabulary
9. DO NOT mix Russian and English - the entire response must be in Russian except product names`,
      en: `
## LANGUAGE MODE: English (default)
Respond in English unless the user writes in another language.`
    }

    // Swap the hand-maintained catalog section for one generated live from the
    // DB (10-min cache). Falls back to the static section on any failure.
    const dynamicCatalog = await getDynamicCatalogSection()
    const systemPromptWithCatalog = spliceCatalogSection(SYSTEM_PROMPT, dynamicCatalog)

    const localizedSystemPrompt = `${systemPromptWithCatalog}
${contextInfo}
Current user locale: ${locale}
${languageInstructions[locale as keyof typeof languageInstructions] || languageInstructions.en}`

    debugLog('[CHAT] Processing chat request', { 
      messageCount: validatedMessages.length,
      locale,
      lastMessage: validatedMessages[validatedMessages.length - 1]?.content?.substring(0, 50)
    })

    // Track conversation in database (non-blocking)
    if (chatId) {
      const userMessageCount = validatedMessages.filter(m => m.role === 'user').length
      const botMessageCount = validatedMessages.filter(m => m.role === 'assistant').length
      const firstUserMessage = validatedMessages.find(m => m.role === 'user')?.content?.substring(0, 500) || null
      
      // Upsert conversation record (don't await - fire and forget)
      prisma.chatConversation.upsert({
        where: { sessionId: chatId },
        create: {
          sessionId: chatId,
          locale,
          messageCount: validatedMessages.length + 1, // +1 for the new bot response
          userMessages: userMessageCount,
          botMessages: botMessageCount + 1, // +1 for the new response
          firstMessage: firstUserMessage,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          deviceType: detectDeviceType(userAgent),
          browser: detectBrowser(userAgent),
          startedAt: new Date(),
          lastMessageAt: new Date(),
        },
        update: {
          messageCount: validatedMessages.length + 1,
          userMessages: userMessageCount,
          botMessages: botMessageCount + 1,
          lastMessageAt: new Date(),
          // Update first message only if not set
          ...(firstUserMessage && { firstMessage: firstUserMessage }),
        },
      }).catch((err) => {
        // Log but don't fail the request
        errorLog('[CHAT] Failed to track conversation:', err)
      })
    }

    // Use Vercel AI SDK to stream the response
    const result = streamText({
      model: openai(CHATBOT_CONFIG.model),
      system: localizedSystemPrompt,
      messages: validatedMessages,
      maxOutputTokens: CHATBOT_CONFIG.maxTokens,
      temperature: CHATBOT_CONFIG.temperature,
    })

    // Return the streaming response using the UI message stream format
    return result.toUIMessageStreamResponse()

  } catch (error) {
    errorLog('[CHAT] Error processing chat:', error)
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Chat service configuration error' },
          { status: 503 }
        )
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Service is busy. Please try again in a moment.' },
          { status: 429 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  const configured = !!OPENAI_API_KEY
  
  return NextResponse.json({
    service: 'GENOSYS AI Chat',
    configured,
    model: CHATBOT_CONFIG.model,
    message: configured 
      ? 'Chat service is ready' 
      : 'Chat service not configured - add OPENAI_API_KEY to environment variables',
  })
}
