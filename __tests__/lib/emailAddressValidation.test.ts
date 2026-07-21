import {
  getEmailDomain,
  isEmailAddressSyntaxValid,
  normalizeEmailAddress,
  suggestEmailAddressCorrection,
} from '@/lib/emailAddressValidation'

describe('email address validation', () => {
  it('normalizes surrounding whitespace and casing', () => {
    expect(normalizeEmailAddress('  Claire.Cabarles@GMAIL.COM ')).toBe(
      'claire.cabarles@gmail.com'
    )
  })

  it.each([
    'customer+orders@gmail.com',
    'name.surname@clinic.ae',
    'doctor@xn--mgbh0fb.xn--kgbechtv',
  ])('accepts practical valid syntax: %s', (email) => {
    expect(isEmailAddressSyntaxValid(email)).toBe(true)
  })

  it.each([
    'missing-at.example.com',
    'name@gmail',
    'name @gmail.com',
    '.name@gmail.com',
    'name..surname@gmail.com',
    'name@-gmail.com',
  ])('rejects malformed syntax: %s', (email) => {
    expect(isEmailAddressSyntaxValid(email)).toBe(false)
  })

  it.each([
    ['clairecabarles@gmail.con', 'clairecabarles@gmail.com'],
    ['customer@gmial.com', 'customer@gmail.com'],
    ['customer@hotmial.com', 'customer@hotmail.com'],
    ['customer@yaho.com', 'customer@yahoo.com'],
  ])('suggests common provider corrections for %s', (email, expected) => {
    expect(suggestEmailAddressCorrection(email)).toBe(expected)
  })

  it.each(['customer@gmail.com', 'customer@mail.com', 'sales@genosys.ae'])(
    'does not alter a known or custom domain: %s',
    (email) => {
      expect(suggestEmailAddressCorrection(email)).toBeNull()
    }
  )

  it('extracts the normalized domain', () => {
    expect(getEmailDomain(' Customer@Gmail.com ')).toBe('gmail.com')
  })
})
