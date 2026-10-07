import { canAccessCustomerEmail, getCustomerEmailWhere } from '@/lib/mobileOrderOwnership'

describe('getCustomerEmailWhere', () => {
  it('matches order emails case-insensitively', () => {
    expect(getCustomerEmailWhere({ email: 'Lizaarnatskaya@gmail.com' })).toEqual({
      customerEmail: { equals: 'lizaarnatskaya@gmail.com', mode: 'insensitive' },
    })
  })

  it('covers the contact email too', () => {
    expect(
      getCustomerEmailWhere({ email: 'abc@privaterelay.appleid.com', contactEmail: 'Real@Mail.com' }),
    ).toEqual({
      OR: [
        { customerEmail: { equals: 'abc@privaterelay.appleid.com', mode: 'insensitive' } },
        { customerEmail: { equals: 'real@mail.com', mode: 'insensitive' } },
      ],
    })
  })
})

describe('canAccessCustomerEmail', () => {
  it('ignores case on both sides', () => {
    expect(canAccessCustomerEmail({ email: 'lizaarnatskaya@gmail.com' }, 'Lizaarnatskaya@gmail.com')).toBe(true)
    expect(canAccessCustomerEmail({ email: 'a@b.com' }, 'c@d.com')).toBe(false)
  })
})
