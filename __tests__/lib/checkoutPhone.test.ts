import { isValidCheckoutPhone, normalizeCheckoutPhone } from '@/lib/checkoutPhone'

describe('isValidCheckoutPhone', () => {
  it.each([
    '050 123 4567',
    '+971 50 123 4567',
    '971501234567',
    '04-123-4567',
    '+17869019906',
    '+1 (786) 901-9906',
    '0044 7700 900123',
    '+7 916 123 45 67',
  ])('accepts %s', (phone) => {
    expect(isValidCheckoutPhone(phone)).toBe(true)
  })

  it.each([
    '',
    '12345',
    '7869019906',
    '+971 12 345',
    '+0 123 456 789',
    'phone',
  ])('rejects %s', (phone) => {
    expect(isValidCheckoutPhone(phone)).toBe(false)
  })
})

describe('normalizeCheckoutPhone', () => {
  it('turns a 00 prefix into +', () => {
    expect(normalizeCheckoutPhone('0044 7700 900123')).toBe('+447700900123')
  })
})
