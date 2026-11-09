const cookieGet = jest.fn()
const verify = jest.fn()
const findUser = jest.fn()
const remember = jest.fn()

jest.mock('next/headers', () => ({ cookies: async () => ({ get: (...a: unknown[]) => cookieGet(...a) }) }))
jest.mock('@/lib/jwt', () => ({ verifySessionToken: (...a: unknown[]) => verify(...a) }))
jest.mock('@/lib/userStorageDb', () => ({ findUserByEmail: (...a: unknown[]) => findUser(...a) }))
jest.mock('@/lib/relayContactEmail', () => ({ rememberRelayContactEmail: (...a: unknown[]) => remember(...a) }))
jest.mock('@/lib/logger', () => ({ errorLog: jest.fn() }))

import { rememberSessionRelayContactEmail } from '@/lib/sessionRelayContactEmail'

const RELAY = 'ft7hr62yby@privaterelay.appleid.com'

describe('rememberSessionRelayContactEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    cookieGet.mockReturnValue({ value: 'token' })
  })

  it('saves the typed email on the signed-in relay account', async () => {
    const user = { id: 'u1', email: RELAY, contactEmail: null }
    verify.mockReturnValue({ email: RELAY })
    findUser.mockResolvedValue(user)
    await rememberSessionRelayContactEmail('client@gmail.com')
    expect(findUser).toHaveBeenCalledWith(RELAY)
    expect(remember).toHaveBeenCalledWith(user, 'client@gmail.com')
  })

  it('does nothing for a normal email session', async () => {
    verify.mockReturnValue({ email: 'client@gmail.com' })
    await rememberSessionRelayContactEmail('other@gmail.com')
    expect(findUser).not.toHaveBeenCalled()
    expect(remember).not.toHaveBeenCalled()
  })

  it('does nothing without a session', async () => {
    cookieGet.mockReturnValue(undefined)
    await rememberSessionRelayContactEmail('client@gmail.com')
    expect(verify).not.toHaveBeenCalled()
    expect(remember).not.toHaveBeenCalled()
  })
})
