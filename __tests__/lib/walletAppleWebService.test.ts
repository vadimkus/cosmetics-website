const findFirst = jest.fn()

jest.mock('@/lib/prisma', () => ({
  prisma: { walletPass: { findFirst: (...args: unknown[]) => findFirst(...args) } },
}))

import type { NextRequest } from 'next/server'
import {
  applePassAuthorization,
  authorizedApplePass,
  validApplePassType,
} from '@/lib/wallet/appleWebService'
import { applePassAuthenticationToken } from '@/lib/wallet/apple'

function request(authorization?: string): NextRequest {
  const headers = new Headers()
  if (authorization) headers.set('authorization', authorization)
  return { headers } as NextRequest
}

describe('Apple Wallet web-service authorization', () => {
  beforeEach(() => {
    findFirst.mockReset()
    process.env.APPLE_PASS_TYPE_ID = 'pass.ae.genosys.rewards'
    process.env.APPLE_WALLET_AUTH_SECRET = 'apple-pass-auth-secret-with-at-least-32-bytes'
  })

  afterEach(() => {
    delete process.env.APPLE_PASS_TYPE_ID
    delete process.env.APPLE_WALLET_AUTH_SECRET
  })

  it('requires the exact ApplePass authorization scheme and pass type', () => {
    expect(applePassAuthorization(request('Bearer no'))).toBeNull()
    expect(applePassAuthorization(request('ApplePass secret'))).toBe('secret')
    expect(validApplePassType('pass.ae.genosys.rewards')).toBe(true)
    expect(validApplePassType('pass.other')).toBe(false)
  })

  it('accepts only the stable token for the requested serial', async () => {
    const record = { id: 'pass-1', externalId: 'a_opaque', status: 'ACTIVE' }
    findFirst.mockResolvedValue(record)
    const token = applePassAuthenticationToken(record.externalId)
    await expect(
      authorizedApplePass(
        request(`ApplePass ${token}`),
        'pass.ae.genosys.rewards',
        record.externalId,
      ),
    ).resolves.toEqual(record)
    await expect(
      authorizedApplePass(
        request('ApplePass wrong'),
        'pass.ae.genosys.rewards',
        record.externalId,
      ),
    ).resolves.toBeNull()
  })
})
