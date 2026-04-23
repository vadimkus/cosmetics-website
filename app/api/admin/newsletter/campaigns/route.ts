import { NextRequest, NextResponse, after } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { debugLog, errorLog } from '@/lib/logger'
import { SITE_URL } from '@/lib/siteConfig'
import { renderNewsletterMarkdown } from '@/lib/newsletterMarkdown'
import { buildUnsubscribeUrl, isValidEmail, normalizeEmail } from '@/lib/newsletter'
import { sendNewsletterCampaignEmail } from '@/lib/email'

type LocaleFilter = 'en' | 'ar' | 'ru' | null
type Status = 'draft' | 'sending' | 'sent' | 'failed' | 'cancelled'

// Delay between emails — keeps us well under Gmail SMTP bursts (60+/sec headroom).
const SEND_DELAY_MS = 150
// Max rows per campaign in a single invocation. On Vercel Pro (60s timeout) this is
// ~400 recipients @ 150ms; bump MAX_SEND_CAP or split across invocations if you
// cross that threshold. Serverless limits are real — don't pretend otherwise.
const MAX_SEND_CAP = 2000

function isLocaleFilter(v: unknown): v is LocaleFilter {
  return v === null || v === 'en' || v === 'ar' || v === 'ru'
}

/**
 * GET /api/admin/newsletter/campaigns
 * Query: limit? (default 20), offset? (default 0)
 * Lists campaigns newest first — used for the "History" panel.
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  try {
    const url = new URL(request.url)
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10) || 20))
    const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10) || 0)

    const [rows, total] = await Promise.all([
      prisma.newsletterCampaign.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          subject: true,
          localeFilter: true,
          sourceFilter: true,
          isTest: true,
          testEmail: true,
          totalRecipients: true,
          sentCount: true,
          failedCount: true,
          status: true,
          sentByEmail: true,
          startedAt: true,
          completedAt: true,
          createdAt: true,
        },
      }),
      prisma.newsletterCampaign.count(),
    ])

    return NextResponse.json({ success: true, rows, total })
  } catch (err) {
    errorLog('[admin/newsletter/campaigns GET] error:', err)
    return NextResponse.json({ success: false, error: 'Failed to load campaigns' }, { status: 500 })
  }
}

/**
 * POST /api/admin/newsletter/campaigns
 * Body: {
 *   subject, bodyMarkdown,
 *   localeFilter?: 'en'|'ar'|'ru'|null (null = all locales),
 *   sourceFilter?: string (e.g. 'homepage'),
 *   isTest: boolean,
 *   testEmail?: string (required when isTest)
 * }
 *
 * For isTest=true: sends once to testEmail, returns final campaign record (status=sent|failed).
 * For isTest=false: creates campaign row, returns immediately with status=sending,
 *   and continues sending via `after()` after the response is flushed.
 *   Frontend polls GET /api/admin/newsletter/campaigns/[id] for progress.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) return csrfCheck.response!

  try {
    const body = (await request.json().catch(() => ({}))) as {
      subject?: string
      bodyMarkdown?: string
      localeFilter?: string | null
      sourceFilter?: string | null
      isTest?: boolean
      testEmail?: string
    }

    const subject = String(body.subject || '').trim()
    const bodyMarkdown = String(body.bodyMarkdown || '').trim()
    if (!subject || subject.length > 200) {
      return NextResponse.json({ success: false, error: 'Subject is required (max 200 chars)' }, { status: 400 })
    }
    if (!bodyMarkdown || bodyMarkdown.length > 50_000) {
      return NextResponse.json({ success: false, error: 'Body is required (max 50,000 chars)' }, { status: 400 })
    }

    const localeFilter: LocaleFilter =
      body.localeFilter === null || body.localeFilter === undefined || body.localeFilter === 'all'
        ? null
        : isLocaleFilter(body.localeFilter)
          ? body.localeFilter
          : null

    const sourceFilter = body.sourceFilter && typeof body.sourceFilter === 'string' && body.sourceFilter !== 'all'
      ? body.sourceFilter
      : null

    const isTest = body.isTest === true
    const testEmail = isTest ? normalizeEmail(body.testEmail || '') : ''

    if (isTest && !isValidEmail(testEmail)) {
      return NextResponse.json({ success: false, error: 'Valid test email required for test send' }, { status: 400 })
    }

    const bodyHtml = renderNewsletterMarkdown(bodyMarkdown)
    if (!bodyHtml) {
      return NextResponse.json({ success: false, error: 'Body rendered empty — check your markdown.' }, { status: 400 })
    }

    // Count recipients BEFORE creating the campaign so we can refuse bad requests early.
    let totalRecipients = 0
    if (isTest) {
      totalRecipients = 1
    } else {
      const where: Record<string, unknown> = { isActive: true }
      if (localeFilter) where.locale = localeFilter
      if (sourceFilter) where.source = sourceFilter
      totalRecipients = await prisma.newsletterSubscriber.count({ where })
      if (totalRecipients === 0) {
        return NextResponse.json({ success: false, error: 'No active subscribers match this filter.' }, { status: 400 })
      }
      if (totalRecipients > MAX_SEND_CAP) {
        return NextResponse.json(
          { success: false, error: `Recipient count (${totalRecipients}) exceeds per-campaign cap of ${MAX_SEND_CAP}. Narrow the filter or split the send.` },
          { status: 400 }
        )
      }
    }

    // Create campaign row
    const campaign = await prisma.newsletterCampaign.create({
      data: {
        subject,
        bodyMarkdown,
        bodyHtml,
        localeFilter,
        sourceFilter,
        isTest,
        testEmail: isTest ? testEmail : null,
        totalRecipients,
        sentCount: 0,
        failedCount: 0,
        status: 'sending',
        sentByEmail: auth.user.email,
        startedAt: new Date(),
      },
    })

    // Test send: do it synchronously so the admin sees the result immediately.
    if (isTest) {
      const unsubscribeUrl = buildUnsubscribeUrl(SITE_URL, 'preview', localeFilter || 'en')
      const result = await sendNewsletterCampaignEmail({
        to: testEmail,
        subject,
        bodyHtml,
        unsubscribeUrl,
        locale: localeFilter || 'en',
      }).catch(err => {
        errorLog('[newsletter/campaigns] test send failed:', err)
        return { success: false, error: err instanceof Error ? err.message : 'send failed' } as const
      })

      const final = await prisma.newsletterCampaign.update({
        where: { id: campaign.id },
        data: {
          status: result.success ? 'sent' : 'failed',
          sentCount: result.success ? 1 : 0,
          failedCount: result.success ? 0 : 1,
          completedAt: new Date(),
          errors: result.success
            ? null
            : JSON.stringify([{ email: testEmail, error: result.error || 'Unknown error' }]),
        },
      })
      return NextResponse.json({ success: result.success, campaign: final })
    }

    // Production send — kick off in background, return campaign immediately.
    after(async () => {
      await runProductionSend(campaign.id, { localeFilter, sourceFilter, subject, bodyHtml })
    })

    return NextResponse.json({ success: true, campaign })
  } catch (err) {
    errorLog('[admin/newsletter/campaigns POST] error:', err)
    return NextResponse.json({ success: false, error: 'Failed to start campaign' }, { status: 500 })
  }
}

/**
 * Deferred sender. Streams through active subscribers matching the filters,
 * sends one email per subscriber, and updates the campaign row in batches of 10
 * so the admin UI sees live progress.
 *
 * If the serverless function dies mid-send, the campaign stays in 'sending' —
 * that's a known failure mode, flagged by a stale `startedAt` on the frontend.
 */
