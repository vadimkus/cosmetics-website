/**
 * Emails active newsletter subscribers about a new Instagram post.
 *
 * Language comes from the person, not only the stored locale: a Cyrillic name or a
 * Russian-language mail domain means RU, an Arabic-script name means AR, otherwise the
 * stored locale (default EN). Names come from the registered account with the same email.
 *
 * Only real addresses are sent: valid syntax, not Apple private relay / test / throwaway,
 * a domain with MX records, and not an address that bounced in an earlier campaign.
 * Sends are spaced 20-40 s apart at random so Gmail does not see a burst.
 *
 *   npx tsx --env-file=.env.local scripts/send-ig-post-newsletter.ts --dry-run
 *   npx tsx --env-file=.env.local scripts/send-ig-post-newsletter.ts --test you@example.com
 *   npx tsx --env-file=.env.local scripts/send-ig-post-newsletter.ts --send
 */
import { promises as dns } from 'dns'
import { prisma } from '../lib/prisma'
import { sendNewsletterCampaignEmail } from '../lib/email'
import { isApplePrivateRelayEmail } from '../lib/emailHelpers'
import { buildUnsubscribeUrl, isValidEmail, normalizeEmail } from '../lib/newsletter'
import { SITE_URL } from '../lib/siteConfig'

type Locale = 'en' | 'ru' | 'ar'

const POST_URL = 'https://www.instagram.com/genosys.uae/p/DfFC5d2jPSc/'
const IMG = `${SITE_URL}/images/newsletter/biomeso-proof-2026-10`
const TAG = 'ig-post biomeso-proof-2026-10'
const MIN_GAP_MS = 20_000
const MAX_GAP_MS = 40_000
const MAX_RECIPIENTS = 400

const COPY: Record<Locale, { subject: string; title: string; p1: string; p2: string; cta: string; clinics: string }> = {
  en: {
    subject: 'No needles. Just hands.',
    title: 'No needles. Just hands.',
    p1: 'New on our Instagram: BIO-MESO PDRN EXPERT AMPOULE 60000. Microscopic spicules from a freshwater sponge, pressed into the skin by a specialist\u2019s hands. No needles, no device.',
    p2: 'Dot by dot, pressed and rolled in. In clinic only, by a trained specialist.',
    cta: 'See the post',
    clinics: 'Clinics, write to us: WhatsApp +971 58 548 76 65',
  },
  ru: {
    subject: 'Без игл. Только руки.',
    title: 'Без игл. Только руки.',
    p1: 'Новое в нашем Instagram: BIO-MESO PDRN EXPERT AMPOULE 60000. Микроскопические спикулы пресноводной губки, которые специалист вводит в кожу руками. Без игл и аппаратов.',
    p2: 'Точка за точкой, прижать и прокатать. Только в кабинете, у обученного специалиста.',
    cta: 'Смотреть пост',
    clinics: 'Клиники, пишите нам: WhatsApp +971 58 548 76 65',
  },
  ar: {
    subject: 'بلا إبر. فقط اليدان.',
    title: 'بلا إبر. فقط اليدان.',
    p1: 'جديد على إنستغرام: BIO-MESO PDRN EXPERT AMPOULE 60000. أشواك مجهرية من إسفنج المياه العذبة، يضغطها المختص على البشرة بيديه. بلا إبر وبلا أجهزة.',
    p2: 'نقطة بعد نقطة، ثم ضغط وتمرير. في العيادة فقط، على يد مختص مدرّب.',
    cta: 'شاهد المنشور',
    clinics: 'للعيادات: راسلونا عبر واتساب \u200E+971 58 548 76 65',
  },
}

