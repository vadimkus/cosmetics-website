import http2 from 'node:http2'
import crypto from 'node:crypto'
import { debugLog, errorLog } from './logger'
import {
  buildActivityPayload,
  type ActivityEvent,
  type OrderForActivity,
} from './liveActivityPayload'

/**
 * Sends Live Activity pushes straight to Apple.
 *
 * Expo's push service cannot carry these. A Live Activity update is not a notification -
 * it is addressed to an ActivityKit token, on a topic of its own
 * (`<bundleId>.push-type.liveactivity`), with `apns-push-type: liveactivity`. There is no
 * field in the Expo API that produces that request, so this talks HTTP/2 to APNs directly.
 *
 * Three tokens are easy to confuse and only one is right here:
 *   - the Expo push token - for ordinary notifications, not this
 *   - the **push-to-start** token - app-wide, starts a card when nothing is running
 *   - the **per-activity** token - updates or ends one card that already exists
 *
 * Configuration, all from the environment:
 *   APNS_KEY_ID      the .p8 key's ten-character id
 *   APNS_TEAM_ID     the Apple team id
 *   APNS_KEY_P8      the .p8 contents, PEM and all
 *   APNS_PRODUCTION  "true" for the App Store build, otherwise sandbox
 */

const BUNDLE_ID = 'ae.genosys.app'
const TOPIC = `${BUNDLE_ID}.push-type.liveactivity`

const HOST_PRODUCTION = 'https://api.push.apple.com'
const HOST_SANDBOX = 'https://api.sandbox.push.apple.com'

export function isApnsConfigured(): boolean {
  return Boolean(process.env.APNS_KEY_ID && process.env.APNS_TEAM_ID && process.env.APNS_KEY_P8)
}

/**
 * A signed provider token.
 *
 * Apple rejects a token older than an hour and refuses more than one per twenty minutes,
 * so it is cached and refreshed well inside both limits.
 */
let cached: { jwt: string; madeAt: number } | null = null

function providerToken(): string {
  const now = Math.floor(Date.now() / 1000)
  if (cached && now - cached.madeAt < 45 * 60) return cached.jwt

  const keyId = process.env.APNS_KEY_ID as string
  const teamId = process.env.APNS_TEAM_ID as string
  // Vercel's environment strips real newlines, so accept the escaped form too.
  const p8 = (process.env.APNS_KEY_P8 as string).replace(/\\n/g, '\n')

  const header = { alg: 'ES256', kid: keyId }
  const claims = { iss: teamId, iat: now }
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url')
  const signingInput = `${b64(header)}.${b64(claims)}`

  // ES256 for APNs is the raw 64-byte r||s, not the DER wrapper Node emits by default.
  const signature = crypto
    .createSign('SHA256')
    .update(signingInput)
    .sign({ key: p8, dsaEncoding: 'ieee-p1363' })
    .toString('base64url')

  cached = { jwt: `${signingInput}.${signature}`, madeAt: now }
  return cached.jwt
}

/** Only for tests: drops the cached provider token. */
export function resetProviderToken() {
  cached = null
}

export type ApnsResult = {
  ok: boolean
  status?: number
  /** Apple's reason string, e.g. BadDeviceToken. */
  reason?: string | undefined
  /** True when the token is dead and the caller should stop using it. */
  gone?: boolean
}

async function post(token: string, body: unknown): Promise<ApnsResult> {
  const host = process.env.APNS_PRODUCTION === 'true' ? HOST_PRODUCTION : HOST_SANDBOX

  return new Promise<ApnsResult>(resolve => {
    const client = http2.connect(host)
    let settled = false
    const done = (result: ApnsResult) => {
      if (settled) return
      settled = true
      client.close()
      resolve(result)
    }

    client.on('error', error => {
      errorLog('[APNS] connection error:', error)
      done({ ok: false, reason: 'connection' })
    })

    const request = client.request({
      ':method': 'POST',
      ':path': `/3/device/${token}`,
      authorization: `bearer ${providerToken()}`,
      'apns-topic': TOPIC,
      'apns-push-type': 'liveactivity',
      // Live Activities must be delivered immediately; 5 would let iOS hold them back.
      'apns-priority': '10',
      'content-type': 'application/json',
    })

    let status = 0
    let payload = ''
    request.on('response', headers => {
      status = Number(headers[':status']) || 0
    })
    request.setEncoding('utf8')
    request.on('data', chunk => {
      payload += chunk
    })
    request.on('error', error => {
      errorLog('[APNS] request error:', error)
      done({ ok: false, reason: 'request' })
    })
    request.on('end', () => {
      if (status === 200) return done({ ok: true, status })
      let reason: string | undefined
      try {
        reason = (JSON.parse(payload) as { reason?: string }).reason
      } catch {
        reason = payload.slice(0, 120) || undefined
      }
      // A token that Apple no longer recognises should be cleared rather than retried.
      const gone =
        status === 410 ||
        reason === 'BadDeviceToken' ||
        reason === 'Unregistered' ||
        reason === 'DeviceTokenNotForTopic'
      done({ ok: false, status, reason, gone })
    })

    request.end(JSON.stringify(body))
  })
}

/**
 * Start, update or end the card for one order.
 *
 * `token` is the push-to-start token for a `start`, and the per-activity token otherwise.
 * Sending one where the other belongs returns `DeviceTokenNotForTopic` rather than
 * anything that explains itself.
 */
export async function sendOrderActivity(params: {
  token: string
  event: ActivityEvent
  order: OrderForActivity
  url?: string
  dismissalDate?: number
}): Promise<ApnsResult> {
  if (!isApnsConfigured()) {
    debugLog('[APNS] not configured; skipping Live Activity push')
    return { ok: false, reason: 'not-configured' }
  }
  if (!params.token) return { ok: false, reason: 'no-token' }

  const body = buildActivityPayload({
    event: params.event,
    order: params.order,
    ...(params.url !== undefined ? { url: params.url } : {}),
    ...(params.dismissalDate !== undefined ? { dismissalDate: params.dismissalDate } : {}),
  })

  const result = await post(params.token, body)
  if (result.ok) {
    debugLog(`[APNS] ${params.event} sent for order ${params.order.orderNumber}`)
  } else {
    errorLog(
      `[APNS] ${params.event} failed for order ${params.order.orderNumber}:`,
      result.status,
      result.reason
    )
  }
  return result
}