async function runProductionSend(
  campaignId: string,
  opts: { localeFilter: LocaleFilter; sourceFilter: string | null; subject: string; bodyHtml: string }
) {
  const PAGE_SIZE = 100
  const where: Record<string, unknown> = { isActive: true }
  if (opts.localeFilter) where.locale = opts.localeFilter
  if (opts.sourceFilter) where.source = opts.sourceFilter

  let sentCount = 0
  let failedCount = 0
  const errors: Array<{ email: string; error: string }> = []
  let cursor: string | undefined = undefined

  try {
    while (true) {
      const page = (await prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { id: 'asc' },
        take: PAGE_SIZE,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        select: {
          id: true,
          email: true,
          locale: true,
          unsubscribeToken: true,
        },
      })) as Array<{ id: string; email: string; locale: string; unsubscribeToken: string }>
      if (page.length === 0) break

      for (const sub of page) {
        const unsubscribeUrl = buildUnsubscribeUrl(SITE_URL, sub.unsubscribeToken, (sub.locale as 'en' | 'ar' | 'ru') || 'en')
        try {
          const result = await sendNewsletterCampaignEmail({
            to: sub.email,
            subject: opts.subject,
            bodyHtml: opts.bodyHtml,
            unsubscribeUrl,
            locale: sub.locale || 'en',
          })
          if (result.success) {
            sentCount++
            // Stamp lastSentAt best-effort; failure here shouldn't abort the run.
            prisma.newsletterSubscriber
              .update({ where: { id: sub.id }, data: { lastSentAt: new Date() } })
              .catch(e => errorLog('[newsletter/campaigns] lastSentAt update failed:', e))
          } else {
            failedCount++
            if (errors.length < 50) errors.push({ email: sub.email, error: result.error || 'Unknown error' })
          }
        } catch (e) {
          failedCount++
          const msg = e instanceof Error ? e.message : 'Unknown error'
          if (errors.length < 50) errors.push({ email: sub.email, error: msg })
          errorLog('[newsletter/campaigns] send exception:', sub.email, e)
        }

        // Gentle throttle for SMTP
        await new Promise(r => setTimeout(r, SEND_DELAY_MS))
      }

      // Persist progress after each page
      await prisma.newsletterCampaign
        .update({
          where: { id: campaignId },
          data: { sentCount, failedCount, errors: errors.length ? JSON.stringify(errors) : null },
        })
        .catch(e => errorLog('[newsletter/campaigns] progress update failed:', e))

      cursor = page[page.length - 1]!.id
      if (page.length < PAGE_SIZE) break
    }

    await prisma.newsletterCampaign.update({
      where: { id: campaignId },
      data: {
        status: failedCount > 0 && sentCount === 0 ? 'failed' : 'sent',
        sentCount,
        failedCount,
        completedAt: new Date(),
        errors: errors.length ? JSON.stringify(errors) : null,
      },
    })
    debugLog('[newsletter/campaigns] campaign finished', { campaignId, sentCount, failedCount })
  } catch (err) {
    errorLog('[newsletter/campaigns] production send fatal:', err)
    await prisma.newsletterCampaign
      .update({
        where: { id: campaignId },
        data: {
          status: 'failed' as Status,
          completedAt: new Date(),
          errors: JSON.stringify([
            ...errors,
            { email: '__run__', error: err instanceof Error ? err.message : 'fatal error' },
          ]),
        },
      })
      .catch(() => {})
  }
}
