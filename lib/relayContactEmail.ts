import { prisma } from './database'
import { errorLog } from './logger'
import { isApplePrivateRelayEmail } from './emailHelpers'
import { isValidEmail, normalizeEmail } from './newsletter'

/**
 * An Apple Private Relay account with no contact email gets the real address the
 * customer typed at checkout saved as its contactEmail, so order and delivery emails
 * reach them (mail to the relay is never sent). A saved contactEmail is never
 * overwritten. Updates `user` in place so the caller's email routing sees it.
 */
export async function rememberRelayContactEmail(
  user: { id: string; email: string; contactEmail?: string | null },
  submittedEmail: unknown,
): Promise<void> {
  if (!isApplePrivateRelayEmail(user.email) || user.contactEmail?.trim()) return
  const email = normalizeEmail(String(submittedEmail ?? ''))
  if (!isValidEmail(email) || isApplePrivateRelayEmail(email)) return
  try {
    await prisma.user.update({ where: { id: user.id }, data: { contactEmail: email } })
    user.contactEmail = email
  } catch (error) {
    errorLog('[RELAY_CONTACT_EMAIL] Could not save checkout email as contactEmail:', error)
  }
}
