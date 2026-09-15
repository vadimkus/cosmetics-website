import http2 from 'node:http2'
import { decodeBase64Secret } from '@/lib/wallet/config'

export type ApplePassPushResult = {
  ok: boolean
  status: number
  reason?: string
  gone: boolean
}

export async function sendApplePassPush(pushToken: string): Promise<ApplePassPushResult> {
  const passTypeIdentifier = process.env.APPLE_PASS_TYPE_ID
  if (!passTypeIdentifier) throw new Error('Missing APPLE_PASS_TYPE_ID')

  return new Promise(resolve => {
    const client = http2.connect('https://api.push.apple.com', {
      cert: decodeBase64Secret('APPLE_PASS_CERT_PEM_B64'),
      key: decodeBase64Secret('APPLE_PASS_KEY_PEM_B64'),
      ...(process.env.APPLE_PASS_KEY_PASSPHRASE
        ? { passphrase: process.env.APPLE_PASS_KEY_PASSPHRASE }
        : {}),
    })
    let settled = false
    let status = 0
    let response = ''
    const finish = (result: ApplePassPushResult) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      client.close()
      resolve(result)
    }
    const fail = (reason: string) => finish({ ok: false, status, reason, gone: false })
    const timer = setTimeout(() => fail('timeout'), 10_000)

    client.on('error', error => fail(error.message.slice(0, 120)))
    const request = client.request({
      ':method': 'POST',
      ':path': `/3/device/${encodeURIComponent(pushToken)}`,
      'apns-topic': passTypeIdentifier,
      'apns-push-type': 'background',
      'apns-priority': '5',
      'content-type': 'application/json',
    })
    request.setEncoding('utf8')
    request.on('response', headers => {
      status = Number(headers[':status']) || 0
    })
    request.on('data', chunk => {
      response += chunk
    })
    request.on('error', error => fail(error.message.slice(0, 120)))
    request.on('end', () => {
      let reason: string | undefined
      try {
        reason = (JSON.parse(response) as { reason?: string }).reason
      } catch {
        reason = response.slice(0, 120) || undefined
      }
      const gone =
        status === 410 ||
        reason === 'BadDeviceToken' ||
        reason === 'Unregistered' ||
        reason === 'DeviceTokenNotForTopic'
      finish({ ok: status === 200, status, ...(reason ? { reason } : {}), gone })
    })
    request.end('{}')
  })
}
