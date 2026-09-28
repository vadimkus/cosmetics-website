const update = jest.fn().mockResolvedValue({})

jest.mock('@/lib/database', () => ({ prisma: { user: { update: (...a: unknown[]) => update(...a) } } }))
jest.mock('@/lib/logger', () => ({ errorLog: jest.fn(), debugLog: jest.fn() }))

import { rememberRelayContactEmail } from '@/lib/relayContactEmail'

const relayUser = () => ({ id: 'u1', email: 'ft7hr62yby@privaterelay.appleid.com', contactEmail: null as string | null })

describe('rememberRelayContactEmail', () => {
  beforeEach(() => update.mockClear())

  it('saves the real checkout email on a relay account with none', async () => {
    const user = relayUser()
    await rememberRelayContactEmail(user, '  Client@Gmail.com ')
    expect(update).toHaveBeenCalledWith({ where: { id: 'u1' }, data: { contactEmail: 'client@gmail.com' } })
    expect(user.contactEmail).toBe('client@gmail.com')
  })

  it('never overwrites a saved contact email', async () => {
    const user = { ...relayUser(), contactEmail: 'saved@mail.com' }
    await rememberRelayContactEmail(user, 'other@gmail.com')
    expect(update).not.toHaveBeenCalled()
    expect(user.contactEmail).toBe('saved@mail.com')
  })

  it('ignores relay, invalid and empty submissions', async () => {
    for (const bad of ['x@privaterelay.appleid.com', 'not-an-email', '', undefined]) {
      await rememberRelayContactEmail(relayUser(), bad)
    }
    expect(update).not.toHaveBeenCalled()
  })

  it('leaves normal accounts alone', async () => {
    await rememberRelayContactEmail({ id: 'u2', email: 'client@gmail.com', contactEmail: null }, 'client@gmail.com')
    expect(update).not.toHaveBeenCalled()
  })
})
