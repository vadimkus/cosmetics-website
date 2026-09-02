/**
 * The welcome email must never carry the user's password.
 *
 * It used to. Registration passed the plaintext password straight through to
 * the template, which printed it in an "Account Details" card beside the email
 * address. Every account created on the site or in the app was sent its own
 * password in clear text, where it stayed in the inbox, went wherever the mail
 * was forwarded, and sat in the provider's backups. A sent mail cannot be
 * recalled, so the only fix was to stop sending it.
 *
 * The parameter is gone from both the sender and the template, so the compiler
 * stops a caller passing one. This covers the other direction: someone adding
 * the field back into the template body from the user record.
 */
import { readFileSync } from 'fs'
import path from 'path'
import { emailTemplates } from '@/lib/email/templates'

const ROOT = path.join(__dirname, '../..')

describe('welcome email', () => {
  const secret = 'Sup3rSecret-Passw0rd'

  it.each(['en', 'ru', 'ar'])('does not print a password (%s)', (locale) => {
    const { html } = emailTemplates.welcomeUser('Test User', 'someone@example.com', locale)
    expect(html).not.toContain(secret)
    expect(html.toLowerCase()).not.toContain('password')
  })

  it('still confirms the address the account was opened with', () => {
    const { html } = emailTemplates.welcomeUser('Test User', 'someone@example.com', 'en')
    expect(html).toContain('someone@example.com')
  })

  it('renders without leaving a template fragment behind', () => {
    const { html } = emailTemplates.welcomeUser('Test User', 'someone@example.com', 'en')
    expect(html).not.toContain('${')
    // The card was removed from inside a conditional, so check the table did
    // not lose a closing tag on the way out.
    expect((html.match(/<tr\b/g) || []).length).toBe((html.match(/<\/tr>/g) || []).length)
    expect((html.match(/<table\b/g) || []).length).toBe((html.match(/<\/table>/g) || []).length)
  })

  it('is never handed a password by any caller', () => {
    // The signature is (name, email, locale). A caller passing a password would
    // now be putting it in the locale slot, which the compiler catches only if
    // it is typed. Scripts are not, so check the source.
    const callers = [
      'app/api/auth/register/route.ts',
      'app/api/mobile/auth/register/route.ts',
      'app/api/test-email/route.ts',
      'scripts/send-welcome-email.js',
      'scripts/test-email-templates.ts',
    ]
    for (const file of callers) {
      const src = readFileSync(path.join(ROOT, file), 'utf8')
      const calls = [...src.matchAll(/sendWelcomeEmail\(([^)]*)\)/g)].map((m) => m[1] ?? '')
      for (const args of calls) {
        expect({ file, args }).toEqual({ file, args: expect.not.stringMatching(/password/i) })
      }
    }
  })
})
