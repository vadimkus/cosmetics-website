import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { SYSTEM_PROMPT, CHATBOT_CONFIG } from '@/lib/chatbot/config'
import { debugLog, errorLog } from '@/lib/logger'

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
    if (!process.env.OPENAI_API_KEY) {
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
    const { messages, locale = 'en', context } = body as { 
      messages: ChatMessage[]
      locale?: string
      context?: {
        timeOfDay?: string // 'morning' | 'afternoon' | 'evening' | 'night'
        dayOfWeek?: string // 'Monday', 'Tuesday', etc.
        isWeekend?: boolean
        localTime?: string // e.g., "14:30"
        timezone?: string
      }
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
## IMPORTANT: ARABIC LANGUAGE MODE
The user's browser is set to Arabic. Follow these rules:
1. If the user writes in Arabic → Respond ENTIRELY in Arabic
2. Use the Arabic translations provided in the prompt for skincare terms
3. Keep product names in English (brand names)
4. Use "درهم" for AED currency
5. Be warm and professional in Arabic tone
6. Use RTL-appropriate punctuation`,
      ru: `
## IMPORTANT: RUSSIAN LANGUAGE MODE
The user's browser is set to Russian. Follow these rules:
1. If the user writes in Russian → Respond ENTIRELY in Russian
2. Use the Russian translations provided in the prompt for skincare terms
3. Keep product names in English (brand names)
4. Use "AED" for currency (standard in UAE)
5. Be warm and professional in Russian tone
6. Use formal "вы" form for politeness`,
      en: `
## LANGUAGE MODE: English (default)
Respond in English unless the user writes in another language.`
    }

    const localizedSystemPrompt = `${SYSTEM_PROMPT}
${contextInfo}
Current user locale: ${locale}
${languageInstructions[locale as keyof typeof languageInstructions] || languageInstructions.en}`

    debugLog('[CHAT] Processing chat request', { 
      messageCount: validatedMessages.length,
      locale,
      lastMessage: validatedMessages[validatedMessages.length - 1]?.content?.substring(0, 50)
    })

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
  const configured = !!process.env.OPENAI_API_KEY
  
  return NextResponse.json({
    service: 'GENOSYS AI Chat',
    configured,
    model: CHATBOT_CONFIG.model,
    message: configured 
      ? 'Chat service is ready' 
      : 'Chat service not configured - add OPENAI_API_KEY to environment variables',
  })
}
