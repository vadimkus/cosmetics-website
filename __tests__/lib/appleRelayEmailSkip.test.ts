jest.mock('nodemailer', () => {
  const sendMail = jest.fn().mockResolvedValue({ messageId: 'm1', response: 'ok' })
  return {
    __esModule: true,
    sendMail,
    default: {
      createTransport: () => ({ sendMail, verify: jest.fn(), close: jest.fn() }),
    },
  }
})

jest.mock('@/lib/envValidation', () => ({
  EMAIL_USER: 'sales@genosys.ae',
  GMAIL_USER: undefined,
  EMAIL_PASSWORD: 'secret',
  GMAIL_APP_PASSWORD: undefined,
}))

jest.mock('@/lib/logger', () => ({ debugLog: jest.fn(), errorLog: jest.fn() }))

import { sendEmail, createBulkMailer } from '@/lib/email/transporter'
import { EXCLUDE_APPLE_RELAY, isApplePrivateRelayEmail } from '@/lib/emailHelpers'

const { sendMail } = jest.requireMock('nodemailer') as { sendMail: jest.Mock }
const RELAY = 'ft7hr62yby@privaterelay.appleid.com'

describe('Apple Private Relay addresses get no email', () => {
  beforeEach(() => sendMail.mockClear())

  it('recognises relay addresses in any case', () => {
    expect(isApplePrivateRelayEmail(RELAY)).toBe(true)
    expect(isApplePrivateRelayEmail('AB12@PrivateRelay.AppleID.com')).toBe(true)
    expect(isApplePrivateRelayEmail('client@gmail.com')).toBe(false)
  })

  it('sendEmail skips a relay address without touching SMTP', async () => {
    const result = await sendEmail(RELAY, 'Order', '<p>hi</p>')
    expect(result).toMatchObject({ success: true, skipped: true })
    expect(sendMail).not.toHaveBeenCalled()
  })

  it('sendEmail still sends to a normal address', async () => {
    const result = await sendEmail('client@gmail.com', 'Order', '<p>hi</p>')
    expect(result).toMatchObject({ success: true, messageId: 'm1' })
    expect(sendMail).toHaveBeenCalledTimes(1)
  })

  it('the bulk mailer skips relay addresses', async () => {
    const mailer = createBulkMailer()
    const result = await mailer.send(RELAY, 'News', '<p>hi</p>')
    mailer.close()
    expect(result).toMatchObject({ success: true, skipped: true })
    expect(sendMail).not.toHaveBeenCalled()
  })

  it('recipient queries exclude the relay domain', () => {
    expect(EXCLUDE_APPLE_RELAY).toEqual({
      NOT: { email: { contains: '@privaterelay.appleid.com', mode: 'insensitive' } },
    })
  })
})
