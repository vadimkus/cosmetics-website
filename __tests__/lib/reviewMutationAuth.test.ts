import type { NextRequest } from 'next/server'
import { validateReviewMutationAuth } from '@/lib/reviewMutationAuth'
import { validateCsrfToken } from '@/lib/csrf'
import { validateMobileAuth } from '@/lib/jwt'

jest.mock('@/lib/csrf', () => ({
  validateCsrfToken: jest.fn(),
}))

jest.mock('@/lib/jwt', () => ({
  extractTokenFromHeader: jest.fn((header: string | null) =>
    header?.startsWith('Bearer ') ? header.slice(7) : null
  ),
  validateMobileAuth: jest.fn(),
}))

const mockValidateCsrfToken = jest.mocked(validateCsrfToken)
const mockValidateMobileAuth = jest.mocked(validateMobileAuth)

describe('validateReviewMutationAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('keeps CSRF protection for website review mutations', async () => {
    mockValidateCsrfToken.mockResolvedValue({ valid: true })
    const request = { headers: new Headers() } as NextRequest

    await expect(validateReviewMutationAuth(request)).resolves.toEqual({
      valid: true,
      mobileEmail: null,
    })
    expect(mockValidateMobileAuth).not.toHaveBeenCalled()
  })

  it('accepts a native request only from its signed mobile identity', async () => {
    mockValidateMobileAuth.mockReturnValue({
      valid: true,
      payload: {
        userId: 'user-1',
        email: 'native@example.com',
        name: 'Native User',
        isAdmin: false,
        canSeePrices: true,
      },
    })
    const request = {
      headers: new Headers({
        'x-api-key': 'mobile-key',
        Authorization: 'Bearer signed-token',
      }),
    } as NextRequest

    await expect(validateReviewMutationAuth(request)).resolves.toEqual({
      valid: true,
      mobileEmail: 'native@example.com',
    })
    expect(mockValidateMobileAuth).toHaveBeenCalledWith('mobile-key', 'signed-token')
    expect(mockValidateCsrfToken).not.toHaveBeenCalled()
  })

  it('rejects an API key without an authenticated mobile user', async () => {
    mockValidateMobileAuth.mockReturnValue({ valid: true, payload: null })
    const request = {
      headers: new Headers({ 'x-api-key': 'mobile-key' }),
    } as NextRequest

    await expect(validateReviewMutationAuth(request)).resolves.toEqual({
      valid: false,
      error: 'Mobile authentication required',
      status: 401,
    })
    expect(mockValidateCsrfToken).not.toHaveBeenCalled()
  })
})