const RU_DOMAINS = /(@|\.)(mail\.ru|bk\.ru|list\.ru|inbox\.ru|internet\.ru|yandex\.[a-z]+|ya\.ru|rambler\.ru|ukr\.net)$|\.(ru|by|kz|ua)$/i
const THROWAWAY = /@(example|test|mailinator|tempmail|temp-mail|yopmail|guerrillamail|10minutemail|trashmail|sharklasers|fakeinbox)\./i
const FAKE_LOCAL = /^(test|testing|asdf|qwerty|qwe|abc|aaa+|xxx+|noreply|no-reply|admin|null|none|fake)\d*@/i

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function bodyHtml(locale: Locale) {
  const c = COPY[locale]
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const align = locale === 'ar' ? 'right' : 'left'
  const font = "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif"
  const p = (t: string, extra = '') =>
    `<p dir="${dir}" style="font-family:${font}; font-size:15px; color:#1d1d1f; line-height:1.6; margin:0 0 16px; text-align:${align};${extra}">${esc(t)}</p>`
  const img = (n: string, alt: string) =>
    `<a href="${POST_URL}"><img src="${IMG}/proof_${locale === 'en' ? '' : locale + '_'}${n}.jpg" alt="${esc(alt)}" width="560" style="width:100%; max-width:560px; height:auto; border-radius:14px; display:block; margin:0 0 16px;" /></a>`
  return `${img('01', c.title)}
<h1 dir="${dir}" style="font-family:${font}; font-size:26px; font-weight:600; color:#1d1d1f; letter-spacing:-0.02em; line-height:1.25; margin:8px 0 12px; text-align:${align};">${esc(c.title)}</h1>
${p(c.p1)}
${img('02', c.p2)}
${p(c.p2)}
<p dir="${dir}" style="margin:8px 0 20px; text-align:${align};"><a href="${POST_URL}" style="display:inline-block; background:#1d1d1f; color:#ffffff; font-family:${font}; font-size:15px; font-weight:600; text-decoration:none; padding:13px 28px; border-radius:999px;">${esc(c.cta)}</a></p>
${p(c.clinics, ' font-size:13px; color:#6e6e73;')}`
}

function detectLocale(email: string, name: string | null, stored: string): Locale {
  if (name && /[\u0600-\u06FF]/.test(name)) return 'ar'
  if (name && /[\u0400-\u04FF]/.test(name)) return 'ru'
  if (RU_DOMAINS.test(email)) return 'ru'
  return stored === 'ru' || stored === 'ar' ? stored : 'en'
}

const mxCache = new Map<string, boolean>()
async function hasMx(domain: string) {
  if (!mxCache.has(domain)) {
    let ok = false
    try {
      ok = (await dns.resolveMx(domain)).length > 0
    } catch {
      ok = false
    }
    mxCache.set(domain, ok)
  }
  return mxCache.get(domain)!
}

