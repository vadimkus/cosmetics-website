import { NextRequest, NextResponse, after } from 'next/server'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'
import { SITE_URL } from '@/lib/siteConfig'
import {
  normalizeEmail,
  normalizeLocale,
  normalizeSource,
  isValidEmail,
  generateUnsubscribeToken,
  buildUnsubscribeUrl,
} from '@/lib/newsletter'
import { sendNewsletterWelcomeEmail } from '@/lib/email'

/**
 * POST /api/newsletter/subscribe
 * Public endpoint — anyone (logged-in or guest) can subscribe from the homepage/footer.
 *
 * Protections:
 *  - IP + UA rate-limit (generous, but stops bulk-signup abuse)
 *  - Body size cap
 *  - Honeypot field (`website`) — bots auto-fill it, humans don't see it
 *  - Idempotent: same email twice just resubscribes without error
 *
 * No CSRF: this is a write-only, non-destructive endpoint with no auth state.
 * Rate limit + honeypot are the right-sized defenses here (mirrors industry newsletter pattern).
 */

const subscribeLimiter = rateLimitSimple({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: 'Too many subscribe attempts. Please try again in a few minutes.',
})

export async function POST(request: NextRequest) {
  try {
    const sizeCheck = requireBodySizeLimit(request, getSizeLimitForContentType(request))
    if (!sizeCheck.valid) return sizeCheck.response!

    let clientId = 'unknown'
    try {
      clientId = getClientIdentifierFromNextRequest(request)
    } catch {
      // non-fatal; treat as a bucket of its own
    }
    const rl = await subscribeLimiter(`newsletter:${clientId}`)
    if (!rl.success) {
      return NextResponse.json({ error: rl.message || 'Too many requests' }, { status: 429 })
    }

    const body = (await request.json().catch(() => ({}))) as {
      email?: string
      locale?: string
      source?: string
      website?: string // honeypot
    }

    // Honeypot: if filled, silently 200 so bots don't learn they're blocked.
    if (body.website && String(body.website).trim().length > 0) {
      debugLog('[newsletter/subscribe] honeypot tripped', { clientId })
      return NextResponse.json({ ok: true, alreadySubscribed: false })
    }

    const email = normalizeEmail(body.email || '')
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const locale = normalizeLocale(body.locale)
    const source = normalizeSource(body.source)
    const userAgent = request.headers.get('user-agent')?.slice(0, 500) || null
    const ipAddress = clientId.split('-')[0] || null

    // Look for existing subscriber.
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } })

    if (existing) {
      if (existing.isActive) {
        // Already active — idempotent success, no second welcome email.
        return NextResponse.json({ ok: true, alreadySubscribed: true })
      }
      // Previously unsubscribed — reactivate with a fresh token so any old
      // forwarded unsubscribe link stops working.
      const newToken = generateUnsubscribeToken()
      const updated = await prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: {
          isActive: true,
          unsubscribeToken: newToken,
          unsubscribedAt: null,
          locale,
          source,
          ipAddress,
          userAgent,
          subscribedAt: new Date(),
        },
      })

      // Send the welcome email AFTER the response is returned. We use Next 16's
      // `after()` so the SMTP call survives the serverless function lifecycle
      // (a plain fire-and-forget promise gets killed when NextResponse returns
      // on Vercel — that's why subscribers stopped seeing the email).
      after(async () => {
        try {
          const result = await sendNewsletterWelcomeEmail({
            email: updated.email,
            locale,
            unsubscribeUrl: buildUnsubscribeUrl(SITE_URL, newToken, locale),
          })
          if (result?.success) {
            debugLog('[newsletter/subscribe] welcome email sent (resubscribe):', updated.email, result.messageId)
          } else {
            errorLog('[newsletter/subscribe] welcome email failed (resubscribe):', updated.email, result?.error)
          }
        } catch (err) {
          errorLog('[newsletter/subscribe] welcome email threw (resubscribe):', err)
        }
      })

      return NextResponse.json({ ok: true, alreadySubscribed: false })
    }

    // New subscriber.
    const token = generateUnsubscribeToken()

    // If email matches an existing user, link them.
    const matchedUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    }).catch(() => null)

    const created = await prisma.newsletterSubscriber.create({
      data: {
        email,
        locale,
        source,
        unsubscribeToken: token,
        userId: matchedUser?.id ?? null,
        ipAddress,
        userAgent,
      },
    })

    after(async () => {
      try {
        const result = await sendNewsletterWelcomeEmail({
          email: created.email,
          locale,
          unsubscribeUrl: buildUnsubscribeUrl(SITE_URL, token, locale),
        })
        if (result?.success) {
          debugLog('[newsletter/subscribe] welcome email sent (new):', created.email, result.messageId)
        } else {
          errorLog('[newsletter/subscribe] welcome email failed (new):', created.email, result?.error)
        }
      } catch (err) {
        errorLog('[newsletter/subscribe] welcome email threw (new):', err)
      }
    })

    return NextResponse.json({ ok: true, alreadySubscribed: false })
  } catch (err) {
    errorLog('[newsletter/subscribe] unexpected error:', err)
    return NextResponse.json(
      { error: 'Could not subscribe right now. Please try again later.' },
      { status: 500 }
    )
  }
}