async function bouncedEmails() {
  const out = new Set<string>()
  const camps = await prisma.newsletterCampaign.findMany({ where: { errors: { not: null } }, select: { errors: true } })
  for (const c of camps) {
    try {
      for (const e of JSON.parse(c.errors || '[]')) if (e?.email) out.add(normalizeEmail(e.email))
    } catch {}
  }
  for (const e of (process.env.EXTRA_BOUNCES || '').split(',')) if (e.trim()) out.add(normalizeEmail(e))
  return out
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const testIdx = args.indexOf('--test')
  const testTo = testIdx === -1 ? null : normalizeEmail(args[testIdx + 1] || '')
  if (!dryRun && !testTo && !args.includes('--send')) {
    console.error('Use --dry-run, --test <email> or --send')
    process.exit(1)
  }

  if (testTo) {
    for (const locale of ['en', 'ru', 'ar'] as Locale[]) {
      const r = await sendNewsletterCampaignEmail({
        to: testTo,
        subject: `[TEST ${locale.toUpperCase()}] ${COPY[locale].subject}`,
        bodyHtml: bodyHtml(locale),
        unsubscribeUrl: `${SITE_URL}/newsletter/unsubscribe?token=test`,
        locale,
      })
      console.log('test', locale, r.success ? 'sent' : r.error)
    }
    return
  }

  const subs = await prisma.newsletterSubscriber.findMany({
    where: { isActive: true, NOT: { lastSentAt: { gte: new Date('2026-10-31T00:00:00Z') } } },
    select: { id: true, email: true, locale: true, unsubscribeToken: true },
    orderBy: { id: 'asc' },
  })
  const users = await prisma.user.findMany({ select: { email: true, contactEmail: true, name: true } })
  const nameBy = new Map<string, string>()
  for (const u of users) {
    nameBy.set(normalizeEmail(u.email), u.name)
    if (u.contactEmail) nameBy.set(normalizeEmail(u.contactEmail), u.name)
  }
  const bounced = await bouncedEmails()

  const skipped: Record<string, string[]> = { syntax: [], relay: [], fake: [], noMx: [], bounced: [] }
  const targets: Array<{ id: string; email: string; locale: Locale; token: string }> = []
  for (const s of subs) {
    const email = normalizeEmail(s.email)
    if (!isValidEmail(email)) { skipped.syntax.push(email); continue }
    if (isApplePrivateRelayEmail(email)) { skipped.relay.push(email); continue }
    if (THROWAWAY.test(email) || FAKE_LOCAL.test(email)) { skipped.fake.push(email); continue }
    if (bounced.has(email)) { skipped.bounced.push(email); continue }
    if (!(await hasMx(email.split('@')[1]))) { skipped.noMx.push(email); continue }
    targets.push({ id: s.id, email, locale: detectLocale(email, nameBy.get(email) ?? null, s.locale), token: s.unsubscribeToken })
  }

  const count = (l: Locale) => targets.filter(t => t.locale === l).length
  console.log(`active subscribers not yet sent today: ${subs.length}`)
  console.log(`to send: ${targets.length}  en=${count('en')} ru=${count('ru')} ar=${count('ar')}`)
  for (const [k, v] of Object.entries(skipped)) if (v.length) console.log(`skip ${k} (${v.length}): ${v.join(', ')}`)
  const changed = targets.filter(t => t.locale !== (subs.find(s => s.id === t.id)?.locale || 'en'))
  if (changed.length) console.log(`language changed from stored (${changed.length}): ${changed.map(t => `${t.email}->${t.locale}`).join(', ')}`)
  if (targets.length > MAX_RECIPIENTS) { console.error(`over ${MAX_RECIPIENTS} cap`); process.exit(1) }
  if (dryRun) return

  const campaigns = {} as Record<Locale, string>
  for (const l of ['en', 'ru', 'ar'] as Locale[]) {
    if (!count(l)) continue
    campaigns[l] = (await prisma.newsletterCampaign.create({
      data: {
        subject: COPY[l].subject,
        bodyMarkdown: `[auto] ${TAG} (${l})`,
        bodyHtml: bodyHtml(l),
        localeFilter: l,
        totalRecipients: count(l),
        status: 'sending',
        sentByEmail: 'script',
        startedAt: new Date(),
      },
    })).id
  }

  const tally = { en: { sent: 0, failed: 0, errors: [] as any[] }, ru: { sent: 0, failed: 0, errors: [] as any[] }, ar: { sent: 0, failed: 0, errors: [] as any[] } }
  for (const [i, t] of targets.entries()) {
    const c = tally[t.locale]
    try {
      const r = await sendNewsletterCampaignEmail({
        to: t.email,
        subject: COPY[t.locale].subject,
        bodyHtml: bodyHtml(t.locale),
        unsubscribeUrl: buildUnsubscribeUrl(SITE_URL, t.token, t.locale),
        locale: t.locale,
      })
      if (r.success) {
        c.sent++
        await prisma.newsletterSubscriber.update({ where: { id: t.id }, data: { lastSentAt: new Date() } }).catch(() => {})
      } else {
        c.failed++
        c.errors.push({ email: t.email, error: r.error || 'unknown' })
      }
      console.log(`${new Date().toISOString().slice(11, 19)} ${i + 1}/${targets.length} ${t.locale} ${t.email} ${r.success ? 'ok' : 'FAIL ' + r.error}`)
    } catch (e) {
      c.failed++
      c.errors.push({ email: t.email, error: e instanceof Error ? e.message : 'unknown' })
      console.log(`${i + 1}/${targets.length} ${t.email} ERROR ${e instanceof Error ? e.message : e}`)
    }
    await prisma.newsletterCampaign.update({ where: { id: campaigns[t.locale] }, data: { sentCount: c.sent, failedCount: c.failed } }).catch(() => {})
    if (i < targets.length - 1) await new Promise(r => setTimeout(r, MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS)))
  }

  for (const l of Object.keys(campaigns) as Locale[]) {
    const c = tally[l]
    await prisma.newsletterCampaign.update({
      where: { id: campaigns[l] },
      data: { status: c.sent === 0 && c.failed > 0 ? 'failed' : 'sent', sentCount: c.sent, failedCount: c.failed, completedAt: new Date(), errors: c.errors.length ? JSON.stringify(c.errors.slice(0, 50)) : null },
    })
    console.log(`${l}: ${c.sent} sent, ${c.failed} failed`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
